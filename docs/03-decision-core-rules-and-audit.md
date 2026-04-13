# Decision Core, Rules & Audit

## Decision Engine

Manthan evaluates every action against predefined rules.

---

## Rule Enforcement

- Rules are deterministic
- No overrides without audit
- Violations block execution

---

## Example Rule

```json
{
  "action": "DELETE_USER",
  "allowedRoles": ["ADMIN"]
}
Audit System

Every execution produces:

decisionHash
auditBinding
requestId
Guarantees
Full traceability
Replay protection
Tamper detection