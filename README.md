# 🚀 DIP — Decision Infrastructure Platform

> **Every decision is traceable, auditable, and built for trust.**

---

## 🧠 What is DIP?

DIP (Decision Infrastructure Platform) is a **deterministic decision system** that converts inputs into enforceable decisions with full auditability and explainability.

---

## ⚙️ Core Flow

```
Input → Rules → Decision → Enforcement → Execution Intent → Audit
```

* No execution side effects
* No AI-driven decisions
* Fully deterministic

---

## 🔒 System Guarantees

* ✅ Deterministic (same input + rules → same output)
* ✅ No runtime mutation
* ✅ Full audit logging
* ✅ Explainable decisions (trace)
* ✅ No side effects (execution is external)

---

## 📁 Project Structure

```
dip-system/
├── dip-core/
│   └── engine.js        → Decision engine (evaluate)
├── rules/               → Rule definitions
├── service.js           → Orchestration layer
├── enforce.js           → Enforcement logic
├── audit.js             → Audit write
├── auditService.js      → Audit read + analytics
├── server.js            → API layer
├── db.js                → Supabase client
├── public/              → Static UI (optional)
```

---

## 🧠 Decision Engine

### Function

```js
evaluate(input, rules)
```

---

### Output

```json
{
  "status": "ALLOW | BLOCK | REQUIRE_OVERRIDE",
  "violations": [],
  "reason": "...",
  "meta": {
    "trace": []
  }
}
```

---

### 🔍 Trace (Explainability)

Each rule evaluation is recorded:

```json
{
  "rule_id": "no-user-delete",
  "when_match": true,
  "if_match": true,
  "result": "VIOLATION"
}
```

#### Trace States

| State     | Meaning                       |
| --------- | ----------------------------- |
| SKIPPED   | Rule not applicable           |
| PASSED    | Rule checked but not violated |
| VIOLATION | Rule triggered                |

---

## 📜 Rule System

Rules are defined as JSON:

```json
{
  "id": "no-user-delete",
  "when": { "action.type": "delete" },
  "if": { "context.role": { "equals": "user" } },
  "then": {
    "enforcement": "BLOCK",
    "message": "Users cannot delete"
  }
}
```

---

### Rule Semantics

* `when` → applicability
* `if` → violation condition
* `then.enforcement` → action

---

## 🚀 API Endpoints

---

### 🔥 POST `/action`

Evaluate a decision and return execution intent.

#### Request

```json
{
  "orgId": "org_1",
  "systemId": "repo",
  "action": { "type": "delete" },
  "context": { "role": "user" }
}
```

#### Response

```json
{
  "success": true,
  "requestId": "...",
  "execution_intent": {}
}
```

---

### 📥 POST `/audit-result`

Record execution outcome.

```json
{
  "requestId": "...",
  "status": "SUCCESS | FAILED",
  "result": {},
  "error": null
}
```

---

### 📜 GET `/audit`

Fetch recent audit logs.

---

### 🔍 GET `/audit/:requestId`

Fetch a specific audit record.

---

### 📊 GET `/audit/summary`

Aggregated decision intelligence.

#### Response

```json
{
  "success": true,
  "data": {
    "total_requests": 100,
    "status_breakdown": {
      "ALLOW": 40,
      "BLOCK": 40,
      "REQUIRE_OVERRIDE": 20
    },
    "rule_stats": {
      "no-user-delete": {
        "violations": 25,
        "passes": 10,
        "skipped": 65
      }
    }
  }
}
```

---

## 📊 Audit System

Every request logs:

* input
* decision
* execution_input
* result
* status
* error
* timestamp

---

## 🧠 Decision Intelligence

DIP provides:

* 🔍 **Trace** → Why a decision happened
* 📊 **Summary** → System-wide patterns

---

## 🔒 Constraints (Non-Negotiable)

* ❌ No changes to decision logic
* ❌ No execution inside system
* ❌ No API contract changes
* ❌ No side effects
* ✅ Audit logging mandatory

---

## 🧪 Validation Rule

> Same input + same rules → same decision

---

## 🏁 Current State

* ✅ Deterministic decision engine
* ✅ Rule enforcement system
* ✅ Audit logging
* ✅ Explainability (trace)
* ✅ Analytics layer (`/audit/summary`)

---

## 🚀 Next Evolution

### ➜ Manthan (Decision Intelligence UI)

* Rule heatmaps
* Decision graph visualization
* Risk panels
* Override tracking

---

## 🧭 Final Principle

> **Intent is a claim. System evaluation is truth.**
