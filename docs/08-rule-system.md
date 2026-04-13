<!DOCTYPE html>

<html>

<head>

&#x20; <title>Rule System</title>

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



&#x20;   h1, h2, h3 {

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

&#x20;     border: none;

&#x20;     border-top: 1px solid #e5e7eb;

&#x20;   }

&#x20; </style>

</head>



<body>

<div class="container">



<h1>Rule System</h1>



<h2>Overview</h2>

<p>Rules define decision logic in Manthan.</p>



<div class="callout">

&#x20; 🧠 Rules are the core of deterministic decision-making.

</div>



<hr>



<h2>Structure</h2>



<p>Rules are:</p>



<ul>

&#x20; <li>Scoped by <code>systemId</code></li>

&#x20; <li>Action-based</li>

&#x20; <li>Context-aware</li>

</ul>



<div class="callout">

&#x20; ⚙️ Rules evaluate input + context to produce a deterministic outcome.

</div>



<hr>



<h2>Rule Format</h2>



<pre><code>{

&#x20; "action": "ACTION\_TYPE",

&#x20; "condition": "boolean expression",

&#x20; "effect": "ALLOW | DENY"

}</code></pre>



<hr>



<h2>Rule Examples</h2>



<h3>1. Allow Admin to Create User</h3>



<pre><code>{

&#x20; "action": "CREATE\_USER",

&#x20; "condition": "role == 'ADMIN'",

&#x20; "effect": "ALLOW"

}</code></pre>



<h3>2. Deny Non-Admin Delete</h3>



<pre><code>{

&#x20; "action": "DELETE\_USER",

&#x20; "condition": "role != 'ADMIN'",

&#x20; "effect": "DENY"

}</code></pre>



<h3>3. Conditional Allow (Admin OR Owner)</h3>



<pre><code>{

&#x20; "action": "UPDATE\_USER",

&#x20; "condition": "role == 'ADMIN' || actor == payload.userId",

&#x20; "effect": "ALLOW"

}</code></pre>



<div class="callout">

&#x20; ⚡ Rules can combine role, actor, and payload context.

</div>



<hr>



<h2>Properties</h2>



<ul>

&#x20; <li>Deterministic</li>

&#x20; <li>Versioned</li>

&#x20; <li>Immutable</li>

</ul>



<div class="callout">

&#x20; 🔒 Rules cannot change at runtime — only via version upgrades.

</div>



<hr>



<h2>Enforcement</h2>



<p>Rules are evaluated before execution token generation.</p>



<div class="callout">

&#x20; 🚫 If rules fail → execution is blocked immediately.

</div>



<hr>



<h2>Rule Engine Flow</h2>



<pre><code>Input Request

&#x20; ↓

Extract action + context

&#x20; ↓

Fetch rules (systemId + action)

&#x20; ↓

Evaluate conditions

&#x20; ↓

Match found?

&#x20;  → NO  → DENY

&#x20;  → YES → Apply effect (ALLOW / DENY)

&#x20; ↓

Decision Output</code></pre>



<div class="callout">

&#x20; 🔁 Same input → same decision (deterministic guarantee)

</div>



<hr>



<h2>Evaluation Steps</h2>



<ol>

&#x20; <li>Identify systemId</li>

&#x20; <li>Match action.type</li>

&#x20; <li>Evaluate rule conditions</li>

&#x20; <li>Determine effect (ALLOW / DENY)</li>

&#x20; <li>Produce deterministic decision</li>

</ol>



<div class="callout">

&#x20; ⚙️ Evaluation is stateless and fully deterministic.

</div>



<hr>



<h2>System Mapping</h2>



<p>This maps directly to:</p>



<ul>

&#x20; <li><code>service.js</code> → rule evaluation engine</li>

&#x20; <li><code>/action</code> → rule enforcement entry point</li>

&#x20; <li><code>execution token</code> → output of rule decision</li>

</ul>



<hr>



<h2>Summary</h2>



<ul>

&#x20; <li>Rules define what is allowed</li>

&#x20; <li>Evaluation is deterministic</li>

&#x20; <li>Enforcement is strict and pre-execution</li>

&#x20; <li>Output is cryptographically bound decision</li>

</ul>



</div>

</body>

</html>

