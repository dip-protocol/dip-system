const { handleAction } = require("./service");
const crypto = require("crypto");

async function run() {
  async function call(input) {
    const requestId = crypto.randomUUID();

    try {
      const result = await handleAction(input, requestId);
      console.log("✅ SUCCESS:", result);
    } catch (err) {
      console.log("❌ ERROR:", err.message);
    }
  }

  console.log("---- Test 1: Non-admin ----");
  await call({
    orgId: "orgA",
    systemId: "billing",
    action: { type: "DELETE_USER" },
    context: { role: "user" },
    data: { userId: "123" }
  });

  console.log("\n---- Test 2: Admin ----");
  await call({
    orgId: "orgA",
    systemId: "billing",
    action: { type: "DELETE_USER" },
    context: { role: "admin" },
    data: { userId: "123" }
  });

  console.log("\n---- Test 3: role = null ----");
  await call({
    orgId: "orgA",
    systemId: "billing",
    action: { type: "DELETE_USER" },
    context: { role: null },
    data: { userId: "123" }
  });

  console.log("\n---- Test 4: role = number ----");
  await call({
    orgId: "orgA",
    systemId: "billing",
    action: { type: "DELETE_USER" },
    context: { role: 123 },
    data: { userId: "123" }
  });

  console.log("\n---- Test 5: Missing role ----");
  await call({
    orgId: "orgA",
    systemId: "billing",
    action: { type: "DELETE_USER" },
    context: {},
    data: { userId: "123" }
  });

  console.log("\n---- Test 6: Missing userId ----");
  await call({
    orgId: "orgA",
    systemId: "billing",
    action: { type: "DELETE_USER" },
    context: { role: "admin" },
    data: {}
  });

  console.log("\n---- Test 7: Empty input ----");
  await call({});

  console.log("\n---- Test 8: Extra fields ----");
  await call({
    orgId: "orgA",
    systemId: "billing",
    action: { type: "DELETE_USER" },
    context: { role: "admin" },
    data: { userId: "123" },
    random: "unexpected"
  });

  console.log("\n---- Test 9: Malformed role ----");
  await call({
    orgId: "orgA",
    systemId: "billing",
    action: { type: "DELETE_USER" },
    context: { role: { type: "admin" } },
    data: { userId: "123" }
  });
}

run();