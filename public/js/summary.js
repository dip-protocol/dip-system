function renderSummary(logs) {
  const el = document.getElementById("summary");

  // ✅ Deterministic safety (prevents crash)
  if (!el) {
    console.error("Summary element not found");
    return;
  }

  // ✅ Handle empty or undefined logs
  if (!logs || logs.length === 0) {
    el.innerHTML = `
      <div class="card">
        <h3>Summary</h3>
        <p>No data available</p>
      </div>
    `;
    return;
  }

  let total = logs.length;
  let allowed = 0;
  let blocked = 0;
  let errors = 0;

  for (const log of logs) {
    if (log?.decision?.status === "ALLOW") allowed++;
    if (log?.decision?.status === "BLOCK") blocked++;
    if (log?.result?.error) errors++;
  }

  el.innerHTML = `
    <div class="card">
      <h3>Summary</h3>
      <div>Total Requests: ${total}</div>
      <div>Allowed: ${allowed}</div>
      <div>Blocked: ${blocked}</div>
      <div>Errors: ${errors}</div>
    </div>
  `;
}