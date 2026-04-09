const { supabase } = require("./db");

// 🔍 find single record
async function findByRequestId(requestId) {
  const { data, error } = await supabase
    .from("audit_logs")
    .select("*")
    .eq("request_id", requestId)
    .single();

  if (error) {
    console.error("AUDIT READ ERROR:", {
      requestId,
      error: error.message
    });
    return null;
  }

  return data; // includes execution_input
}

// 📜 get recent logs
async function getAll(limit = 10) {
  const { data, error } = await supabase
    .from("audit_logs")
    .select("*")
    .order("timestamp", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("AUDIT READ ERROR:", {
      error: error.message
    });
    return [];
  }

  return data || []; // deterministic fallback
}

module.exports = { findByRequestId, getAll };