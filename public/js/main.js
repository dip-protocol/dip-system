let allLogs = [];

async function loadLogs(){
  const res = await fetch("/audit", {
    headers: { "x-api-key": "Charak@987" }
  });

  const data = await res.json();
  allLogs = data.data || [];

  renderTrends(allLogs);
  renderSummary(allLogs);
  renderPatterns(allLogs);
  renderRisk(allLogs);
  renderImpact(allLogs);
  renderInsights(allLogs);
  renderLogs(allLogs);
}

loadLogs();