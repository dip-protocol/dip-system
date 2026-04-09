const { executeAction } = require("./executor");
const { run } = require("./runtime");
const { enforce } = require("./enforce");
const { logAudit } = require("./audit");

// VALIDATION LAYER (unchanged)
function validateInput(input) {
  if (input.action.type === "DELETE_USER") {
    if (!input.data || !input.data.userId) {
      throw new Error("INVALID: Missing userId");
    }
  }

  if (input.action.type === "CREATE_USER") {
    if (!input.data || !input.data.userId) {
      throw new Error("INVALID: Missing userId");
    }
  }
}

// EXECUTION INPUT (unchanged)
function buildExecutionInput(input) {
  return {
    ...input,
    userId:
      input?.data?.userId ||
      input?.userId ||
      null
  };
}

async function handleAction(input, requestId) {
  if (!input || !input.action || !input.context) {
    throw new Error("INVALID: Invalid input structure");
  }

  let decision;
  let overridden = false; // ✅ NEW

  // STEP 1: DECISION
  try {
    decision = await run(input);
    console.log(`[${requestId}] Decision:`, decision);
  } catch (err) {
    console.error(`[${requestId}] Runtime error:`, err.message);

    try {
      await logAudit({
        requestId,
        input,
        execution_input: null,
        status: "FAILED",
        error: err.message,
        override: input.override || null // ✅ NEW
      });
    } catch (auditErr) {
      console.error(`[${requestId}] Audit failed:`, auditErr.message);
    }

    throw new Error("System failure");
  }

  try {
    // ✅ OVERRIDE-AWARE ENFORCEMENT
    if (decision.status === "BLOCK") {
      if (input.override) {
        overridden = true;
        console.log(`[${requestId}] ⚠️ OVERRIDE APPLIED`);
      } else {
        enforce(decision);
      }
    } else {
      enforce(decision);
    }

    // VALIDATION (unchanged)
    validateInput(input);

    const executionInput = buildExecutionInput(input);

    const result = await executeAction(executionInput, requestId);

    // SUCCESS AUDIT
    try {
      await logAudit({
        requestId,
        input,
        execution_input: executionInput,
        decision,
        result,
        status: overridden ? "OVERRIDDEN" : "SUCCESS", // ✅ NEW
        override: input.override || null // ✅ NEW
      });
    } catch (auditErr) {
      console.error(`[${requestId}] Audit failed:`, auditErr.message);
    }

    return result;

  } catch (err) {
    let status = "FAILED";

    if (decision?.status === "BLOCK") {
      status = "BLOCKED";
    } else if (err.message.startsWith("INVALID")) {
      status = "INVALID";
    }

    const executionInput = buildExecutionInput(input);

    try {
      await logAudit({
        requestId,
        input,
        execution_input: executionInput,
        decision,
        status: overridden ? "OVERRIDDEN" : status, // ✅ NEW
        error: err.message,
        override: input.override || null // ✅ NEW
      });
    } catch (auditErr) {
      console.error(`[${requestId}] Audit failed:`, auditErr.message);
    }

    throw err;
  }
}

module.exports = { handleAction };