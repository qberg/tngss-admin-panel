import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

const PASS_TYPE_ID_MAP = {
  'TNGSS Visitor': 'f171cd44-8007-4ad2-beea-c487c1827246',
  'TNGSS Conference': 'f171cd44-8007-4ad2-beea-c487c1827247',
}

const addMissingFields = async () => {
  console.log('### ADDING MISSING FIELDS TO EXISTING RECORDS ###')

  const payload = await getPayload({ config })

  try {
    // Find all attendees that are missing either pass_type_id or upgrade field
    const attendeesNeedingUpdate = await payload.find({
      collection: 'attendee-passes',
      where: {
        or: [{ pass_type_id: { exists: false } }, { upgrade: { exists: false } }],
      },
      limit: 10000,
    })

    console.log(`Found ${attendeesNeedingUpdate.totalDocs} records that need field updates`)

    if (attendeesNeedingUpdate.totalDocs === 0) {
      console.log('No records to update')
      return
    }

    let updatedCount = 0
    let errorCount = 0
    const unknownPassTypes = new Set()

    for (const attendee of attendeesNeedingUpdate.docs) {
      try {
        const updateData = {}
        let needsUpdate = false
        const migrationNotes = []

        // Handle pass_type_id
        if (!attendee.pass_type_id) {
          const passType = attendee.pass_type || 'TNGSS Visitor'
          const passTypeId = PASS_TYPE_ID_MAP[passType]

          if (!passTypeId) {
            unknownPassTypes.add(passType)
            console.log(`❌ Unknown pass_type: "${passType}" for ${attendee.pass_id}`)
            continue
          }

          updateData.pass_type_id = passTypeId
          migrationNotes.push(`Added pass_type_id: ${passTypeId} from pass_type: "${passType}"`)
          needsUpdate = true
        }

        // Handle upgrade field
        if (attendee.upgrade === undefined || attendee.upgrade === null) {
          updateData.upgrade = false // Default to false for existing records
          migrationNotes.push('Added upgrade field: false (default for existing records)')
          needsUpdate = true
        }

        // Update migration notes
        if (migrationNotes.length > 0) {
          const existingNotes = attendee.migration_notes || ''
          const newNotes = migrationNotes.join('; ')
          updateData.migration_notes = existingNotes ? `${existingNotes}; ${newNotes}` : newNotes
        }

        if (needsUpdate) {
          await payload.update({
            collection: 'attendee-passes',
            id: attendee.id,
            data: updateData,
            overrideAccess: true,
          })

          updatedCount++

          if (updatedCount % 100 === 0) {
            console.log(`✅ Updated ${updatedCount} records...`)
          }
        }
      } catch (error) {
        errorCount++
        console.error(`❌ Error updating ${attendee.pass_id}:`, error.message)
      }
    }

    console.log('\n### UPDATE SUMMARY ###')
    console.log(`Successfully updated: ${updatedCount}`)
    console.log(`Errors: ${errorCount}`)
    console.log(`Total processed: ${attendeesNeedingUpdate.totalDocs}`)

    if (unknownPassTypes.size > 0) {
      console.log(`Unknown pass_types found: ${Array.from(unknownPassTypes).join(', ')}`)
    }
  } catch (error) {
    console.error('Migration failed:', error.message)
    throw error
  }
}

const verifyMigration = async () => {
  console.log('### VERIFICATION ###')

  const payload = await getPayload({ config })

  try {
    const total = await payload.find({
      collection: 'attendee-passes',
      limit: 0,
    })

    console.log(`Total attendee passes: ${total.totalDocs}`)

    // Check pass_type_id coverage
    const withPassTypeId = await payload.find({
      collection: 'attendee-passes',
      where: {
        pass_type_id: { exists: true },
      },
      limit: 0,
    })

    const withoutPassTypeId = await payload.find({
      collection: 'attendee-passes',
      where: {
        pass_type_id: { exists: false },
      },
      limit: 0,
    })

    console.log(`\n--- Pass Type ID Coverage ---`)
    console.log(`Records with pass_type_id: ${withPassTypeId.totalDocs}`)
    console.log(`Records without pass_type_id: ${withoutPassTypeId.totalDocs}`)

    // Show distribution by pass type ID
    for (const [passType, passTypeId] of Object.entries(PASS_TYPE_ID_MAP)) {
      const count = await payload.find({
        collection: 'attendee-passes',
        where: {
          pass_type_id: { equals: passTypeId },
        },
        limit: 0,
      })
      console.log(`${passType} (${passTypeId}): ${count.totalDocs} records`)
    }

    // Check upgrade field coverage
    const withUpgradeField = await payload.find({
      collection: 'attendee-passes',
      where: {
        upgrade: { exists: true },
      },
      limit: 0,
    })

    const withoutUpgradeField = await payload.find({
      collection: 'attendee-passes',
      where: {
        upgrade: { exists: false },
      },
      limit: 0,
    })

    const upgradeTrue = await payload.find({
      collection: 'attendee-passes',
      where: {
        upgrade: { equals: true },
      },
      limit: 0,
    })

    const upgradeFalse = await payload.find({
      collection: 'attendee-passes',
      where: {
        upgrade: { equals: false },
      },
      limit: 0,
    })

    console.log(`\n--- Upgrade Field Coverage ---`)
    console.log(`Records with upgrade field: ${withUpgradeField.totalDocs}`)
    console.log(`Records without upgrade field: ${withoutUpgradeField.totalDocs}`)
    console.log(`Records with upgrade=true: ${upgradeTrue.totalDocs}`)
    console.log(`Records with upgrade=false: ${upgradeFalse.totalDocs}`)
  } catch (error) {
    console.error('Verification failed:', error.message)
    throw error
  }
}

