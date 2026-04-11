const { createClient } = require("redis");

let client = null;

// -----------------------------
// GET REDIS CLIENT (LAZY INIT)
// -----------------------------
function getRedisClient() {
  // 🔐 MUST exist (runtime check, not import-time)
  if (!process.env.REDIS_URL) {
    throw new Error("REDIS_URL not set");
  }

  if (!client) {
    client = createClient({
      url: process.env.REDIS_URL
    });

    client.on("error", (err) => {
      console.error("Redis error:", err);
    });
  }

  return client;
}

// -----------------------------
// CONNECT (SAFE + IDEMPOTENT)
// -----------------------------
async function connectRedis() {
  const client = getRedisClient();

  if (!client.isOpen) {
    try {
      await client.connect();
      console.log("Redis connected");
    } catch (err) {
      console.error("Redis connection failed:", err.message);
      throw new Error("REDIS_CONNECTION_FAILED");
    }
  }

  return client;
}

module.exports = {
  getRedisClient,
  connectRedis
};