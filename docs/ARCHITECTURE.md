\# Architecture



\## System Layers



\### 1. Decision Layer



\* Rule evaluation

\* Deterministic output



\### 2. Execution Layer



\* Token verification

\* Replay protection

\* Integrity validation



\### 3. Audit Layer



\* Immutable logs

\* Traceability

\* Trend analysis



\---



\## Flow



Client → /action → Execution Token

→ /execute → Verified Execution

→ Audit stored in DB



\---



\## Security Model



\* SHA256 decision hash

\* Audit binding

\* Signed execution token

\* Redis replay protection



