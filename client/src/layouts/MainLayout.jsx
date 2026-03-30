import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "./MainLayout.css"

const MainLayout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-logo">V</div>
          <h1>Literatvs</h1>
          <p>Your reading universe</p>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" end>Início</NavLink>
          <NavLink to="/my-library">Biblioteca</NavLink>
          <NavLink to="/my-reviews">Minhas Reviews</NavLink>
          <NavLink to="/lists">Listas</NavLink>
          <NavLink to="/profile">Perfil</NavLink>
        </nav>

        <div className="sidebar-footer">
          {user ? (
            <>
              <div className="user-chip">
                <div className="avatar">
                  {user?.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <div>
                  <strong>{user?.name || "Utilizador"}</strong>
                  <small>{user?.email || ""}</small>
                </div>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <div className="auth-links">
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Registo</NavLink>
            </div>
          )}
        </div>
      </aside>

      <main className="main-area">
        
        <section className="page-content">
          <Outlet />
        </section>
      </main>
    </div>
  )
}

export default MainLayout