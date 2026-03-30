const express = require("express")
const authMiddleware = require("../middlewares/authMiddleware")
const adminMiddleware = require("../middlewares/adminMiddleware")
const {
  getAllUsers,
  updateUserStatus,
  deleteAnyReview,
} = require("../controllers/adminController")

const router = express.Router()

router.get("/users", authMiddleware, adminMiddleware, getAllUsers)
router.patch("/users/:id/status", authMiddleware, adminMiddleware, updateUserStatus)
router.delete("/reviews/:id", authMiddleware, adminMiddleware, deleteAnyReview)

module.exports = router