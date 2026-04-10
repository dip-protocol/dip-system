const API_KEY = "Charak@987";
const BASE_URL = "https://dip-system.fly.dev";

export async function getSummary() {
  const res = await fetch(`${BASE_URL}/audit/summary`, {
    headers: {
      "x-api-key": API_KEY
    }
  });
  return res.json();
}

export async function getTrace(requestId) {
  const res = await fetch(`${BASE_URL}/audit/${requestId}`, {
    headers: {
      "x-api-key": API_KEY
    }
  });
  return res.json();
}