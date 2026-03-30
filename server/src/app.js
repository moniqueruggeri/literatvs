const express = require("express")
const cors = require("cors")
const db = require("./config/db")
const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")
const bookRoutes = require("./routes/bookRoutes")
const userBookRoutes = require("./routes/userBookRoutes")
const reviewRoutes = require("./routes/reviewRoutes")
const listRoutes = require("./routes/listRoutes")
const adminRoutes = require("./routes/adminRoutes")

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.json({ message: "Literatvs API running" })
})

app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SHOW TABLES")
    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Database connection failed" })
  }
})

app.use("/auth", authRoutes)
app.use("/users", userRoutes)
app.use("/books", bookRoutes)
app.use("/user-books", userBookRoutes)
app.use("/reviews", reviewRoutes)
app.use("/lists", listRoutes)
app.use("/admin", adminRoutes)

module.exports = app