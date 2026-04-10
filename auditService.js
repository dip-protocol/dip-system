const { supabase } = require("./db");

// 🔍 find single record
async function findByRequestId(requestId) {
  const { data, error } = await supabase
    .from("audit_logs")
    .select("*")
    .eq("request_id", requestId)
    .single();

  if (error) {
    console.error("AUDIT READ ERROR:", {
      requestId,
      error: error.message
    });
    return null;
  }

  return data; // includes execution_input
}

// 📜 get recent logs
async function getAll(limit = 10) {
  const { data, error } = await supabase
    .from("audit_logs")
    .select("*")
    .order("timestamp", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("AUDIT READ ERROR:", {
      error: error.message
    });
    return [];
  }

  return data || []; // deterministic fallback
}

// 📊 audit summary (deterministic analytics)
async function getAuditSummary(auditLogs) {
  const summary = {
  total_requests: 0,
  status_breakdown: {
    ALLOW: 0,
    BLOCK: 0,
    REQUIRE_OVERRIDE: 0
  },
  rule_stats: {}
};

  const VALID = ["ALLOW", "BLOCK", "REQUIRE_OVERRIDE"];

for (const log of auditLogs) {
  const status = log.decision?.status;

if (VALID.includes(status)) {
  summary.status_breakdown[status]++;
  summary.total_requests++; // ✅ ADD THIS LINE
}

    const trace = log.decision?.meta?.trace || [];

    for (const t of trace) {
      const ruleId = t.rule_id;

      if (!summary.rule_stats[ruleId]) {
        summary.rule_stats[ruleId] = {
          violations: 0,
          passes: 0,
          skipped: 0
        };
      }

      if (t.result === "VIOLATION") {
        summary.rule_stats[ruleId].violations++;
      } else if (t.result === "PASSED") {
        summary.rule_stats[ruleId].passes++;
      } else {
        summary.rule_stats[ruleId].skipped++;
      }
    }
  }

  return summary;
}

module.exports = {
  findByRequestId,
  getAll,
  getAuditSummary
};