const express = require("express");
const path = require("path"); 
const { handleAction } = require("./service");
const { supabase } = require("./db"); // ✅ USE DB
const crypto = require("crypto");

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// 🔒 API key
const API_KEY = process.env.API_KEY;

// 🔒 Auth middleware
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
    await handleAction(req.body, requestId);

    res.json({
      success: true,
      requestId
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
      requestId
    });
  }
});

// 🔍 GET recent audits (FROM SUPABASE ✅)
app.get("/audit", authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("audit_logs")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(10);

    console.log("AUDIT FETCH:", data);

    if (error) {
      throw new Error(error.message);
    }

    res.json({
      success: true,
      data: data || []
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// 🔍 GET single audit (FROM SUPABASE ✅)
app.get("/audit/:requestId", authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("audit_logs")
      .select("*")
      .eq("request_id", req.params.requestId)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        error: "Not found"
      });
    }

    res.json({
      success: true,
      data
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// 🚀 START SERVER
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

process.stdin.resume();