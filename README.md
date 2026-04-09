\# DIP System



Application layer that enforces decisions from DIP.



\---



\## 🧠 Overview



DIP System connects real-world actions to a deterministic decision engine.



It:



\- Builds structured input

\- Calls DIP Runtime

\- Enforces decisions

\- Executes real actions



\---



\## 🔁 Flow





Request → Controller → Service → run() → enforce() → execute()





\---



\## 🧭 Architecture



> DIP ensures that no action is executed without passing through a deterministic decision layer.



```mermaid

flowchart TD



subgraph System Layer

A\[Request]

B\[Controller]

C\[Service]

G\[Enforce]

H\[Execute]

end



subgraph Runtime Layer

D\[run()]

end



subgraph Core Layer

E\[evaluate()]

end



A --> B --> C --> D --> E --> F\[Decision] --> G

G -->|ALLOW| H

G -->|BLOCK| I\[Stop Execution]

G -->|REQUIRE\_OVERRIDE| J\[Escalate]

📦 Example

const { run } = require("dip-runtime");

const { enforce } = require("./enforce");



async function deleteUser(userId, role) {

&#x20; const input = {

&#x20;   action: { type: "DELETE\_USER" },

&#x20;   context: { role },

&#x20;   data: { userId }

&#x20; };



&#x20; const decision = run(input);



&#x20; enforce(decision);



&#x20; return deleteUserFromDB(userId);

}

🔒 Enforcement Rule

No action without enforcement



All sensitive operations MUST follow:



const decision = run(input);



enforce(decision);



execute();

📁 Structure

service.js    → business logic + enforcement

controller.js → request validation

app.js        → test harness

enforce.js    → enforcement logic

🧱 Responsibilities

Controller

Validates incoming request

Extracts required fields

Service

Builds DIP input

Calls runtime (run)

Enforces decision

Executes action

Enforce

Converts decision → control

Blocks or allows execution

⚠️ Guarantees

No bypass of decision checks

All actions gated by DIP

Invalid input fails early

Errors are controlled and consistent

Deterministic behavior

❌ What It Does NOT Do

Does not define rules

Does not evaluate rules (handled by runtime/core)

Does not mutate decision logic

🧠 Design Philosophy

DIP decides.

System enforces.

Reality follows.

🧩 Role in Architecture

dip-core     → decision engine

dip-runtime  → rule execution

dip-system   → enforcement + execution

💡 One-Line Summary



The layer where decisions become real-world actions.

