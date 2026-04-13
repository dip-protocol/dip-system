<!DOCTYPE html>
<html>
<head>
  <title>API Documentation</title>
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

<h1>API Documentation</h1>

<h2>Authentication</h2>

<p>All requests require:</p>

<pre><code>x-api-key: YOUR_API_KEY</code></pre>

<div class="callout">
  🔐 Requests without a valid API key will be rejected.
</div>

<hr>

<h2>1. Generate Execution Token</h2>

<p><strong>POST</strong> <code>/action</code></p>

<h3>Request</h3>

<pre><code>{
  "systemId": "billing",
  "orgId": "orgA",
  "action": {
    "type": "CREATE_USER"
  },
  "payload": {
    "userId": "user-1"
  },
  "context": {
    "actor": "admin",
    "role": "ADMIN"
  }
}</code></pre>

<h3>Response</h3>

<pre><code>{
  "success": true,
  "requestId": "uuid",
  "execution_token": {
    "action": "CREATE_USER",
    "payload": {
      "userId": "user-1"
    },
    "decisionHash": "...",
    "auditBinding": "...",
    "signature": "..."
  }
}</code></pre>

<div class="callout">
  ⚡ Generates a deterministic execution token bound to the request and decision.
</div>

<hr>

<h2>2. Execute Action</h2>

<p><strong>POST</strong> <code>/execute</code></p>

<h3>Request</h3>

<pre><code>{
  "action": {
    "type": "CREATE_USER"
  },
  "payload": {
    "userId": "user-1"
  },
  "requestId": "uuid",
  "decisionHash": "...",
  "auditBinding": "...",
  "signature": "..."
}</code></pre>

<h3>Response</h3>

<pre><code>{
  "success": true,
  "requestId": "uuid",
  "result": {
    "message": "User created"
  }
}</code></pre>

<div class="callout">
  🚀 Execution succeeds only if all bindings and signatures are valid.
</div>

<hr>

<h2>3. Audit Logs</h2>

<p><strong>GET</strong> <code>/audit</code></p>

<p>Returns last 10 logs.</p>

<hr>

<h2>4. Audit Summary</h2>

<p><strong>GET</strong> <code>/audit/summary?range=7d</code></p>

<div class="callout">
  📊 Provides aggregated audit insights over a time range.
</div>

<hr>

<h2>5. Single Audit</h2>

<p><strong>GET</strong> <code>/audit/{requestId}</code></p>

<div class="callout">
  🔍 Retrieves full trace for a specific request.
</div>

</div>
</body>
</html>