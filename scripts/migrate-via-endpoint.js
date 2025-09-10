import 'dotenv/config'
import { Pool } from 'pg'
import { getPayload } from 'payload'
import config from '@payload-config'
import { createInterface } from 'readline'

const createPgPool = () => {
  return new Pool({
    host: 'tngss-ticketing-system-prod-db.cva40kkq0dp1.ap-south-1.rds.amazonaws.com',
    port: 5432,
    database: 'ticketing_system',
    user: 'ticketing_admin',
    password: process.env.POSTGRES_PASSWORD,
  })
}

const getQuery = (limit) => {
  const baseQuery = `
    SELECT 
      vp.pass_id,
      vp.visitor_id,
      vp.conference_id,
      vp.pass_data,
      vp.created_at as pass_created_at,
      vp.updated_at as pass_updated_at,
      vp.checkin_data,
      v.visitor_data,
      v.created_at as registration_created_at,
      c.conference_name
    FROM prodschema.visitor_pass_table vp
    JOIN prodschema.visitor_table v ON vp.visitor_id = v.visitor_id
    LEFT JOIN prodschema.conference c ON vp.conference_id = c.conference_id
    ORDER BY vp.created_at ASC
  `
  return limit ? `${baseQuery}\n    LIMIT ${limit}` : baseQuery
}

const askQuestion = (question) => {
  return new Promise((resolve) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    rl.question(question, (answer) => {
      rl.close()
      resolve(answer)
    })
  })
}

const testConnections = async () => {
  console.log('Testing connections...')

  // Test PostgreSQL
  const pgPool = createPgPool()
  try {
    const result = await pgPool.query('SELECT COUNT(*) FROM prodschema.visitor_pass_table')
    console.log(`PostgreSQL: Found ${result.rows[0].count} passes`)
  } catch (error) {
    console.error('PostgreSQL failed:', error.message)
    throw error
  } finally {
    await pgPool.end()
  }

  // Test Payload/MongoDB
  try {
    const payload = await getPayload({ config })
    const existing = await payload.find({ collection: 'attendee-passes', limit: 0 })
    console.log(`MongoDB: Found ${existing.totalDocs} existing attendees`)
  } catch (error) {
    console.error('MongoDB failed:', error.message)
    throw error
  }

  // Test API endpoint
  try {
    const response = await fetch('http://localhost:3000/api/attendee-passes/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.ATTENDEE_API_TOKENS}`,
      },
      body: JSON.stringify({ test: 'connection' }),
    })

    if (response.status === 400) {
      console.log('API endpoint: Responding (validation error expected)')
    } else {
      console.log(`API endpoint: Status ${response.status}`)
    }
  } catch (error) {
    console.error('API endpoint failed:', error.message)
    throw error
  }
}

const clearExistingData = async () => {
  console.log('\n### CLEARING EXISTING DATA ###')

  const payload = await getPayload({ config })
  const existing = await payload.find({ collection: 'attendee-passes', limit: 0 })

  if (existing.totalDocs === 0) {
    console.log('No existing data to clear')
    return
  }

  console.log(`Clearing ${existing.totalDocs} existing attendees...`)

  const batchSize = 100
  let deletedCount = 0
  const startTime = Date.now()

  while (true) {
    const batch = await payload.find({
      collection: 'attendee-passes',
      limit: batchSize,
    })

    if (batch.docs.length === 0) break

    const deletePromises = batch.docs.map((attendee) =>
      payload.delete({
        collection: 'attendee-passes',
        id: attendee.id,
        overrideAccess: true,
      }),
    )

    await Promise.allSettled(deletePromises)
    deletedCount += batch.docs.length

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
    const progress = ((deletedCount / existing.totalDocs) * 100).toFixed(1)
    console.log(
      `Progress: ${progress}% (${deletedCount}/${existing.totalDocs}) | Time: ${elapsed}s`,
    )

    if (batch.docs.length < batchSize) break
  }

  // Verify deletion
  const remaining = await payload.find({ collection: 'attendee-passes', limit: 0 })
  if (remaining.totalDocs > 0) {
    throw new Error(`Failed to clear all data. ${remaining.totalDocs} records remain.`)
  }

  console.log(`Successfully cleared ${deletedCount} records`)
}

