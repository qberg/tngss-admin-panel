import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

const findDuplicateEmails = async () => {
  console.log('### FINDING DUPLICATE EMAIL ENTRIES ###\n')

  const payload = await getPayload({ config })

  try {
    const allAttendees = await payload.find({
      collection: 'attendee-passes',
      limit: 25000,
      pagination: false,
    })

    console.log(`Total attendees found: ${allAttendees.totalDocs}`)

    const emailGroups = {}

    for (const attendee of allAttendees.docs) {
      const email = attendee?.email?.toLowerCase()

      if (!email) {
        console.log(`[WARNING] Skipping record with no email: ${attendee.pass_id}`)
      }

      if (!emailGroups[email]) {
        emailGroups[email] = []
      }

      emailGroups[email].push({
        id: attendee.id,
        pass_id: attendee.pass_id,
        name: attendee.name,
        pass_type: attendee.pass_type,
        pass_type_id: attendee.pass_type_id,
        createdAt: attendee.createdAt,
        updatedAt: attendee.updatedAt,
        legacyCreatedAt: attendee.legacy_created_at,
      })
    }

    const duplicates = Object.entries(emailGroups).filter(([email, records]) => records.length > 1)

    console.log(`\n### DUPLICATE SUMMARY ###`)
    console.log(`Unique emails: ${Object.keys(emailGroups).length}`)
    console.log(`Emails with duplicates: ${duplicates.length}`)
    console.log(
      `Total duplicate records: ${duplicates.reduce((sum, [, records]) => sum + records.length - 1, 0)}`,
    )

    if (duplicates.length === 0) {
      console.log('\n[HURRAY] No duplicate emails found!')
      return
    }

    duplicates.sort((a, b) => b[1].length - a[1].length)

    duplicates.forEach(([email, records], index) => {
      console.log(`${index + 1}. ${email} (${records.length} records)`)
      records.forEach((record, i) => {
        console.log(`   ${i + 1}. Pass ID: ${record.pass_id}`)
        console.log(`      Name: ${record.name}`)
        console.log(`      Type: ${record.pass_type} (${record.pass_type_id})`)
        console.log(`      Created: ${record.createdAt}`)
        console.log(`      ID: ${record.id}`)
      })
      console.log('')
    })

    console.log(`### ANALYSIS BY PASS TYPE ###\n`)

    const preferredPassTypeId = 'f171cd44-8007-4ad2-beea-c487c1827247'
    let hasPreferred = 0
    let noPreferred = 0
    let multiplePreferred = 0

    duplicates.forEach(([email, records]) => {
      const preferredRecords = records.filter((r) => r.pass_type_id === preferredPassTypeId)

      if (preferredRecords.length === 0) {
        noPreferred++
      } else if (preferredRecords.length === 1) {
        hasPreferred++
      } else {
        multiplePreferred++
      }
    })

    console.log(`Emails with 1 preferred pass type (${preferredPassTypeId}): ${hasPreferred}`)
    console.log(`Emails with NO preferred pass type: ${noPreferred}`)
    console.log(`Emails with MULTIPLE preferred pass types: ${multiplePreferred}`)

    // Show emails without preferred pass type
    if (noPreferred > 0) {
      console.log(`\n### EMAILS WITHOUT PREFERRED PASS TYPE ###\n`)

      duplicates
        .filter(([email, records]) => !records.some((r) => r.pass_type_id === preferredPassTypeId))
        .forEach(([email, records]) => {
          console.log(`${email}:`)
          records.forEach((r) => {
            console.log(`  - ${r.pass_id}: ${r.pass_type} (${r.pass_type_id})`)
          })
          console.log('')
        })
    }

    // Export to JSON for further processing
    const exportData = duplicates.map(([email, records]) => ({
      email,
      count: records.length,
      records: records.map((r) => ({
        id: r.id,
        pass_id: r.pass_id,
        name: r.name,
        pass_type: r.pass_type,
        pass_type_id: r.pass_type_id,
        createdAt: r.createdAt,
      })),
    }))

    const fs = await import('fs')
    const filename = `duplicate-emails-${Date.now()}.json`
    fs.writeFileSync(filename, JSON.stringify(exportData, null, 2))
    console.log(`\n📄 Full details exported to: ${filename}`)
  } catch (error) {
    console.error('Script failed:', error.message)
    throw error
  }
}

