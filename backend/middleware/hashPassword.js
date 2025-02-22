const bcrypt = require("bcryptjs");

const hashPassword = async (req, res, next) => {
  try {
    if (!req.body.password) return res.status(400).json({ message: "Password is required" });
    req.body.password = await bcrypt.hash(req.body.password, 10); 
    next();
  } catch (error) {
    res.status(500).json({ error: "Error hashing password" });
  }
};

module.exports = hashPassword;
