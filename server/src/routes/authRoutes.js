const express = require("express")
const { body } = require("express-validator")
const { register, login } = require("../controllers/authController")

const router = express.Router()

router.post(
  "/register",
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("O nome é obrigatório.")
      .isLength({ min: 2, max: 100 })
      .withMessage("O nome deve ter entre 2 e 100 caracteres."),
    body("email")
      .trim()
      .isEmail()
      .withMessage("Email inválido.")
      .normalizeEmail(),
    body("password")
      .isLength({ min: 8 })
      .withMessage("A password deve ter pelo menos 8 caracteres."),
    body("phone")
      .optional()
      .trim()
      .isLength({ max: 20 })
      .withMessage("Telefone inválido."),
  ],
  register
)

router.post(
  "/login",
  [
    body("email").trim().isEmail().withMessage("Email inválido.").normalizeEmail(),
    body("password").notEmpty().withMessage("A password é obrigatória."),
  ],
  login
)

module.exports = router