const removeDuplicateEmails = async () => {
  console.log('### FINDING DUPLICATE EMAIL ENTRIES AND REPLACING THEM ###\n')

  const payload = await getPayload({ config })

  try {
    const allAttendees = await payload.find({
      collection: 'attendee-passes',
      limit: 25000,
      pagination: false,
    })

    console.log(`Total attendees found: ${allAttendees.totalDocs}`)

    const emailGroups = {}

    for (const attendee of allAttendees.docs) {
      const email = attendee?.email?.toLowerCase()

      if (!email) {
        console.log(`[WARNING] Skipping record with no email: ${attendee.pass_id}`)
      }

      if (!emailGroups[email]) {
        emailGroups[email] = []
      }

      emailGroups[email].push(attendee)
    }

    const duplicates = Object.entries(emailGroups).filter(([email, records]) => records.length > 1)

    console.log(`\n### DUPLICATE SUMMARY ###`)
    console.log(`Emails with duplicates: ${duplicates.length}`)
    console.log(
      `Total duplicate records to process: ${duplicates.reduce((sum, [, records]) => sum + records.length, 0)}`,
    )

    if (duplicates.length === 0) {
      console.log('\n[SUCCESS] No duplicate emails found!')
      return
    }

    const preferredPassTypeId = 'f171cd44-8007-4ad2-beea-c487c1827247'

    let keptPreferred = 0
    let keptNonPreferred = 0
    let deletedRecords = 0
    const idsToDelete = []

    console.log(`\n### PROCESSING DUPLICATES ###\n`)

    for (const [email, records] of duplicates) {
      // Find records with preferred pass type
      const preferredRecords = records.filter((r) => r.pass_type_id === preferredPassTypeId)
      const nonPreferredRecords = records.filter((r) => r.pass_type_id !== preferredPassTypeId)

      console.log(`\nProcessing: ${email} (${records.length} records)`)

      let recordToKeep = null

      if (preferredRecords.length > 0) {
        // Has preferred pass type(s) - keep the latest preferred one
        const sortedPreferred = preferredRecords.sort((a, b) => {
          const dateA = new Date(a.legacy_created_at || a.createdAt)
          const dateB = new Date(b.legacy_created_at || b.createdAt)
          return dateB - dateA // Descending order (latest first)
        })

        recordToKeep = sortedPreferred[0]
        console.log(
          `  [KEEP] ${recordToKeep.pass_id} - ${recordToKeep.pass_type} (PREFERRED, latest legacy_created: ${recordToKeep.legacy_created_at || recordToKeep.createdAt})`,
        )
        keptPreferred++

        // Delete all other preferred records
        for (const record of sortedPreferred.slice(1)) {
          console.log(
            `  [DELETE] ${record.pass_id} - ${record.pass_type} (older preferred, legacy_created: ${record.legacy_created_at || record.createdAt})`,
          )
          idsToDelete.push(record.id)
          deletedRecords++
        }

        // Delete all non-preferred records
        for (const record of nonPreferredRecords) {
          console.log(
            `  [DELETE] ${record.pass_id} - ${record.pass_type} (non-preferred, legacy_created: ${record.legacy_created_at || record.createdAt})`,
          )
          idsToDelete.push(record.id)
          deletedRecords++
        }
      } else {
        // No preferred pass type - keep the latest non-preferred one
        const sortedNonPreferred = nonPreferredRecords.sort((a, b) => {
          const dateA = new Date(a.legacy_created_at || a.createdAt)
          const dateB = new Date(b.legacy_created_at || b.createdAt)
          return dateB - dateA // Descending order (latest first)
        })

        recordToKeep = sortedNonPreferred[0]
        console.log(
          `  [KEEP] ${recordToKeep.pass_id} - ${recordToKeep.pass_type} (NON-PREFERRED, latest legacy_created: ${recordToKeep.legacy_created_at || recordToKeep.createdAt})`,
        )
        keptNonPreferred++

        // Delete all other non-preferred records
        for (const record of sortedNonPreferred.slice(1)) {
          console.log(
            `  [DELETE] ${record.pass_id} - ${record.pass_type} (older non-preferred, legacy_created: ${record.legacy_created_at || record.createdAt})`,
          )
          idsToDelete.push(record.id)
          deletedRecords++
        }
      }
    }

    console.log(`\n### DELETION SUMMARY ###`)
    console.log(`Records to keep (latest preferred): ${keptPreferred}`)
    console.log(`Records to keep (latest non-preferred): ${keptNonPreferred}`)
    console.log(`Records to delete: ${deletedRecords}`)
    console.log(`Total IDs to delete: ${idsToDelete.length}`)

    if (idsToDelete.length === 0) {
      console.log('\n[INFO] No records to delete')
      return
    }

    // Confirmation prompt
    const readline = await import('readline')
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    const answer = await new Promise((resolve) => {
      rl.question(
        `\nThis will DELETE ${idsToDelete.length} records. Continue? (type 'DELETE' to confirm): `,
        resolve,
      )
    })
    rl.close()

    if (answer !== 'DELETE') {
      console.log('\n[CANCELLED] No records were deleted')
      return
    }

    // Delete records
    console.log(`\n### DELETING RECORDS ###`)
    let deletedCount = 0

    for (const id of idsToDelete) {
      try {
        await payload.delete({
          collection: 'attendee-passes',
          id: id,
          overrideAccess: true,
        })
        deletedCount++

        if (deletedCount % 10 === 0) {
          console.log(`Deleted ${deletedCount}/${idsToDelete.length}...`)
        }
      } catch (error) {
        console.error(`[ERROR] Failed to delete ID ${id}: ${error.message}`)
      }
    }

    console.log(`\n### COMPLETION SUMMARY ###`)
    console.log(`Successfully deleted: ${deletedCount}`)
    console.log(`Failed to delete: ${idsToDelete.length - deletedCount}`)

    // Verify results
    const remainingDuplicates = await payload.find({
      collection: 'attendee-passes',
      limit: 25000,
      pagination: false,
    })

    const emailGroupsAfter = {}
    for (const attendee of remainingDuplicates.docs) {
      const email = attendee?.email?.toLowerCase()
      if (!email) continue

      if (!emailGroupsAfter[email]) {
        emailGroupsAfter[email] = []
      }
      emailGroupsAfter[email].push(attendee)
    }

    const duplicatesAfter = Object.entries(emailGroupsAfter).filter(
      ([email, records]) => records.length > 1,
    )

    console.log(`\n### VERIFICATION ###`)
    console.log(`Total attendees remaining: ${remainingDuplicates.totalDocs}`)
    console.log(`Emails with duplicates remaining: ${duplicatesAfter.length}`)

    if (duplicatesAfter.length > 0) {
      console.log(`\nWARNING: Still have duplicates (this should not happen!):`)
      duplicatesAfter.forEach(([email, records]) => {
        console.log(`  ${email}: ${records.length} records`)
        records.forEach((r) => {
          console.log(`    - ${r.pass_id}: ${r.pass_type} (${r.pass_type_id})`)
        })
      })
    } else {
      console.log(`\n[SUCCESS] All duplicates resolved!`)
    }
  } catch (error) {
    console.error('Script failed:', error.message)
    throw error
  }
}

const command = process.argv[2]

const main = async () => {
  try {
    switch (command) {
      case 'find':
        await findDuplicateEmails()
        break

      case 'remove':
        await removeDuplicateEmails()
        break

      default:
        console.log('Usage:')
        console.log(
          '  npx payload run scripts/fix-duplicate-email.js find  # Finds and reports all duplicate mails',
        )
        console.log(
          '  npx payload run scripts/fix-duplicate-email.js remove       # Update ALL corporates to none',
        )
        break
    }
  } catch (error) {
    console.error('Script failed:', error.message)
    process.exit(1)
  }
}

main()
