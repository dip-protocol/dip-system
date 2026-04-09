function renderSummary(logs) {
  let success=0, failed=0, blocked=0, overridden=0;

  logs.forEach(l=>{
    if(l.status==="SUCCESS") success++;
    if(l.status==="FAILED") failed++;
    if(l.status==="BLOCKED") blocked++;
    if(l.status==="OVERRIDDEN") overridden++;
  });

  const rate = ((overridden/(logs.length||1))*100).toFixed(1);

  document.getElementById("summary").innerHTML = `
    <b>Summary</b><br/>
    ✅ ${success} | ❌ ${failed} | 🚫 ${blocked} | ⚠️ ${overridden}
    <br/>Override Rate: ${rate}%
  `;
}