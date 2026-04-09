function validateRules(rules) {
  if (!Array.isArray(rules)) {
    throw new Error("Rules must be an array");
  }

  const ids = new Set();

  for (const rule of rules) {
    if (!rule.id) {
      throw new Error("Rule missing id");
    }

    if (ids.has(rule.id)) {
      throw new Error(`Duplicate rule id: ${rule.id}`);
    }

    ids.add(rule.id);

    if (!rule.when || typeof rule.when !== "object") {
      throw new Error(`Rule ${rule.id} missing 'when'`);
    }

    if (!rule.then || !rule.then.enforcement) {
      throw new Error(`Rule ${rule.id} missing 'then.enforcement'`);
    }
  }
}

function validateInput(input) {
  if (!input || typeof input !== "object") {
    throw new Error("Invalid input: must be an object");
  }
}

module.exports = {
  validateRules,
  validateInput
};