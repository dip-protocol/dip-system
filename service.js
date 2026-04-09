const { evaluate } = require("./dip-core/index");
const { loadRules } = require("./rules/ruleLoader");
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
  let overridden = false;

  // STEP 1: DECISION
  try {
    const rules = await loadRules(input.orgId, input.systemId);
decision = evaluate(input, rules);
    console.log(`[${requestId}] Decision:`, decision);

  } catch (err) {
    console.error(`[${requestId}] Runtime error:`, {
      message: err.message,
      stack: err.stack
    });

    try {
      await logAudit({
        requestId,
        input,
        execution_input: null,
        status: "FAILED",
        error: err.message,
        override: input.override || null
      });
    } catch (auditErr) {
      console.error(`[${requestId}] Audit failed:`, auditErr.message);
    }

    throw new Error(`SYSTEM_ERROR: ${err.message}`);
  }

  try {
    // STEP 2: ENFORCEMENT
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

    // STEP 3: VALIDATION
    validateInput(input);

    const executionInput = buildExecutionInput(input);

    console.log("EXECUTION INPUT:", executionInput);

    // ✅ FINAL EXECUTION INTENT (MINIMAL PAYLOAD)
    const executionIntent = {
      action: executionInput.action.type,
      payload: {
        userId: executionInput.userId
      }
    };

    // STEP 4: AUDIT
    try {
      await logAudit({
        requestId,
        input,
        execution_input: executionInput,
        decision,
        result: executionIntent,
        status: overridden ? "OVERRIDDEN" : "SUCCESS",
        override: input.override || null
      });
    } catch (auditErr) {
      console.error(`[${requestId}] Audit failed:`, auditErr.message);
    }

    return executionIntent;

  } catch (err) {
    console.error(`[${requestId}] Execution error:`, {
      message: err.message,
      stack: err.stack
    });

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
        status: overridden ? "OVERRIDDEN" : status,
        error: err.message,
        override: input.override || null
      });
    } catch (auditErr) {
      console.error(`[${requestId}] Audit failed:`, auditErr.message);
    }

    throw new Error(err.message);
  }
}

module.exports = { handleAction };