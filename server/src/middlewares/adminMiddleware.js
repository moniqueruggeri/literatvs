const adminMiddleware = (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "Utilizador não autenticado.",
        })
      }
  
      if (req.user.role_id !== 1) {
        return res.status(403).json({
          message: "Acesso negado. Apenas administradores.",
        })
      }
  
      next()
    } catch (error) {
      return res.status(500).json({
        message: "Erro interno de autorização.",
      })
    }
  }
  
  module.exports = adminMiddleware