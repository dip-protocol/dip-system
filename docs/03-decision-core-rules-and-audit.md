\---



\# Decision Core, Rules, and Audit Model



\---



\## DIP Core (`dip-core/`)



The DIP core is the \*\*deterministic engine\*\* of Manthan.

It is intentionally isolated to guarantee:



\* No side effects

\* No runtime mutation

\* Fully reproducible decisions



\---



\### `engine.js`



Core responsibilities:



\* \*\*Dot-path getter (`get`)\*\*

&#x20; Access nested input fields safely



\* \*\*Rule evaluation\*\*



&#x20; \* `matchesWhen` → checks rule applicability

&#x20; \* `matchesIf` → checks violation conditions



\* \*\*Supported operators\*\*



&#x20; \* `equals`

&#x20; \* `not\_equals`

&#x20; \* `exists`



\---



\### Output of the Engine



Each evaluation produces:



\* `status` → `ALLOW | BLOCK | REQUIRE\_OVERRIDE`

\* `violations` → list of triggered conditions

\* `reason` → human-readable explanation

\* `trace` → metadata for explainability



\---



\## Decision Semantics



The engine follows strict deterministic rules:



\* \*\*No applicable rule → `BLOCK`\*\*

\* \*\*Any BLOCK-level violation → `BLOCK`\*\*

\* \*\*Only non-block violations → `REQUIRE\_OVERRIDE`\*\*

\* \*\*No violations → `ALLOW`\*\*



This ensures:



\* Fail-safe defaults

\* No ambiguous decisions



\---



\### `validator.js`



Ensures correctness before evaluation:



\* Rules must be an \*\*array\*\*

\* Rule IDs must be \*\*unique\*\*

\* Each rule must contain:



&#x20; \* `when`

&#x20; \* `then.enforcement`

\* Input must be a valid object



\---



\## Rule Loading and Structure



\### Rule Loader



\* `rules/ruleLoader.js`



Maps:



```text

(orgId, systemId) → rules/{orgId}/{systemId}.json

```



\---



\### Example Rule Set



\* `rules/orgA/billing.json`



Includes policies like:



\* Only admins can create/delete users

\* Block guest user creation

\* Block zero invoice amount

\* Block negative payment sentinel values



\---



\## Enforcement and Approvals



\### Enforcement



\* `enforce.js`



\* Converts decision status into:



&#x20; \* Hard blocks

&#x20; \* Allowed execution paths



\---



\### Approval System



\* `approvalService.js`



Provides:



\* Approval token generation

\* Token verification

\* Override flows for `REQUIRE\_OVERRIDE` decisions



\---



\## Audit Lifecycle



\### Write Path



\* `audit.js`



\* Creates request-level audit entries



\* Updates execution results



\---



\### Read + Analytics Layer



\* `auditService.js`



Computes:



\* Total requests

\* Status breakdown (`ALLOW`, `BLOCK`, `OVERRIDE`)

\* Per-rule metrics:



&#x20; \* violations

&#x20; \* passes

&#x20; \* skips

\* Trend analysis over time ranges



\---



\## Example Assets



Located in `examples/`:



\* \*\*`README.md`\*\*

&#x20; Usage guidance



\* \*\*`PROMPT.md`\*\*

&#x20; Prompt scaffolding



\* \*\*`payloads/\*.json`\*\*

&#x20; Sample request inputs



\* \*\*`rules/billing.sample.json`\*\*

&#x20; Reference policy set



\---



\## Key Design Principles



\* \*\*Determinism first\*\*

&#x20; Same input → same output



\* \*\*Fail-safe by default\*\*

&#x20; No rule = BLOCK



\* \*\*Explainability built-in\*\*

&#x20; Every decision has a trace



\* \*\*Separation of concerns\*\*



&#x20; \* Decision ≠ Execution



\---



