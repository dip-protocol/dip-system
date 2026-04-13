# Manthan v0.2 — Decision Infrastructure

## Overview

Manthan is a deterministic decision system that enforces, audits, and executes actions with cryptographic integrity.

---

## Core Flow

1. `/action` → Generate execution token  
2. `/execute` → Execute validated decision  
3. `/audit` → Retrieve audit logs  

---

## Key Principles

- Deterministic decisions  
- Execution token verification  
- Audit traceability  
- Replay protection  
- Decision integrity via hashing  

---

## API Docs

👉 Live Swagger UI:  
https://dip-system.fly.dev/docs

---

## Modules

- `service.js` → Decision engine  
- `executionService.js` → Token verification  
- `auditService.js` → Audit intelligence  
- `server.js` → API layer  

---

## Version

v0.2 — Deterministic PR Gate + Execution System