<!DOCTYPE html>

<html>

<head>

&#x20; <title>Development Guidelines</title>



&#x20; <!-- Mobile scaling -->

&#x20; <meta name="viewport" content="width=device-width, initial-scale=1.0">



&#x20; <style>

&#x20;   body {

&#x20;     font-family: Inter, sans-serif;

&#x20;     margin: 0;

&#x20;     padding: 20px;

&#x20;     line-height: 1.6;

&#x20;     color: #333;

&#x20;     background: #ffffff;

&#x20;   }



&#x20;   .container {

&#x20;     max-width: 900px;

&#x20;     margin: 0 auto;

&#x20;   }



&#x20;   h1 {

&#x20;     font-size: 32px;

&#x20;   }



&#x20;   h2 {

&#x20;     font-size: 24px;

&#x20;   }



&#x20;   h3 {

&#x20;     font-size: 18px;

&#x20;   }



&#x20;   h4 {

&#x20;     font-size: 16px;

&#x20;   }



&#x20;   pre {

&#x20;     background: #0b0f14;

&#x20;     color: #fff;

&#x20;     padding: 16px;

&#x20;     border-radius: 8px;

&#x20;     overflow-x: auto;

&#x20;     font-size: 14px;

&#x20;   }



&#x20;   code {

&#x20;     background: #eef2ff;

&#x20;     padding: 2px 6px;

&#x20;     border-radius: 4px;

&#x20;     font-size: 13px;

&#x20;   }



&#x20;   .callout {

&#x20;     background: #f5f7fa;

&#x20;     border-left: 4px solid #4f46e5;

&#x20;     padding: 16px;

&#x20;     margin: 20px 0;

&#x20;     font-size: 14px;

&#x20;   }



&#x20;   ul, ol {

&#x20;     margin-left: 20px;

&#x20;     padding-left: 10px;

&#x20;   }



&#x20;   li {

&#x20;     margin: 6px 0;

&#x20;   }



&#x20;   hr {

&#x20;     margin: 30px 0;

&#x20;     border: none;

&#x20;     border-top: 1px solid #e5e7eb;

&#x20;   }



&#x20;   /\* 📱 Mobile styles \*/

&#x20;   @media (max-width: 768px) {

&#x20;     body {

&#x20;       padding: 16px;

&#x20;     }



&#x20;     h1 {

&#x20;       font-size: 26px;

&#x20;     }



&#x20;     h2 {

&#x20;       font-size: 20px;

&#x20;     }



&#x20;     h3 {

&#x20;       font-size: 16px;

&#x20;     }



&#x20;     pre {

&#x20;       padding: 12px;

&#x20;       font-size: 13px;

&#x20;     }



&#x20;     .callout {

&#x20;       padding: 12px;

&#x20;       font-size: 13px;

&#x20;     }

&#x20;   }



&#x20;   /\* 📱 Small phones \*/

&#x20;   @media (max-width: 480px) {

&#x20;     h1 {

&#x20;       font-size: 22px;

&#x20;     }



&#x20;     h2 {

&#x20;       font-size: 18px;

&#x20;     }



&#x20;     pre {

&#x20;       font-size: 12px;

&#x20;     }

&#x20;   }



&#x20; </style>

</head>



<body>



<div class="container">



<h1>Development Guidelines</h1>



<h2>Overview</h2>



<p>This document defines how features must be built in Manthan.</p>



<div class="callout">

&#x20; 🧠 Every feature is a <strong>contract</strong>, not just code.

</div>



<hr>



<h2>Core Principle</h2>



<pre><code>Every change = Contract + Rule + Validation + Audit</code></pre>



<h3>Mandatory Development Flow</h3>



<p>Every feature MUST follow this sequence:</p>



<ol>

&#x20; <li>Define Contract</li>

&#x20; <li>Define Rules</li>

&#x20; <li>Implement Service Logic</li>

&#x20; <li>Add Validation</li>

&#x20; <li>Add Audit</li>

&#x20; <li>Add Tests</li>

&#x20; <li>Update Docs</li>

</ol>



<div class="callout">

&#x20; 🚫 Skipping any step breaks determinism.

</div>



<h3>Feature Template (COPY THIS)</h3>



<h4>1. Contract</h4>



