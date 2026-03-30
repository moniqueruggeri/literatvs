const express = require("express")
const authMiddleware = require("../middlewares/authMiddleware")
const {
  getAllBooks,
  getBookById,
  createBook,
  deleteBook,
  importAndAddBookToLibrary,
} = require("../controllers/bookController")

const router = express.Router()

router.get("/", getAllBooks)
router.get("/:id", getBookById)
router.post("/", authMiddleware, createBook)
router.post("/import-and-add", authMiddleware, importAndAddBookToLibrary)
router.delete("/:id", authMiddleware, deleteBook)

module.exports = router