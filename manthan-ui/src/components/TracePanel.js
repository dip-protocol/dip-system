import { useState, useEffect } from "react";
import { getTrace } from "../api";

export default function TracePanel({ filter }) {
  const [requestId, setRequestId] = useState("");
  const [trace, setTrace] = useState(null);
  const [loading, setLoading] = useState(false);

  async function loadTrace() {
    if (!requestId) return;

    setLoading(true);
    try {
      const res = await getTrace(requestId);
      setTrace(res.data?.decision?.meta?.trace || []);
    } catch {
      setTrace([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (!filter) return;

    setLoading(true);

    fetch("https://dip-system.fly.dev/audit", {
      headers: { "x-api-key": "Charak@987" }
    })
      .then(res => res.json())
      .then(res => {
        const item = res.data?.[0];
        setTrace(item?.decision?.meta?.trace || []);
      })
      .catch(() => setTrace([]))
      .finally(() => setLoading(false));

  }, [filter]);

  const isBlocked = trace?.some(t => t.if_match);

  return (
    <div className="card">
      <h3>Inspect Decision</h3>

      <p className="hint">
        Click a metric OR enter a request ID
      </p>

      {/* ===== DECISION HEADER ===== */}
      {trace && (
        <div className="decision-header">
          <div>
            <div className="label">Decision</div>
            <div className={`decision-badge ${isBlocked ? "block" : "allow"}`}>
              {isBlocked ? "BLOCKED" : "ALLOWED"}
            </div>
          </div>

          <div>
            <div className="label">Source</div>
            <div className="value">
              {requestId ? "Manual Request" : "Latest Selected"}
            </div>
          </div>
        </div>
      )}

      {filter && (
        <p className="hint highlight">
          Showing latest <b>{filter}</b> decision
        </p>
      )}

      <div className="trace-input">
        <input
          className="input"
          placeholder="Enter requestId"
          value={requestId}
          onChange={(e) => setRequestId(e.target.value)}
        />

        <button className="button" onClick={loadTrace}>
          {loading ? "Loading..." : "Inspect"}
        </button>
      </div>

      {/* ===== TRACE ===== */}
      <div className="trace-container">
        {!trace && <p className="hint">No data loaded yet</p>}

        {trace && trace.length === 0 && (
          <p className="hint">No trace found</p>
        )}

        {trace && trace.length > 0 && (
          <>
            <p className="trace-title">Rule Evaluation Flow</p>

            {trace.map((t, i) => {
              const status = t.when_match
                ? t.if_match
                  ? "VIOLATION"
                  : "PASSED"
                : "SKIPPED";

              return (
                <div key={i} className="trace-item">
                  <div className="trace-left">
                    <div className="trace-index">{i + 1}</div>
                    <div className="trace-rule">{t.rule_id}</div>
                  </div>

                  <div
                    className={`trace-status ${
                      status === "VIOLATION"
                        ? "fail"
                        : status === "PASSED"
                        ? "pass"
                        : "skip"
                    }`}
                  >
                    {status}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}