<pre><code>{

&#x20; "action": "ACTION\_TYPE",

&#x20; "payload": {},

&#x20; "context": {}

}</code></pre>



<h4>2. Rules</h4>



<pre><code>{

&#x20; "action": "ACTION\_TYPE",

&#x20; "condition": "boolean expression",

&#x20; "effect": "ALLOW"

}</code></pre>



<h4>3. Service Logic</h4>



<pre><code>if (action.type === "ACTION\_TYPE") {

&#x20; return { message: "result" };

}</code></pre>



<h4>4. Validation</h4>



<ul>

&#x20; <li>Validate payload structure</li>

&#x20; <li>Validate required fields</li>

&#x20; <li>Reject invalid inputs</li>

</ul>



<h4>5. Audit</h4>



<p>Ensure audit includes:</p>



<ul>

&#x20; <li>requestId</li>

&#x20; <li>action</li>

&#x20; <li>decision</li>

&#x20; <li>result</li>

&#x20; <li>timestamp</li>

</ul>



<h4>6. Tests</h4>



<p>Must include:</p>



<ul>

&#x20; <li>✅ Valid case (allowed)</li>

&#x20; <li>❌ Invalid case (blocked)</li>

&#x20; <li>🔁 Replay attack</li>

&#x20; <li>⚠️ Tampering attempt</li>

</ul>



<h4>7. Documentation</h4>



<p>Update:</p>



<ul>

&#x20; <li>API docs</li>

&#x20; <li>Rule system</li>

&#x20; <li>Flow (if affected)</li>

</ul>



<hr>



<h2>Determinism Rules</h2>



<p>Same input → same output</p>



<p>Avoid:</p>



<ul>

&#x20; <li>Random values (<code>Math.random()</code>)</li>

&#x20; <li>Time-based logic (<code>Date.now()</code>)</li>

</ul>



<div class="callout">

&#x20; ⚠️ Unless explicitly part of the contract

</div>



<hr>



<h2>Code Structure Rules</h2>



<ul>

&#x20; <li><code>server.js</code> → routes ONLY</li>

&#x20; <li><code>service.js</code> → decision logic</li>

&#x20; <li><code>executionService.js</code> → verification</li>

&#x20; <li><code>auditService.js</code> → audit handling</li>

</ul>



<div class="callout">

&#x20; 🚫 No business logic in routes

</div>



<hr>



<h2>Naming Conventions</h2>



<ul>

&#x20; <li>Actions → UPPER\_SNAKE\_CASE</li>

&#x20; <li>Roles → UPPERCASE</li>

&#x20; <li>Files → kebab-case.md</li>

</ul>



<hr>



<h2>Debugging Flow</h2>



<p>When something fails:</p>



<ol>

&#x20; <li>Input</li>

&#x20; <li>Rules</li>

&#x20; <li>Decision</li>

&#x20; <li>Token</li>

&#x20; <li>Execution</li>

&#x20; <li>Audit</li>

</ol>



<hr>



<h2>Versioning Rules</h2>



<ul>

&#x20; <li>Rules must be versioned</li>

&#x20; <li>Contracts must be versioned</li>

&#x20; <li>No silent behavior changes</li>

</ul>



<div class="callout">

&#x20; 🔒 No runtime mutation allowed

</div>



<hr>



<h2>PR Checklist (MANDATORY)</h2>



<p>Before merging:</p>



<ul>

&#x20; <li>✔ Contract defined</li>

&#x20; <li>✔ Rule defined</li>

&#x20; <li>✔ Validation added</li>

&#x20; <li>✔ Audit recorded</li>

&#x20; <li>✔ Tests written</li>

&#x20; <li>✔ Docs updated</li>

</ul>



<div class="callout">

&#x20; 🚫 PR must be blocked if any item is missing

</div>



<hr>



<h2>Summary</h2>



<ul>

&#x20; <li>Features are contract-driven</li>

&#x20; <li>Rules are the source of truth</li>

&#x20; <li>Execution is strictly verified</li>

&#x20; <li>Audit ensures traceability</li>

</ul>



<div class="callout">

&#x20; 🧠 This enforces Manthan as Decision Infrastructure, not just an API.

</div>



</div>



</body>

</html>

