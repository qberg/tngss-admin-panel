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
