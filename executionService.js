const crypto = require("crypto");
const { client, connectRedis } = require("./redisClient");

// 🔐 MULTI-KEY SUPPORT (ROTATION READY)
const KEYS = {
  v1: process.env.EXECUTION_SECRET
};

const CURRENT_KEY_ID = "v1";

// 🔒 Ensure key exists
if (!KEYS[CURRENT_KEY_ID]) {
  throw new Error("EXECUTION_SECRET not set");
}

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
// SIGN EXECUTION INTENT
// -----------------------------
function signExecutionIntent(intent, requestId) {
  const payload = {
    ...intent,
    requestId,
    iat: Date.now(),          // issued at
    kid: CURRENT_KEY_ID,      // key version
    scope: "EXECUTION"        // context binding
  };

  const secret = KEYS[CURRENT_KEY_ID];

  const signature = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(canonicalize(payload)))
    .digest("hex");

  return {
    ...payload,
    signature
  };
}

// -----------------------------
// VERIFY TOKEN + REPLAY PROTECTION
// -----------------------------
async function verifyExecutionToken(token) {
  if (!token) return false;

  const redis = await connectRedis();

  const { signature, ...payload } = token;

  // 🔐 Key selection (supports rotation)
  const secret = KEYS[payload.kid];
  if (!secret) return false;

  // 🔐 Signature verification
  const expected = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(canonicalize(payload)))
    .digest("hex");

  if (signature !== expected) return false;

  // 🔒 TTL enforcement (LIMIT DAMAGE WINDOW)
  const MAX_AGE_MS = 5 * 60 * 1000; // 5 minutes
  if (!payload.iat || Date.now() - payload.iat > MAX_AGE_MS) {
    return false;
  }

  // 🔒 Scope validation
  if (payload.scope !== "EXECUTION") return false;

  // 🔒 Strict structure validation
  if (
    !payload.requestId ||
    !payload.action ||
    !payload.payload ||
    !payload.decisionHash
  ) {
    return false;
  }

  const key = `exec_token:${payload.requestId}:${payload.decisionHash}`;

  // 🔁 Atomic single-use enforcement
  const result = await redis.set(key, "used", {
  NX: true
});

  if (result === null) return false;

  return true;
}

module.exports = {
  signExecutionIntent,
  verifyExecutionToken
};