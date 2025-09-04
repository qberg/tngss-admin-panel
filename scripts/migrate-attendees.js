import 'dotenv/config'
import { Pool } from 'pg'
import { getPayload } from 'payload'
import config from '@payload-config'

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

  return limit ? `${baseQuery}\n      LIMIT ${limit}` : baseQuery
}

const transformPassType = (conferenceName) => {
  const passTypeMap = {
    'TNGSS Visitor': 'TNGSS Visitor',
    'TNGSS Conference': 'TNGSS Conference',
  }
  return passTypeMap[conferenceName] || conferenceName
}

const extractBusinessClassification = (visitorData) => {
  return {
    organisation_type: visitorData?.organisationType || 'startup',
    profile_type: visitorData?.profileType || 'corporates',
    sector_interested: visitorData?.sectorIntrested || 'sector_agnostic',
    registration_type:
      visitorData?.type ||
      (visitorData?.profileType === 'corporates' ? 'corporates' : 'individual'),
  }
}

const safeExtract = (obj, path, fallback = null) => {
  try {
    return path.split('.').reduce((current, key) => current?.[key], obj) || fallback
  } catch {
    return fallback
  }
}

const safeEmail = (email) => {
  if (!email || typeof email !== 'string') return null
  return email.toLowerCase().trim()
}

const testConnections = async () => {
  console.log('🔍 Testing database connections...')

  const pgPool = createPgPool()

  try {
    const result = await pgPool.query('SELECT COUNT(*) FROM prodschema.visitor_pass_table')
    console.log(`✅ PostgreSQL connected. Found ${result.rows[0].count} passes`)
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error.message)
    throw error
  } finally {
    await pgPool.end()
  }

  try {
    const payload = await getPayload({ config })
    console.log('✅ Payload/MongoDB connected successfully')
    const existingAttendees = await payload.find({
      collection: 'attendee-passes',
      limit: 0,
    })
    console.log(`Found ${existingAttendees.totalDocs} existing attendees`)
  } catch (error) {
    console.error('❌ Payload connection failed:', error.message)
    throw error
  }
}

const explorePostgres = async () => {
  console.log('🔍 Exploring PostgreSQL data structure...')

  const pgPool = createPgPool()

  try {
    console.log('### Table Counts ###\n')

    const passCount = await pgPool.query('SELECT COUNT(*) FROM prodschema.visitor_pass_table')
    console.log(`visitor_pass_table: ${passCount.rows[0].count} records`)

    const bookingCount = await pgPool.query('SELECT COUNT(*) FROM prodschema.visitor_table')
    console.log(`visitor_table: ${bookingCount.rows[0].count} records`)

    const conferenceCount = await pgPool.query('SELECT COUNT(*) FROM prodschema.conference')
    console.log(`Type of tickets: ${conferenceCount.rows[0].count}`)

    const query = getQuery(3)
    const samples = await pgPool.query(query)

    console.log(`Query returned ${samples.rows.length} sample records`)

    samples.rows.forEach((row, index) => {
      console.log(`\n--- Sample Record ${index + 1} ---`)
      console.log(`Pass ID: ${row.pass_id}`)
      console.log(`Visitor ID: ${row.visitor_id}`)
      console.log(`Conference: ${row.conference_name || 'N/A'}`)
      console.log(`Pass Created: ${row.pass_created_at}`)
      console.log(`Registration Created: ${row.registration_created_at}`)

      // pass_data structure
      console.log('\n Pass Data:')
      console.log('  Keys:', Object.keys(row.pass_data || {}))
      if (row.pass_data) {
        console.log('  Sample:', {
          name: row.pass_data.name,
          email: row.pass_data.email,
          mobile: row.pass_data.mobile,
          designation: row.pass_data.designation,
          organisation: row.pass_data.organisation,
          gender: row.pass_data.gender,
        })
      }

      console.log('\n Visitor Data:')
      console.log('  Keys:', Object.keys(row.visitor_data || {}))
      if (row.visitor_data) {
        console.log('  Sample:', {
          city: row.visitor_data.city,
          state: row.visitor_data.state,
          country: row.visitor_data.country,
          profileType: row.visitor_data.profileType,
          organisationType: row.visitor_data.organisationType,
          sectorIntrested: row.visitor_data.sectorIntrested,
          name: row.visitor_data.name,
          email: row.visitor_data.email,
          website: row.visitor_data.website,
          whyAttending: row.visitor_data.whyAttending,
        })
      }

      console.log('\n Checkin Status:', !!row.checkin_data)
      if (row.checkin_data) {
        console.log('  Checkin Data Keys:', Object.keys(row.checkin_data))
      }
    })

    console.log('\n### Field Availability Analysis ###')
    const fieldAnalysis = await pgPool.query(`
      SELECT 
        COUNT(*) as total_records,
        COUNT(CASE WHEN visitor_data->>'website' IS NOT NULL AND visitor_data->>'website' != '' THEN 1 END) as has_website,
        COUNT(CASE WHEN visitor_data->>'whyAttending' IS NOT NULL AND visitor_data->>'whyAttending' != '' THEN 1 END) as has_why_attending,
        COUNT(CASE WHEN pass_data->>'email' IS NOT NULL THEN 1 END) as has_email,
        COUNT(CASE WHEN pass_data->>'mobile' IS NOT NULL THEN 1 END) as has_mobile
      FROM prodschema.visitor_pass_table vp
      JOIN prodschema.visitor_table v ON vp.visitor_id = v.visitor_id
    `)

    const analysis = fieldAnalysis.rows[0]
    console.log(`Total Records: ${analysis.total_records}`)
    console.log(
      `Has Website: ${analysis.has_website} (${((analysis.has_website / analysis.total_records) * 100).toFixed(1)}%)`,
    )
    console.log(
      `Has Why Attending: ${analysis.has_why_attending} (${((analysis.has_why_attending / analysis.total_records) * 100).toFixed(1)}%)`,
    )
    console.log(
      `Has Email: ${analysis.has_email} (${((analysis.has_email / analysis.total_records) * 100).toFixed(1)}%)`,
    )
    console.log(
      `Has Mobile: ${analysis.has_mobile} (${((analysis.has_mobile / analysis.total_records) * 100).toFixed(1)}%)`,
    )
  } catch (error) {
    console.error('PostgreSQL exploration failed:', error.message)
    throw error
  } finally {
    await pgPool.end()
  }
}

