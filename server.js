const express = require("express");
const path = require("path");
const { handleAction } = require("./service");
const { supabase } = require("./db");
const { updateAuditResult } = require("./audit");
const { getAuditSummaryWithTrend } = require("./auditService"); // ✅ FINAL
const crypto = require("crypto");
const cors = require("cors");

const app = express();

// ✅ CORS
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "x-api-key"]
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

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

// 🔒 AUTH
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

// 🔥 ACTION API
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

    const executionIntent = await handleAction(input, requestId);

    res.json({
      success: true,
      requestId,
      execution_intent: executionIntent
    });

  } catch (err) {
    let statusCode = 500;

    if (err.message.startsWith("INVALID")) statusCode = 400;
    else if (err.message === "Requires override") statusCode = 400;
    else if (!err.message.startsWith("SYSTEM_ERROR")) statusCode = 400;

    res.status(statusCode).json({
      success: false,
      error: err.message,
      requestId
    });
  }
});

// 📥 RESULT API
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

// 🔍 RECENT
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

// 📊 ✅ FINAL SUMMARY WITH TREND
app.get("/audit/summary", authMiddleware, async (req, res) => {
  try {
    const range = req.query.range || "7d";

    const summary = await getAuditSummaryWithTrend(range); // 🔥 KEY CHANGE

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

// 🔍 SINGLE
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

// 🚀 START
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});

process.stdin.resume();