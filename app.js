const { handleDelete } = require("./controller");

async function run() {
  console.log("---- Test 1: Non-admin ----");
  await handleDelete({ userId: "123", role: "user" });

  console.log("\n---- Test 2: Admin ----");
  await handleDelete({ userId: "123", role: "admin" });

  console.log("\n---- Test 3: role = null ----");
  await handleDelete({ userId: "123", role: null });

  console.log("\n---- Test 4: role = number ----");
  await handleDelete({ userId: "123", role: 123 });

  console.log("\n---- Test 5: Missing role ----");
  await handleDelete({ userId: "123" });

  console.log("\n---- Test 6: Missing userId ----");
  await handleDelete({ role: "admin" });

  console.log("\n---- Test 7: Empty input ----");
  await handleDelete({});

  console.log("\n---- Test 8: Extra fields ----");
  await handleDelete({
    userId: "123",
    role: "admin",
    random: "unexpected"
  });

  console.log("\n---- Test 9: Malformed role ----");
  await handleDelete({
    userId: "123",
    role: { type: "admin" }
  });
}

run();