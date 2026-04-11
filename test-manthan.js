const axios = require("axios");

const BASE_URL = "http://localhost:8080";
const API_KEY = "your-api-key"; // 🔑 replace

async function run() {
  console.log("\n==============================");
  console.log("🧠 MANTHAN SYSTEM TEST");
  console.log("==============================\n");

  let token, requestId;

  // -----------------------------
  // 1. FUNCTIONALITY TEST
  // -----------------------------
  console.log("1️⃣ FUNCTIONALITY TEST");

  const actionRes = await axios.post(
    `${BASE_URL}/action`,
    {
      orgId: "org1",
      systemId: "sys1",
      action: { type: "CREATE_USER" },
      data: { userId: "user123" },
      context: { role: "ADMIN" }
    },
    { headers: { "x-api-key": API_KEY } }
  );

  token = actionRes.data.execution_token;
  requestId = actionRes.data.requestId;

  if (!token) throw new Error("❌ No execution token");

  console.log("✅ Action created");

  // -----------------------------
  // 2. VALID EXECUTION
  // -----------------------------
  console.log("\n2️⃣ VALID EXECUTION");

  const execRes = await axios.post(
    `${BASE_URL}/execute`,
    token,
    { headers: { "x-api-key": API_KEY } }
  );

  if (!execRes.data.success) throw new Error("❌ Execution failed");

  console.log("✅ Execution succeeded");

  // -----------------------------
  // 3. REPLAY ATTACK
  // -----------------------------
  console.log("\n3️⃣ REPLAY ATTACK TEST");

  try {
    await axios.post(`${BASE_URL}/execute`, token, {
      headers: { "x-api-key": API_KEY }
    });

    console.log("❌ Replay allowed (FAIL)");
  } catch {
    console.log("✅ Replay blocked");
  }

  // -----------------------------
  // 4. PAYLOAD TAMPERING
  // -----------------------------
  console.log("\n4️⃣ PAYLOAD TAMPERING TEST");

  const tampered = {
    ...token,
    payload: { userId: "HACKED" }
  };

  try {
    await axios.post(`${BASE_URL}/execute`, tampered, {
      headers: { "x-api-key": API_KEY }
    });

    console.log("❌ Tampering allowed (FAIL)");
  } catch {
    console.log("✅ Tampering blocked");
  }

  // -----------------------------
  // 5. SIGNATURE FORGERY
  // -----------------------------
  console.log("\n5️⃣ SIGNATURE FORGERY TEST");

  const forged = {
    ...token,
    signature: "fake_signature"
  };

  try {
    await axios.post(`${BASE_URL}/execute`, forged, {
      headers: { "x-api-key": API_KEY }
    });

    console.log("❌ Forgery allowed (FAIL)");
  } catch {
    console.log("✅ Forgery blocked");
  }

  // -----------------------------
  // 6. OVERRIDE FLOW TEST
  // -----------------------------
  console.log("\n6️⃣ OVERRIDE TEST");

  try {
    await axios.post(
      `${BASE_URL}/action`,
      {
        orgId: "org1",
        systemId: "sys1",
        action: { type: "DELETE_USER" },
        data: { userId: "restricted-user" },
        context: { role: "USER" } // should trigger override
      },
      { headers: { "x-api-key": API_KEY } }
    );

    console.log("❌ Override not enforced (FAIL)");
  } catch (err) {
    console.log("✅ Override correctly required");
  }

  // -----------------------------
  // 7. AUDIT CHECK
  // -----------------------------
  console.log("\n7️⃣ AUDIT CHECK");

  const auditRes = await axios.get(`${BASE_URL}/audit`, {
    headers: { "x-api-key": API_KEY }
  });

  if (!auditRes.data.data.length) {
    console.log("❌ Audit missing");
  } else {
    console.log("✅ Audit recorded");
  }

  // -----------------------------
  // 8. DETERMINISM CHECK (BASIC)
  // -----------------------------
  console.log("\n8️⃣ DETERMINISM CHECK");

  const res1 = await axios.post(
    `${BASE_URL}/action`,
    {
      orgId: "org1",
      systemId: "sys1",
      action: { type: "CREATE_USER" },
      data: { userId: "same-user" },
      context: { role: "ADMIN" }
    },
    { headers: { "x-api-key": API_KEY } }
  );

  const res2 = await axios.post(
    `${BASE_URL}/action`,
    {
      orgId: "org1",
      systemId: "sys1",
      action: { type: "CREATE_USER" },
      data: { userId: "same-user" },
      context: { role: "ADMIN" }
    },
    { headers: { "x-api-key": Charak@987 } }
  );

  if (
    res1.data.execution_token.action === res2.data.execution_token.action
  ) {
    console.log("✅ Deterministic decision behavior");
  } else {
    console.log("❌ Non-deterministic behavior");
  }

  console.log("\n==============================");
  console.log("🎯 TEST COMPLETE");
  console.log("==============================\n");
}

run().catch(err => {
  console.error("🔥 TEST FAILED:", err.message);
});