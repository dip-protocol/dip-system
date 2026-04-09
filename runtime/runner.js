const { evaluate } = require("dip-core");
const { loadRules } = require("./ruleLoader");

function run(input) {
  if (!input || typeof input !== "object") {
    throw new Error("Invalid input");
  }

  try {
    const rules = loadRules();
    return evaluate(input, rules);
  } catch (err) {
    throw new Error("Decision evaluation failed"); // sanitized
  }
}

module.exports = { run };