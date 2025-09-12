## Security Matrix

| Action                 | Admin | Event Manager | Content Manager | User |
| ---------------------- | ----- | ------------- | --------------- | ---- |
| **Create Users**       | ✅    | ✅            | ❌              | ❌   |
| **Read All Users**     | ✅    | ❌            | ❌              | ❌   |
| **Read Own Profile**   | ✅    | ✅            | ✅              | ✅   |
| **Change Roles**       | ✅    | ❌            | ❌              | ❌   |
| **Change Status**      | ✅    | ❌            | ❌              | ❌   |
| **Update Own Profile** | ✅    | ✅            | ✅              | ✅   |
| **Delete Users**       | ✅    | ❌            | ❌              | ❌   |

| No Ticket | FREE Ticket | DELEGATE Ticket
Main Events (View) | ✅ | ✅ | ✅
Main Events (Reg) | ❌ | ✅* | ✅*
Partner Events | ✅ | ✅ | ✅
Delegate-Only | ❌ | ❌ | ✅

Main Events Collection - Events during summit days
Partner Events Collection - Pre-summit events
User Tickets Collection - Links users to their ticket tiers
Event Registrations Collection - Tracks who registered for what
Show Interest Collection - For non-registration events

pm2 start .next/standalone/server.js \
 --name payload-app \
 -i max \
 --node-args="--max-old-space-size=1536" \
 -e NODE_ENV=production \
 -e PORT=3000 \
 -e HOSTNAME=0.0.0.0

## TODO

- [x] Featured Content for home page
- []

## Migration sctipts

```bash
npx payload run scripts/migrate-attendees.js test
```

## API Endpoints

```bash
/api/events/filters

/api/networking-sessions/available-venues?type=main_event
```

```
Event registration Approval or reject status update @917094606683  Bro

API url : https://dev.tngss.startuptn.in/event-service/v2/event/registration-status/update
Method : PUT
Payload in json :

{
"_id":"68bfa0d7063736b3f0e3f923",
"status":"approved"
}
// status enum: "rejected","approved"

Bearer token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjhiMzMxNzMxZDRlYmVmNzliOGM3ODZkIiwiaWF0IjoxNzU2NTc1Mzc1LCJleHAiOjE3NjUyMTUzNzV9.n8s-3SZfWQJy-lMkWX6jLWSC1cPjnlLWBjjJMc3vxBY
```

```
Api URL : https://tngss.startuptn.in/event-service/v2/event/user-registrations/statistics?event_id=68bfa0d7063736b3f0e3f923

Method : GET

Bearer token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjhiMzMxNzMxZDRlYmVmNzliOGM3ODZkIiwiaWF0IjoxNzU2NTc1Mzc1LCJleHAiOjE3NjUyMTUzNzV9.n8s-3SZfWQJy-lMkWX6jLWSC1cPjnlLWBjjJMc3vxBY
```
