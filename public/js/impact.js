function renderImpact(logs){
  const map={};

  logs.forEach(l=>{
    const a=l.input?.action?.type||"UNKNOWN";
    if(!map[a]) map[a]={f:0,o:0,b:0};

    if(l.status==="FAILED") map[a].f++;
    if(l.status==="OVERRIDDEN") map[a].o++;
    if(l.status==="BLOCKED") map[a].b++;
  });

  const rows = Object.entries(map).map(([a,d])=>{
    const impact = d.f*2 + d.o*3 + d.b;
    return `<tr><td>${a}</td><td>${impact}</td></tr>`;
  }).join("");

  document.getElementById("impact").innerHTML = `
    <b>Impact</b>
    <table>${rows}</table>
  `;
}