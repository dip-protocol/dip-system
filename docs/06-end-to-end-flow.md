<!DOCTYPE html>

<html>

<head>

&#x20; <title>End-to-End Flow</title>

&#x20; <meta name="viewport" content="width=device-width, initial-scale=1.0">



&#x20; <style>

&#x20;   body {

&#x20;     font-family: Inter, sans-serif;

&#x20;     margin: 0;

&#x20;     padding: 20px;

&#x20;     line-height: 1.6;

&#x20;     color: #333;

&#x20;   }



&#x20;   .container {

&#x20;     max-width: 900px;

&#x20;     margin: 0 auto;

&#x20;   }



&#x20;   h2, h3 {

&#x20;     margin-top: 30px;

&#x20;   }



&#x20;   pre {

&#x20;     background: #0b0f14;

&#x20;     color: #fff;

&#x20;     padding: 16px;

&#x20;     border-radius: 8px;

&#x20;     overflow-x: auto;

&#x20;   }



&#x20;   code {

&#x20;     background: #eef2ff;

&#x20;     padding: 2px 6px;

&#x20;     border-radius: 4px;

&#x20;   }



&#x20;   .callout {

&#x20;     background: #f5f7fa;

&#x20;     border-left: 4px solid #4f46e5;

&#x20;     padding: 16px;

&#x20;     margin: 20px 0;

&#x20;   }



&#x20;   ul, ol {

&#x20;     margin-left: 20px;

&#x20;   }



&#x20;   hr {

&#x20;     margin: 30px 0;

&#x20;     border-top: 1px solid #e5e7eb;

&#x20;   }

&#x20; </style>

</head>



<body>

<div class="container">



<h2>Step 1 — Client Request</h2>



<p>Client sends request to:</p>

<p><strong>POST</strong> <code>/action</code></p>



<h3>Example</h3>



<pre><code>{

&#x20; "systemId": "billing",

&#x20; "orgId": "orgA",

&#x20; "action": { "type": "CREATE\_USER" },

&#x20; "payload": { "userId": "user-1" },

&#x20; "context": {

&#x20;   "actor": "admin",

&#x20;   "role": "ADMIN"

&#x20; }

}</code></pre>



<div class="callout">

&#x20; 📥 This is the initial intent submitted to the decision system.

</div>



<hr>



<h2>Step 2 — Decision Engine</h2>



<p>Handled by:</p>

<p><code>service.js</code></p>



<h3>What happens</h3>



<ul>

&#x20; <li>Input validation</li>

&#x20; <li>Rule evaluation</li>

&#x20; <li>Deterministic decision generation</li>

&#x20; <li>Decision hash creation</li>

&#x20; <li>Audit log creation</li>

</ul>



<div class="callout">

&#x20; 🧠 The system evaluates rules and produces a deterministic decision.

</div>



<hr>



<h2>Step 3 — Execution Token Generated</h2>



<h3>Response</h3>



<pre><code>{

&#x20; "success": true,

&#x20; "requestId": "uuid",

&#x20; "execution\_token": {

&#x20;   "action": { "type": "CREATE\_USER" },

&#x20;   "payload": { "userId": "user-1" },

&#x20;   "decisionHash": "...",

&#x20;   "auditBinding": "...",

&#x20;   "signature": "..."

&#x20; }

}</code></pre>



<div class="callout">

&#x20; 🔐 The execution token binds the decision, payload, and audit context.

</div>



<hr>



<h2>Step 4 — Client Executes Decision</h2>



<p>Client sends token to:</p>

<p><strong>POST</strong> <code>/execute</code></p>



<hr>



<h2>Step 5 — Execution Verification</h2>



<p>Handled by:</p>

<p><code>executionService.js</code></p>



<h3>Validation Steps</h3>



<ul>

&#x20; <li>Token structure validation</li>

&#x20; <li>Signature verification</li>

&#x20; <li>Replay protection (Redis)</li>

&#x20; <li>Decision hash validation</li>

&#x20; <li>Audit binding validation</li>

&#x20; <li>Request existence check</li>

&#x20; <li>Action whitelist check</li>

</ul>



<div class="callout">

&#x20; ⚙️ All validations must pass before execution is allowed.

</div>



<hr>



<h2>Step 6 — Execution Happens</h2>



<p>If valid:</p>



<ul>

&#x20; <li>Action executed</li>

&#x20; <li>Result generated</li>

</ul>



<h3>Example</h3>



<pre><code>{

&#x20; "message": "User created",

&#x20; "userId": "user-1"

}</code></pre>



<div class="callout">

&#x20; 🚀 Execution is performed only after full validation.

</div>



<hr>



<h2>Step 7 — Audit Update</h2>



<p>Handled by:</p>

<p><code>auditService.js</code></p>



<h3>Stored Data</h3>



<ul>

&#x20; <li><code>requestId</code></li>

&#x20; <li>decision</li>

&#x20; <li>execution result</li>

&#x20; <li>status (<code>SUCCESS</code> / <code>FAILURE</code>)</li>

&#x20; <li>timestamp</li>

</ul>



<div class="callout">

&#x20; 🔍 Every execution is recorded for traceability.

</div>



<hr>



<h2>Step 8 — Audit Retrieval</h2>



<p>Available APIs:</p>



<ul>

&#x20; <li><code>GET /audit</code></li>

&#x20; <li><code>GET /audit/{requestId}</code></li>

&#x20; <li><code>GET /audit/summary</code></li>

</ul>



<hr>



<h2>Full Flow Summary</h2>



<pre><code>Client

&#x20; ↓

POST /action

&#x20; ↓

Decision Engine (service.js)

&#x20; ↓

Execution Token

&#x20; ↓

POST /execute

&#x20; ↓

Verification (executionService.js)

&#x20; ↓

Execution

&#x20; ↓

Audit Update

&#x20; ↓

Audit APIs</code></pre>



<div class="callout">

&#x20; 🔁 The entire flow is deterministic, validated, and auditable.

</div>



<hr>



<h2>Key Guarantees</h2>



<ul>

&#x20; <li>Deterministic decisions</li>

&#x20; <li>Cryptographic integrity</li>

&#x20; <li>Replay protection</li>

&#x20; <li>Full audit traceability</li>

&#x20; <li>Strict contract enforcement</li>

</ul>



<hr>



<h2>Failure Cases</h2>



<p>Execution fails if:</p>



<ul>

&#x20; <li>Token is tampered</li>

&#x20; <li>Payload is modified</li>

&#x20; <li>Replay is detected</li>

&#x20; <li>Signature is invalid</li>

&#x20; <li>Audit binding mismatch</li>

&#x20; <li>Action not allowed</li>

</ul>



<div class="callout">

&#x20; 🚫 Any failure at any step blocks execution completely.

</div>



<hr>



<h2>Summary</h2>



<p>Manthan ensures:</p>



<ul>

&#x20; <li>Every decision is verified before execution</li>

&#x20; <li>Every execution is audited</li>

&#x20; <li>Every action is traceable end-to-end</li>

</ul>



<div class="callout">

&#x20; 🧠 This guarantees a fully deterministic and trustworthy decision system.

</div>



</div>

</body>

</html>

