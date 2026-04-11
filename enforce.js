function enforce(decision) {
  if (!decision || !decision.status) {
    const err = new Error("Invalid decision");
    err.code = "INVALID_DECISION";
    throw err;
  }

  if (decision.status === "ALLOW") return;

  if (decision.status === "BLOCK") {
    const message =
      decision.violations?.map(v => v.message).join(", ") ||
      "Blocked by policy";

    const err = new Error(message);
    err.code = "BLOCK";
    throw err;
  }

  if (decision.status === "REQUIRE_OVERRIDE") {
    const err = new Error("Requires override");
    err.code = "REQUIRE_OVERRIDE";
    throw err;
  }

  const err = new Error("Unknown decision status");
  err.code = "UNKNOWN_STATUS";
  throw err;
}

module.exports = { enforce };