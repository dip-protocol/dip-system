<!DOCTYPE html>
<html>
<head>
  <title>Backend & API</title>
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
      border-top: 1px solid #e5e7eb;
    }
  </style>
</head>

<body>
<div class="container">

<h1>Backend & API</h1>

<h2>Base URL</h2>

<p><code>https://dip-system.fly.dev</code></p>

<hr>

<h2>Authentication</h2>

<p>All requests require:</p>

<pre><code>x-api-key: YOUR_API_KEY</code></pre>

<div class="callout">
  🔐 All endpoints are protected via API key authentication.
</div>

<hr>

<h2>1. Generate Execution Token</h2>

<p><strong>POST</strong> <code>/action</code></p>

<h3>Request</h3>

<pre><code>{
  "systemId": "billing",
  "orgId": "orga",
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
  "execution_token": {
    "action": "CREATE_USER",
    "payload": {
      "userId": "user-1"
    },
    "decisionHash": "abc123",
    "auditBinding": "xyz456"
  }
}</code></pre>

<div class="callout">
  ⚡ This step validates intent and generates a deterministic execution token.
</div>

<hr>

<h2>2. Execute Action</h2>

<p><strong>POST</strong> <code>/execute</code></p>

<h3>Request</h3>

<pre><code>{
  "execution_token": "TOKEN_HERE"
}</code></pre>

<h3>Response</h3>

<pre><code>{
  "success": true
}</code></pre>

<div class="callout">
  🚀 Execution only succeeds if the token is valid and untampered.
</div>

<hr>

<h2>3. Get Audit Logs</h2>

<p><strong>GET</strong> <code>/audit</code></p>

<h3>Response</h3>

<pre><code>{
  "success": true,
  "logs": []
}</code></pre>

<hr>

<h2>4. Get Audit Summary</h2>

<p><strong>GET</strong> <code>/audit/summary?range=7d</code></p>

<div class="callout">
  📊 Returns aggregated audit insights over a time range.
</div>

<hr>

<h2>5. Get Single Audit Trace</h2>

<p><strong>GET</strong> <code>/audit/{requestId}</code></p>

<p><strong>Example:</strong></p>

<pre><code>/audit/17670520-xxxx</code></pre>

<div class="callout">
  🔍 Provides full trace of a single decision lifecycle.
</div>

</div>
</body>
</html>