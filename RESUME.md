You are continuing work on \*\*Manthan — a deterministic Decision Intelligence System\*\*.



STRICT RULES (DO NOT VIOLATE):



1\. NO ARCHITECTURE DRIFT



\* Do NOT introduce new patterns, abstractions, or redesigns

\* Work ONLY within existing files (service.js, auditService.js, server.js, React components)

\* No refactors unless explicitly asked



2\. DECISION IS SINGLE SOURCE OF TRUTH



\* decision.status ∈ { ALLOW, BLOCK, REQUIRE\_OVERRIDE }

\* Audit MUST store decision.status exactly

\* No derived statuses like SUCCESS, FAILED, BLOCKED, etc.



3\. OVERRIDE SEMANTICS (LOCKED)



\* Rule fail → BLOCK

\* If override present → decision.status = REQUIRE\_OVERRIDE

\* Override is a decision state, NOT metadata



4\. SYSTEM FLOW (DO NOT CHANGE)



\* evaluate() → decision

\* enforce() → blocks only if BLOCK without override

\* validateInput()

\* buildExecutionInput()

\* logAudit() → must store decision.status



5\. SUMMARY CONTRACT (LOCKED)



\* status\_breakdown MUST ONLY contain:



&#x20; \* ALLOW

&#x20; \* BLOCK

&#x20; \* REQUIRE\_OVERRIDE

\* total\_requests = sum of above

\* No grouping, no inference, no fallback logic



6\. FRONTEND CONTRACT



\* UI reads ONLY from:



&#x20; \* /audit/summary

&#x20; \* /audit

\* No recomputation of status in frontend

\* selectedType filters trace panel only



7\. DO NOT ADD



\* No caching layers

\* No async background jobs

\* No ML/LLM logic

\* No automatic overrides



8\. DEBUG PRINCIPLE



\* If counts mismatch → issue in summary (auditService.js)

\* If wrong status stored → issue in service.js

\* If UI mismatch → frontend only



\---



CURRENT STATE (LOCKED):



Backend:



\* auditService.js supports range-based filtering:



&#x20; \* 1d, 7d, 30d, 365d, 5y, all

\* getAuditSummary() is deterministic and strict

\* server.js uses:

&#x20; → getAll(range)

&#x20; → getAuditSummary(logs)

\* No trend logic used in UI



Frontend:



\* HeroStats shows:



&#x20; \* total

&#x20; \* ALLOW / BLOCK / REQUIRE\_OVERRIDE

&#x20; \* percentage distribution

\* Range selector exists and drives API:

&#x20; → /audit/summary?range=...

\* No trend/diff shown (intentionally removed for clarity)

\* Clean centered layout, no redundant panels



Removed (INTENTIONAL):



\* Risk panel

\* Summary panel duplication

\* Trend/diff UI



\---



OBJECTIVE:



Continue improving \*\*clarity, explainability, and decision intelligence UX\*\*



DO:



\* Improve readability and hierarchy

\* Improve explainability of rules / trace

\* Add meaningful insights (deterministic only)



DO NOT:



\* Change architecture

\* Add new decision states

\* Add derived metrics without audit basis

\* Introduce hidden logic



\---



RESPONSE RULES:



If proposing a change:



\* Show exact file

\* Show exact code

\* Explain why it does NOT violate constraints



Keep everything:



\* Deterministic

\* Traceable

\* Auditable

\* Minimal



