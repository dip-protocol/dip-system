<!DOCTYPE html>

<html>

<head>

&#x20; <title>Deployment \& Operations</title>

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



<h1>Deployment \& Operations</h1>



<h2>Environment</h2>



<ul>

&#x20; <li>Node.js</li>

&#x20; <li>Fly.io</li>

</ul>



<div class="callout">

&#x20; ⚙️ Manthan runs as a Node.js service and is deployed via Fly.io.

</div>



<hr>



<h2>Required Environment Variables</h2>



<ul>

&#x20; <li><code>API\_KEY</code></li>

&#x20; <li><code>SUPABASE\_URL</code></li>

&#x20; <li><code>SUPABASE\_KEY</code></li>

&#x20; <li><code>REDIS\_URL</code></li>

</ul>



<div class="callout">

&#x20; 🔐 Missing environment variables will prevent the system from starting correctly.

</div>



<hr>



<h2>Environment Validation</h2>



<p>At startup, validate required environment variables:</p>



<pre><code>const requiredEnv = \["API\_KEY", "SUPABASE\_URL", "SUPABASE\_KEY", "REDIS\_URL"];



requiredEnv.forEach((key) => {

&#x20; if (!process.env\[key]) {

&#x20;   throw new Error(`Missing required env: ${key}`);

&#x20; }

});</code></pre>



<div class="callout">

&#x20; ⚠️ Fail fast if configuration is invalid — prevents undefined runtime behavior.

</div>



<hr>



<h2>Local Run</h2>



<pre><code>npm install

node server.js</code></pre>



<div class="callout">

&#x20; 🚀 Starts the API server locally.

</div>



<hr>



<h2>Production Deployment</h2>



<pre><code>fly deploy</code></pre>



<div class="callout">

&#x20; 🌍 Deploys the application to Fly.io.

</div>



<hr>



<h2>Health Check</h2>



<h3>Endpoint</h3>

<p><code>GET /health</code></p>



<h3>Response</h3>



<pre><code>{

&#x20; "status": "ok",

&#x20; "uptime": 12345,

&#x20; "timestamp": "2026-04-13T10:00:00Z"

}</code></pre>



<div class="callout">

&#x20; ❤️ Used by Fly.io and monitoring systems to verify service health.

</div>



<hr>



<h2>Health Check Implementation</h2>



<pre><code>app.get("/health", (req, res) => {

&#x20; res.json({

&#x20;   status: "ok",

&#x20;   uptime: process.uptime(),

&#x20;   timestamp: new Date().toISOString()

&#x20; });

});</code></pre>



<hr>



<h2>Operational Guarantees</h2>



<ul>

&#x20; <li>System fails fast on invalid config</li>

&#x20; <li>Health endpoint always available</li>

&#x20; <li>Deployment is reproducible</li>

&#x20; <li>Runtime behavior is deterministic</li>

</ul>



<div class="callout">

&#x20; 🧠 Operations are designed to be predictable, observable, and failure-safe.

</div>



</div>

</body>

</html>

