<!DOCTYPE html>
<html>
<head>
  <title>Manthan System Overview</title>
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

    h1, h2 {
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

<h1>Manthan System Overview</h1>

<p>
Manthan is a <strong>Decision Infrastructure System</strong> that ensures every action is:
</p>

<ul>
  <li>Deterministic</li>
  <li>Auditable</li>
  <li>Enforced via rules</li>
</ul>

<div class="callout">
  <strong>System Guarantee:</strong><br/>
  Every decision is traceable, auditable, and enforced before execution.
</div>

<hr>

<h2>Core Principles</h2>

<ul>
  <li>Every action is validated before execution</li>
  <li>Every decision is traceable</li>
  <li>No runtime mutation</li>
  <li>Contracts define system truth</li>
</ul>

<div class="callout">
  ⚡ These principles are enforced at runtime, not just documented.
</div>

<hr>

<h2>Execution Flow</h2>

<ol>
  <li>Generate execution token <code>/action</code></li>
  <li>Execute action <code>/execute</code></li>
  <li>Record audit <code>/audit</code></li>
</ol>

<div class="callout">
  🔁 Every step is validated and logged for auditability.
</div>

<hr>

<h2>Components</h2>

<ul>
  <li>Decision Engine</li>
  <li>Execution Service</li>
  <li>Audit System</li>
  <li>Rule Engine</li>
</ul>

<div class="callout">
  🧠 Each component operates deterministically and contributes to the decision lifecycle.
</div>

<hr>

</div>
</body>
</html>