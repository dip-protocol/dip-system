const { deleteUser } = require("./service");

function validateRequest(req) {
  if (!req.userId) throw new Error("Missing userId");
  if (!req.role) throw new Error("Missing role");
}

async function handleDelete(req) {
  try {
    validateRequest(req);

    const { userId, role } = req;

    await deleteUser(userId, { role });

    console.log("Success");
  } catch (err) {
    console.log(err.message);
  }
}

module.exports = { handleDelete };