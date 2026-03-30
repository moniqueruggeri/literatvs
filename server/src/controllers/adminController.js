const db = require("../config/db")

const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      `
      SELECT id, name, email, phone, role_id, is_active, created_at
      FROM users
      ORDER BY id ASC
      `
    )

    res.json(users)
  } catch (error) {
    console.error("GET ALL USERS ERROR:", error)
    res.status(500).json({ message: "Erro ao buscar utilizadores." })
  }
}

const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { is_active } = req.body

    const [existing] = await db.query(
      `
      SELECT id
      FROM users
      WHERE id = ?
      `,
      [id]
    )

    if (existing.length === 0) {
      return res.status(404).json({
        message: "Utilizador não encontrado.",
      })
    }

    await db.query(
      `
      UPDATE users
      SET is_active = ?
      WHERE id = ?
      `,
      [is_active, id]
    )

    res.json({
      message: "Estado do utilizador atualizado com sucesso.",
    })
  } catch (error) {
    console.error("UPDATE USER STATUS ERROR:", error)
    res.status(500).json({ message: "Erro ao atualizar utilizador." })
  }
}

const deleteAnyReview = async (req, res) => {
  try {
    const { id } = req.params

    const [existing] = await db.query(
      `
      SELECT id
      FROM reviews
      WHERE id = ?
      `,
      [id]
    )

    if (existing.length === 0) {
      return res.status(404).json({
        message: "Review não encontrada.",
      })
    }

    await db.query(
      `
      DELETE FROM reviews
      WHERE id = ?
      `,
      [id]
    )

    res.json({
      message: "Review removida com sucesso pelo administrador.",
    })
  } catch (error) {
    console.error("DELETE ANY REVIEW ERROR:", error)
    res.status(500).json({ message: "Erro ao remover review." })
  }
}

module.exports = {
  getAllUsers,
  updateUserStatus,
  deleteAnyReview,
}