import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../services/api"
import ProtectedRoute from "../components/ProtectedRoute"
import "../styles/bookGrid.css"

const MyReviewsContent = () => {
  const [reviews, setReviews] = useState([])
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const reviewsResponse = await api.get("/reviews/me")
      setReviews(reviewsResponse.data)
    } catch (error) {
      console.error("ERROR FETCH MY REVIEWS:", error)
      setMessage("Erro ao carregar reviews.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDelete = async (id) => {
    setMessage("")

    try {
      await api.delete(`/reviews/${id}`)
      setReviews((prev) => prev.filter((review) => review.id !== id))
      setMessage("Review removida com sucesso.")
    } catch (error) {
      console.error("ERROR DELETE REVIEW:", error)
      setMessage("Erro ao remover review.")
    }
  }

  if (loading) {
    return <p>A carregar...</p>
  }

  return (
    <div className="book-grid-layout">
      <div className="book-grid-panel">
        <div className="book-grid-header">
          <div>
            <h1>Minhas Reviews</h1>
            <p>As tuas opiniões sobre os livros que já leste.</p>
          </div>
        </div>

        {message && <div className="message-box">{message}</div>}

        {reviews.length === 0 ? (
          <p className="empty-state">Ainda não criaste reviews.</p>
        ) : (
          <div className="cover-grid">
            {reviews.map((review) => (
              <article className="cover-card" key={review.id}>
                <div className="cover-image-wrap">
                  <Link to={`/books/${review.book_id}`}>
                    {review.book_cover_url ? (
                      <img src={review.book_cover_url} alt={review.book_title} />
                    ) : (
                      <div style={{ padding: "1rem", color: "#7c6f98" }}>Sem capa</div>
                    )}
                  </Link>
                </div>

                <div className="cover-content">
                  <Link
                    to={`/books/${review.book_id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <h3 className="cover-title">{review.book_title}</h3>
                  </Link>

                  <p className="cover-author">{review.book_author}</p>

                  <div className="cover-meta">⭐ {review.rating}/5</div>

                  <p style={{ fontWeight: "700", margin: "8px 0 6px", color: "#3a2d53" }}>
                    {review.title}
                  </p>

                  <p className="muted" style={{ marginBottom: "12px" }}>
                    {review.content}
                  </p>

                  <div className="cover-actions">
                    <button
                      className="small-btn secondary"
                      onClick={() => handleDelete(review.id)}
                    >
                      Apagar
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

const MyReviews = () => {
  return (
    <ProtectedRoute>
      <MyReviewsContent />
    </ProtectedRoute>
  )
}

export default MyReviews