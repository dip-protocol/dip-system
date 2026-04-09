# DIP Core

Deterministic Decision Engine for the Decision Infrastructure Platform (DIP).

---

## 🎯 Purpose

DIP Core evaluates decisions using predefined rules.

It is:

- Deterministic
- Stateless
- Side-effect free
- Fully predictable

---

## 🧠 What It Does

```text
Input + Rules → Decision
🔒 Core Principles
No external dependencies
No I/O (no DB, no network, no filesystem)
No hidden logic
No mutation
Same input always produces same output
📦 Installation
npm install
🚀 Usage
const { evaluate } = require("dip-core");

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

const result = evaluate(input, rules);

console.log(result);
📥 Input Contract
{
  "action": { "type": "string" },
  "context": { "any": "object" },
  "...": "any additional data"
}
Input must be an object
No strict schema enforcement in core
Missing fields are handled gracefully
📜 Rule Structure
{
  "id": "string",
  "when": {
    "path.to.field": "value"
  },
  "if": {
    "path.to.field": {
      "equals": "value"
    }
  },
  "then": {
    "message": "string",
    "enforcement": "BLOCK | REQUIRE_OVERRIDE"
  }
}
⚙️ Supported Conditions
Operator	Description
equals	value === expected
not_equals	value !== expected
exists	field presence check
📤 Output Contract
{
  "status": "ALLOW | BLOCK | REQUIRE_OVERRIDE",
  "violations": [
    {
      "rule_id": "string",
      "message": "string",
      "enforcement": "BLOCK | REQUIRE_OVERRIDE"
    }
  ],
  "reason": "string",
  "meta": {}
}
🔁 Decision Logic
Match rules using when
Evaluate conditions using if
Collect violations
Return final status:
Condition	Result
No rule matched	BLOCK
BLOCK violation exists	BLOCK
Only soft violations	REQUIRE_OVERRIDE
No violations	ALLOW
⚠️ Important Behaviors
Missing Input Fields
Missing fields DO NOT throw errors
They cause conditions to fail
Fail-Safe Default
If no rules match → BLOCK
Strict Rule Validation

Invalid rules will throw errors.

🧪 Testing
node test.js
🧱 Architecture
Validator → Engine → Decision
validator.js → validates input & rules
engine.js → evaluates rules
index.js → orchestrates
❌ What This Core Does NOT Do
No rule fetching
No database access
No execution of actions
No audit logging
No retries or side effects
🔗 Responsibility Boundary
Layer	Responsibility
Core	Decision
Runtime	Rule injection
System	Execution + Audit
🧠 Philosophy
Core evaluates reality.
It does not assume it.
It does not fix it.
It does not fetch it.
🔒 Status
DIP Core is stable, deterministic, and production-ready.