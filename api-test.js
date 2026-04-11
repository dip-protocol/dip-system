const BASE_URL = (process.env.BASE_URL || "https://dip-system.fly.dev").replace(/\/$/, "");
const API_KEY = process.env.API_KEY || "Charak@987";

async function api(path, method = "GET", body = null) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await res.json().catch(() => ({}));

  return {
    status: res.status,
    ok: res.ok,
    data
  };
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function run() {
  console.log("\n==============================");
  console.log("🧪 API TEST SUITE");
  console.log("==============================\n");

  // 1. HEALTH CHECK (optional if exists)
  console.log("1️⃣ HEALTH CHECK");
  try {
    const res = await api("/health");
    console.log(res.ok ? "✅ Server reachable" : "⚠️ No health endpoint");
  } catch {
    console.log("⚠️ Health check skipped");
  }

  // 2. ACTION API
  console.log("\n2️⃣ /action API");

  const actionBody = {
    orgId: "orgA",
    systemId: "billing",
    action: { type: "CREATE_USER" },
    payload: { userId: "api-test-user" },
    context: { role: "ADMIN" }
  };

  const actionRes = await api("/action", "POST", actionBody);

  assert(actionRes.ok, "❌ /action failed");
  assert(actionRes.data.execution_token, "❌ No execution_token");

  console.log("✅ /action working");

  const token = actionRes.data.execution_token;

  // 3. EXECUTE API
  console.log("\n3️⃣ /execute API");

  const execRes = await api("/execute", "POST", token);

  assert(execRes.ok, "❌ /execute failed");
  assert(execRes.data.success === true, "❌ Execution not successful");

  console.log("✅ /execute working");

  // 4. INVALID PAYLOAD (CONTRACT TEST)
  console.log("\n4️⃣ CONTRACT VALIDATION");

  const invalidRes = await api("/action", "POST", {
    orgId: "orgA",
    systemId: "billing",
    action: { type: "CREATE_USER" },
    data: { userId: "wrong-field" }, // intentionally wrong
    context: { role: "ADMIN" }
  });

  assert(!invalidRes.ok, "❌ Contract violation NOT blocked");

  console.log("✅ Contract enforcement working");

  // 5. AUTH TEST
  console.log("\n5️⃣ AUTH TEST");

  const res = await fetch(`${BASE_URL}/action`, {
    method: "POST",
    headers: { "Content-Type": "application/json" }, // no API key
    body: JSON.stringify(actionBody)
  });

  assert(res.status === 401 || res.status === 403, "❌ Auth not enforced");

  console.log("✅ Auth enforcement working");

  // 6. AUDIT API
  console.log("\n6️⃣ /audit API");

  const auditRes = await api("/audit");

  assert(auditRes.ok, "❌ /audit failed");
  assert(Array.isArray(auditRes.data.data), "❌ Invalid audit format");

  console.log("✅ /audit working");

  console.log("\n==============================");
  console.log("🎯 API TEST PASSED");
  console.log("==============================\n");
}

run().catch(err => {
  console.error("🔥 API TEST FAILED:", err.message);
  process.exit(1);
});