const clearExistingAttendees = async (payload) => {
  const existingAttendees = await payload.find({
    collection: 'attendee-passes',
    limit: 0,
  })

  if (existingAttendees.totalDocs === 0) {
    console.log('No existing attendees to clear')
    return
  }

  console.log(
    `----------------Clearing ${existingAttendees.totalDocs} existing attendees...---------------\n`,
  )

  const deleteBatchSize = 100
  let deletedCount = 0
  const startTime = Date.now()

  while (true) {
    const batchToDelete = await payload.find({
      collection: 'attendee-passes',
      limit: deleteBatchSize,
      page: 1,
    })

    if (batchToDelete.docs.length === 0) {
      break
    }

    console.log(
      `Deleting batch: ${deletedCount + 1} to ${deletedCount + batchToDelete.docs.length}...`,
    )

    for (const attendee of batchToDelete.docs) {
      try {
        await payload.delete({
          collection: 'attendee-passes',
          id: attendee.id,
          overrideAccess: true,
        })
        deletedCount++
      } catch (error) {
        console.error(`Error deleting attendee ${attendee.id}:`, error.message)
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 100))

    if (deletedCount % 500 === 0 || deletedCount === existingAttendees.totalDocs) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
      const progress = ((deletedCount / existingAttendees.totalDocs) * 100).toFixed(1)
      console.log(
        `   Progress: ${progress}% (${deletedCount}/${existingAttendees.totalDocs}) | Time: ${elapsed}s`,
      )
    }
  }

  console.log(`Successfully deleted ${deletedCount} existing attendees`)

  const remainingCount = await payload.find({
    collection: 'attendee-passes',
    limit: 0,
  })

  if (remainingCount.totalDocs > 0) {
    console.warn(` [Warning]: ${remainingCount.totalDocs} records still remain after deletion`)
    throw new Error(`Failed to delete all records. ${remainingCount.totalDocs} remain.`)
  } else {
    console.log('All existing records successfully deleted')
  }
}

