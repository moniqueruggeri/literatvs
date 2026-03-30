const express = require("express")
const authMiddleware = require("../middlewares/authMiddleware")
const { getMe } = require("../controllers/userController")

const router = express.Router()

router.get("/me", authMiddleware, getMe)

module.exports = router