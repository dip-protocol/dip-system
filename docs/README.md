<!DOCTYPE html>
<html>
<head>
  <title>Manthan v0.2 — Decision Infrastructure</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <style>
    body {
      font-family: Inter, sans-serif;
      margin: 0;
      padding: 20px;
      line-height: 1.6;
      color: #333;
      background: #ffffff;
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
    }

    h1, h2, h3 {
      margin-top: 30px;
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

    ul, ol {
      margin-left: 20px;
    }

    hr {
      margin: 30px 0;
      border: none;
      border-top: 1px solid #e5e7eb;
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

<h1>Manthan v0.2 — Decision Infrastructure</h1>

<h2>Overview</h2>

<p>
Manthan is a <strong>deterministic decision system</strong> that enforces, audits, and executes actions with <strong>cryptographic integrity</strong>.
</p>

<div class="callout">
  🧠 Every decision is validated before execution and recorded for full traceability.
</div>

<hr>

<h2>Core Flow</h2>

<ol>
  <li><code>/action</code> → Generate execution token</li>
  <li><code>/execute</code> → Execute validated decision</li>
  <li><code>/audit</code> → Retrieve audit logs</li>
</ol>

<div class="callout">
  🔁 Each step is enforced, validated, and auditable.
</div>

<hr>

<h2>Key Principles</h2>

<ul>
  <li>Deterministic decisions</li>
  <li>Execution token verification</li>
  <li>Audit traceability</li>
  <li>Replay protection</li>
  <li>Decision integrity via hashing</li>
</ul>

<div class="callout">
  ⚡ These principles ensure every action is secure, reproducible, and verifiable.
</div>

<hr>

<h2>API Docs</h2>

<p>👉 Live Swagger UI:</p>

<p><code>https://dip-system.fly.dev/docs</code></p>

<div class="callout">
  🧪 Use Swagger UI to explore and test API endpoints.
</div>

<hr>

<h2>Modules</h2>

<ul>
  <li><code>service.js</code> → Decision engine</li>
  <li><code>executionService.js</code> → Token verification</li>
  <li><code>auditService.js</code> → Audit intelligence</li>
  <li><code>server.js</code> → API layer</li>
</ul>

<div class="callout">
  🧩 Each module contributes to a deterministic and auditable execution pipeline.
</div>

<hr>

<h2>Version</h2>

<p><strong>v0.2 — Deterministic PR Gate + Execution System</strong></p>

<div class="callout">
  🔒 This version enforces strict validation, auditability, and replay-safe execution.
</div>

<hr>

</div>
</body>
</html>