const migrateViaEndpoint = async (dryRun = false) => {
  console.log(`\n### ${dryRun ? 'DRY RUN - ' : ''}MIGRATING VIA API ENDPOINT ###`)

  const pgPool = createPgPool()
  const API_URL = 'http://localhost:3000/api/attendee-passes'
  const API_TOKEN = process.env.ATTENDEE_API_TOKENS

  if (!API_TOKEN) {
    throw new Error('ATTENDEE_API_TOKENS environment variable is required')
  }

  try {
    const result = await pgPool.query(getQuery())
    console.log(`Found ${result.rows.length} passes to migrate`)

    let successCount = 0
    let errorCount = 0
    const errors = []
    const migrationSummary = {
      total: result.rows.length,
      orgTypeMappings: {},
      profileTypeMappings: {},
      missingFields: { whyAttend: 0, profileType: 0 },
    }

    const batchSize = 50
    const totalBatches = Math.ceil(result.rows.length / batchSize)

    for (let i = 0; i < result.rows.length; i += batchSize) {
      const batch = result.rows.slice(i, i + batchSize)
      const batchNum = Math.floor(i / batchSize) + 1

      console.log(`\nProcessing batch ${batchNum}/${totalBatches} (${batch.length} records)...`)

      // Process sequentially instead of concurrently to avoid rate limits
      for (const row of batch) {
        try {
          // Track data patterns for summary
          const visitorData = row.visitor_data || {}
          const orgType = visitorData.organisationType
          const profileType = visitorData.profileType

          if (orgType) {
            migrationSummary.orgTypeMappings[orgType] =
              (migrationSummary.orgTypeMappings[orgType] || 0) + 1
          }
          if (profileType) {
            migrationSummary.profileTypeMappings[profileType] =
              (migrationSummary.profileTypeMappings[profileType] || 0) + 1
          }
          if (!visitorData.whyAttend && !visitorData.whyAttending) {
            migrationSummary.missingFields.whyAttend++
          }
          if (!profileType) {
            migrationSummary.missingFields.profileType++
          }

          const payload = {
            pass_id: row.pass_id,
            name: row.pass_data?.name || '',
            email: row.pass_data?.email || '',
            mobile: row.pass_data?.mobile || '',
            visitor_id: row.visitor_id,
            conference_name: row.conference_name || 'TNGSS Visitor',
            pass_created_at: row.pass_created_at,
            pass_data: row.pass_data || {},
            visitor_data: row.visitor_data || {},
            checkin_data: row.checkin_data || null,
          }

          if (dryRun) {
            console.log(`[DRY RUN] Would migrate ${row.pass_id}`)
            successCount++
            continue
          }

          const response = await fetch(`${API_URL}/create`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${API_TOKEN}`,
            },
            body: JSON.stringify(payload),
          })

          if (response.ok) {
            const responseData = await response.json()
            successCount++
            console.log(`✅ ${row.pass_id} -> ${responseData.data?.name || 'Unknown'}`)
          } else if (response.status === 409) {
            // Pass already exists - count as success but note it
            successCount++
            console.log(`⚠️ ${row.pass_id} -> Already exists (skipped)`)
          } else {
            const errorText = await response.text()
            errorCount++
            errors.push({
              pass_id: row.pass_id,
              status: response.status,
              error: errorText,
              orgType: visitorData.organisationType,
              profileType: visitorData.profileType,
            })
            console.error(`❌ ${row.pass_id}: ${response.status} - ${errorText}`)
          }

          // Small delay between individual requests within batch
          if (!dryRun) {
            await new Promise((resolve) => setTimeout(resolve, 300)) // 300ms between requests
          }
        } catch (error) {
          errorCount++
          errors.push({
            pass_id: row.pass_id,
            error: error.message,
            orgType: row.visitor_data?.organisationType,
            profileType: row.visitor_data?.profileType,
          })
          console.error(`❌ ${row.pass_id}: ${error.message}`)
        }
      }

      // Rate limiting between batches - longer delay
      if (batchNum < totalBatches) {
        console.log('Waiting 5s between batches...')
        await new Promise((resolve) => setTimeout(resolve, 5000)) // 5 seconds between batches
      }
    }

    console.log('\n### MIGRATION SUMMARY ###')
    console.log(`Total records: ${migrationSummary.total}`)
    console.log(`✅ Successful: ${successCount}`)
    console.log(`❌ Failed: ${errorCount}`)
    console.log(`Success rate: ${((successCount / migrationSummary.total) * 100).toFixed(1)}%`)

    console.log('\n### DATA PATTERNS ###')
    console.log('Organisation types found:')
    Object.entries(migrationSummary.orgTypeMappings).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`)
    })

    console.log('\nProfile types found:')
    Object.entries(migrationSummary.profileTypeMappings).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`)
    })

    console.log('\n### MISSING DATA ###')
    console.log(`Records missing whyAttend: ${migrationSummary.missingFields.whyAttend}`)
    console.log(`Records missing profileType: ${migrationSummary.missingFields.profileType}`)

    if (errors.length > 0) {
      console.log('\n### FIRST 10 ERRORS ###')
      errors.slice(0, 10).forEach((error, index) => {
        console.log(`${index + 1}. ${error.pass_id}: ${error.error}`)
        if (error.orgType || error.profileType) {
          console.log(`   Data: org=${error.orgType}, profile=${error.profileType}`)
        }
      })

      if (errors.length > 10) {
        console.log(`... and ${errors.length - 10} more errors`)
      }
    }

    if (!dryRun) {
      // Verify final count
      const payload = await getPayload({ config })
      const finalCount = await payload.find({ collection: 'attendee-passes', limit: 0 })
      console.log(`\nFinal MongoDB count: ${finalCount.totalDocs} attendees`)
    }
  } finally {
    await pgPool.end()
  }
}

// Command handling
const command = process.argv[2]
const subCommand = process.argv[3]

const main = async () => {
  try {
    switch (command) {
      case 'test':
        await testConnections()
        break

      case 'clear':
        await clearExistingData()
        break

      case 'migrate':
        if (subCommand === 'dry-run') {
          await migrateViaEndpoint(true)
        } else {
          const answer = await askQuestion('This will migrate production data. Continue? (y/N) ')

          if (answer.toLowerCase() === 'y') {
            await migrateViaEndpoint(false)
          } else {
            console.log('Migration cancelled')
          }
        }
        break

      case 'full':
        if (subCommand === 'dry-run') {
          console.log('=== DRY RUN MODE ===')
          await testConnections()
          await migrateViaEndpoint(true)
        } else {
          const answer = await askQuestion('This will CLEAR ALL DATA and migrate. Continue? (y/N) ')

          if (answer.toLowerCase() === 'y') {
            await testConnections()
            await clearExistingData()
            await migrateViaEndpoint(false)
          } else {
            console.log('Migration cancelled')
          }
        }
        break

      case 'resume':
        // Resume migration without clearing data (handles duplicates automatically)
        if (subCommand === 'dry-run') {
          await migrateViaEndpoint(true)
        } else {
          const answer = await askQuestion(
            'This will resume migration (skipping existing records). Continue? (y/N) ',
          )

          if (answer.toLowerCase() === 'y') {
            await migrateViaEndpoint(false)
          } else {
            console.log('Migration cancelled')
          }
        }
        break

      default:
        console.log('Usage:')
        console.log(
          '  npx payload run scripts/migrate-via-endpoint.js test           # Test connections',
        )
        console.log(
          '  npx payload run scripts/migrate-via-endpoint.js clear          # Clear existing data',
        )
        console.log(
          '  npx payload run scripts/migrate-via-endpoint.js migrate        # Migrate data',
        )
        console.log(
          '  npx payload run scripts/migrate-via-endpoint.js migrate dry-run # Test migration',
        )
        console.log(
          '  npx payload run scripts/migrate-via-endpoint.js full           # Clear + migrate',
        )
        console.log(
          '  npx payload run scripts/migrate-via-endpoint.js full dry-run   # Test full process',
        )
        console.log(
          '  npx payload run scripts/migrate-via-endpoint.js resume         # Resume failed migration',
        )
        console.log(
          '  npx payload run scripts/migrate-via-endpoint.js resume dry-run # Test resume',
        )
        break
    }
  } catch (error) {
    console.error('Migration failed:', error.message)
    process.exit(1)
  }
}

main()