const testTransformation = async () => {
  console.log('\n ### Testing data transformation logic... ### \n')

  const pgPool = createPgPool()
  try {
    const query = getQuery(5) // Test with 5 records
    const result = await pgPool.query(query)

    console.log('Testing transformation on sample records:')
    result.rows.forEach((row, index) => {
      const passData = row.pass_data || {}
      const visitorData = row.visitor_data || {}
      const businessClassification = extractBusinessClassification(visitorData)

      console.log(`\n--- Transformation Test ${index + 1} ---`)
      console.log('Input data availability:')
      console.log(`  Pass Data Keys: ${Object.keys(passData)}`)
      console.log(`  Visitor Data Keys: ${Object.keys(visitorData)}`)

      const transformedData = {
        pass_id: row.pass_id,
        pass_type: transformPassType(row.conference_name),

        // Pass data with safe extraction
        name: safeExtract(passData, 'name'),
        email: safeEmail(passData.email),
        gender: safeExtract(passData, 'gender'),
        mobile: safeExtract(passData, 'mobile'),
        designation: safeExtract(passData, 'designation'),
        organisation: safeExtract(passData, 'organisation'),

        // Registration context with safe extraction
        legacy_visitor_id: row.visitor_id,
        registration_email: safeEmail(visitorData.email),
        registration_organisation:
          safeExtract(visitorData, 'name') || safeExtract(visitorData, 'organisation'),
        registration_city: safeExtract(visitorData, 'city'),
        registration_state: safeExtract(visitorData, 'state'),
        registration_country: safeExtract(visitorData, 'country') || 'India',

        // Business classification
        organisation_type: businessClassification.organisation_type,
        profile_type: businessClassification.profile_type,
        sector_interested: businessClassification.sector_interested,

        // NEW FIELDS
        why_attending:
          safeExtract(visitorData, 'whyAttending') || safeExtract(visitorData, 'why_attending'),
        website: safeExtract(visitorData, 'website'),

        // Timestamps
        legacy_created_at: row.pass_created_at,

        // Check-in status
        checked_in: !!row.checkin_data,
        checkin_data: row.checkin_data,
      }

      console.log('Transformed data:')
      console.log(`  Name: ${transformedData.name || 'MISSING'}`)
      console.log(`  Email: ${transformedData.email || 'MISSING'}`)
      console.log(`  Website: ${transformedData.website || 'MISSING'}`)
      console.log(`  Why Attending: ${transformedData.why_attending || 'MISSING'}`)
      console.log(`  Organisation Type: ${transformedData.organisation_type}`)
      console.log(`  Profile Type: ${transformedData.profile_type}`)
      console.log(`  Sector: ${transformedData.sector_interested}`)
    })
  } finally {
    await pgPool.end()
  }
}

