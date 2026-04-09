const { supabase } = require("./db");

const MAX_RETRIES = 2;

function safe(value) {
  return value === undefined ? null : value;
}

async function logAudit(entry) {
  let attempt = 0;

  while (attempt <= MAX_RETRIES) {
    try {
      const record = {
        request_id: entry.requestId,
        timestamp: new Date().toISOString(),

        input: safe(entry.input),
        execution_input: safe(entry.execution_input),
        decision: safe(entry.decision),
        result: safe(entry.result),
        status: safe(entry.status),
        error: safe(entry.error),
        override: safe(entry.override)
      };

      const { data, error } = await supabase
        .from("audit_logs")
        .insert([record])
        .select();

      if (error) {
        throw new Error(error.message);
      }

      if (!data || data.length === 0) {
        throw new Error("Audit insert returned empty");
      }

      return data[0];

    } catch (err) {
      attempt++;

      if (attempt > MAX_RETRIES) {
        console.error("AUDIT FAILED:", {
          requestId: entry.requestId,
          error: err.message
        });

        throw err;
      }
    }
  }
}

async function updateAuditResult({ requestId, status, result, error }) {
  let attempt = 0;

  while (attempt <= MAX_RETRIES) {
    try {
      if (!requestId) {
        throw new Error("Missing requestId");
      }

      const updatePayload = {
        status: safe(status),
        result: safe(result) || {},
        error: safe(error) || ""
      };

      const { data, error: dbError } = await supabase
        .from("audit_logs")
        .update(updatePayload)
        .eq("request_id", requestId)
        .select();

      if (dbError) {
        throw new Error(dbError.message);
      }

      if (!data || data.length === 0) {
        throw new Error("Audit record not found");
      }

      return data[0];

    } catch (err) {
      attempt++;

      if (attempt > MAX_RETRIES) {
        console.error("AUDIT UPDATE FAILED:", {
          requestId,
          error: err.message
        });

        throw err;
      }
    }
  }
}

module.exports = {
  logAudit,
  updateAuditResult
};