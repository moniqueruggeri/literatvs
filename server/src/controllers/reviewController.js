const db = require("../config/db")

const getAllReviews = async (req, res) => {
  try {
    const [reviews] = await db.query(
      `
      SELECT 
        reviews.id,
        reviews.title,
        reviews.content,
        reviews.rating,
        reviews.is_public,
        reviews.created_at,
        reviews.updated_at,
        users.id AS user_id,
        users.name AS user_name,
        books.id AS book_id,
        books.title AS book_title,
        books.author AS book_author
      FROM reviews
      INNER JOIN users ON reviews.user_id = users.id
      INNER JOIN books ON reviews.book_id = books.id
      WHERE reviews.is_public = true
      ORDER BY reviews.created_at DESC
      `
    )

    res.json(reviews)
  } catch (error) {
    console.error("GET ALL REVIEWS ERROR:", error)
    res.status(500).json({ message: "Erro ao buscar reviews." })
  }
}

const getMyReviews = async (req, res) => {
  try {
    const userId = req.user.id

    const [reviews] = await db.query(
      `
      SELECT 
        reviews.id,
        reviews.title,
        reviews.content,
        reviews.rating,
        reviews.is_public,
        reviews.created_at,
        reviews.updated_at,
        books.id AS book_id,
        books.title AS book_title,
        books.author AS book_author,
        books.cover_url AS book_cover_url
      FROM reviews
      INNER JOIN books ON reviews.book_id = books.id
      WHERE reviews.user_id = ?
      ORDER BY reviews.created_at DESC
      `,
      [userId]
    )

    res.json(reviews)
  } catch (error) {
    console.error("GET MY REVIEWS ERROR:", error)
    res.status(500).json({ message: "Erro ao buscar as reviews do utilizador." })
  }
}

const createReview = async (req, res) => {
  try {
    const userId = req.user.id
    const { book_id, title, content, rating, is_public } = req.body

    const [books] = await db.query(
      "SELECT id FROM books WHERE id = ?",
      [book_id]
    )

    if (books.length === 0) {
      return res.status(404).json({
        message: "Livro não encontrado.",
      })
    }

    const [result] = await db.query(
      `
      INSERT INTO reviews (user_id, book_id, title, content, rating, is_public)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [userId, book_id, title, content, rating, is_public ?? true]
    )

    res.status(201).json({
      message: "Review criada com sucesso.",
      id: result.insertId,
    })
  } catch (error) {
    console.error("CREATE REVIEW ERROR:", error)
    res.status(500).json({ message: "Erro ao criar review." })
  }
}

const updateReview = async (req, res) => {
  try {
    const userId = req.user.id
    const { id } = req.params
    const { title, content, rating, is_public } = req.body

    const [existing] = await db.query(
      `
      SELECT id
      FROM reviews
      WHERE id = ? AND user_id = ?
      `,
      [id, userId]
    )

    if (existing.length === 0) {
      return res.status(404).json({
        message: "Review não encontrada.",
      })
    }

    await db.query(
      `
      UPDATE reviews
      SET title = ?, content = ?, rating = ?, is_public = ?
      WHERE id = ? AND user_id = ?
      `,
      [title, content, rating, is_public ?? true, id, userId]
    )

    res.json({
      message: "Review atualizada com sucesso.",
    })
  } catch (error) {
    console.error("UPDATE REVIEW ERROR:", error)
    res.status(500).json({ message: "Erro ao atualizar review." })
  }
}

const deleteReview = async (req, res) => {
  try {
    const userId = req.user.id
    const { id } = req.params

    const [existing] = await db.query(
      `
      SELECT id
      FROM reviews
      WHERE id = ? AND user_id = ?
      `,
      [id, userId]
    )

    if (existing.length === 0) {
      return res.status(404).json({
        message: "Review não encontrada.",
      })
    }

    await db.query(
      `
      DELETE FROM reviews
      WHERE id = ? AND user_id = ?
      `,
      [id, userId]
    )

    res.json({
      message: "Review removida com sucesso.",
    })
  } catch (error) {
    console.error("DELETE REVIEW ERROR:", error)
    res.status(500).json({ message: "Erro ao remover review." })
  }
}

module.exports = {
  getAllReviews,
  getMyReviews,
  createReview,
  updateReview,
  deleteReview,
}