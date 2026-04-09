function renderInsights(logs){
  const insights=[];

  const failures = logs.filter(l=>l.status==="FAILED").length;
  if(failures>3){
    insights.push(`High failure count: ${failures}`);
  }

  document.getElementById("insights").innerHTML = `
    <b>Insights</b>
    <ul>${insights.map(i=>`<li>${i}</li>`).join("")}</ul>
  `;
}