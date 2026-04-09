function formatAction(type) {
  if (!type) return "-";
  return type.toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}

function formatTime(ts) {
  if (!ts) return "-";
  return new Date(ts).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function getDiff(input, execution) {
  const diffs = [];
  const keys = new Set([
    ...Object.keys(input || {}),
    ...Object.keys(execution || {})
  ]);

  keys.forEach(key => {
    if (JSON.stringify(input?.[key]) !== JSON.stringify(execution?.[key])) {
      diffs.push({
        field: key,
        input: input?.[key],
        execution: execution?.[key]
      });
    }
  });

  return diffs;
}

function generateWhy(log) {
  const action = formatAction(log.input?.action?.type);
  const error = log.error || "";

  if (log.status === "OVERRIDDEN") {
    return `${action} was blocked but executed via override`;
  }

  if (log.status === "BLOCKED") {
    return `${action} blocked by policy`;
  }

  if (log.status === "FAILED") {
    return `${action} failed: ${error}`;
  }

  if (log.status === "SUCCESS") {
    return `${action} succeeded`;
  }

  return "";
}