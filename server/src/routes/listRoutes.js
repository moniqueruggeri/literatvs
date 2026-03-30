const express = require("express")
const authMiddleware = require("../middlewares/authMiddleware")
const {
  getMyLists,
  createList,
  updateList,
  deleteList,
  addBookToList,
  getBooksFromList,
  removeBookFromList,
  getListsWithBooks,
} = require("../controllers/listController")

const router = express.Router()

router.get("/", authMiddleware, getMyLists)
router.get("/with-books", authMiddleware, getListsWithBooks)
router.post("/", authMiddleware, createList)
router.put("/:id", authMiddleware, updateList)
router.delete("/:id", authMiddleware, deleteList)

router.get("/:id/books", authMiddleware, getBooksFromList)
router.post("/:id/books", authMiddleware, addBookToList)
router.delete("/:id/books/:bookId", authMiddleware, removeBookFromList)

module.exports = router