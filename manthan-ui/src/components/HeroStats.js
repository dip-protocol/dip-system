export default function HeroStats({ data, selected, onSelect }) {
  if (!data) return null;

  const allow = data.status_breakdown?.ALLOW || 0;
  const block = data.status_breakdown?.BLOCK || 0;
  const override = data.status_breakdown?.REQUIRE_OVERRIDE || 0;

  const total = data.total_requests || 0;

  const percent = (value) =>
    total ? ((value / total) * 100).toFixed(1) : "0.0";

  const Card = ({ type, value, label, percentValue, className }) => {
    const isActive = selected === type;

    return (
      <div
        className={`hero-card ${className || ""} ${isActive ? "active" : ""}`}
        onClick={() => type && onSelect(type)}
      >
        <div className="hero-number">{value}</div>

        {percentValue !== undefined && (
          <div className="hero-percent">{percentValue}%</div>
        )}

        <div className="hero-label">{label}</div>
      </div>
    );
  };

  return (
    <div className="hero">
      <Card value={total} label="Total Decisions" />

      <Card
        type="ALLOW"
        value={allow}
        percentValue={percent(allow)}
        label="Allowed"
        className="green"
      />

      <Card
        type="BLOCK"
        value={block}
        percentValue={percent(block)}
        label="Blocked"
        className="red"
      />

      <Card
        type="REQUIRE_OVERRIDE"
        value={override}
        percentValue={percent(override)}
        label="Override"
        className="yellow"
      />
    </div>
  );
}