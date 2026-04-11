const { createClient } = require("redis");

// 🔐 MUST be set
if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL not set");
}

const client = createClient({
  url: process.env.REDIS_URL
});

client.on("error", (err) => {
  console.error("Redis error:", err);
});

async function connectRedis() {
  if (!client.isOpen) {
    try {
      await client.connect();
    } catch (err) {
      console.error("Redis connection failed:", err.message);
      throw new Error("REDIS_CONNECTION_FAILED");
    }
  }
}

module.exports = {
  client,
  connectRedis
};