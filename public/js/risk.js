function renderRisk(logs){
  const map={};

  logs.forEach(l=>{
    const a=l.input?.action?.type||"UNKNOWN";
    if(!map[a]) map[a]={f:0,o:0};
    if(l.status==="FAILED") map[a].f++;
    if(l.status==="OVERRIDDEN") map[a].o++;
  });

  const rows = Object.entries(map).map(([a,d])=>{
    const score = d.f + d.o*2;
    return `<tr><td>${a}</td><td>${score}</td></tr>`;
  }).join("");

  document.getElementById("risk").innerHTML = `
    <b>Risk</b>
    <table>${rows}</table>
  `;
}