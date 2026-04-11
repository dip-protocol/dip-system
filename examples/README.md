# 🧠 Manthan Decision System — Examples & Reference

---

## 🚀 What is this?

This folder contains **reference examples** for the Manthan Decision System.

Manthan is not a CRUD API.

👉 It is a **Decision Infrastructure System**
Every action must pass through a **deterministic decision engine** before execution.

---

## 🧱 System Architecture (Simplified)

```text
Client Request
     ↓
Controller
     ↓
Service Layer
     ↓
Rule Engine (evaluate)
     ↓
Decision (ALLOW / BLOCK / REQUIRE_OVERRIDE)
     ↓
Enforcement
     ↓
Execution Token (if allowed)
     ↓
Audit Log
```

---

## 📥 Input Contract (STRICT)

Every request MUST follow this structure:

```json
{
  "action": { "type": "CREATE_USER" },
  "orgId": "orgA",
  "systemId": "billing",
  "payload": {
    "userId": "user-1"
  },
  "context": {
    "role": "admin"
  }
}
```

---

### 🔑 Required Fields

| Field          | Description             |
| -------------- | ----------------------- |
| action.type    | Action name (UPPERCASE) |
| orgId          | Organization identifier |
| systemId       | System identifier       |
| payload.userId | Target entity           |
| context.role   | Actor role              |

---

### ❌ Forbidden Fields

```json
{
  "data": { "userId": "..." }
}
```

👉 This will FAIL with:

```text
INVALID: 'data' field not allowed. Use 'payload'
```

---

## 📜 Rule Structure (Contract)

Each rule follows:

```json
{
  "id": "RULE_NAME",
  "when": {
    "action.type": "ACTION"
  },
  "if": {
    "context.role": {
      "not_equals": "admin"
    }
  },
  "then": {
    "message": "Explanation",
    "enforcement": "BLOCK"
  }
}
```

---

### 🔍 Rule Fields Explained

| Field | Purpose               |
| ----- | --------------------- |
| id    | Unique identifier     |
| when  | When rule applies     |
| if    | Condition to evaluate |
| then  | Enforcement decision  |

---

## ⚖️ Decision Outcomes

| Status           | Meaning             |
| ---------------- | ------------------- |
| ALLOW            | Execution permitted |
| BLOCK            | Execution denied    |
| REQUIRE_OVERRIDE | Needs approval      |

---

## 🔄 Execution Flow (Detailed)

1. **Input received**
2. **Input normalized**

   * action.type → UPPERCASE
   * context.role → lowercase
3. **Rules loaded**

   * Based on `orgId/systemId`
4. **Rules evaluated**
5. **Decision generated**
6. **Determinism check (double evaluation)**
7. **Validation**
8. **Enforcement**
9. **Execution token generated**
10. **Audit log written**

---

## 🔐 Security Model

### ✔ Deterministic Engine

Same input → same decision ALWAYS

---

### ✔ Execution Token (HMAC Signed)

* Signed with secret key
* Cannot be tampered

---

### ✔ Replay Protection (Redis)

* Token usable ONLY once

---

### ✔ TTL Protection

* Token expires in ~5 minutes

---

### ✔ Audit Logging

Every decision is recorded:

* input
* decision
* execution
* errors
* overrides

---

## 🧪 Example Scenarios

---

### ✅ Admin creates user

```json
context.role = "admin"
```

👉 Result:

```text
ALLOW
```

---

### ❌ Non-admin creates user

```json
context.role = "user"
```

👉 Result:

```text
BLOCK
Reason: ONLY_ADMIN_CAN_CREATE
```

---

### ❌ Invalid payload format

```json
data.userId instead of payload.userId
```

👉 Result:

```text
ERROR
```

---

## 📂 Folder Structure

```text
examples/
  payloads/
    create-user-admin.json
    create-user-non-admin.json
    delete-user-admin.json
    invalid-data-format.json

  rules/
    billing.sample.json

  README.md
```

---

## ⚠️ Important Rules (DO NOT BREAK)

* Always use `payload` (NOT `data`)
* action.type must be UPPERCASE
* context.role must be lowercase
* Rules must match normalized input
* No runtime mutation allowed

---

## 🧠 System Philosophy

> “Intent is a claim, system observation is truth.”

* Client sends intent
* System evaluates reality (rules)
* Decision becomes **single source of truth**

---

## 🔒 Determinism Guarantee

The system enforces:

```text
evaluate(input) === evaluate(input)
```

If mismatch → system error

---

## 🎯 Purpose of This Folder

This folder is used for:

* Testing scenarios
* Debugging
* Developer onboarding
* Demo & presentation
* Contract reference

---

## 🚀 What Next?

You can extend this system with:

* Rule versioning
* Decision graph visualization
* Risk scoring
* Automated test runner
* Multi-org scaling

---

## 🏁 Final Note

This is not just an API.

👉 This is **Decision Infrastructure**

Every action must be:

```text
Traceable ✔
Auditable ✔
Deterministic ✔
```

---
