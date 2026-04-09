function renderInsights(logs) {
  const el = document.getElementById("insights");

  // ✅ Prevent crash
  if (!el) {
    console.error("Insights element not found");
    return;
  }

  if (!logs || logs.length === 0) {
    el.innerHTML = "<p>No insights available</p>";
    return;
  }

  let blocked = 0;
  let allowed = 0;

  for (const log of logs) {
    if (log?.decision?.status === "BLOCK") blocked++;
    if (log?.decision?.status === "ALLOW") allowed++;
  }

  el.innerHTML = `
    <div class="card">
      <div>Allowed Actions: ${allowed}</div>
      <div>Blocked Actions: ${blocked}</div>
    </div>
  `;
}