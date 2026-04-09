const fs = require("fs");
const path = require("path");

function loadRules(orgId, systemId) {
  if (!orgId || !systemId) {
    throw new Error("Missing orgId/systemId");
  }

  const filePath = path.join(
    __dirname,
    orgId,
    `${systemId}.json`
  );

  if (!fs.existsSync(filePath)) {
    throw new Error(`Rules not found for ${orgId}/${systemId}`);
  }

  const raw = fs.readFileSync(filePath, "utf-8");

  const rules = JSON.parse(raw);

  return Object.freeze(rules);
}

module.exports = { loadRules };