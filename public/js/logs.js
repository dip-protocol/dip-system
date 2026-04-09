function renderLogs(logs) {
  const container = document.getElementById("logs");

  if (!container) {
    console.error("Logs container not found");
    return;
  }

  if (!logs || logs.length === 0) {
    container.innerHTML = "<p>No logs found</p>";
    return;
  }

  container.innerHTML = logs.map(log => {
    const status = log?.decision?.status || "UNKNOWN";

    let color = "#999";
    if (status === "ALLOW") color = "green";
    if (status === "BLOCK") color = "red";

    return `
      <div class="section">
        <div><strong>Status:</strong> <span style="color:${color}">${status}</span></div>
        <div><strong>Request ID:</strong> ${log.requestId || "N/A"}</div>

        <details>
          <summary>View Details</summary>

          <div style="margin-top:10px;">

            <div>
              <strong>Request Input</strong>
              <pre>${JSON.stringify(log.request_input, null, 2)}</pre>
            </div>

            <div>
              <strong>Execution Input</strong>
              <pre>${JSON.stringify(log.execution_input || {}, null, 2)}</pre>
            </div>

            <div>
              <strong>Decision</strong>
              <pre>${JSON.stringify(log.decision, null, 2)}</pre>
            </div>

            <div>
              <strong>Result</strong>
              <pre>${JSON.stringify(log.result, null, 2)}</pre>
            </div>

          </div>
        </details>
      </div>
    `;
  }).join("");
}