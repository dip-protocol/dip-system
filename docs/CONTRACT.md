<!DOCTYPE html>
<html>
<head>
  <title>Contract Model</title>
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

<h1>Contract Model</h1>

<p>Manthan enforces <strong>decision contracts</strong>:</p>

<ul>
  <li>Input → structured request</li>
  <li>Output → execution token</li>
  <li>Enforcement → deterministic validation</li>
</ul>

<div class="callout">
  📌 Contracts define the <strong>single source of truth</strong> for system behavior.
</div>

<hr>

<h2>Contract Properties</h2>

<ul>
  <li>Deterministic</li>
  <li>Verifiable</li>
  <li>Immutable</li>
  <li>Auditable</li>
</ul>

<div class="callout">
  ⚡ These properties ensure every decision can be trusted and reproduced.
</div>

<hr>

<h2>Versioning</h2>

<p>Contracts evolve via <strong>version upgrades</strong>.</p>

<p>No runtime mutation allowed.</p>

<div class="callout">
  🔒 Changes are only introduced through controlled, versioned updates — never at runtime.
</div>

<hr>

<h2>Contract Example</h2>

<pre><code>{
  "intent": "CREATE_USER",
  "inputs": {
    "userId": "string",
    "role": "string"
  },
  "outputs": {
    "executionToken": "signed-token",
    "decisionHash": "sha256"
  },
  "behavior": {
    "validation": "role must be ADMIN",
    "effect": "user is created if validation passes"
  },
  "determinism": {
    "rulesVersion": "v1",
    "noRuntimeMutation": true
  },
  "boundaries": {
    "allowedRoles": ["ADMIN"],
    "system": "billing"
  },
  "metadata": {
    "version": "1.0.0",
    "audit": true
  }
}</code></pre>

<hr>

</div>
</body>
</html>