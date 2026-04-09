\# DIP Runtime



Execution layer for DIP Core.



\---



\## 🧠 Overview



DIP Runtime loads rules, validates them, and executes decisions using DIP Core.





run(input) → decision





It acts as the bridge between raw rules and the core decision engine.



\---



\## ⚙️ Installation



```bash

npm install dip-runtime

📦 Usage

const { run } = require("dip-runtime");



const input = {

&#x20; action: { type: "DELETE\_USER" },

&#x20; context: { role: "user" }

};



const decision = run(input);



console.log(decision);

🔁 What It Does

Loads rules from rules.json

Validates rule structure

Caches rules for performance

Calls DIP Core (evaluate)

Returns decision

📁 Structure

runner.js      → executes decision

ruleLoader.js  → loads + validates rules

rules.json     → rule definitions

📜 Rules



Rules are defined in rules.json.



Example:



\[

&#x20; {

&#x20;   "id": "ONLY\_ADMIN\_CAN\_DELETE",

&#x20;   "when": { "action.type": "DELETE\_USER" },

&#x20;   "if": { "context.role": { "not\_equals": "admin" } },

&#x20;   "then": {

&#x20;     "message": "Only admin can delete users",

&#x20;     "enforcement": "BLOCK"

&#x20;   }

&#x20; }

]

🔒 Safety Features

Rule validation (missing fields, duplicates)

Deep-freeze protection (rules cannot be mutated)

Error sanitization (no internal errors leaked)

⚠️ Important Notes

Does NOT enforce decisions

Does NOT execute business logic

Does NOT interact with DB or APIs



It only returns a decision.



❗ Error Handling



Internal errors from DIP Core are caught and converted into:



Decision evaluation failed

🧠 Design Philosophy

Runtime executes decisions.

It does not act on them.

🧩 Role in Architecture

dip-core     → decision engine

dip-runtime  → rule execution layer

dip-system   → enforcement + real-world actions

💡 One-Line Summary



A safe execution layer that turns rules into decisions using DIP Core.

