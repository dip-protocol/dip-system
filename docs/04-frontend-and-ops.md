<!DOCTYPE html>
<html>
<head>
  <title>Frontend & Operations</title>
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
    }
  </style>
</head>

<body>
<div class="container">

<h1>Frontend & Operations</h1>

<h2>API Explorer</h2>

<p>Swagger UI is available at:</p>

<pre><code>/docs</code></pre>

<div class="callout">
  🧪 Use this interface to test API endpoints interactively.
</div>

<hr>

<h2>Documentation Site</h2>

<pre><code>/docs-site</code></pre>

<div class="callout">
  📘 This is the primary documentation interface for understanding the system.
</div>

<hr>

<h2>Logs & Debugging</h2>

<p>Use the following endpoints:</p>

<ul>
  <li><code>/audit</code></li>
  <li><code>/audit/summary</code></li>
  <li><code>/audit/{requestId}</code></li>
</ul>

<div class="callout">
  🔍 These endpoints provide full visibility into system behavior and decisions.
</div>

<hr>

<h2>Deployment</h2>

<pre><code>fly deploy</code></pre>

<div class="callout">
  🚀 Deploys the system to Fly.io with the current configuration.
</div>

<hr>

<h2>Environment Variables</h2>

<ul>
  <li><code>API_KEY</code></li>
  <li><code>REDIS_URL</code></li>
  <li><code>PORT</code></li>
</ul>

<div class="callout">
  ⚙️ Ensure all environment variables are configured before deployment.
</div>

</div>
</body>
</html>