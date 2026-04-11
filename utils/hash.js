const crypto = require("crypto");

// -----------------------------
// CANONICALIZE (DETERMINISTIC)
// -----------------------------
function canonicalize(obj) {
  if (Array.isArray(obj)) return obj.map(canonicalize);

  if (obj && typeof obj === "object") {
    return Object.keys(obj)
      .sort()
      .reduce((acc, key) => {
        acc[key] = canonicalize(obj[key]);
        return acc;
      }, {});
  }

  return obj;
}

// -----------------------------
// DECISION HASH
// -----------------------------
function computeDecisionHash(action, payload) {
  const canonical = canonicalize({ action, payload });

  return crypto
    .createHash("sha256")
    .update(JSON.stringify(canonical))
    .digest("hex");
}

module.exports = {
  computeDecisionHash
};