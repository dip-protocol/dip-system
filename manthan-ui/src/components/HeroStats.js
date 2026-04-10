export default function HeroStats({ data }) {
  if (!data) return null;

  const allow = data.status_breakdown?.ALLOW || 0;
  const block = data.status_breakdown?.BLOCK || 0;
  const override =
    data.status_breakdown?.REQUIRE_OVERRIDE ||
    data.status_breakdown?.OVERRIDE ||
    0;

  const total = data.total_requests || 0;
  const unknown = total - (allow + block + override);

  return (
    <div className="hero">
      <div className="hero-card">
        <div className="hero-number">{total}</div>
        <div className="hero-label">Total Decisions</div>
      </div>

      <div className="hero-card green">
        <div className="hero-number">{allow}</div>
        <div className="hero-label">Allowed</div>
      </div>

      <div className="hero-card red">
        <div className="hero-number">{block}</div>
        <div className="hero-label">Blocked</div>
      </div>

      <div className="hero-card yellow">
        <div className="hero-number">{override}</div>
        <div className="hero-label">Override</div>
      </div>

      {unknown > 0 && (
        <div className="hero-card gray">
          <div className="hero-number">{unknown}</div>
          <div className="hero-label">Unclassified</div>
        </div>
      )}
    </div>
  );
}