import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

const updateCorporatesToNone = async () => {
  console.log('### UPDATING CORPORATES TO NONE ###')

  const payload = await getPayload({ config })

  try {
    // Find all attendees with profile_type: "corporates"
    const attendeesWithCorporates = await payload.find({
      collection: 'attendee-passes',
      where: {
        profile_type: { equals: 'corporates' },
      },
      limit: 10000,
    })

    console.log(
      `Found ${attendeesWithCorporates.totalDocs} records with profile_type: "corporates"`,
    )

    if (attendeesWithCorporates.totalDocs === 0) {
      console.log('No records to update')
      return
    }

    let updatedCount = 0
    let skippedCount = 0

    for (const attendee of attendeesWithCorporates.docs) {
      // Only update if organisation_type suggests profile should be "none"
      const shouldBeNone = ['industry_corporate', 'others'].includes(attendee.organisation_type)

      if (shouldBeNone) {
        await payload.update({
          collection: 'attendee-passes',
          id: attendee.id,
          data: {
            profile_type: 'none',
            migration_notes: attendee.migration_notes
              ? `${attendee.migration_notes}; Updated: corporates → none for ${attendee.organisation_type}`
              : `Updated: corporates → none for ${attendee.organisation_type}`,
          },
          overrideAccess: true,
        })

        updatedCount++
        console.log(
          `✅ Updated ${attendee.pass_id}: ${attendee.organisation_type} → profile_type: "none"`,
        )
      } else {
        skippedCount++
        console.log(
          `⚠️ Skipped ${attendee.pass_id}: ${attendee.organisation_type} (keeping corporates)`,
        )
      }
    }

    console.log('\n### UPDATE SUMMARY ###')
    console.log(`Updated to "none": ${updatedCount}`)
    console.log(`Kept as "corporates": ${skippedCount}`)
    console.log(`Total processed: ${attendeesWithCorporates.totalDocs}`)

    // Verify the updates
    const remainingCorporates = await payload.find({
      collection: 'attendee-passes',
      where: {
        profile_type: { equals: 'corporates' },
      },
      limit: 0,
    })

    const newNoneCount = await payload.find({
      collection: 'attendee-passes',
      where: {
        profile_type: { equals: 'none' },
      },
      limit: 0,
    })

    console.log('\n### VERIFICATION ###')
    console.log(`Remaining "corporates": ${remainingCorporates.totalDocs}`)
    console.log(`Total "none": ${newNoneCount.totalDocs}`)
  } catch (error) {
    console.error('Update failed:', error.message)
    throw error
  }
}

const updateAllCorporatesToNone = async () => {
  console.log('### UPDATING ALL CORPORATES TO NONE ###')

  const payload = await getPayload({ config })

  try {
    const result = await payload.update({
      collection: 'attendee-passes',
      where: {
        profile_type: { equals: 'corporates' },
      },
      data: {
        profile_type: 'none',
      },
      overrideAccess: true,
    })

    console.log(`Updated ${result.docs.length} records from "corporates" to "none"`)
  } catch (error) {
    console.error('Bulk update failed:', error.message)
    throw error
  }
}

// Command handling
const command = process.argv[2]

const main = async () => {
  try {
    switch (command) {
      case 'selective':
        await updateCorporatesToNone()
        break

      case 'all':
        const readline = await import('readline')
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        })

        const answer = await new Promise((resolve) => {
          rl.question('This will update ALL "corporates" to "none". Continue? (y/N) ', resolve)
        })
        rl.close()

        if (answer.toLowerCase() === 'y') {
          await updateAllCorporatesToNone()
        } else {
          console.log('Update cancelled')
        }
        break

      default:
        console.log('Usage:')
        console.log(
          '  npx payload run scripts/update-corporates.js selective  # Update only industry_corporate & others',
        )
        console.log(
          '  npx payload run scripts/update-corporates.js all        # Update ALL corporates to none',
        )
        break
    }
  } catch (error) {
    console.error('Script failed:', error.message)
    process.exit(1)
  }
}

main()
