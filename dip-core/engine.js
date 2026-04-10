function get(obj, path) {
  const keys = path.split(".");
  let current = obj;

  for (const key of keys) {
    if (current == null || !(key in current)) {
      return undefined;
    }
    current = current[key];
  }

  return current;
}

function matchesWhen(input, when = {}) {
  return Object.entries(when).every(([path, expected]) => {
    return get(input, path) === expected;
  });
}

function evaluateCondition(value, condition) {
  if (condition.equals !== undefined) {
    return value === condition.equals;
  }

  if (condition.not_equals !== undefined) {
    return value !== condition.not_equals;
  }

  if (condition.exists !== undefined) {
    return condition.exists ? value !== undefined : value === undefined;
  }

  throw new Error("Unknown condition operator");
}

function matchesIf(input, conditions = {}) {
  return Object.entries(conditions).every(([path, cond]) => {
    const value = get(input, path);
    return evaluateCondition(value, cond);
  });
}

function evaluate(input, rules) {
  const violations = [];
  let matchedRules = 0;
  const trace = [];

  for (const rule of rules) {
    const whenMatch = matchesWhen(input, rule.when);

    let result = "SKIPPED";
    let ifMatch = false;

    if (whenMatch) {
      matchedRules++;

      ifMatch = matchesIf(input, rule.if);

      if (ifMatch) {
        violations.push({
          rule_id: rule.id,
          message: rule.then?.message,
          enforcement: rule.then.enforcement
        });

        result = "VIOLATION";
      } else {
        result = "PASSED";
      }
    }

    trace.push({
      rule_id: rule.id,
      when_match: whenMatch,
      if_match: whenMatch ? ifMatch : false,
      result
    });
  }

  // ❌ NO RULE MATCHED
  if (matchedRules === 0) {
    return {
      status: "BLOCK",
      violations: [],
      reason: "NO_APPLICABLE_RULE",
      meta: {
        no_rule_matched: true,
        trace
      }
    };
  }

  // ❌ BLOCK
  if (violations.some(v => v.enforcement === "BLOCK")) {
    return {
      status: "BLOCK",
      violations,
      reason: "RULE_VIOLATION_BLOCK",
      meta: {
        violated_rules: violations.map(v => v.rule_id),
        trace
      }
    };
  }

  // ⚠️ REQUIRE OVERRIDE
  if (violations.length > 0) {
    return {
      status: "REQUIRE_OVERRIDE",
      violations,
      reason: "RULE_VIOLATION_OVERRIDE",
      meta: {
        violated_rules: violations.map(v => v.rule_id),
        trace
      }
    };
  }

  // ✅ ALLOW
  return {
    status: "ALLOW",
    violations: [],
    reason: "ALL_RULES_PASSED",
    meta: {
      trace
    }
  };
}

module.exports = { evaluate };