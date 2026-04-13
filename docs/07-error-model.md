<!DOCTYPE html>

<html>

<head>

&#x20; <title>Error Model \& Rule System</title>

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



&#x20;   hr {

&#x20;     margin: 30px 0;

&#x20;     border: none;

&#x20;     border-top: 1px solid #e5e7eb;

&#x20;   }

&#x20; </style>

</head>



<body>

<div class="container">



<!-- ================= ERROR MODEL ================= -->



<h1>Error Model</h1>



<h2>Overview</h2>

<p>Defines all possible failure modes in Manthan.</p>



<div class="callout">

&#x20; ⚠️ Every failure is deterministic and traceable via <code>requestId</code>.

</div>



<hr>



<h2>Error Categories</h2>



<h3>1. Validation Errors</h3>

<ul>

&#x20; <li>Missing <code>orgId</code></li>

&#x20; <li>Missing <code>systemId</code></li>

&#x20; <li>Invalid payload</li>

</ul>

<p><strong>Status:</strong> 400</p>



<hr>



<h3>2. Authorization Errors</h3>

<ul>

&#x20; <li>Invalid API key</li>

</ul>

<p><strong>Status:</strong> 401</p>



<hr>



<h3>3. Execution Errors</h3>

<ul>

&#x20; <li>Token replay</li>

&#x20; <li>Signature invalid</li>

&#x20; <li>Decision mismatch</li>

</ul>

<p><strong>Status:</strong> 403</p>



<hr>



<h3>4. System Errors</h3>

<ul>

&#x20; <li>Internal failures</li>

</ul>

<p><strong>Status:</strong> 500</p>



<hr>



<h2>Response Format</h2>



<pre><code>{

&#x20; "success": false,

&#x20; "error": "Error message",

&#x20; "requestId": "uuid"

}</code></pre>



<div class="callout">

&#x20; 🔍 Every error response includes a <code>requestId</code> for audit tracing.

</div>



<hr>



<h2>Determinism Rule</h2>



<p>Same input → same error</p>



<div class="callout">

&#x20; 🧠 Error outcomes are deterministic and reproducible.

</div>



<hr>



<!-- ================= RULE SYSTEM ================= -->



<h1>Rule System</h1>



<h2>Overview</h2>

<p>Rules define decision logic in Manthan.</p>



<div class="callout">

&#x20; 🧠 Rules are the core of deterministic decision-making.

</div>



<hr>



<h2>Structure</h2>



<ul>

&#x20; <li>Scoped by <code>systemId</code></li>

&#x20; <li>Action-based</li>

&#x20; <li>Context-aware</li>

</ul>



<div class="callout">

&#x20; ⚙️ Rules evaluate inputs and context to produce a deterministic outcome.

</div>



<hr>



<h2>Example</h2>



<pre><code>{

&#x20; "action": "DELETE\_USER",

&#x20; "condition": "role == ADMIN",

&#x20; "effect": "ALLOW"

}</code></pre>



<div class="callout">

&#x20; ⚡ Only users with the <code>ADMIN</code> role can perform this action.

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

&#x20; 🚫 If rules fail, execution is blocked immediately.

</div>



</div>

</body>

</html>

