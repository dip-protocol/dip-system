# API Documentation

## Authentication

All requests require:


x-api-key: YOUR_API_KEY


---

## 1. Generate Execution Token

### POST /action

### Request

```json
{
  "systemId": "billing",
  "orgId": "orgA",
  "action": {
    "type": "CREATE_USER"
  },
  "payload": {
    "userId": "user-1"
  },
  "context": {
    "actor": "admin",
    "role": "ADMIN"
  }
}
Response
{
  "success": true,
  "requestId": "uuid",
  "execution_token": {
    "action": "CREATE_USER",
    "payload": {
      "userId": "user-1"
    },
    "decisionHash": "...",
    "auditBinding": "...",
    "signature": "..."
  }
}
2. Execute Action
POST /execute
Request
{
  "action": {
    "type": "CREATE_USER"
  },
  "payload": {
    "userId": "user-1"
  },
  "requestId": "uuid",
  "decisionHash": "...",
  "auditBinding": "...",
  "signature": "..."
}
Response
{
  "success": true,
  "requestId": "uuid",
  "result": {
    "message": "User created"
  }
}
3. Audit Logs
GET /audit

Returns last 10 logs

4. Audit Summary
GET /audit/summary?range=7d
5. Single Audit
GET /audit/{requestId}