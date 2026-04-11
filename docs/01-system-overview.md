

\---



\# Manthan / DIP System



> \*\*Deterministic Decision Infrastructure\*\*

> Every decision is traceable, auditable, and built for trust.



\---



\## Overview



Manthan (DIP System) is a \*\*deterministic decision infrastructure platform\*\* that evaluates actions against rule-based policies and enforces outcomes with cryptographic guarantees.



\### Core Flow



```

Input → Rule Evaluation → Enforcement → Execution Token → Auditing → Analytics

```



The system ensures that every decision is:



\* Deterministic

\* Verifiable

\* Replay-safe

\* Fully auditable



\---



\## Architecture



\### Runtime Components



\* \*\*API Layer\*\*



&#x20; \* `server.js`, `app.js`

&#x20; \* Handles routing, auth, and input validation



\* \*\*Decision Orchestration\*\*



&#x20; \* `service.js`

&#x20; \* Controls full decision lifecycle



\* \*\*Core Decision Engine\*\*



&#x20; \* `dip-core/`

&#x20; \* Deterministic rule evaluation + trace generation



\* \*\*Rule System\*\*



&#x20; \* `rules/`

&#x20; \* JSON-based policy definitions per org/system



\* \*\*Execution Layer\*\*



&#x20; \* `executionService.js`

&#x20; \* `approvalService.js`

&#x20; \* Token signing + verification



\* \*\*Audit \& Analytics\*\*



&#x20; \* `audit.js`, `auditService.js`

&#x20; \* Persistence + summaries + trends



\* \*\*Dashboards\*\*



&#x20; \* Static UI: `public/`

&#x20; \* React UI: `manthan-ui/`



\---



\## End-to-End Flow



1\. \*\*Request Submission\*\*



&#x20;  ```

&#x20;  POST /action

&#x20;  ```



&#x20;  Payload includes:



&#x20;  \* org

&#x20;  \* system

&#x20;  \* action

&#x20;  \* context

&#x20;  \* payload



2\. \*\*Decision Processing\*\*



&#x20;  \* Rules are loaded

&#x20;  \* Input is normalized

&#x20;  \* Deterministic evaluation is executed



3\. \*\*Enforcement\*\*



&#x20;  \* Applied via `enforce.js`



4\. \*\*Execution Token\*\*



&#x20;  \* If allowed, a short-lived signed token is generated



5\. \*\*Audit Logging\*\*



&#x20;  \* Decision stored in Supabase



6\. \*\*Execution\*\*



&#x20;  ```

&#x20;  POST /execute

&#x20;  ```



&#x20;  Token is verified for:



&#x20;  \* Signature

&#x20;  \* Replay protection

&#x20;  \* Decision integrity



7\. \*\*Result Recording\*\*



&#x20;  ```

&#x20;  POST /audit-result

&#x20;  ```



8\. \*\*Observability\*\*



&#x20;  \* `/audit`

&#x20;  \* `/audit/summary`



\---



\## Guarantees



\* \*\*Deterministic Decisions\*\*



&#x20; \* Same input always produces same output



\* \*\*Fail-Safe Defaults\*\*



&#x20; \* No matching rule ⇒ \*\*BLOCK\*\*



\* \*\*Cryptographic Integrity\*\*



&#x20; \* `decisionHash`

&#x20; \* `auditBinding`



\* \*\*Replay Protection\*\*



&#x20; \* Redis-based `SET NX` mechanism



\* \*\*Full Audit Trail\*\*



&#x20; \* Every request is logged and traceable



\---



\## Key Files



| File                      | Responsibility           |

| ------------------------- | ------------------------ |

| `server.js`               | API routes, auth, guards |

| `service.js`              | Decision orchestration   |

| `dip-core/engine.js`      | Rule evaluation engine   |

| `dip-core/validator.js`   | Input + rule validation  |

| `rules/ruleLoader.js`     | Rule loading             |

| `rules/orgA/billing.json` | Example policies         |

| `auditService.js`         | Metrics + summaries      |



\---



\## Deployment



\* \*\*Containerized\*\* via `Dockerfile`

\* \*\*Hosted on Fly.io\*\*



&#x20; \* Config: `fly.toml`

\* \*\*CI/CD\*\*



&#x20; \* `.github/workflows/fly-deploy.yml`



\---



\## Philosophy



Manthan treats \*\*decision-making as infrastructure\*\*, not business logic.



\* Rules are \*\*explicit contracts\*\*

\* Execution is \*\*separate from decision\*\*

\* Every action is \*\*provable and replay-safe\*\*



\---



\## Status



\*\*Version: v0.2.1 (Locked State)\*\*



\* Deterministic engine

\* PR Gate enforcement

\* Execution token security (anti-replay)

\* Audit + analytics pipeline



\---



