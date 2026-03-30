const express = require("express")
const authMiddleware = require("../middlewares/authMiddleware")
const {
  getMyLibrary,
  addBookToLibrary,
  updateLibraryBook,
  removeBookFromLibrary,
} = require("../controllers/userBookController")

const router = express.Router()

router.get("/", authMiddleware, getMyLibrary)
router.post("/", authMiddleware, addBookToLibrary)
router.put("/:id", authMiddleware, updateLibraryBook)
router.delete("/:id", authMiddleware, removeBookFromLibrary)

module.exports = router