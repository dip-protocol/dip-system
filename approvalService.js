require("dotenv").config();
const crypto = require("crypto");

// 🔐 MUST be set (no fallback allowed)
if (!process.env.APPROVAL_SECRET) {
  throw new Error("APPROVAL_SECRET not set");
}

const SECRET = process.env.APPROVAL_SECRET;
const TTL = 5 * 60 * 1000; // 5 minutes

// -----------------------------
// CANONICALIZE (DETERMINISTIC)
// -----------------------------
function canonicalize(obj) {
  if (Array.isArray(obj)) return obj.map(canonicalize);

  if (obj && typeof obj === "object") {
    return Object.keys(obj)
      .sort()
      .reduce((acc, key) => {
        acc[key] = canonicalize(obj[key]);
        return acc;
      }, {});
  }

  return obj;
}

// -----------------------------
// GENERATE APPROVAL TOKEN
// -----------------------------
function generateApprovalToken({ override_id, approved_by, role }) {
  if (!override_id) throw new Error("override_id required");
  if (!approved_by) throw new Error("approved_by required");

  // 🔐 ONLY SUPER_ADMIN CAN APPROVE
  if (role !== "SUPER_ADMIN") {
    throw new Error("Only SUPER_ADMIN can approve override");
  }

  const payload = {
    override_id,       // 🔐 binds token to request
    approved_by,       // 👤 who approved
    role,              // 🔐 must be SUPER_ADMIN
    iat: Date.now(),
    exp: Date.now() + TTL
  };

  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(JSON.stringify(canonicalize(payload)))
    .digest("hex");

  return {
    ...payload,
    signature
  };
}

// -----------------------------
// VERIFY APPROVAL TOKEN
// -----------------------------
function verifyApprovalToken(token) {
  if (!token || typeof token !== "object") return false;

  const { signature, ...payload } = token;

  // 🔒 signature must exist
  if (!signature) return false;

  // 🔒 Strict structure validation
  if (
    !payload.override_id ||
    !payload.approved_by ||
    !payload.role ||
    !payload.iat ||
    !payload.exp
  ) {
    return false;
  }

  // 🔐 Role enforcement
  if (payload.role !== "SUPER_ADMIN") return false;

  // 🔐 Verify signature (deterministic)
  const expectedSignature = crypto
    .createHmac("sha256", SECRET)
    .update(JSON.stringify(canonicalize(payload)))
    .digest("hex");

  if (signature !== expectedSignature) return false;

  // ⏱️ Expiry check
  if (Date.now() > payload.exp) return false;

  return true;
}

module.exports = {
  generateApprovalToken,
  verifyApprovalToken
};