# Security Model

## Guarantees

### 1. No Replay

Each token is single-use.

---

### 2. Decision Integrity

Hash ensures payload is unchanged.

---

### 3. Audit Binding

Execution is tied to requestId.

---

### 4. Authorization

`x-api-key` is required.

---

## Validation Steps

1. Structure validation  
2. Token verification  
3. Decision hash check  
4. Audit binding check  
5. Context validation  
6. Action whitelist  