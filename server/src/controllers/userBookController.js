const db = require("../config/db");

const getMyLibrary = async (req, res) => {
  try {
    const userId = req.user.id;

    const [books] = await db.query(
      `
      SELECT 
  user_books.id,
  user_books.reading_status,
  user_books.progress,
  user_books.rating,
  user_books.start_date,
  user_books.end_date,
  user_books.notes,
        books.id AS book_id,
        books.title,
        books.author,
        books.genre,
        books.cover_url
      FROM user_books
      INNER JOIN books ON user_books.book_id = books.id
      WHERE user_books.user_id = ?
      ORDER BY user_books.id DESC
      `,
      [userId]
    );

    res.json(books);
  } catch (error) {
    console.error("GET MY LIBRARY ERROR:", error);
    res.status(500).json({ message: "Erro ao buscar biblioteca." });
  }
};

const addBookToLibrary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { book_id, reading_status, rating, start_date, end_date, notes } =
      req.body;

    const [existing] = await db.query(
      `
      SELECT id
      FROM user_books
      WHERE user_id = ? AND book_id = ?
      `,
      [userId, book_id]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        message: "Este livro já está na biblioteca do utilizador.",
      });
    }

    const [result] = await db.query(
      `
      INSERT INTO user_books
(user_id, book_id, reading_status, progress, rating, start_date, end_date, notes)
VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        userId,
        book_id,
        reading_status || "quero_ler",
        reading_status === "lido" ? 100 : 0,
        rating || null,
        start_date || null,
        end_date || null,
        notes || null,
      ]
    );

    res.status(201).json({
      message: "Livro adicionado à biblioteca com sucesso.",
      id: result.insertId,
    });
  } catch (error) {
    console.error("ADD BOOK TO LIBRARY ERROR:", error);
    res.status(500).json({ message: "Erro ao adicionar livro à biblioteca." });
  }
};

const updateLibraryBook = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { reading_status, progress, rating, start_date, end_date, notes } =
      req.body;

    const [existing] = await db.query(
      `
      SELECT id
      FROM user_books
      WHERE id = ? AND user_id = ?
      `,
      [id, userId]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        message: "Livro da biblioteca não encontrado.",
      });
    }

    let finalProgress = progress ?? 0;
    let finalEndDate = end_date || null;

    if (reading_status === "quero_ler") {
      finalProgress = 0;
      finalEndDate = null;
    }

    if (reading_status === "lendo") {
      if (finalProgress >= 100 || finalProgress === 0) {
        finalProgress = 1;
      }
      finalEndDate = null;
    }

    if (reading_status === "lido") {
      finalProgress = 100;
      finalEndDate = new Date().toISOString().split("T")[0];
    }

    await db.query(
      `
      UPDATE user_books
      SET reading_status = ?, progress = ?, rating = ?, start_date = ?, end_date = ?, notes = ?
      WHERE id = ? AND user_id = ?
      `,
      [
        reading_status,
        finalProgress,
        rating || null,
        start_date || null,
        finalEndDate,
        notes || null,
        id,
        userId,
      ]
    );

    res.json({
      message: "Livro da biblioteca atualizado com sucesso.",
    });
  } catch (error) {
    console.error("UPDATE LIBRARY BOOK ERROR:", error);
    res.status(500).json({ message: "Erro ao atualizar livro da biblioteca." });
  }
};

const removeBookFromLibrary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const removeFromLists = req.query.removeFromLists === "true";

    const [existing] = await db.query(
      `
      SELECT id, book_id
      FROM user_books
      WHERE id = ? AND user_id = ?
      `,
      [id, userId]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        message: "Livro da biblioteca não encontrado.",
      });
    }

    const bookId = existing[0].book_id;

    if (removeFromLists) {
      await db.query(
        `
        DELETE lb
        FROM list_books lb
        INNER JOIN lists l ON lb.list_id = l.id
        WHERE lb.book_id = ? AND l.user_id = ?
        `,
        [bookId, userId]
      );
    }

    await db.query(
      `
      DELETE FROM user_books
      WHERE id = ? AND user_id = ?
      `,
      [id, userId]
    );

    res.json({
      message: removeFromLists
        ? "Livro removido da biblioteca e das listas."
        : "Livro removido da biblioteca com sucesso.",
    });
  } catch (error) {
    console.error("REMOVE BOOK FROM LIBRARY ERROR:", error);
    res.status(500).json({ message: "Erro ao remover livro da biblioteca." });
  }
};

module.exports = {
  getMyLibrary,
  addBookToLibrary,
  updateLibraryBook,
  removeBookFromLibrary,
};
