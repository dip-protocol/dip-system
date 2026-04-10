export default function SummaryPanel({ data, selected, onSelect }) {
  if (!data) return null;

  const allow = data.status_breakdown?.ALLOW || 0;
  const block = data.status_breakdown?.BLOCK || 0;
  const override = data.status_breakdown?.REQUIRE_OVERRIDE || 0;

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
          Allowed ({allow})
        </span>

        <span
          className={`pill red ${selected === "BLOCK" ? "active" : ""}`}
          onClick={() => onSelect("BLOCK")}
        >
          Blocked ({block})
        </span>

        <span
          className={`pill yellow ${
            selected === "REQUIRE_OVERRIDE" ? "active" : ""
          }`}
          onClick={() => onSelect("REQUIRE_OVERRIDE")}
        >
          Override ({override})
        </span>
      </div>
    </div>
  );
}