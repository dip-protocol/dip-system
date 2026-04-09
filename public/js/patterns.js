function renderPatterns(logs){
  const failed={}, blocked={};

  logs.forEach(l=>{
    const a=l.input?.action?.type||"UNKNOWN";
    if(l.status==="FAILED") failed[a]=(failed[a]||0)+1;
    if(l.status==="BLOCKED") blocked[a]=(blocked[a]||0)+1;
  });

  const top = obj => Object.entries(obj)
    .sort((a,b)=>b[1]-a[1]).slice(0,3);

  document.getElementById("patterns").innerHTML = `
    <b>Patterns</b>
    <ul>${top(failed).map(([k,v])=>`<li>${k} → ${v}</li>`).join("")}</ul>
  `;
}