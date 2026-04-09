let failureCount = 0;
let lastFailureTime = 0;

const FAILURE_THRESHOLD = 3;
const COOLDOWN_MS = 10000;

const TIMEOUT_MS = 3000;
const MAX_RETRIES = 2;

const SERVICE_MAP = {
  DELETE_USER: "https://user-service.com/delete",
  CREATE_USER: "https://user-service.com/create"
};

async function fetchWithTimeout(url, options, timeout) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Execution timeout")), timeout)
    )
  ]);
}

async function executeAction(executionInput, requestId) {
  const startTime = Date.now();

  // ✅ LOG EXACT INPUT USED (critical for traceability)
  console.log(`[${requestId}] Execution Input:`, executionInput);

  const actionType = executionInput.action.type;
  const url = SERVICE_MAP[actionType];

  if (!url) {
    throw new Error(`No service mapped for action: ${actionType}`);
  }

  // 🔴 CIRCUIT BREAKER CHECK (unchanged)
  const now = Date.now();
  if (
    failureCount >= FAILURE_THRESHOLD &&
    now - lastFailureTime < COOLDOWN_MS
  ) {
    console.log(`[${requestId}] ⛔ Circuit breaker OPEN`);
    throw new Error("Circuit breaker OPEN");
  }

  console.log(`[${requestId}] → Calling ${actionType} at ${url}`);

  let attempt = 0;

  while (attempt <= MAX_RETRIES) {
    try {
      const response = await fetchWithTimeout(
        url,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-idempotency-key": requestId
          },
          // ✅ CRITICAL: send executionInput (not original input)
          body: JSON.stringify(executionInput)
        },
        TIMEOUT_MS
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Execution failed: ${text}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Execution error");
      }

      // ✅ RESET ON SUCCESS (unchanged)
      failureCount = 0;

      const duration = Date.now() - startTime;

      console.log(
        `[${requestId}] ✔ SUCCESS ${actionType} (${duration}ms)`
      );

      return data.result || "SUCCESS";

    } catch (err) {
      // ✅ TRACK FAILURE (unchanged)
      failureCount++;
      lastFailureTime = Date.now();

      console.log(
        `[${requestId}] ✖ ERROR attempt ${attempt + 1}: ${err.message}`
      );

      attempt++;

      if (attempt > MAX_RETRIES) {
        throw err;
      }
    }
  }
}

module.exports = { executeAction };