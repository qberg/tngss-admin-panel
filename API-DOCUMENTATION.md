## API With Bearer tokens

```bash
curl -X POST https://cms.tngss.startuptn.in/api/attendee-passes/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 8fdca024d4bdaad6bd536e240b7216e795e9f07435a6863502072abecfc9a49b" \
  -d '{
    "pass_id": "TNGSSC_00354",
    "name": "Ganesan M",
    "email": "mganesan3010@gmail.com",
    "mobile": "+917418025625",
    "visitor_id": "a992fd90-70a3-4365-bd72-c1b7c458bd3c",
    "pass_created_at": "2025-09-04T09:45:04.470756Z",
    "conference_name": "TNGSS Conference",
    "pass_data": {
      "name": "Ganesan M",
      "email": "mganesan3010@gmail.com",
      "gender": "male",
      "mobile": "+917418025625",
      "organisation": "WisePrince"
    },
    "visitor_data": {
      "city": "Madurai",
      "state": "Tamil Nadu",
      "country": "India",
      "website": "https://wiseprince.in/",
      "profileType": "incubation_acceleration",
      "sectorIntrested": "social_impact_rural_livelihood_sustainability",
      "whyAttend": "meetStakeholders"
      "email": "mganesan3010@gmail.com"
    }
  }'
```

## Bulk

```bash
curl -X POST https://cms.tngss.startuptn.in/api/attendee-passes/bulk \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 8fdca024d4bdaad6bd536e240b7216e795e9f07435a6863502072abecfc9a49b" \
  -d '{
    "attendees": [
{
    "pass_id": "TNGSSC_00354",
    "name": "Ganesan M",
    "email": "mganesan3010@gmail.com",
    "mobile": "+917418025625",
    "visitor_id": "a992fd90-70a3-4365-bd72-c1b7c458bd3c",
    "pass_created_at": "2025-09-04T09:45:04.470756Z",
    "conference_name": "TNGSS Conference",
    "pass_data": {
      "name": "Ganesan M",
      "email": "mganesan3010@gmail.com",
      "gender": "male",
      "mobile": "+917418025625",
      "organisation": "WisePrince"
    },
    "visitor_data": {
      "city": "Madurai",
      "state": "Tamil Nadu",
      "country": "India",
      "website": "https://wiseprince.in/",
      "profileType": "incubation_acceleration",
      "sectorIntrested": "social_impact_rural_livelihood_sustainability",
      "whyAttend": "meetStakeholders"
      "email": "mganesan3010@gmail.com"
    }
  },
{
    "pass_id": "TNGSSC_00354",
    "name": "Ganesan M",
    "email": "mganesan3010@gmail.com",
    "mobile": "+917418025625",
    "visitor_id": "a992fd90-70a3-4365-bd72-c1b7c458bd3c",
    "pass_created_at": "2025-09-04T09:45:04.470756Z",
    "conference_name": "TNGSS Conference",
    "pass_data": {
      "name": "Ganesan M",
      "email": "mganesan3010@gmail.com",
      "gender": "male",
      "mobile": "+917418025625",
      "organisation": "WisePrince"
    },
    "visitor_data": {
      "city": "Madurai",
      "state": "Tamil Nadu",
      "country": "India",
      "website": "https://wiseprince.in/",
      "profileType": "incubation_acceleration",
      "sectorIntrested": "social_impact_rural_livelihood_sustainability",
      "whyAttend": "meetStakeholders",
      "email": "mganesan3010@gmail.com"
    }
  }

    ]
  }'
```

## SQL Query for reference

```sql
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
```
