import { useEffect, useState } from "react";
import { getSummary } from "../api";

export default function RiskPanel() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getSummary().then(res => setData(res.data));
  }, []);

  if (!data) return null;

  const riskScore =
    (data.status_breakdown.BLOCK || 0) /
    (data.total_requests || 1);

  return (
    <div className="card">
      <h3>Risk Level</h3>

      <div className="metric">
        {(riskScore * 100).toFixed(2)}% of decisions are blocked
      </div>

      {riskScore > 0.5 && (
        <div className="metric red">System is high risk</div>
      )}

      {riskScore <= 0.5 && (
        <div className="metric green">System is stable</div>
      )}
    </div>
  );
}