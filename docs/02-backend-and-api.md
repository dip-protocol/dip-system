# Backend & API

## Base URL

https://dip-system.fly.dev


---

## Authentication

All requests require:


x-api-key: YOUR_API_KEY


---

## 1. Generate Execution Token

**POST** `/action`

### Request
```json
{
  "systemId": "billing",
  "orgId": "orga",
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
  "execution_token": {
    "action": "CREATE_USER",
    "payload": {
      "userId": "user-1"
    },
    "decisionHash": "abc123",
    "auditBinding": "xyz456"
  }
}
2. Execute Action

POST /execute

Request
{
  "execution_token": "TOKEN_HERE"
}
Response
{
  "success": true
}
3. Get Audit Logs

GET /audit

Response
{
  "success": true,
  "logs": []
}
4. Get Audit Summary

GET /audit/summary?range=7d

5. Get Single Audit Trace

GET /audit/{requestId}

Example
/audit/17670520-xxxx