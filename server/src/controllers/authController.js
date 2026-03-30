const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { validationResult } = require("express-validator")
const db = require("../config/db")

const register = async (req, res) => {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      })
    }

    const { name, email, password, phone } = req.body

    const [existingUsers] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    )

    if (existingUsers.length > 0) {
      return res.status(409).json({
        message: "Email já registado.",
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const [result] = await db.query(
      `
      INSERT INTO users (name, email, password_hash, phone, role_id, is_active)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [name, email, hashedPassword, phone || null, 2, true]
    )

    return res.status(201).json({
      message: "Utilizador criado com sucesso.",
      user: {
        id: result.insertId,
        name,
        email,
        phone: phone || null,
        role_id: 2,
      },
    })
  } catch (error) {
    console.error("REGISTER ERROR:", error)
    return res.status(500).json({
      message: "Erro interno no registo.",
    })
  }
}

const login = async (req, res) => {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      })
    }

    const { email, password } = req.body

    const [users] = await db.query(
      `
      SELECT id, name, email, password_hash, role_id, is_active
      FROM users
      WHERE email = ?
      `,
      [email]
    )

    if (users.length === 0) {
      return res.status(401).json({
        message: "Credenciais inválidas.",
      })
    }

    const user = users[0]

    if (!user.is_active) {
      return res.status(403).json({
        message: "Conta desativada.",
      })
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash)

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Credenciais inválidas.",
      })
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role_id: user.role_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )

    return res.status(200).json({
      message: "Login com sucesso.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role_id: user.role_id,
      },
    })
  } catch (error) {
    console.error("LOGIN ERROR:", error)
    return res.status(500).json({
      message: "Erro interno no login.",
    })
  }
}

module.exports = {
  register,
  login,
}