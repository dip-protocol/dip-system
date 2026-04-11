

\---



\# Backend and API Documentation



\---



\## Entry Points



\* \*\*`server.js`\*\*

&#x20; Main API entry point with middleware and all routes.



\* \*\*`app.js`\*\*

&#x20; Lightweight script for testing `/action` flows via direct service calls.



\---



\## Middleware and Security



\* CORS enabled for `GET` and `POST` requests

\* Supports `x-api-key` header authentication

\* Enforces `Content-Type: application/json` for all POST requests

\* API key middleware protects critical endpoints



\---



\## API Endpoints



\### POST `/action`



\*\*Purpose:\*\* Initiate a decision request



\*\*Behavior:\*\*



\* Validates request body:



&#x20; \* `orgId`

&#x20; \* `systemId`

&#x20; \* `action.type`

\* Generates a `requestId`

\* Delegates to `handleAction` in `service.js`

\* Returns a \*\*signed execution token\*\*



\---



\### POST `/execute`



\*\*Purpose:\*\* Execute a previously approved decision



\*\*Behavior:\*\*



\* Validates token structure

\* Verifies:



&#x20; \* HMAC signature

&#x20; \* Anti-replay protection (`executionService.verifyExecutionToken`)

\* Recomputes `decisionHash` from action + payload

\* Validates:



&#x20; \* Audit binding (`requestId + decisionHash`)

&#x20; \* Request existence in `audit\_logs`

\* Applies action allowlist

\* Simulates or executes the final result



\---



\### POST `/audit-result`



\*\*Purpose:\*\* Record execution outcome



\*\*Behavior:\*\*



\* Updates audit record with external execution result



\---



\### GET `/audit`



\*\*Purpose:\*\* Fetch audit logs (list view)



\---



\### GET `/audit/:requestId`



\*\*Purpose:\*\* Fetch detailed audit record



\---



\### GET `/audit/summary`



\*\*Purpose:\*\* Aggregated observability



\*\*Returns:\*\*



\* Status breakdown

\* Per-rule statistics

\* Trend deltas



\---



\## Service Orchestration (`service.js`)



The decision lifecycle follows these steps:



1\. Load rules by `org` and `system`

2\. Normalize input:



&#x20;  \* `role` → lowercase

&#x20;  \* `action.type` → uppercase

3\. Evaluate rules \*\*twice\*\* (determinism guard)

4\. Validate payload contract

5\. Handle override path (approval token)

6\. Enforce decision (`enforce.js`)

7\. Build execution intent payload

8\. Compute `decisionHash`

9\. Sign execution token

10\. Write audit record



\---



\## Storage and Integrations



\* \*\*Supabase\*\*



&#x20; \* Configured via `db.js`

&#x20; \* Stores audit logs



\* \*\*Redis\*\*



&#x20; \* Managed via `redisClient.js`

&#x20; \* Used for replay protection (`SET NX`)



\* \*\*Hashing Utilities\*\*



&#x20; \* `utils/hash.js`

&#x20; \* Provides canonicalization + decision hashing



\---



\## Operational Scripts



\* \*\*`findAudit.js`\*\*



&#x20; \* Local tool for inspecting audit records



\* \*\*`test-manthan.js`\*\*



&#x20; \* Multi-case test harness for validating action flows



\---



\## Key Guarantees



\* Deterministic decision execution

\* Strong token verification (HMAC + hash binding)

\* Replay attack prevention

\* Full audit traceability

\* Strict input validation and enforcement



\---



