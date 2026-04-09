const { evaluate: engineEvaluate } = require("./engine");
const { validateRules, validateInput } = require("./validator");

function evaluate(input, rules) {
  validateRules(rules);
  validateInput(input);

  return engineEvaluate(input, rules);
}

module.exports = { evaluate };