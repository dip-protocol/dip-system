const { run } = require("./index");

const input = {
  action: { type: "DELETE_USER" },
  context: { role: "user" }
};

const decision = run(input);

console.log(decision);