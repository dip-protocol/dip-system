function renderLogs(logs){
  document.getElementById("logs").innerHTML =
    logs.map(log=>{
      const action = formatAction(log.input?.action?.type);
      const time = formatTime(log.timestamp);

      return `
        <div class="card">
          <b>${action}</b><br/>
          ${time}
        </div>
      `;
    }).join("");
}