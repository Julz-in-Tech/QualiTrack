const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const { verifyPassword } = require("../utils/passwords");

async function login(req, res, next) {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required.",
    });
  }

  try {
    const result = await pool.query(
      `
        SELECT id, full_name, email, role, password_hash
        FROM users
        WHERE LOWER(email) = $1
        LIMIT 1
      `,
      [email],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const user = result.rows[0];
    const isValid = verifyPassword(password, user.password_hash, user.email);

    if (!isValid) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "qualitrack_secret_key",
      { expiresIn: "24h" }
    );

    return res.json({
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error); // This helps you see why it's a 500
    return next(error);
  }
}

module.exports = {
  login,
};
