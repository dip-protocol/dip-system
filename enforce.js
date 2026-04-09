function enforce(decision) {
  if (!decision || !decision.status) {
    throw new Error("Invalid decision");
  }

  if (decision.status === "ALLOW") return;

  if (decision.status === "BLOCK") {
    const message =
      decision.violations?.map(v => v.message).join(", ") ||
      "Blocked by policy";

    throw new Error(message);
  }

  if (decision.status === "REQUIRE_OVERRIDE") {
    throw new Error("Requires override");
  }

  throw new Error("Unknown decision status");
}

module.exports = { enforce };