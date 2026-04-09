const { evaluate } = require("./index");
const { validateRules, validateInput } = require("./validator");

const rules = [
  {
    id: "ONLY_ADMIN_CAN_DELETE",
    when: { "action.type": "DELETE_USER" },
    if: { "context.role": { "not_equals": "admin" } },
    then: {
      message: "Only admin can delete users",
      enforcement: "BLOCK"
    }
  }
];

const input = {
  action: { type: "DELETE_USER" },
  context: { role: "user" }
};

try {
  validateRules(rules);
  validateInput(input);

  const result = evaluate(input, rules);

  console.log(result);

} catch (err) {
  console.error("❌ Validation Error:", err.message);
}