const db = require("../config/db");

const getMyLists = async (req, res) => {
  try {
    const userId = req.user.id;

    const [lists] = await db.query(
      `
      SELECT id, name, description, is_public, created_at
      FROM lists
      WHERE user_id = ?
      ORDER BY created_at DESC
      `,
      [userId]
    );

    res.json(lists);
  } catch (error) {
    console.error("GET MY LISTS ERROR:", error);
    res.status(500).json({ message: "Erro ao buscar listas." });
  }
};

const createList = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description, is_public } = req.body;

    const [result] = await db.query(
      `
      INSERT INTO lists (user_id, name, description, is_public)
      VALUES (?, ?, ?, ?)
      `,
      [userId, name, description || null, is_public ?? true]
    );

    res.status(201).json({
      message: "Lista criada com sucesso.",
      id: result.insertId,
    });
  } catch (error) {
    console.error("CREATE LIST ERROR:", error);
    res.status(500).json({ message: "Erro ao criar lista." });
  }
};

const updateList = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { name, description, is_public } = req.body;

    const [existing] = await db.query(
      `
      SELECT id
      FROM lists
      WHERE id = ? AND user_id = ?
      `,
      [id, userId]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        message: "Lista não encontrada.",
      });
    }

    await db.query(
      `
      UPDATE lists
      SET name = ?, description = ?, is_public = ?
      WHERE id = ? AND user_id = ?
      `,
      [name, description || null, is_public ?? true, id, userId]
    );

    res.json({
      message: "Lista atualizada com sucesso.",
    });
  } catch (error) {
    console.error("UPDATE LIST ERROR:", error);
    res.status(500).json({ message: "Erro ao atualizar lista." });
  }
};

const deleteList = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const [existing] = await db.query(
      `
      SELECT id
      FROM lists
      WHERE id = ? AND user_id = ?
      `,
      [id, userId]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        message: "Lista não encontrada.",
      });
    }

    await db.query("DELETE FROM list_books WHERE list_id = ?", [id]);
    await db.query("DELETE FROM lists WHERE id = ? AND user_id = ?", [
      id,
      userId,
    ]);

    res.json({
      message: "Lista removida com sucesso.",
    });
  } catch (error) {
    console.error("DELETE LIST ERROR:", error);
    res.status(500).json({ message: "Erro ao remover lista." });
  }
};

const addBookToList = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { book_id } = req.body;

    const [lists] = await db.query(
      `
      SELECT id
      FROM lists
      WHERE id = ? AND user_id = ?
      `,
      [id, userId]
    );

    if (lists.length === 0) {
      return res.status(404).json({
        message: "Lista não encontrada.",
      });
    }

    const [books] = await db.query(
      `
      SELECT id
      FROM books
      WHERE id = ?
      `,
      [book_id]
    );

    if (books.length === 0) {
      return res.status(404).json({
        message: "Livro não encontrado.",
      });
    }

    const [existing] = await db.query(
      `
      SELECT id
      FROM list_books
      WHERE list_id = ? AND book_id = ?
      `,
      [id, book_id]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        message: "Este livro já está na lista.",
      });
    }

    await db.query(
      `
      INSERT INTO list_books (list_id, book_id)
      VALUES (?, ?)
      `,
      [id, book_id]
    );

    res.status(201).json({
      message: "Livro adicionado à lista com sucesso.",
    });
  } catch (error) {
    console.error("ADD BOOK TO LIST ERROR:", error);
    res.status(500).json({ message: "Erro ao adicionar livro à lista." });
  }
};

const getBooksFromList = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const [lists] = await db.query(
      `
      SELECT id, name, description, is_public
      FROM lists
      WHERE id = ? AND user_id = ?
      `,
      [id, userId]
    );

    if (lists.length === 0) {
      return res.status(404).json({
        message: "Lista não encontrada.",
      });
    }

    const [books] = await db.query(
      `
      SELECT 
        books.id,
        books.title,
        books.author,
        books.genre,
        books.cover_url
      FROM list_books
      INNER JOIN books ON list_books.book_id = books.id
      WHERE list_books.list_id = ?
      ORDER BY books.title ASC
      `,
      [id]
    );

    res.json({
      list: lists[0],
      books,
    });
  } catch (error) {
    console.error("GET BOOKS FROM LIST ERROR:", error);
    res.status(500).json({ message: "Erro ao buscar livros da lista." });
  }
};

const removeBookFromList = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id, bookId } = req.params;

    const [lists] = await db.query(
      `
      SELECT id
      FROM lists
      WHERE id = ? AND user_id = ?
      `,
      [id, userId]
    );

    if (lists.length === 0) {
      return res.status(404).json({
        message: "Lista não encontrada.",
      });
    }

    const [existing] = await db.query(
      `
      SELECT id
      FROM list_books
      WHERE list_id = ? AND book_id = ?
      `,
      [id, bookId]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        message: "Livro não encontrado na lista.",
      });
    }

    await db.query(
      `
      DELETE FROM list_books
      WHERE list_id = ? AND book_id = ?
      `,
      [id, bookId]
    );

    res.json({
      message: "Livro removido da lista com sucesso.",
    });
  } catch (error) {
    console.error("REMOVE BOOK FROM LIST ERROR:", error);
    res.status(500).json({ message: "Erro ao remover livro da lista." });
  }
};

const getListsWithBooks = async (req, res) => {
  try {
    const userId = req.user.id

    const [lists] = await db.query(
      `
      SELECT id, name, description, is_public, created_at
      FROM lists
      WHERE user_id = ?
      ORDER BY created_at DESC
      `,
      [userId]
    )

    const result = []

    for (const list of lists) {
      const [books] = await db.query(
        `
        SELECT 
          books.id,
          books.title,
          books.cover_url
        FROM list_books
        INNER JOIN books ON list_books.book_id = books.id
        WHERE list_books.list_id = ?
        ORDER BY books.title ASC
        `,
        [list.id]
      )

      result.push({
        ...list,
        books,
      })
    }

    res.json(result)
  } catch (error) {
    console.error("GET LISTS WITH BOOKS ERROR:", error)
    res.status(500).json({ message: "Erro ao buscar listas com livros." })
  }
}

module.exports = {
  getMyLists,
  createList,
  updateList,
  deleteList,
  addBookToList,
  getBooksFromList,
  removeBookFromList,
  getListsWithBooks,
}
