\# API Documentation



\## Authentication



All requests require:



```

x-api-key: YOUR\_API\_KEY

```



\---



\## 1. Generate Execution Token



\### POST /action



\### Request



```json

{

&#x20; "systemId": "billing",

&#x20; "orgId": "orgA",

&#x20; "action": {

&#x20;   "type": "CREATE\_USER"

&#x20; },

&#x20; "payload": {

&#x20;   "userId": "user-1"

&#x20; },

&#x20; "context": {

&#x20;   "actor": "admin",

&#x20;   "role": "ADMIN"

&#x20; }

}

```



\### Response



```json

{

&#x20; "success": true,

&#x20; "requestId": "uuid",

&#x20; "execution\_token": { ... }

}

```



\---



\## 2. Execute Action



\### POST /execute



\### Request



```json

{

&#x20; "action": { "type": "CREATE\_USER" },

&#x20; "payload": { "userId": "user-1" },

&#x20; "requestId": "uuid",

&#x20; "decisionHash": "...",

&#x20; "auditBinding": "...",

&#x20; "signature": "..."

}

```



\### Response



```json

{

&#x20; "success": true,

&#x20; "requestId": "uuid",

&#x20; "result": {

&#x20;   "message": "User created"

&#x20; }

}

```



\---



\## 3. Audit Logs



\### GET /audit



Returns last 10 logs



\---



\## 4. Audit Summary



\### GET /audit/summary?range=7d



\---



\## 5. Single Audit



\### GET /audit/{requestId}



