<!DOCTYPE html>
<html>
<head>
  <title>Security Model</title>
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

    hr {
      margin: 30px 0;
      border: none;
      border-top: 1px solid #e5e7eb;
    }

    ol {
      margin-left: 20px;
    }

    @media (max-width: 768px) {
      body {
        padding: 16px;
      }
    }
  </style>
</head>

<body>
<div class="container">

<h1>Security Model</h1>

<h2>Guarantees</h2>

<h3>1. No Replay</h3>

<p>Each execution token is <strong>single-use</strong>.</p>

<div class="callout">
  🔁 Prevents replay attacks by invalidating tokens after execution.
</div>

<hr>

<h3>2. Decision Integrity</h3>

<p>A cryptographic hash ensures the payload is unchanged.</p>

<div class="callout">
  🔐 Any tampering with the payload invalidates the decision.
</div>

<hr>

<h3>3. Audit Binding</h3>

<p>Execution is tied to a unique <code>requestId</code>.</p>

<div class="callout">
  🔍 Ensures every execution can be traced back to its origin.
</div>

<hr>

<h3>4. Authorization</h3>

<p>All requests require a valid <code>x-api-key</code>.</p>

<div class="callout">
  🛡️ Unauthorized requests are rejected before processing.
</div>

<hr>

<h2>Validation Steps</h2>

<ol>
  <li>Structure validation</li>
  <li>Token verification</li>
  <li>Decision hash check</li>
  <li>Audit binding check</li>
  <li>Context validation</li>
  <li>Action whitelist</li>
</ol>

<div class="callout">
  ⚙️ Every step must pass for execution to succeed — no partial validation.
</div>

<hr>

</div>
</body>
</html>