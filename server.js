const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

require("dotenv").config();
console.log("SERVER_BOOT_V2");

const express = require("express");
const path = require("path");
const crypto = require("crypto");
const cors = require("cors");
const fs = require("fs");

const { handleAction } = require("./service");
const { verifyExecutionToken } = require("./executionService");
const { supabase } = require("./db");
const { updateAuditResult } = require("./audit");
const { getAuditSummaryWithTrend } = require("./auditService");

const app = express();

// -----------------------------
// LOAD SWAGGER
// -----------------------------
const swaggerDocument = YAML.load(
  path.join(__dirname, "docs", "openapi.yaml")
);
app.get("/openapi.json", (req, res) => {
  res.json(swaggerDocument);
});

// -----------------------------
// 🔥 ROUTES (CORRECT ORDER)
// -----------------------------

// ✅ 1. Swagger UI
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ✅ 2. Markdown API (CRITICAL POSITION)
app.get("/docs-content/:file", (req, res) => {
  const filePath = path.join(__dirname, "docs", req.params.file);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("File not found");
  }

  const md = fs.readFileSync(filePath, "utf-8");
  res.send(md);
});

// -----------------------------
// MIDDLEWARE
// -----------------------------
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "x-api-key"]
}));

app.use(express.json());

// -----------------------------
// STATIC FILES
// -----------------------------

// ✅ Docs UI
app.use("/docs-site", express.static(
  path.join(__dirname, "public", "docs-site")
));

// ✅ PUBLIC (MUST BE LAST)
app.use(express.static(path.join(__dirname, "public")));

// -----------------------------
// HEALTH
// -----------------------------
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "manthan",
    timestamp: new Date().toISOString()
  });
});

// -----------------------------
// AUTH
// -----------------------------
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
// EXECUTE API
// -----------------------------
app.post("/execute", authMiddleware, async (req, res) => {
  try {
    const token = req.body;

    if (!token || typeof token !== "object") {
      return res.status(400).json({
        success: false,
        error: "Invalid execution token"
      });
    }

    const { action, payload, requestId, decisionHash } = token;
    const actionType = typeof action === "string" ? action : action?.type;

    if (!actionType || typeof actionType !== "string") {
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

    const valid = await verifyExecutionToken(token);

    if (!valid) {
      return res.status(403).json({
        success: false,
        error: "Invalid or already used execution token"
      });
    }

    const ALLOWED_ACTIONS = new Set([
      "DELETE_USER",
      "CREATE_USER"
    ]);

    if (!ALLOWED_ACTIONS.has(actionType)) {
      return res.status(403).json({
        success: false,
        error: "Action not allowed"
      });
    }

    let result;

    if (actionType === "DELETE_USER") {
      result = { message: "User deleted", userId: payload.userId };
    } else if (actionType === "CREATE_USER") {
      result = { message: "User created", userId: payload.userId };
    }

    await updateAuditResult({
      requestId,
      status: "SUCCESS",
      result
    });

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
// START
// -----------------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});