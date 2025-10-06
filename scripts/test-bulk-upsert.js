import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

const API_URL = 'http://localhost:3000/api/attendee-passes/bulk'
const API_TOKEN = process.env.ATTENDEE_API_TOKENS?.split(',')[0]

const testBulkUpsert = async () => {
  console.log('### TESTING BULK UPSERT ENDPOINT ###\n')

  const payload = await getPayload({ config })

  // Test Case 1: Create new records
  console.log('TEST 1: Creating new records')
  console.log('=' * 50)

  const newRecords = [
    {
      pass_id: 'TEST_NEW_001',
      name: 'Test User 1',
      email: 'test1@example.com',
      mobile: '9999999991',
      visitor_id: 'visitor_001',
      conference_name: 'TNGSS Conference',
      pass_created_at: new Date().toISOString(),
    },
    {
      pass_id: 'TEST_NEW_002',
      name: 'Test User 2',
      email: 'test2@example.com',
      mobile: '9999999992',
      visitor_id: 'visitor_002',
      conference_name: 'TNGSS Conference',
      pass_created_at: new Date().toISOString(),
    },
  ]

  const response1 = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_TOKEN}`,
    },
    body: JSON.stringify({ attendees: newRecords }),
  })

  const result1 = await response1.json()
  console.log('Response:', JSON.stringify(result1, null, 2))

  if (result1.summary.created === 2 && result1.summary.updated === 0) {
    console.log('✅ PASS: Created 2 new records\n')
  } else {
    console.log('❌ FAIL: Expected 2 created, 0 updated\n')
  }

  // Test Case 2: Update existing records by email
  console.log('TEST 2: Update existing records by email (same email, different pass_id)')
  console.log('=' * 50)

  const updateByEmail = [
    {
      pass_id: 'TEST_UPDATED_001', // Different pass_id
      name: 'Test User 1 Updated',
      email: 'test1@example.com', // Same email
      mobile: '8888888881',
      visitor_id: 'visitor_001_updated',
      conference_name: 'TNGSS Conference',
      pass_created_at: new Date().toISOString(),
    },
  ]

  const response2 = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_TOKEN}`,
    },
    body: JSON.stringify({ attendees: updateByEmail }),
  })

  const result2 = await response2.json()
  console.log('Response:', JSON.stringify(result2, null, 2))

  if (result2.summary.created === 0 && result2.summary.updated === 1) {
    console.log('✅ PASS: Updated 1 record by email\n')
  } else {
    console.log('❌ FAIL: Expected 0 created, 1 updated\n')
  }

  // Verify the update
  const verifyEmail = await payload.find({
    collection: 'attendee-passes',
    where: { email: { equals: 'test1@example.com' } },
  })

  if (
    verifyEmail.docs[0].pass_id === 'TEST_UPDATED_001' &&
    verifyEmail.docs[0].name === 'Test User 1 Updated'
  ) {
    console.log(
      '✅ PASS: Email match updated correctly - pass_id changed from TEST_NEW_001 to TEST_UPDATED_001\n',
    )
  } else {
    console.log('❌ FAIL: Email match did not update correctly\n')
  }

  // Test Case 3: Update existing records by pass_id
  console.log('TEST 3: Update existing records by pass_id (same pass_id, different email)')
  console.log('=' * 50)

  const updateByPassId = [
    {
      pass_id: 'TEST_UPDATED_001', // Same pass_id
      name: 'Test User 1 Email Changed',
      email: 'newemail@example.com', // Different email
      mobile: '7777777771',
      visitor_id: 'visitor_001_v2',
      conference_name: 'TNGSS Conference',
      pass_created_at: new Date().toISOString(),
    },
  ]

  const response3 = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_TOKEN}`,
    },
    body: JSON.stringify({ attendees: updateByPassId }),
  })

  const result3 = await response3.json()
  console.log('Response:', JSON.stringify(result3, null, 2))

  if (result3.summary.created === 0 && result3.summary.updated === 1) {
    console.log('✅ PASS: Updated 1 record by pass_id\n')
  } else {
    console.log('❌ FAIL: Expected 0 created, 1 updated\n')
  }

  // Verify the update
  const verifyPassId = await payload.find({
    collection: 'attendee-passes',
    where: { pass_id: { equals: 'TEST_UPDATED_001' } },
  })

  if (
    verifyPassId.docs[0].email === 'newemail@example.com' &&
    verifyPassId.docs[0].name === 'Test User 1 Email Changed'
  ) {
    console.log(
      '✅ PASS: Pass_id match updated correctly - email changed from test1@example.com to newemail@example.com\n',
    )
  } else {
    console.log('❌ FAIL: Pass_id match did not update correctly\n')
  }

  // Test Case 4: Mixed batch (create + update)
  console.log('TEST 4: Mixed batch (some new, some existing)')
  console.log('=' * 50)

  const mixedBatch = [
    {
      pass_id: 'TEST_NEW_003',
      name: 'Test User 3',
      email: 'test3@example.com',
      mobile: '6666666663',
      visitor_id: 'visitor_003',
      conference_name: 'TNGSS Visitor',
      pass_created_at: new Date().toISOString(),
    },
    {
      pass_id: 'TEST_NEW_002', // Existing pass_id
      name: 'Test User 2 Updated Name',
      email: 'test2@example.com',
      mobile: '5555555552',
      visitor_id: 'visitor_002',
      conference_name: 'TNGSS Conference',
      pass_created_at: new Date().toISOString(),
    },
  ]

  const response4 = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_TOKEN}`,
    },
    body: JSON.stringify({ attendees: mixedBatch }),
  })

  const result4 = await response4.json()
  console.log('Response:', JSON.stringify(result4, null, 2))

  if (result4.summary.created === 1 && result4.summary.updated === 1) {
    console.log('✅ PASS: Mixed batch - 1 created, 1 updated\n')
  } else {
    console.log('❌ FAIL: Expected 1 created, 1 updated\n')
  }

  // Test Case 5: Check migration notes
  console.log('TEST 5: Verify migration notes are added')
  console.log('=' * 50)

  const checkMigrationNotes = await payload.find({
    collection: 'attendee-passes',
    where: { pass_id: { equals: 'TEST_UPDATED_001' } },
  })

  if (
    checkMigrationNotes.docs[0].migration_notes &&
    checkMigrationNotes.docs[0].migration_notes.includes('BULK UPSERT')
  ) {
    console.log('✅ PASS: Migration notes added correctly')
    console.log(`Migration notes: ${checkMigrationNotes.docs[0].migration_notes}\n`)
  } else {
    console.log('❌ FAIL: Migration notes not found\n')
  }

  // Test Case 6: Validation errors
  console.log('TEST 6: Test validation errors (invalid email)')
  console.log('=' * 50)

  const invalidData = [
    {
      pass_id: 'TEST_INVALID_001',
      name: 'Invalid User',
      email: 'not-an-email', // Invalid email
      mobile: '9999999999',
      visitor_id: 'visitor_invalid',
      conference_name: 'TNGSS Conference',
    },
  ]

  const response5 = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_TOKEN}`,
    },
    body: JSON.stringify({ attendees: invalidData }),
  })

  const result5 = await response5.json()
  console.log('Response:', JSON.stringify(result5, null, 2))

  if (response5.status === 400) {
    console.log('✅ PASS: Validation error returned correctly\n')
  } else {
    console.log('❌ FAIL: Expected 400 validation error\n')
  }

  // Test Case 7: Check-in data preservation
  console.log('TEST 7: Verify check-in data is preserved during update')
  console.log('=' * 50)

  // Manually set check-in data
  const recordWithCheckin = await payload.find({
    collection: 'attendee-passes',
    where: { pass_id: { equals: 'TEST_NEW_002' } },
  })

  await payload.update({
    collection: 'attendee-passes',
    id: recordWithCheckin.docs[0].id,
    data: {
      checked_in: true,
      checkin_data: { timestamp: new Date().toISOString(), location: 'Main Gate' },
    },
    overrideAccess: true,
  })

  // Now update via API
  const updateWithCheckin = [
    {
      pass_id: 'TEST_NEW_002',
      name: 'Test User 2 After Checkin',
      email: 'test2@example.com',
      mobile: '4444444442',
      visitor_id: 'visitor_002',
      conference_name: 'TNGSS Conference',
      pass_created_at: new Date().toISOString(),
    },
  ]

  await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_TOKEN}`,
    },
    body: JSON.stringify({ attendees: updateWithCheckin }),
  })

  const verifyCheckin = await payload.find({
    collection: 'attendee-passes',
    where: { pass_id: { equals: 'TEST_NEW_002' } },
  })

  if (verifyCheckin.docs[0].checked_in === true && verifyCheckin.docs[0].checkin_data) {
    console.log('✅ PASS: Check-in data preserved after update\n')
  } else {
    console.log('❌ FAIL: Check-in data was lost\n')
  }

  // Cleanup
  console.log('CLEANUP: Removing test records')
  console.log('=' * 50)

  const testPassIds = [
    'TEST_NEW_001',
    'TEST_NEW_002',
    'TEST_NEW_003',
    'TEST_UPDATED_001',
    'TEST_INVALID_001',
  ]

  for (const passId of testPassIds) {
    const record = await payload.find({
      collection: 'attendee-passes',
      where: { pass_id: { equals: passId } },
    })

    if (record.docs.length > 0) {
      await payload.delete({
        collection: 'attendee-passes',
        id: record.docs[0].id,
        overrideAccess: true,
      })
      console.log(`Deleted ${passId}`)
    }
  }

  // Also delete by the emails we used
  const testEmails = [
    'test1@example.com',
    'test2@example.com',
    'test3@example.com',
    'newemail@example.com',
  ]

  for (const email of testEmails) {
    const record = await payload.find({
      collection: 'attendee-passes',
      where: { email: { equals: email } },
    })

    if (record.docs.length > 0) {
      for (const doc of record.docs) {
        await payload.delete({
          collection: 'attendee-passes',
          id: doc.id,
          overrideAccess: true,
        })
        console.log(`Deleted record with email ${email}`)
      }
    }
  }

  console.log('\n### TEST SUITE COMPLETE ###')
}

const main = async () => {
  try {
    await testBulkUpsert()
  } catch (error) {
    console.error('Test suite failed:', error)
    process.exit(1)
  }
}

main()
