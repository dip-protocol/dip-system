import { useEffect, useState } from "react";
import { getSummary } from "../api";

export default function RuleHeatmap() {
  const [rules, setRules] = useState({});

  useEffect(() => {
    getSummary().then(res => setRules(res.data.rule_stats));
  }, []);

  return (
    <div className="card">
      <div className="title">Rule Impact</div>

      {Object.entries(rules).map(([rule, stats]) => (
        <div key={rule}>
          {rule} → <span className="red">{stats.violations}</span> violations
        </div>
      ))}
    </div>
  );
}