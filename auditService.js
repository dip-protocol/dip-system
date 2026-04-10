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

  return data;
}

// 📜 get logs with RANGE FILTER
async function getAll(range = "7d") {
  let fromDate = new Date();

  if (range === "1d") {
    fromDate.setDate(fromDate.getDate() - 1);
  } else if (range === "7d") {
    fromDate.setDate(fromDate.getDate() - 7);
  } else if (range === "30d") {
    fromDate.setDate(fromDate.getDate() - 30);
  } else if (range === "365d") {
    fromDate.setDate(fromDate.getDate() - 365);
  } else if (range === "5y") {
    fromDate.setDate(fromDate.getDate() - (365 * 5));
  } else if (range === "all") {
    fromDate = new Date(0);
  }

  const { data, error } = await supabase
    .from("audit_logs")
    .select("*")
    .gte("timestamp", fromDate.toISOString())
    .order("timestamp", { ascending: false });

  if (error) {
    console.error("AUDIT READ ERROR:", error.message);
    return [];
  }

  return data || [];
}

// 📊 STRICT SUMMARY (LOCKED CONTRACT)
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
      summary.total_requests++;
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

// 📈 TREND CALCULATION
function calculateTrend(current, previous) {
  return {
    ALLOW: current.ALLOW - previous.ALLOW,
    BLOCK: current.BLOCK - previous.BLOCK,
    REQUIRE_OVERRIDE:
      current.REQUIRE_OVERRIDE - previous.REQUIRE_OVERRIDE
  };
}

// 📊 SUMMARY WITH TREND
async function getAuditSummaryWithTrend(range = "7d") {
  const now = new Date();

  const mapDays = {
    "1d": 1,
    "7d": 7,
    "30d": 30,
    "365d": 365,
    "5y": 365 * 5
  };

  let currentFrom = new Date();
  let previousFrom = new Date();

  if (range === "all") {
    currentFrom = new Date(0);
    previousFrom = new Date(0);
  } else {
    const days = mapDays[range] || 7;

    currentFrom.setDate(now.getDate() - days);
    previousFrom.setDate(now.getDate() - (days * 2));
  }

  const { data, error } = await supabase
    .from("audit_logs")
    .select("*")
    .gte("timestamp", previousFrom.toISOString())
    .order("timestamp", { ascending: false });

  if (error) {
    console.error("AUDIT READ ERROR:", error.message);

    return {
      total_requests: 0,
      status_breakdown: {
        ALLOW: 0,
        BLOCK: 0,
        REQUIRE_OVERRIDE: 0
      },
      rule_stats: {},
      trend: {
        ALLOW: 0,
        BLOCK: 0,
        REQUIRE_OVERRIDE: 0
      }
    };
  }

  const currentLogs = [];
  const previousLogs = [];

  for (const log of data || []) {
    const ts = new Date(log.timestamp);

    if (ts >= currentFrom) {
      currentLogs.push(log);
    } else {
      previousLogs.push(log);
    }
  }

  const currentSummary = await getAuditSummary(currentLogs);
  const previousSummary = await getAuditSummary(previousLogs);

  const trend = calculateTrend(
    currentSummary.status_breakdown,
    previousSummary.status_breakdown
  );

  return {
    ...currentSummary,
    trend
  };
}

module.exports = {
  findByRequestId,
  getAll,
  getAuditSummary,
  getAuditSummaryWithTrend
};