const db = require("../config/db")

const getAllBooks = async (req, res) => {
  try {
    const [books] = await db.query("SELECT * FROM books ORDER BY id DESC")
    res.json(books)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Erro ao buscar livros" })
  }
}

const getBookById = async (req, res) => {
  try {
    const { id } = req.params

    const [books] = await db.query(
      "SELECT * FROM books WHERE id = ? LIMIT 1",
      [id]
    )

    if (books.length === 0) {
      return res.status(404).json({ message: "Livro não encontrado." })
    }

    res.json(books[0])
  } catch (error) {
    console.error("GET BOOK BY ID ERROR:", error)
    res.status(500).json({ message: "Erro ao buscar livro." })
  }
}

const createBook = async (req, res) => {
  try {
    const { title, author, genre, isbn, cover_url, synopsis } = req.body

    const [result] = await db.query(
      `
      INSERT INTO books (title, author, isbn, genre, synopsis, cover_url)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        title,
        author,
        isbn || null,
        genre || null,
        synopsis || null,
        cover_url || null,
      ]
    )

    res.status(201).json({
      id: result.insertId,
      title,
      author,
      genre,
      isbn: isbn || null,
      synopsis: synopsis || null,
      cover_url: cover_url || null,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Erro ao criar livro" })
  }
}

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params

    await db.query("DELETE FROM books WHERE id = ?", [id])

    res.json({ message: "Livro removido" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Erro ao remover livro" })
  }
}

const importAndAddBookToLibrary = async (req, res) => {
  try {
    const userId = req.user.id
    const { title, author, genre, isbn, cover_url, synopsis } = req.body

    if (!title || !author) {
      return res.status(400).json({
        message: "Título e autor são obrigatórios.",
      })
    }

    let existingBook = []

    if (isbn) {
      const [byIsbn] = await db.query(
        "SELECT id FROM books WHERE isbn = ? LIMIT 1",
        [isbn]
      )
      existingBook = byIsbn
    }

    if (existingBook.length === 0) {
      const [byTitleAuthor] = await db.query(
        "SELECT id FROM books WHERE title = ? AND author = ? LIMIT 1",
        [title, author]
      )
      existingBook = byTitleAuthor
    }

    let bookId

    if (existingBook.length > 0) {
      bookId = existingBook[0].id
    } else {
      const [insertBook] = await db.query(
        `
        INSERT INTO books (title, author, isbn, genre, synopsis, cover_url)
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          title,
          author,
          isbn || null,
          genre || null,
          synopsis || null,
          cover_url || null,
        ]
      )

      bookId = insertBook.insertId
    }

    const [existingLibraryItem] = await db.query(
      `
      SELECT id
      FROM user_books
      WHERE user_id = ? AND book_id = ?
      `,
      [userId, bookId]
    )

    if (existingLibraryItem.length > 0) {
      return res.status(409).json({
        message: "Este livro já está na tua biblioteca.",
      })
    }

    await db.query(
      `
      INSERT INTO user_books
      (user_id, book_id, reading_status, rating, start_date, end_date, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [userId, bookId, "quero_ler", null, null, null, null]
    )

    res.status(201).json({
      message: "Livro importado e adicionado à biblioteca com sucesso.",
      book_id: bookId,
    })
  } catch (error) {
    console.error("IMPORT AND ADD BOOK ERROR:", error)
    res.status(500).json({
      message: "Erro ao importar e adicionar livro.",
    })
  }
}

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  deleteBook,
  importAndAddBookToLibrary,
}