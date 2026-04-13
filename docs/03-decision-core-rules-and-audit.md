<!DOCTYPE html>
<html>
<head>
  <title>Decision Core, Rules & Audit</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <style>
    body {
      font-family: Inter, sans-serif;
      margin: 0;
      padding: 20px;
      line-height: 1.6;
      color: #333;
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
    }

    h1, h2, h3 {
      margin-top: 30px;
    }

    pre {
      background: #0b0f14;
      color: #fff;
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
    }

    code {
      background: #eef2ff;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .callout {
      background: #f5f7fa;
      border-left: 4px solid #4f46e5;
      padding: 16px;
      margin: 20px 0;
    }

    ul {
      margin-left: 20px;
    }

    hr {
      margin: 30px 0;
      border-top: 1px solid #e5e7eb;
    }
  </style>
</head>

<body>
<div class="container">

<h1>Decision Core, Rules & Audit</h1>

<h2>Decision Engine</h2>

<p>Manthan evaluates every action against predefined rules.</p>

<div class="callout">
  🧠 Every decision is computed deterministically based on system contracts.
</div>

<hr>

<h2>Rule Enforcement</h2>

<ul>
  <li>Rules are deterministic</li>
  <li>No overrides without audit</li>
  <li>Violations block execution</li>
</ul>

<div class="callout">
  🚫 Any rule violation prevents execution unless explicitly audited.
</div>

<hr>

<h2>Example Rule</h2>

<pre><code>{
  "action": "DELETE_USER",
  "allowedRoles": ["ADMIN"]
}</code></pre>

<div class="callout">
  ⚡ Only users with the <code>ADMIN</code> role can perform this action.
</div>

<hr>

<h2>Audit System</h2>

<p>Every execution produces:</p>

<ul>
  <li><code>decisionHash</code></li>
  <li><code>auditBinding</code></li>
  <li><code>requestId</code></li>
</ul>

<div class="callout">
  🔍 These identifiers ensure full traceability of every decision.
</div>

<hr>

<h2>Guarantees</h2>

<ul>
  <li>Full traceability</li>
  <li>Replay protection</li>
  <li>Tamper detection</li>
</ul>

<div class="callout">
  🔐 The system guarantees that no execution can occur without audit integrity.
</div>

</div>
</body>
</html>