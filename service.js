const { signExecutionIntent } = require("./executionService");
const { verifyApprovalToken } = require("./approvalService");
const { evaluate } = require("./dip-core/index");
const { loadRules } = require("./rules/ruleLoader");
const { enforce } = require("./enforce");
const { logAudit } = require("./audit");
const crypto = require("crypto");
const { computeDecisionHash } = require("./utils/hash");

// -----------------------------
// CANONICAL HASHING (DETERMINISTIC)
// -----------------------------

// -----------------------------
// INPUT NORMALIZATION (DETERMINISTIC)
// -----------------------------
function normalizeInput(input) {
  if (input?.context?.role) {
    input.context.role = String(input.context.role).toLowerCase();
  }

  if (input?.action?.type) {
    input.action.type = String(input.action.type).toUpperCase();
  }

  return input;
}

// -----------------------------
// VALIDATION
// -----------------------------
function validateInput(input) {
if (input.data) {
  throw new Error("INVALID: 'data' field not allowed. Use 'payload'");
}
  if (!input || !input.action || !input.context) {
    throw new Error("INVALID: Invalid input structure");
  }

  if (!input.action.type) {
    throw new Error("INVALID: Missing action type");
  }

  if (input.action.type === "DELETE_USER") {
    if (!input.payload?.userId) {
  throw new Error("INVALID: Missing userId");
}
  }

  if (input.action.type === "CREATE_USER") {
  if (!input.payload?.userId) {
    throw new Error("INVALID: Missing userId");
  }
}
}

// -----------------------------
// EXECUTION INPUT
// -----------------------------
function buildExecutionInput(input) {
  const userId = input?.payload?.userId ?? null;

  return {
    ...input,
    userId
  };
}

// -----------------------------
// MAIN HANDLER
// -----------------------------
async function handleAction(input, requestId, approvalToken = null) {
  let decision;
  let overrideUsed = false;

  // -----------------------------
  // STEP 1: DECISION
  // -----------------------------
  try {
    const rules = await loadRules(input.orgId, input.systemId);

    // ✅ NORMALIZE INPUT BEFORE EVALUATION
    input = normalizeInput({ ...input });

    decision = evaluate(input, rules);

    // 🔒 Determinism guard
    const decisionCheck = evaluate(input, rules);
    if (JSON.stringify(decisionCheck) !== JSON.stringify(decision)) {
      throw new Error("NON_DETERMINISTIC_DECISION");
    }

    console.log(`[${requestId}] Decision:`, decision);
  } catch (err) {
    await logAudit({
      requestId,
      input,
      execution_input: null,
      status: "BLOCK",
      error: err.message,
      override: null
    });

    throw new Error(`SYSTEM_ERROR: ${err.message}`);
  }

  try {
    // -----------------------------
    // STEP 2: VALIDATION
    // -----------------------------
    validateInput(input);

    // -----------------------------
    // STEP 3: APPROVAL GATE
    // -----------------------------
    if (decision.status === "REQUIRE_OVERRIDE") {
      if (!approvalToken || !verifyApprovalToken(approvalToken)) {
        throw new Error("Override not approved");
      }

      if (approvalToken.override_id !== requestId) {
        throw new Error("Invalid approval token for this request");
      }

      decision = {
        ...decision,
        status: "ALLOW",
        override: true
      };

      overrideUsed = true;
    }

    // -----------------------------
    // STEP 4: ENFORCEMENT
    // -----------------------------
    enforce(decision);

    // -----------------------------
    // STEP 5: FINAL GUARD
    // -----------------------------
    if (decision.status !== "ALLOW") {
      throw new Error("Execution not permitted");
    }

    // -----------------------------
    // STEP 6: BUILD EXECUTION INPUT
    // -----------------------------
    const executionInput = buildExecutionInput(input);

    // -----------------------------
    // STEP 7: EXECUTION INTENT
    // -----------------------------
    const executionIntent = {
      action: executionInput.action.type,
      payload: {
        userId: executionInput.userId
      }
    };

    // -----------------------------
    // STEP 8: STATUS VALIDATION
    // -----------------------------
    const VALID = ["ALLOW", "BLOCK", "REQUIRE_OVERRIDE"];

    if (!VALID.includes(decision.status)) {
      throw new Error(`Invalid decision.status: ${decision.status}`);
    }

    // -----------------------------
    // STEP 9: DECISION HASH
    // -----------------------------
    const decisionHash = computeDecisionHash(
      executionIntent.action,
      executionIntent.payload
    );

    // -----------------------------
    // STEP 10: SIGN EXECUTION TOKEN
    // -----------------------------
    const auditBinding = crypto
      .createHash("sha256")
      .update(requestId + decisionHash)
      .digest("hex");

    const executionToken = signExecutionIntent(
      {
        ...executionIntent,
        decisionHash,
        auditBinding
      },
      requestId
    );

    // -----------------------------
    // STEP 11: AUDIT (FINAL STATE)
    // -----------------------------
    await logAudit({
      requestId,
      input,
      execution_input: executionInput,
      decision,
      result: executionIntent,
      decisionHash,
      executionToken,
      status: decision.status,
      override: overrideUsed ? true : null
    });

    return executionToken;

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
        : "BLOCK",
      error: err.message,
      override: overrideUsed ? true : null
    });

    throw new Error(err.message);
  }
}

module.exports = { handleAction };