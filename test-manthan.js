const BASE_URL = (process.env.BASE_URL || "https://dip-system.fly.dev").replace(/\/$/, "");
const API_KEY = process.env.API_KEY || "Charak@987";

async function request(path, { method = "GET", body } = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const error = new Error(`HTTP ${response.status}`);
    error.response = { status: response.status, data };
    throw error;
  }

  return data;
}

function validateActionBody(body) {
  if ("data" in body) {
    throw new Error("INVALID CLIENT: Use 'payload' instead of 'data'");
  }
}

async function run() {
  if (!API_KEY) {
    throw new Error("Missing API_KEY environment variable");
  }

  console.log("\n==============================");
  console.log("🧠 MANTHAN SYSTEM TEST");
  console.log("==============================\n");

  let token;

  // 1. FUNCTIONALITY TEST
  console.log("1️⃣ FUNCTIONALITY TEST");

  const actionBody = {
    orgId: "orgA",
    systemId: "billing",
    action: { type: "CREATE_USER" },
    payload: { userId: "user123" },
    context: { role: "ADMIN" }
  };

  validateActionBody(actionBody);

  const actionRes = await request("/action", {
    method: "POST",
    body: actionBody
  });

  token = actionRes.execution_token;

  if (!token) throw new Error("❌ No execution token");

  console.log("✅ Action created");

  // 2. VALID EXECUTION
  console.log("\n2️⃣ VALID EXECUTION");

  const execRes = await request("/execute", {
    method: "POST",
    body: token
  });

  if (!execRes.success) throw new Error("❌ Execution failed");

  console.log("✅ Execution succeeded");

  // 3. REPLAY ATTACK
  console.log("\n3️⃣ REPLAY ATTACK TEST");

  try {
    await request("/execute", { method: "POST", body: token });
    console.log("❌ Replay allowed (FAIL)");
  } catch {
    console.log("✅ Replay blocked");
  }

  // 4. PAYLOAD TAMPERING
  console.log("\n4️⃣ PAYLOAD TAMPERING TEST");

  const tampered = {
    ...token,
    payload: { userId: "HACKED" }
  };

  try {
    await request("/execute", { method: "POST", body: tampered });
    console.log("❌ Tampering allowed (FAIL)");
  } catch {
    console.log("✅ Tampering blocked");
  }

  // 5. SIGNATURE FORGERY
  console.log("\n5️⃣ SIGNATURE FORGERY TEST");

  const forged = {
    ...token,
    signature: "fake_signature"
  };

  try {
    await request("/execute", { method: "POST", body: forged });
    console.log("❌ Forgery allowed (FAIL)");
  } catch {
    console.log("✅ Forgery blocked");
  }

  // 6. OVERRIDE TEST
  console.log("\n6️⃣ OVERRIDE TEST");

  try {
    const overrideBody = {
      orgId: "orgA",
      systemId: "billing",
      action: { type: "DELETE_USER" },
      payload: { userId: "restricted-user" },
      context: { role: "USER" }
    };

    validateActionBody(overrideBody);

    await request("/action", {
      method: "POST",
      body: overrideBody
    });

    console.log("❌ Override not enforced (FAIL)");
  } catch {
    console.log("✅ Override correctly required");
  }

  // 7. AUDIT CHECK
  console.log("\n7️⃣ AUDIT CHECK");

  const auditRes = await request("/audit");

  if (!auditRes?.data?.length) {
    console.log("❌ Audit missing");
  } else {
    console.log("✅ Audit recorded");
  }

  // 8. DETERMINISM CHECK
  console.log("\n8️⃣ DETERMINISM CHECK");

  const detBody = {
    orgId: "orgA",
    systemId: "billing",
    action: { type: "CREATE_USER" },
    payload: { userId: "same-user" },
    context: { role: "ADMIN" }
  };

  validateActionBody(detBody);

  const res1 = await request("/action", {
    method: "POST",
    body: detBody
  });

  const res2 = await request("/action", {
    method: "POST",
    body: detBody
  });

  if (res1?.execution_token?.action === res2?.execution_token?.action) {
    console.log("✅ Deterministic decision behavior");
  } else {
    console.log("❌ Non-deterministic behavior");
  }

  console.log("\n==============================");
  console.log("🎯 TEST COMPLETE");
  console.log("==============================\n");
}

run().catch(err => {
  console.error("🔥 TEST FAILED:", err.response?.data || err.message);
  process.exit(1);
});