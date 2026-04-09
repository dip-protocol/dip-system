const fs = require("fs");
const path = require("path");

let cachedRules = null;

function validateRules(rules) {
  const ids = new Set();

  for (const rule of rules) {
    if (!rule.id) throw new Error("Rule missing id");

    if (ids.has(rule.id)) {
      throw new Error(`Duplicate rule id: ${rule.id}`);
    }

    ids.add(rule.id);

    if (!rule.when || !rule.then || !rule.then.enforcement) {
      throw new Error(`Invalid rule: ${rule.id}`);
    }
  }
}

function deepFreeze(obj) {
  Object.freeze(obj);
  Object.getOwnPropertyNames(obj).forEach(prop => {
    if (obj[prop] !== null && typeof obj[prop] === "object" && !Object.isFrozen(obj[prop])) {
      deepFreeze(obj[prop]);
    }
  });
  return obj;
}

function loadRules() {
  if (cachedRules) return cachedRules;

  const filePath = path.join(__dirname, "rules.json");
  const raw = fs.readFileSync(filePath, "utf-8");

  const rules = JSON.parse(raw);

  validateRules(rules);

  cachedRules = deepFreeze(rules); // hardened

  return cachedRules;
}

module.exports = { loadRules };