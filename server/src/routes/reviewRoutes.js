const express = require("express")
const authMiddleware = require("../middlewares/authMiddleware")
const {
  getAllReviews,
  getMyReviews,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController")

const router = express.Router()

router.get("/", getAllReviews)
router.get("/me", authMiddleware, getMyReviews)
router.post("/", authMiddleware, createReview)
router.put("/:id", authMiddleware, updateReview)
router.delete("/:id", authMiddleware, deleteReview)

module.exports = router