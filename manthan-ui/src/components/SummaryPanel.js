export default function SummaryPanel({ data, selected, onSelect }) {
  const allow = data.status_breakdown?.ALLOW || 0;
  const block = data.status_breakdown?.BLOCK || 0;
  const override =
    data.status_breakdown?.REQUIRE_OVERRIDE ||
    data.status_breakdown?.OVERRIDE ||
    0;

  const total = data.total_requests || 0;
  const unknown = total - (allow + block + override);

  return (
    <div className="card compact">
      <h3>Explore</h3>

      <div className="compact-list">
        <span
          className={`pill ${selected === null ? "active" : ""}`}
          onClick={() => onSelect(null)}
        >
          All
        </span>

        <span
          className={`pill green ${selected === "ALLOW" ? "active" : ""}`}
          onClick={() => onSelect("ALLOW")}
        >
          Allowed
        </span>

        <span
          className={`pill red ${selected === "BLOCK" ? "active" : ""}`}
          onClick={() => onSelect("BLOCK")}
        >
          Blocked
        </span>

        <span
          className={`pill yellow ${
            selected === "REQUIRE_OVERRIDE" ? "active" : ""
          }`}
          onClick={() => onSelect("REQUIRE_OVERRIDE")}
        >
          Override
        </span>

        {unknown > 0 && (
          <span className="pill gray">Unclassified</span>
        )}
      </div>
    </div>
  );
}