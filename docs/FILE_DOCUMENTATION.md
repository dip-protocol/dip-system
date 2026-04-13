<!DOCTYPE html>
<html>
<head>
  <title>File Documentation</title>
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

    code {
      background: #eef2ff;
      padding: 2px 6px;
      border-radius: 4px;
    }

    pre {
      background: #0b0f14;
      color: #fff;
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
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

<h1>File Documentation</h1>

<h2>Core Files</h2>

<h3>server.js</h3>
<p>Entry point for the API server.</p>
<div class="callout">
  🚀 Initializes routes, middleware, and system services.
</div>

<hr>

<h3>service.js</h3>
<p>Core decision engine logic.</p>
<div class="callout">
  🧠 Evaluates actions against rules and produces deterministic decisions.
</div>

<hr>

<h3>executionService.js</h3>
<p>Handles execution validation.</p>
<div class="callout">
  ⚙️ Verifies execution tokens, integrity, and replay protection.
</div>

<hr>

<h3>auditService.js</h3>
<p>Stores and retrieves audit logs.</p>
<div class="callout">
  🔍 Maintains full traceability of all system actions.
</div>

<hr>

<h3>enforce.js</h3>
<p>Rule enforcement layer.</p>
<div class="callout">
  🚫 Blocks execution when rules are violated.
</div>

<hr>

<h2>Supporting Files</h2>

<h3>redisClient.js</h3>
<p>Handles Redis connection.</p>
<div class="callout">
  🔁 Used for replay protection and execution token validation.
</div>

<hr>

<h3>db.js</h3>
<p>Basic database utilities.</p>
<div class="callout">
  💾 Provides storage access for audit and system data.
</div>

<hr>

<h2>Rules</h2>

<p>Located in:</p>

<pre><code>/rules</code></pre>

<div class="callout">
  📜 Contains rule definitions used by the decision engine.
</div>

<hr>

<h2>Docs</h2>

<p>Located in:</p>

<pre><code>/docs</code></pre>

<div class="callout">
  📘 Source of truth for system documentation and API definitions.
</div>

<hr>

<h2>🔥 What improved</h2>

<h3>1. Each file now explains <em>purpose</em></h3>

<p>Before:</p>
<pre><code>server.js → Entry point</code></pre>

<p>Now:</p>
<pre><code>server.js → Entry + what it actually does</code></pre>

<p>👉 Much clearer for developers</p>

<hr>

<h3>2. Callouts add meaning</h3>
<ul>
  <li>Not just <em>what</em></li>
  <li>But <em>why it exists</em></li>
</ul>

<hr>

<h3>3. Paths fixed</h3>

<pre><code>/rules
/docs</code></pre>

<p>→ now proper code blocks</p>

<hr>

<h2>🧭 Result</h2>

</div>
</body>
</html>