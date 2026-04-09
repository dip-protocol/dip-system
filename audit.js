const { supabase } = require("./db");

const MAX_RETRIES = 2;

async function logAudit(entry) {
  let attempt = 0;

  while (attempt <= MAX_RETRIES) {
    try {
      const { data, error } = await supabase
        .from("audit_logs")
        .insert([
          {
            request_id: entry.requestId,
            timestamp: new Date().toISOString(),

            // EXISTING (unchanged)
            input: entry.input || null,
            execution_input: entry.execution_input || null,
            decision: entry.decision || null,
            result: entry.result || null,
            status: entry.status || null,
            error: entry.error || null,

            // ✅ NEW FIELD (override support)
            override: entry.override || null
          }
        ])
        .select();

      if (error) {
        throw new Error(error.message);
      }

      // HARD GUARANTEE (unchanged)
      if (!data || data.length === 0) {
        throw new Error("Audit insert returned empty");
      }

      return data[0];

    } catch (err) {
      attempt++;

      if (attempt > MAX_RETRIES) {
        console.error("❌ AUDIT FAILED:", {
          requestId: entry.requestId,
          error: err.message
        });

        throw err;
      }
    }
  }
}

module.exports = { logAudit };