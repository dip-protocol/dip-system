import { useEffect, useState } from "react";
import { getSummary } from "../api";

export default function RuleHeatmap() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getSummary().then(res => setData(res.data));
  }, []);

  if (!data) return <div className="card">Loading...</div>;

  const rules = data.rule_stats || {};

  return (
    <div className="card">
      <h3>Rule Activity</h3>

      {Object.entries(rules).map(([rule, stats]) => (
        <div key={rule} className="rule-row">
          <div className="rule-name">{rule}</div>

          <div className="rule-badges">
            <span className="badge fail">{stats.violations}</span>
            <span className="badge pass">{stats.passes}</span>
            <span className="badge skip">{stats.skipped}</span>
          </div>
        </div>
      ))}
    </div>
  );
}