function renderTrends(logs) {
  const byDay = {};

  logs.forEach(l => {
    const day = new Date(l.timestamp).toISOString().slice(0, 10);
    if (!byDay[day]) byDay[day] = { failed: 0, overridden: 0 };

    if (l.status === "FAILED") byDay[day].failed++;
    if (l.status === "OVERRIDDEN") byDay[day].overridden++;
  });

  const days = Object.keys(byDay).sort().slice(-7);

  document.getElementById("trends").innerHTML = `
    <b>Trends</b>
    <table>
      <tr><th>Date</th><th>Failures</th><th>Overrides</th></tr>
      ${days.map(d => `
        <tr>
          <td>${d}</td>
          <td>${byDay[d].failed}</td>
          <td>${byDay[d].overridden}</td>
        </tr>
      `).join("")}
    </table>
  `;
}