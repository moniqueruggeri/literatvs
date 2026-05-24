import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Profile = () => {
  const { user, logout, loading } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }
 
  if (loading) {
    return <p>A carregar...</p>
  }

  if (!user) {
    return <p>Utilizador não autenticado.</p>
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Perfil</h1>

      <p><strong>Nome:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Telefone:</strong> {user.phone || "—"}</p>
      <p><strong>Role:</strong> {user.role_id}</p>

      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Profile