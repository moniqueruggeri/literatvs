const db = require("../config/db")

const getMe = async (req, res) => {
  try {
    const userId = req.user.id

    const [users] = await db.query(
      `
      SELECT id, name, email, phone, role_id, is_active, created_at
      FROM users
      WHERE id = ?
      `,
      [userId]
    )

    if (users.length === 0) {
      return res.status(404).json({
        message: "Utilizador não encontrado.",
      })
    }

    return res.status(200).json(users[0])
  } catch (error) {
    console.error("GET ME ERROR:", error)
    return res.status(500).json({
      message: "Erro interno ao buscar utilizador.",
    })
  }
}

module.exports = {
  getMe,
}