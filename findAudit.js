const fs = require("fs");
const path = require("path");

const LOG_FILE = path.join(__dirname, "audit.log");

function findByRequestId(requestId) {
  const lines = fs.readFileSync(LOG_FILE, "utf-8").split("\n");

  for (const line of lines) {
    if (!line.trim()) continue;

    const entry = JSON.parse(line);

    if (entry.requestId === requestId) {
      printEntry(entry);
      return;
    }
  }

  console.log("❌ No record found for requestId:", requestId);
}

function printEntry(entry) {
  console.log("\n==============================");
  console.log("🔎 AUDIT RECORD");
  console.log("==============================\n");

  console.log("🆔 Request ID :", entry.requestId);
  console.log("⏱️ Timestamp  :", entry.timestamp);

  console.log("\n📥 INPUT");
  console.log("  Action :", entry.input?.action?.type);
  console.log("  Role   :", entry.input?.context?.role);
  console.log("  Data   :", JSON.stringify(entry.input?.data));

  console.log("\n⚖️ DECISION");
  console.log("  Status :", entry.decision?.status);

  if (entry.decision?.violations?.length) {
    console.log("  Violations:");
    entry.decision.violations.forEach(v => {
      console.log(`   - ${v.rule_id}: ${v.message}`);
    });
  }

  // ✅ NEW: TRACE (CRITICAL ADDITION)
  const trace = entry.decision?.meta?.trace || [];

  if (trace.length > 0) {
    console.log("\n🧠 TRACE (Rule Evaluation)");
    trace.forEach(t => {
      console.log(
        `   - ${t.rule_id} → ${t.result} (when: ${t.when_match}, if: ${t.if_match})`
      );
    });
  }

  console.log("\n⚙️ RESULT");
  console.log("  Result :", entry.result || "N/A");
  console.log("  Status :", entry.status);

  if (entry.error) {
    console.log("\n❌ ERROR");
    console.log(" ", entry.error);
  }

  console.log("\n==============================\n");
}

// 🔥 CLI usage
const requestId = process.argv[2];

if (!requestId) {
  console.log("❗ Usage: node findAudit.js <requestId>");
  process.exit(1);
}

findByRequestId(requestId);