const migrateAttendees = async () => {
  console.log('\n ### MIGRATING DATA FROM POSTGRES TO MONGODB ### \n')

  const pgPool = createPgPool()

  try {
    const payload = await getPayload({ config })
    console.log('[SUCCESS] Payload/MongoDB connected successfully')

    // destroyer of db, UNCOMMENT at your own risk hehehehe
    //console.log('\n### CLEARING EXISTING DATA ###')
    //await clearExistingAttendees(payload)

    console.log('\n### FETCHING DATA FROM POSTGRES ###\n')

    const query = getQuery()
    const result = await pgPool.query(query)
    console.log(`Found ${result.rows.length} passes to migrate`)

    let successCount = 0
    let errorCount = 0
    let missingDataWarnings = {
      website: 0,
      why_attending: 0,
      email: 0,
      mobile: 0,
      name: 0,
    }
    const errors = []

    const batchSize = 50
    for (let i = 0; i < result.rows.length; i += batchSize) {
      const batch = result.rows.slice(i, i + batchSize)

      console.log(
        `Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(result.rows.length / batchSize)}...`,
      )

      const batchPromises = batch.map(async (row) => {
        try {
          const passData = row.pass_data || {}
          const visitorData = row.visitor_data || {}
          const businessClassification = extractBusinessClassification(visitorData)

          // Track missing data for reporting
          if (!safeExtract(visitorData, 'website')) missingDataWarnings.website++
          if (
            !safeExtract(visitorData, 'whyAttending') &&
            !safeExtract(visitorData, 'why_attending')
          )
            missingDataWarnings.why_attending++
          if (!safeExtract(passData, 'email')) missingDataWarnings.email++
          if (!safeExtract(passData, 'mobile')) missingDataWarnings.mobile++
          if (!safeExtract(passData, 'name')) missingDataWarnings.name++

          const attendeeData = {
            pass_id: row.pass_id,
            pass_type: transformPassType(row.conference_name),

            // Pass data with safe extraction
            name: safeExtract(passData, 'name'),
            email: safeEmail(passData.email),
            gender: safeExtract(passData, 'gender'),
            mobile: safeExtract(passData, 'mobile'),
            designation: safeExtract(passData, 'designation'),
            organisation: safeExtract(passData, 'organisation'),

            // Registration context with safe extraction
            legacy_visitor_id: row.visitor_id,
            registration_email: safeEmail(visitorData.email),
            registration_organisation:
              safeExtract(visitorData, 'name') || safeExtract(visitorData, 'organisation'),
            registration_city: safeExtract(visitorData, 'city'),
            registration_state: safeExtract(visitorData, 'state'),
            registration_country: safeExtract(visitorData, 'country') || 'India',

            // Business classification
            organisation_type: businessClassification.organisation_type,
            profile_type: businessClassification.profile_type,
            sector_interested: businessClassification.sector_interested,

            why_attending:
              safeExtract(visitorData, 'whyAttending') || safeExtract(visitorData, 'why_attending'),
            website: safeExtract(visitorData, 'website'),

            // Timestamps
            legacy_created_at: row.pass_created_at,

            // Check-in status
            checked_in: !!row.checkin_data,
            checkin_data: row.checkin_data,
          }

          const cleanedData = Object.fromEntries(
            Object.entries(attendeeData).filter(
              ([key, value]) => value !== null && value !== undefined,
            ),
          )

          await payload.create({
            collection: 'attendee-passes',
            data: cleanedData,
            overrideAccess: true,
          })

          successCount++
          return { success: true, pass_id: row.pass_id }
        } catch (error) {
          errorCount++
          const errorInfo = {
            pass_id: row.pass_id,
            error: error.message,
            data: {
              pass_data_keys: Object.keys(row.pass_data || {}),
              visitor_data_keys: Object.keys(row.visitor_data || {}),
            },
          }
          errors.push(errorInfo)
          console.error(`Error migrating pass ${row.pass_id}:`, error.message)
          return { success: false, pass_id: row.pass_id, error: error.message }
        }
      })

      await Promise.allSettled(batchPromises)
    }

    const finalCount = await payload.find({
      collection: 'attendee-passes',
      limit: 0,
    })

    console.log('\n### MIGRATION SUMMARY ###')
    console.log(`✅ Successfully migrated: ${successCount} passes`)
    console.log(`❌ Failed migrations: ${errorCount} passes`)
    console.log(`📊 Final count in MongoDB: ${finalCount.totalDocs} attendees`)

    console.log('\n### MISSING DATA WARNINGS ###')
    console.log(`Records missing website: ${missingDataWarnings.website}`)
    console.log(`Records missing why_attending: ${missingDataWarnings.why_attending}`)
    console.log(`Records missing email: ${missingDataWarnings.email}`)
    console.log(`Records missing mobile: ${missingDataWarnings.mobile}`)
    console.log(`Records missing name: ${missingDataWarnings.name}`)

    if (errors.length > 0) {
      console.log('\n### ERRORS ENCOUNTERED ###')
      errors.slice(0, 5).forEach((error, index) => {
        console.log(`Error ${index + 1}: Pass ${error.pass_id} - ${error.error}`)
      })
      if (errors.length > 5) {
        console.log(`... and ${errors.length - 5} more errors`)
      }
    }
  } catch (error) {
    console.error('##### MIGRATION FAILED: ###', error.message)
    throw error
  } finally {
    await pgPool.end()
    console.log('######\n PostgreSQL connection closed \n ######')
  }
}

const command = process.argv[2]

if (command === 'test') {
  testConnections()
    .then(() => process.exit(0))
    .catch(console.error)
} else if (command === 'explore-pg') {
  explorePostgres()
    .then(() => process.exit(0))
    .catch(console.error)
} else if (command === 'test-transform') {
  testTransformation()
    .then(() => process.exit(0))
    .catch(console.error)
} else if (command === 'migrate') {
  migrateAttendees()
    .then(() => process.exit(0))
    .catch(console.error)
} else {
  console.log('Usage:')
  console.log(' payload run scripts/migrate-attendees.js test')
  console.log(' payload run scripts/migrate-attendees.js explore-pg')
  console.log(' payload run scripts/migrate-attendees.js test-transform')
  console.log(' payload run scripts/migrate-attendees.js migrate')
}

export { testConnections }
