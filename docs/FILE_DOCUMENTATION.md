

\---



\# Manthan (DIP System)



> \*\*Deterministic Decision Infrastructure\*\*

> Every decision is traceable, auditable, and built for trust.



\---



\## What is Manthan?



Manthan is a \*\*decision infrastructure system\*\* that separates:



\* \*\*Decision (rules, evaluation, enforcement)\*\*

\* \*\*Execution (external systems)\*\*



It ensures that every action taken by a system is:



\* Deterministic

\* Verifiable

\* Replay-safe

\* Fully auditable



\---



\## Core Principle



```text

Input → Rule Evaluation → Enforcement → Execution Token → Audit → Analytics

```



This is not business logic.

This is \*\*decision infrastructure\*\*.



\---



\## System Architecture



\### 1. API Layer



\* `server.js`

\* `app.js`



Handles:



\* Authentication middleware

\* Input validation

\* Public endpoints:



&#x20; \* `POST /action`

&#x20; \* `POST /execute`

&#x20; \* `POST /audit-result`

&#x20; \* `GET /audit`

&#x20; \* `GET /audit/summary`

&#x20; \* `GET /audit/:requestId`



\---



\### 2. Decision Orchestration



\* `service.js`



Responsibilities:



\* Input normalization

\* Rule loading

\* Deterministic evaluation

\* Execution preparation



\---



\### 3. Deterministic Core Engine



\* `dip-core/engine.js`

\* `dip-core/validator.js`



Provides:



\* Rule matching (`matchesWhen`, `matchesIf`)

\* Condition evaluation

\* Trace generation

\* Input + rule validation



\---



\### 4. Rule System



\* `rules/ruleLoader.js`

\* `rules/orgA/billing.json`



Features:



\* JSON-based policy definitions

\* Org + system scoped rules

\* Deterministic evaluation guarantees



\---



\### 5. Enforcement Layer



\* `enforce.js`



\* Applies decision outcomes



\* Ensures fail-safe defaults (\*\*BLOCK if no match\*\*)



\---



\### 6. Execution Security Layer



\* `executionService.js`

\* `approvalService.js`



Provides:



\* Execution token signing

\* Token verification

\* Canonicalization

\* Cryptographic binding to decisions



\---



\### 7. Audit \& Analytics



\* `audit.js`

\* `auditService.js`

\* `findAudit.js`



Capabilities:



\* Persistent audit logging

\* Request-level traceability

\* Summary + trend analytics



\---



\### 8. Replay Protection



\* `redisClient.js`



\* Prevents token reuse



\* Uses \*\*SET NX\*\* pattern for idempotency



\---



\### 9. Hashing \& Integrity



\* `utils/hash.js`



\* Canonicalization



\* `decisionHash` generation



\* Ensures decision immutability



\---



\### 10. UI Layers



\#### Static Dashboard



\* `public/`

\* `public/js/\*`



Includes:



\* Logs

\* Risk

\* Trends

\* Patterns

\* Impact

\* Insights



\#### React Dashboard



\* `manthan-ui/`



Key components:



\* `RiskPanel`

\* `SummaryPanel`

\* `TracePanel`

\* `TopRiskRules`

\* `RuleHeatmap`



\---



\## End-to-End Flow



\### Step 1: Decision Request



```http

POST /action

```



Input:



\* org

\* system

\* action

\* context

\* payload



\---



\### Step 2: Deterministic Evaluation



Inside `service.handleAction`:



\* Load rules

\* Normalize input

\* Run engine (`dip-core`)

\* Generate trace



\---



\### Step 3: Enforcement



\* Applied via `enforce.js`

\* If no rule matches → \*\*BLOCK\*\*



\---



\### Step 4: Execution Token



If allowed:



\* Signed token generated

\* Short-lived

\* Bound to decision hash



\---



\### Step 5: Audit Logging



\* Stored via `audit.js`

\* Backed by Supabase



\---



\### Step 6: Execution



```http

POST /execute

```



Verification:



\* Signature

\* Replay protection (Redis)

\* Decision integrity



\---



\### Step 7: Result Recording



```http

POST /audit-result

```



\---



\### Step 8: Observability



Endpoints:



\* `/audit`

\* `/audit/summary`

\* `/audit/:requestId`



\---



\## Guarantees



\### Determinism



\* Same input → same decision

\* No runtime mutation



\### Fail-Safe Defaults



\* No rule match → \*\*BLOCK\*\*



\### Cryptographic Integrity



\* `decisionHash`

\* `auditBinding`



\### Replay Protection



\* Redis `SET NX`



\### Full Traceability



\* Every request has:



&#x20; \* Input

&#x20; \* Rule trace

&#x20; \* Decision

&#x20; \* Execution result



\---



\## Example Rules



\* `rules/orgA/billing.json`

\* `examples/rules/billing.sample.json`



\---



\## Testing



\* `test-manthan.js` → end-to-end test runner

\* `dip-core/test.js` → engine-level tests



\---



\## Deployment



\### Container



\* `Dockerfile`



\### Infrastructure



\* `fly.toml` (Fly.io)



\### CI/CD



\* `.github/workflows/fly-deploy.yml`



\---



\## Repository Structure (Summary)



\* `dip-core/` → deterministic engine

\* `rules/` → policy definitions

\* `public/` → static dashboards

\* `manthan-ui/` → React UI

\* `examples/` → payloads + sample rules

\* `utils/` → hashing + helpers



\---



\## Version



\*\*v0.2.1 — Locked State\*\*



Includes:



\* Deterministic engine

\* Execution token security (anti-replay)

\* Audit + analytics pipeline

\* PR Gate foundation



\---



\## Philosophy



Manthan treats \*\*decision-making as infrastructure\*\*:



\* Rules are \*\*contracts\*\*, not code branches

\* Execution is \*\*separate from decision\*\*

\* Systems become \*\*provable\*\*, not just functional



\---



