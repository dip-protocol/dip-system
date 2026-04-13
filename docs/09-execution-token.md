<!DOCTYPE html>

<html>

<head>

&#x20; <title>Execution Token</title>

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



&#x20;   @media (max-width: 768px) {

&#x20;     body {

&#x20;       padding: 16px;

&#x20;     }



&#x20;     pre {

&#x20;       padding: 12px;

&#x20;       font-size: 13px;

&#x20;     }

&#x20;   }

&#x20; </style>

</head>



<body>

<div class="container">



<h1>Execution Token</h1>



<h2>Overview</h2>



<p>Execution token is a <strong>signed, verifiable decision artifact</strong>.</p>



<div class="callout">

&#x20; 🔐 It binds the decision, payload, and audit context into a tamper-proof structure.

</div>



<hr>



<h2>Structure</h2>



<pre><code>{

&#x20; "action": { "type": "CREATE\_USER" },

&#x20; "payload": { "userId": "user-1" },

&#x20; "decisionHash": "sha256(...)",

&#x20; "auditBinding": "sha256(requestId + decisionHash)",

&#x20; "signature": "signed\_hash"

}</code></pre>



<hr>



<h2>Formal Contract Specification</h2>



<h3>Input → Output Contract</h3>



<p><strong>Input:</strong></p>

<pre><code>action

payload

context

requestId</code></pre>



<p><strong>Output:</strong></p>

<pre><code>execution\_token</code></pre>



<hr>



<h3>Deterministic Mapping</h3>



<pre><code>execution\_token = sign(

&#x20; hash(

&#x20;   canonicalize(action + payload)

&#x20; )

)</code></pre>



<hr>



<h3>Derived Fields</h3>



<h4>1. Decision Hash</h4>



<pre><code>decisionHash = sha256(

&#x20; canonicalize({ action, payload })

)</code></pre>



<h4>2. Audit Binding</h4>



<pre><code>auditBinding = sha256(

&#x20; requestId + decisionHash

)</code></pre>



<h4>3. Signature</h4>



<pre><code>signature = sign(

&#x20; decisionHash + auditBinding

)</code></pre>



<hr>



<h2>Invariants (MUST ALWAYS HOLD)</h2>



<ol>

&#x20; <li><strong>Integrity</strong><br>

&#x20;   sha256(canonicalize(action + payload)) == decisionHash

&#x20; </li>

&#x20; <li><strong>Audit Binding</strong><br>

&#x20;   sha256(requestId + decisionHash) == auditBinding

&#x20; </li>

&#x20; <li><strong>Authenticity</strong><br>

&#x20;   verify(signature, decisionHash + auditBinding) == true

&#x20; </li>

&#x20; <li><strong>Replay Protection</strong><br>

&#x20;   token(requestId) can be used ONLY once

&#x20; </li>

&#x20; <li><strong>Determinism</strong><br>

&#x20;   Same input → same decisionHash

&#x20; </li>

</ol>



<hr>



<h2>Validation Pipeline</h2>



<ol>

&#x20; <li>Validate structure</li>

&#x20; <li>Verify signature</li>

&#x20; <li>Recompute decisionHash</li>

&#x20; <li>Recompute auditBinding</li>

&#x20; <li>Check replay (Redis)</li>

&#x20; <li>Validate requestId exists</li>

&#x20; <li>Allow execution</li>

</ol>



<hr>



<h2>Token Lifecycle</h2>



<pre><code>Request → /action

&#x20; ↓

Decision Engine (service.js)

&#x20; ↓

Token Generated

&#x20; ↓

Token Signed

&#x20; ↓

Client receives token

&#x20; ↓

Client calls /execute

&#x20; ↓

Verification (executionService.js)

&#x20; ↓

Execution

&#x20; ↓

Token consumed

&#x20; ↓

Audit recorded</code></pre>



<hr>



<h2>Security Guarantees</h2>



<ul>

&#x20; <li>Tamper-proof</li>

&#x20; <li>Single-use</li>

&#x20; <li>Cryptographically verifiable</li>

&#x20; <li>Bound to audit trail</li>

&#x20; <li>Deterministic</li>

</ul>



<hr>



<h2>System Mapping</h2>



<ul>

&#x20; <li><code>service.js</code> → generates token</li>

&#x20; <li><code>executionService.js</code> → verifies token</li>

&#x20; <li><code>/action</code> → issuance</li>

&#x20; <li><code>/execute</code> → consumption</li>

</ul>



<hr>



<h2>Summary</h2>



<p>Execution token is a decision contract:</p>



<ul>

&#x20; <li>Encodes decision deterministically</li>

&#x20; <li>Verifies execution integrity</li>

&#x20; <li>Prevents replay attacks</li>

&#x20; <li>Guarantees traceability</li>

</ul>



<div class="callout">

&#x20; 🧠 This is the core primitive of Manthan’s Decision Infrastructure.

</div>



</div>

</body>

</html>

