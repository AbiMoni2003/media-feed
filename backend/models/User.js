const db = require("../config/db");

const User = {
  createUser: async (email, hashedPassword) => {
    const sql = "INSERT INTO users (email, password) VALUES (?, ?)";
    const [result] = await db.execute(sql, [email, hashedPassword]);
    return result;
  },
};

module.exports = User;