const showFieldStats = async () => {
  console.log('### FIELD STATISTICS ###')

  const payload = await getPayload({ config })

  try {
    const total = await payload.find({
      collection: 'attendee-passes',
      limit: 0,
    })

    console.log(`Total attendee passes: ${total.totalDocs}`)

    // Show pass_type distribution
    console.log('\n--- Pass Type Distribution ---')
    for (const passType of Object.keys(PASS_TYPE_ID_MAP)) {
      const count = await payload.find({
        collection: 'attendee-passes',
        where: {
          pass_type: { equals: passType },
        },
        limit: 0,
      })
      console.log(`${passType}: ${count.totalDocs}`)
    }

    // Show field existence
    console.log('\n--- Field Existence ---')

    const fieldsToCheck = ['pass_type_id', 'upgrade']
    for (const field of fieldsToCheck) {
      const withField = await payload.find({
        collection: 'attendee-passes',
        where: {
          [field]: { exists: true },
        },
        limit: 0,
      })

      const withoutField = await payload.find({
        collection: 'attendee-passes',
        where: {
          [field]: { exists: false },
        },
        limit: 0,
      })

      console.log(`${field}: ${withField.totalDocs} have it, ${withoutField.totalDocs} missing`)
    }
  } catch (error) {
    console.error('Stats failed:', error.message)
    throw error
  }
}

const fixDuplicateUpgrades = async () => {
  console.log('### FIXING DUPLICATE UPGRADES ###')

  const payload = await getPayload({ config })

  try {
    // Find records that might have been accidentally marked as upgrades
    const possibleDuplicates = await payload.find({
      collection: 'attendee-passes',
      where: {
        upgrade: { equals: true },
      },
      limit: 1000,
    })

    console.log(`Found ${possibleDuplicates.totalDocs} records marked as upgrades`)

    let fixedCount = 0

    for (const record of possibleDuplicates.docs) {
      // Check if this looks like a real upgrade (has upgrade notes in migration_notes)
      const hasUpgradeNotes =
        record.migration_notes?.includes('UPGRADED:') ||
        record.migration_notes?.includes('BULK UPGRADED:')

      if (!hasUpgradeNotes) {
        // This might be a false positive, reset to false
        await payload.update({
          collection: 'attendee-passes',
          id: record.id,
          data: {
            upgrade: false,
            migration_notes: record.migration_notes
              ? `${record.migration_notes}; Reset upgrade flag: no upgrade evidence found`
              : 'Reset upgrade flag: no upgrade evidence found',
          },
          overrideAccess: true,
        })

        fixedCount++
        console.log(`✅ Reset upgrade flag for ${record.pass_id}`)
      }
    }

    console.log(`Fixed ${fixedCount} incorrectly marked upgrade records`)
  } catch (error) {
    console.error('Fix failed:', error.message)
    throw error
  }
}

// Command handling
const command = process.argv[2]

const main = async () => {
  try {
    switch (command) {
      case 'migrate':
        await addMissingFields()
        break

      case 'verify':
        await verifyMigration()
        break

      case 'stats':
        await showFieldStats()
        break

      case 'fix-upgrades':
        await fixDuplicateUpgrades()
        break

      default:
        console.log('Usage:')
        console.log(
          '  npx payload run scripts/migrate-attendee-fields.js migrate      # Add missing fields to existing records',
        )
        console.log(
          '  npx payload run scripts/migrate-attendee-fields.js verify       # Verify migration results',
        )
        console.log(
          '  npx payload run scripts/migrate-attendee-fields.js stats        # Show field statistics',
        )
        console.log(
          '  npx payload run scripts/migrate-attendee-fields.js fix-upgrades # Fix incorrectly marked upgrades',
        )
        break
    }
  } catch (error) {
    console.error('Script failed:', error.message)
    process.exit(1)
  }
}

main()
