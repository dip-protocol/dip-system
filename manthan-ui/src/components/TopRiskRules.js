export default function TopRiskRules({ data }) {
  if (!data) return null;

  const totalBlocks = data.status_breakdown?.BLOCK || 1;
  const totalOverrides = data.status_breakdown?.REQUIRE_OVERRIDE || 1;

  const allRules = Object.entries(data.rule_stats || {}).map(
    ([rule, stats]) => ({
      rule,
      violations: stats.violations || 0,
      overrides: stats.overrides || 0 // requires backend support
    })
  );

  // 🔴 BLOCKING RULES
  const riskRules = allRules
    .map((r) => ({
      ...r,
      percent: ((r.violations / totalBlocks) * 100).toFixed(1)
    }))
    .filter((r) => r.violations > 0)
    .sort((a, b) => b.violations - a.violations);

  // 🟡 OVERRIDE RULES
  const overrideRules = allRules
    .map((r) => ({
      ...r,
      percent: ((r.overrides / totalOverrides) * 100).toFixed(1)
    }))
    .filter((r) => r.overrides > 0)
    .sort((a, b) => b.overrides - a.overrides);

  return (
    <div className="card">
      <h3>Top Rule Drivers</h3>

      {/* 🔴 BLOCKING */}
      <div style={{ marginBottom: "20px" }}>
        <div className="metric red">Top Risk (Blocking)</div>
        <div className="subtext">
          Rules that stop actions from happening
        </div>

        {riskRules.length === 0 ? (
          <p className="empty">No blocking rules</p>
        ) : (
          riskRules.map((r, index) => (
            <div
              key={r.rule}
              className={`rule-row ${index === 0 ? "highlight" : ""}`}
            >
              <div className="rule-name">{r.rule}</div>

              <div className="rule-stats">
                <span className="badge red">
                  {r.violations} violations
                </span>

                <span className="badge gray">
                  {r.percent}% of BLOCK
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 🟡 OVERRIDES */}
      <div>
        <div className="metric yellow">Top Overrides (Friction)</div>
        <div className="subtext">
          Rules users bypass with approval (override)
        </div>

        {overrideRules.length === 0 ? (
          <p className="empty">No overrides detected</p>
        ) : (
          overrideRules.map((r) => (
            <div key={r.rule} className="rule-row">
              <div className="rule-name">{r.rule}</div>

              <div className="rule-stats">
                <span className="badge yellow">
                  {r.overrides} overrides
                </span>

                <span className="badge gray">
                  {r.percent}% of overrides
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}