const { evaluate } = require("./dip-core/index");
const { loadRules } = require("./rules/ruleLoader");
const { enforce } = require("./enforce");
const { logAudit } = require("./audit");

// VALIDATION
function validateInput(input) {
  if (input.action.type === "DELETE_USER") {
    if (!input.data?.userId) {
      throw new Error("INVALID: Missing userId");
    }
  }

  if (input.action.type === "CREATE_USER") {
    if (!input.data?.userId) {
      throw new Error("INVALID: Missing userId");
    }
  }
}

// EXECUTION INPUT
function buildExecutionInput(input) {
  const userId = input?.data?.userId ?? input?.userId ?? null;

  return {
    ...input,
    userId
  };
}

async function handleAction(input, requestId) {
  if (!input || !input.action || !input.context) {
    throw new Error("INVALID: Invalid input structure");
  }

  let decision;

  // STEP 1: DECISION
  try {
    const rules = await loadRules(input.orgId, input.systemId);
    decision = evaluate(input, rules);

    console.log(`[${requestId}] Decision:`, decision);
  } catch (err) {
    await logAudit({
      requestId,
      input,
      execution_input: null,
      status: "BLOCK", // ✅ FIX: no FAILED
      error: err.message,
      override: input.override || null
    });

    throw new Error(`SYSTEM_ERROR: ${err.message}`);
  }

  try {
    // STEP 2: ENFORCEMENT + OVERRIDE
    if (decision.status === "BLOCK") {
      if (input.override) {
        decision.status = "REQUIRE_OVERRIDE";
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

    // STEP 4: EXECUTION INTENT
    const executionIntent = {
      action: executionInput.action.type,
      payload: {
        userId: executionInput.userId
      }
    };

    // 🔒 FINAL STATUS GUARD
    const VALID = ["ALLOW", "BLOCK", "REQUIRE_OVERRIDE"];

    if (!VALID.includes(decision.status)) {
      console.error(`[${requestId}] ❌ INVALID DECISION STATUS`, {
        status: decision.status,
        decision
      });

      throw new Error(`Invalid decision.status: ${decision.status}`);
    }

    // STEP 5: AUDIT
    await logAudit({
      requestId,
      input,
      execution_input: executionInput,
      decision,
      result: executionIntent,
      status: decision.status,
      override: input.override || null
    });

    return executionIntent;

  } catch (err) {
    const executionInput = buildExecutionInput(input);

    const VALID = ["ALLOW", "BLOCK", "REQUIRE_OVERRIDE"];

    await logAudit({
      requestId,
      input,
      execution_input: executionInput,
      decision,
      status: VALID.includes(decision?.status)
        ? decision.status
        : "BLOCK", // ✅ FIX: deterministic fallback
      error: err.message,
      override: input.override || null
    });

    throw new Error(err.message);
  }
}

module.exports = { handleAction };