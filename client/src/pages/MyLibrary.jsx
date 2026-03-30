import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import api from "../services/api"
import ProtectedRoute from "../components/ProtectedRoute"
import "../styles/bookGrid.css"

const MyLibraryContent = () => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [filter, setFilter] = useState("all")

  const fetchLibrary = async () => {
    try {
      const response = await api.get("/user-books")
      setBooks(response.data)
    } catch (error) {
      console.error("ERROR FETCH LIBRARY:", error)
      setMessage("Erro ao carregar biblioteca.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLibrary()
  }, [])

  const handleRemove = async (id) => {
    setMessage("")
  
    const confirmed = window.confirm(
      "Ao clicar em OK, este livro será removido da biblioteca e também de todas as tuas listas."
    )
  
    if (!confirmed) {
      return
    }
  
    try {
      await api.delete(`/user-books/${id}?removeFromLists=true`)
  
      setBooks((prev) => prev.filter((book) => book.id !== id))
      setMessage("Livro removido da biblioteca e das listas.")
    } catch (error) {
      console.error("ERROR REMOVE LIBRARY BOOK:", error)
      setMessage("Erro ao remover livro da biblioteca.")
    }
  }

  const filteredBooks = useMemo(() => {
    if (filter === "all") return books
    return books.filter((book) => book.reading_status === filter)
  }, [books, filter])

  const stats = useMemo(() => {
    return {
      total: books.length,
      quero_ler: books.filter((b) => b.reading_status === "quero_ler").length,
      lendo: books.filter((b) => b.reading_status === "lendo").length,
      lido: books.filter((b) => b.reading_status === "lido").length,
    }
  }, [books])

  if (loading) {
    return <p>A carregar biblioteca...</p>
  }

  return (
    <div className="book-grid-layout">
      <div className="book-grid-panel">
        <div className="book-grid-header">
          <div>
            <h1>Minha Biblioteca</h1>
            <p>Organiza os teus livros por estado de leitura.</p>
          </div>
        </div>

        {message && <div className="message-box">{message}</div>}

        <div className="filter-chips">
          <button
            className={`filter-chip ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            Todas
          </button>
          <button
            className={`filter-chip ${filter === "quero_ler" ? "active" : ""}`}
            onClick={() => setFilter("quero_ler")}
          >
            Quero ler
          </button>
          <button
            className={`filter-chip ${filter === "lendo" ? "active" : ""}`}
            onClick={() => setFilter("lendo")}
          >
            A ler
          </button>
          <button
            className={`filter-chip ${filter === "lido" ? "active" : ""}`}
            onClick={() => setFilter("lido")}
          >
            Lidos
          </button>
        </div>

        {filteredBooks.length === 0 ? (
          <p className="empty-state">A tua biblioteca está vazia neste filtro.</p>
        ) : (
          <div className="cover-grid">
            {filteredBooks.map((item) => (
              <article className="cover-card" key={item.id}>
                <div className="cover-image-wrap">
                  <Link to={`/books/${item.book_id}`}>
                    {item.cover_url ? (
                      <img src={item.cover_url} alt={item.title} />
                    ) : (
                      <div style={{ padding: "1rem", color: "#7c6f98" }}>
                        Sem capa
                      </div>
                    )}
                  </Link>
                </div>

                <div className="cover-content">
                  <Link
                    to={`/books/${item.book_id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <h3 className="cover-title">{item.title}</h3>
                  </Link>

                  <p className="cover-author">{item.author}</p>

                  <div className="cover-meta">
                    {item.reading_status === "quero_ler" && "📚 Quero ler"}
                    {item.reading_status === "lendo" && "📖 A ler"}
                    {item.reading_status === "lido" && "✅ Lido"}
                  </div>

                  <div className="cover-actions">
                    <button
                      className="small-btn secondary"
                      onClick={() => handleRemove(item.id)}
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const MyLibrary = () => {
  return (
    <ProtectedRoute>
      <MyLibraryContent />
    </ProtectedRoute>
  )
}

export default MyLibrary