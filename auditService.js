const { supabase } = require("./db");

// 🔍 find single record
async function findByRequestId(requestId) {
  const { data, error } = await supabase
    .from("audit_logs")
    .select("*")
    .eq("request_id", requestId)
    .single();

  if (error) return null;

  return data; // ✅ includes execution_input
}

// 📜 get recent logs
async function getAll(limit = 10) {
  const { data, error } = await supabase
    .from("audit_logs")
    .select("*")
    .order("timestamp", { ascending: false })
    .limit(limit);

  if (error) return [];

  return data; // ✅ includes execution_input
}

module.exports = { findByRequestId, getAll };