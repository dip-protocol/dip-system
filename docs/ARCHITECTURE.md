<!DOCTYPE html>
<html>
<head>
  <title>Architecture</title>
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

    @media (max-width: 768px) {
      body {
        padding: 16px;
      }

      pre {
        padding: 12px;
        font-size: 13px;
      }
    }
  </style>
</head>

<body>
<div class="container">

<h1>Architecture</h1>

<h2>System Layers</h2>

<h3>1. Decision Layer</h3>

<ul>
  <li>Rule evaluation</li>
  <li>Deterministic output</li>
</ul>

<div class="callout">
  🧠 Ensures every decision is computed consistently with no ambiguity.
</div>

<hr>

<h3>2. Execution Layer</h3>

<ul>
  <li>Token verification</li>
  <li>Replay protection</li>
  <li>Integrity validation</li>
</ul>

<div class="callout">
  ⚙️ Guarantees that only validated and untampered actions are executed.
</div>

<hr>

<h3>3. Audit Layer</h3>

<ul>
  <li>Immutable logs</li>
  <li>Traceability</li>
  <li>Trend analysis</li>
</ul>

<div class="callout">
  🔍 Captures every decision and execution for full audit visibility.
</div>

<hr>

<h2>Flow</h2>

<pre><code>Client → /action → Execution Token
       → /execute → Verified Execution
       → Audit stored in DB</code></pre>

<div class="callout">
  🔁 Each step is validated and recorded to ensure end-to-end integrity.
</div>

<hr>

<h2>Security Model</h2>

<ul>
  <li>SHA256 decision hash</li>
  <li>Audit binding</li>
  <li>Signed execution token</li>
  <li>Redis replay protection</li>
</ul>

<div class="callout">
  🔐 Security is enforced at every layer to prevent tampering and replay attacks.
</div>

</div>
</body>
</html>