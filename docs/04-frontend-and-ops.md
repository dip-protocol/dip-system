

\---



\# Frontend Dashboards and Operations Guide



\---



\## Legacy Static Dashboard (`public/`)



This is the \*\*lightweight observability layer\*\* for audit data.



\### Structure



\* \*\*`public/index.html`\*\*

&#x20; Hosts dashboard containers and layout



\* \*\*`public/js/main.js`\*\*



&#x20; \* Fetches data from `/audit`

&#x20; \* Dispatches results to rendering modules



\---



\### Visualization Modules



Each module renders a specific analytical view:



\* \*\*Trends\*\* → system activity over time

\* \*\*Risk\*\* → rule violations and severity

\* \*\*Patterns\*\* → recurring behaviors

\* \*\*Impact\*\* → decision consequences

\* \*\*Insights\*\* → derived explanations

\* \*\*Logs\*\* → raw audit records



\---



\### Utilities



\* \*\*`public/js/utils.js`\*\*



Provides:



\* Action formatting

\* Timestamp formatting

\* Diff generation

\* Human-readable explanations (`generateWhy`)



\---



\## React Dashboard (`manthan-ui/`)



The React app is the \*\*advanced UI layer\*\* for decision intelligence.



\---



\### Core Structure



\* \*\*App Root\*\*



&#x20; \* `manthan-ui/src/App.js`



\* \*\*API Layer\*\*



&#x20; \* `manthan-ui/src/api.js`

&#x20; \* Handles calls to backend endpoints (`/audit`, `/summary`, etc.)



\---



\### Key Components



\* \*\*HeroStats\*\*



&#x20; \* Displays top-level metrics (ALLOW / BLOCK / OVERRIDE)

&#x20; \* Maintains selection/filter state



\* \*\*TopRiskRules\*\*



&#x20; \* Lists highest-risk rules based on violations



\* \*\*TracePanel\*\*



&#x20; \* Displays request-level traces

&#x20; \* Supports filtered + latest trace loading



\* \*\*RiskPanel\*\*



&#x20; \* Visual breakdown of system risk



\* \*\*SummaryPanel\*\*



&#x20; \* Aggregated audit insights



\* \*\*RuleHeatmap\*\*



&#x20; \* Visual density of rule activity



\---



\### Styling



\* `src/index.css` → global styles

\* `src/styles.css` → application-specific styles



\---



\## Infrastructure and Packaging



\### Backend Dependencies



Defined in root `package.json`:



\* `express` → API server

\* `redis` → replay protection

\* `@supabase/supabase-js` → audit storage

\* `cors` → cross-origin support

\* `node-fetch` → external requests



\---



\### Frontend Dependencies



Defined in `manthan-ui/package.json`:



\* Create React App (CRA) stack

\* React + standard UI tooling



\---



\### Deployment



\* \*\*Docker\*\*



&#x20; \* `Dockerfile` for containerized builds



\* \*\*Fly.io\*\*



&#x20; \* `fly.toml` configuration



\---



\## Known Structure Notes



\* `manthan-ui/src/components/TracePanel.j`



&#x20; \* Likely an unintended duplicate next to `TracePanel.js`



\* `FILE\_DOCUMENTATION.md`



&#x20; \* Full file catalog with metadata



\* `RESUME.md`



&#x20; \* Implementation notes and development history

&#x20; \* Useful for context, not runtime



\---



\## Suggested Onboarding Path



To understand the system efficiently:



1\. \*\*Start with architecture\*\*



&#x20;  \* `README.md`

&#x20;  \* `dip-core/README.md`



2\. \*\*Understand runtime flow\*\*



&#x20;  \* `service.js`

&#x20;  \* `server.js`



3\. \*\*Explore decision logic\*\*



&#x20;  \* `rules/\*.json`

&#x20;  \* Run sample `/action` calls



4\. \*\*Inspect observability\*\*



&#x20;  \* `/audit/summary` endpoint

&#x20;  \* Dashboard rendering (static + React)



\---



\## Mental Model



\* Backend = \*\*Decision + Enforcement + Audit\*\*

\* Frontend = \*\*Visibility + Intelligence\*\*

\* Rules = \*\*Source of Truth\*\*



\---



