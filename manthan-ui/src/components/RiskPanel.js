import { useEffect, useState } from "react";
import { getSummary } from "../api";

export default function RiskPanel() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getSummary().then((res) => setData(res.data));
  }, []);

  if (!data) return null;

  const total = data.total_requests || 1;

  const counts = {
    BLOCK: data.status_breakdown.BLOCK || 0,
    REQUIRE_OVERRIDE: data.status_breakdown.REQUIRE_OVERRIDE || 0,
    ALLOW: data.status_breakdown.ALLOW || 0,
  };

  const percentages = {
    BLOCK: ((counts.BLOCK / total) * 100).toFixed(1),
    REQUIRE_OVERRIDE: ((counts.REQUIRE_OVERRIDE / total) * 100).toFixed(1),
    ALLOW: ((counts.ALLOW / total) * 100).toFixed(1),
  };

  return (
    <div className="card">
      <h3 className="mb-4">Risk Composition</h3>

      {/* Segmented Bar */}
      <div className="w-full h-3 flex rounded overflow-hidden mb-5">
        <div
          className="bg-red-500"
          style={{ width: `${percentages.BLOCK}%` }}
        ></div>
        <div
          className="bg-yellow-400"
          style={{ width: `${percentages.REQUIRE_OVERRIDE}%` }}
        ></div>
        <div
          className="bg-green-500"
          style={{ width: `${percentages.ALLOW}%` }}
        ></div>
      </div>

      {/* Metrics */}
      <div className="flex flex-col gap-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-red-400 font-medium">BLOCK</span>
          <span className="font-semibold">
            {percentages.BLOCK}% ({counts.BLOCK})
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-yellow-300 font-medium">
            REQUIRE_OVERRIDE
          </span>
          <span className="font-semibold">
            {percentages.REQUIRE_OVERRIDE}% ({counts.REQUIRE_OVERRIDE})
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-green-400 font-medium">ALLOW</span>
          <span className="font-semibold">
            {percentages.ALLOW}% ({counts.ALLOW})
          </span>
        </div>
      </div>

      <div className="text-xs text-gray-500 mt-4">
        Risk = BLOCK + REQUIRE_OVERRIDE
      </div>
    </div>
  );
}