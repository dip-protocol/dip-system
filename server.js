require("dotenv").config();
console.log("SERVER_BOOT_V2");

const express = require("express");
const path = require("path");
const crypto = require("crypto");
const cors = require("cors");

const { handleAction } = require("./service");
const { verifyExecutionToken } = require("./executionService");
const { supabase } = require("./db");
const { updateAuditResult } = require("./audit");
const { getAuditSummaryWithTrend } = require("./auditService");

const app = express();

// -----------------------------
// CANONICALIZE (DETERMINISTIC)
// -----------------------------
function canonicalize(obj) {
  if (Array.isArray(obj)) return obj.map(canonicalize);

  if (obj && typeof obj === "object") {
    return Object.keys(obj)
      .sort()
      .reduce((acc, key) => {
        acc[key] = canonicalize(obj[key]);
        return acc;
      }, {});
  }

  return obj;
}

// -----------------------------
// MIDDLEWARE
// -----------------------------
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "x-api-key"]
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "manthan",
    timestamp: new Date().toISOString()
  });
});

// 🔒 CONTENT-TYPE GUARD
app.use((req, res, next) => {
  if (req.method === "POST" && !req.is("application/json")) {
    return res.status(400).json({
      success: false,
      error: "Content-Type must be application/json"
    });
  }
  next();
});

// 🔒 API KEY
const API_KEY = process.env.API_KEY;

function authMiddleware(req, res, next) {
  const key = req.headers["x-api-key"];

  if (!key || key !== API_KEY) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized"
    });
  }

  next();
}

// -----------------------------
// ACTION API
// -----------------------------
app.post("/action", authMiddleware, async (req, res) => {
  const requestId = crypto.randomUUID();

  try {
    const input = req.body;

    if (!input || typeof input !== "object") {
      return res.status(400).json({ success: false, error: "Invalid request body", requestId });
    }

    if (!input.orgId) {
      return res.status(400).json({ success: false, error: "Missing orgId", requestId });
    }

    if (!input.systemId) {
      return res.status(400).json({ success: false, error: "Missing systemId", requestId });
    }

    if (!input.action || !input.action.type) {
      return res.status(400).json({ success: false, error: "Missing action.type", requestId });
    }

    const executionToken = await handleAction(input, requestId);

    res.json({
      success: true,
      requestId,
      execution_token: executionToken
    });

  } catch (err) {
    let statusCode = 500;

    if (err.message.startsWith("INVALID")) statusCode = 400;
    else if (!err.message.startsWith("SYSTEM_ERROR")) statusCode = 400;

    res.status(statusCode).json({
      success: false,
      error: err.message,
      requestId
    });
  }
});

// -----------------------------
// EXECUTE API (CRITICAL PATH)
// -----------------------------
app.post("/execute", authMiddleware, async (req, res) => {
  try {
    const token = req.body;

    // 🔒 STEP 0: STRUCTURE VALIDATION (BEFORE ANYTHING)
    if (!token || typeof token !== "object") {
      return res.status(400).json({
        success: false,
        error: "Invalid execution token"
      });
    }

    const { action, payload, requestId, decisionHash } = token;

    if (typeof action !== "string") {
      return res.status(400).json({ success: false, error: "Invalid action" });
    }

    if (!payload || typeof payload !== "object") {
      return res.status(400).json({ success: false, error: "Invalid payload" });
    }

    if (!requestId || !decisionHash) {
      return res.status(400).json({
        success: false,
        error: "Invalid token structure"
      });
    }

    if (!payload.userId) {
      return res.status(400).json({
        success: false,
        error: "Invalid payload"
      });
    }

    console.log("EXECUTE_START", { requestId });

    // 🔐 STEP 1: VERIFY TOKEN (signature + replay protection)
    const valid = await verifyExecutionToken(token);

    if (!valid) {
      return res.status(403).json({
        success: false,
        error: "Invalid or already used execution token"
      });
    }

    console.log("TOKEN_VERIFIED", { requestId });

    // 🔐 STEP 2: DECISION BINDING
    const reconstructed = {
      action,
      payload
    };

    const recalculatedHash = crypto
      .createHash("sha256")
      .update(JSON.stringify(canonicalize(reconstructed)))
      .digest("hex");

    if (recalculatedHash !== decisionHash) {
      return res.status(403).json({
        success: false,
        error: "Decision integrity violation"
      });
    }
// 🔐 STEP 2.5: AUDIT BINDING VALIDATION (FIX)
const expectedAuditBinding = crypto
  .createHash("sha256")
  .update(requestId + decisionHash)
  .digest("hex");

if (expectedAuditBinding !== token.auditBinding) {
  return res.status(403).json({
    success: false,
    error: "Audit binding mismatch"
  });
}
    console.log("HASH_MATCHED", { requestId });

    // 🔐 STEP 3: REQUEST CONTEXT VALIDATION
    const { data } = await supabase
      .from("audit_logs")
      .select("request_id")
      .eq("request_id", requestId)
      .single();

    if (!data) {
      return res.status(403).json({
        success: false,
        error: "Invalid request context"
      });
    }

    // 🔐 STEP 4: ACTION WHITELIST
    const ALLOWED_ACTIONS = new Set([
      "DELETE_USER",
      "CREATE_USER"
    ]);

    if (!ALLOWED_ACTIONS.has(action)) {
      return res.status(403).json({
        success: false,
        error: "Action not allowed"
      });
    }

    // -----------------------------
    // STEP 5: EXECUTION
    // -----------------------------
    let result;

    if (action === "DELETE_USER") {
      console.log("Deleting user:", payload.userId);
      result = { message: "User deleted", userId: payload.userId };
    } else if (action === "CREATE_USER") {
      console.log("Creating user:", payload.userId);
      result = { message: "User created", userId: payload.userId };
    }

    // -----------------------------
    // STEP 6: AUDIT UPDATE
    // -----------------------------
    await updateAuditResult({
      requestId,
      status: "SUCCESS",
      result
    });

    console.log("EXECUTION_SUCCESS", { requestId });

    res.json({
      success: true,
      requestId,
      result
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// -----------------------------
// AUDIT APIs
// -----------------------------
app.post("/audit-result", async (req, res) => {
  try {
    const { requestId, status, result, error } = req.body;

    if (!requestId || !status) {
      return res.status(400).json({
        success: false,
        error: "requestId and status are required"
      });
    }

    await updateAuditResult({ requestId, status, result, error });

    res.json({ success: true, requestId });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/audit", authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("audit_logs")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(10);

    if (error) throw new Error(error.message);

    res.json({ success: true, data: data || [] });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/audit/summary", authMiddleware, async (req, res) => {
  try {
    const range = req.query.range || "7d";

    const summary = await getAuditSummaryWithTrend(range);

    res.json({
      success: true,
      data: summary
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

app.get("/audit/:requestId", authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("audit_logs")
      .select("*")
      .eq("request_id", req.params.requestId)
      .single();

    if (error || !data) {
      return res.status(404).json({ success: false, error: "Not found" });
    }

    res.json({ success: true, data });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -----------------------------
// START
// -----------------------------


const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});process.stdin.resume();