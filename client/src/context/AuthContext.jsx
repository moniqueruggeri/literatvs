import { createContext, useContext, useEffect, useState } from "react"
import api from "../services/api"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const register = async (formData) => {
    const response = await api.post("/auth/register", formData)
    return response.data
  }

  const login = async (formData) => {
    const response = await api.post("/auth/login", formData)

    localStorage.setItem("token", response.data.token)
    setUser(response.data.user)

    return response.data
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  const fetchMe = async () => {
    try {
      const response = await api.get("/users/me")
      setUser(response.data)
    } catch (error) {
      localStorage.removeItem("token")
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (token) {
      fetchMe()
    } else {
      setLoading(false)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        fetchMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)