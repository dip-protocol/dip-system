import { useEffect, useState } from "react";
import "./styles.css";

import HeroStats from "./components/HeroStats";
import SummaryPanel from "./components/SummaryPanel";
import RiskPanel from "./components/RiskPanel";
import RuleHeatmap from "./components/RuleHeatmap";
import TracePanel from "./components/TracePanel";

import { getSummary } from "./api";

function App() {
  const [summary, setSummary] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    getSummary().then((res) => {
      setSummary(res.data);
    });
  }, []);

  if (!summary) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Manthan</h1>

<p className="subtitle">
  Monitor decisions, detect rule violations, and understand system risk.
</p>

<div className="focus-box">
  {!selectedType && (
    <p>
      👇 Start by selecting a decision type (Allowed / Blocked / Override)
    </p>
  )}

  {selectedType && (
    <p>
      Showing <b>{selectedType}</b> decisions → Inspect how system evaluated rules
    </p>
  )}
</div>

      {/* ✅ HERO (NOW INTERACTIVE) */}
      <HeroStats
        data={summary}
        selected={selectedType}
        onSelect={setSelectedType}
      />

      {/* SUMMARY + RISK */}
      <div className="grid">
        <SummaryPanel
          data={summary}
          selected={selectedType}
          onSelect={setSelectedType}
        />
        <RiskPanel data={summary} />
      </div>

      {/* RULES + TRACE */}
      <div className="grid">
  <RuleHeatmap data={summary} />

  {selectedType ? (
    <TracePanel filter={selectedType} />
  ) : (
    <div className="card empty-state">
      <p>Select a decision type above to inspect rule evaluation</p>
    </div>
  )}
</div>
    </div>
  );
}

export default App;