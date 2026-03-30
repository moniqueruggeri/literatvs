import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import "../styles/bookGrid.css";

const BookDetail = () => {
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [libraryBooks, setLibraryBooks] = useState([]);
  const [libraryItem, setLibraryItem] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    rating: 5,
    is_public: true,
  });

  const fetchBookData = async () => {
    try {
      const [bookRes, reviewsRes, libraryRes] = await Promise.all([
        api.get(`/books/${id}`),
        api.get("/reviews"),
        api.get("/user-books"),
      ]);

      setBook(bookRes.data);
      setLibraryBooks(libraryRes.data);

      const filteredReviews = reviewsRes.data.filter(
        (review) => Number(review.book_id) === Number(id)
      );
      setReviews(filteredReviews);

      const currentLibraryItem = libraryRes.data.find(
        (item) => Number(item.book_id) === Number(id)
      );

      setLibraryItem(currentLibraryItem || null);
    } catch (error) {
      console.error("ERROR FETCH BOOK DETAIL:", error);
      setMessage("Erro ao carregar detalhe do livro.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookData();
  }, [id]);

  const handleAddToLibrary = async () => {
    if (!book) return;
    setMessage("");

    try {
      await api.post("/books/import-and-add", {
        title: book.title,
        author: book.author,
        genre: book.genre,
        isbn: book.isbn,
        cover_url: book.cover_url,
        synopsis: book.synopsis,
      });

      setMessage("Livro adicionado à biblioteca com sucesso.");
      fetchBookData();
    } catch (error) {
      console.error("ERROR ADD BOOK FROM DETAIL:", error);
      setMessage(
        error.response?.data?.message || "Erro ao adicionar à biblioteca."
      );
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!libraryItem) return;
    setMessage("");

    let newProgress = libraryItem.progress ?? 0;
    let newEndDate = libraryItem.end_date || null;

    if (newStatus === "quero_ler") {
      newProgress = 0;
      newEndDate = null;
    }

    if (newStatus === "lendo") {
      if (newProgress === 0 || newProgress === 100) {
        newProgress = 1;
      }
      newEndDate = null;
    }

    if (newStatus === "lido") {
      newProgress = 100;
      newEndDate = new Date().toISOString().split("T")[0];
    }

    try {
      await api.put(`/user-books/${libraryItem.id}`, {
        reading_status: newStatus,
        progress: newProgress,
        rating: libraryItem.rating || null,
        start_date: libraryItem.start_date || null,
        end_date: newEndDate,
        notes: libraryItem.notes || "",
      });

      setLibraryItem((prev) =>
        prev
          ? {
              ...prev,
              reading_status: newStatus,
              progress: newProgress,
              end_date: newEndDate,
            }
          : prev
      );

      setMessage("Estado de leitura atualizado.");
      fetchBookData();
    } catch (error) {
      console.error("ERROR UPDATE STATUS:", error);
      setMessage("Erro ao atualizar estado de leitura.");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await api.post("/reviews", {
        book_id: Number(id),
        title: formData.title,
        content: formData.content,
        rating: Number(formData.rating),
        is_public: formData.is_public,
      });

      setMessage("Review criada com sucesso.");
      setFormData({
        title: "",
        content: "",
        rating: 5,
        is_public: true,
      });

      fetchBookData();
    } catch (error) {
      console.error("ERROR CREATE REVIEW:", error);
      setMessage(error.response?.data?.message || "Erro ao criar review.");
    }
  };

  if (loading) return <p>A carregar livro...</p>;
  if (!book) return <p>Livro não encontrado.</p>;

  const canReview = libraryItem?.reading_status === "lido";

  return (
    <div className="book-grid-layout">
      <div className="book-grid-panel">
        {message && <div className="message-box">{message}</div>}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "220px 1fr",
            gap: "24px",
            marginBottom: "24px",
          }}
        >
          <div className="cover-image-wrap" style={{ borderRadius: "24px" }}>
            {book.cover_url ? (
              <img src={book.cover_url} alt={book.title} />
            ) : (
              <div style={{ padding: "1rem", color: "#7c6f98" }}>Sem capa</div>
            )}
          </div>

          <div>
            <h1 className="section-title">{book.title}</h1>
            <p className="muted" style={{ marginTop: "-8px" }}>
              {book.author}
            </p>

            {book.genre && (
              <div className="cover-meta" style={{ marginBottom: "14px" }}>
                {book.genre}
              </div>
            )}

            {book.synopsis ? (
              <div style={{ marginTop: "16px" }}>
                <h3
                  style={{
                    fontSize: "0.9rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    color: "#7c6f98",
                    marginBottom: "8px",
                  }}
                >
                  Sinopse
                </h3>

                <p
                  style={{
                    lineHeight: 1.7,
                    color: "#3a2d53",
                    maxWidth: "600px",
                  }}
                >
                  {book.synopsis}
                </p>
              </div>
            ) : (
              <div style={{ marginTop: "16px" }}>
                <h3
                  style={{
                    fontSize: "0.9rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    color: "#7c6f98",
                    marginBottom: "8px",
                  }}
                >
                  Sinopse
                </h3>

                <p
                  style={{
                    lineHeight: 1.7,
                    color: "#7c6f98",
                    maxWidth: "600px",
                  }}
                >
                  Sem sinopse disponível para este livro.
                </p>
              </div>
            )}
          </div>
        </div>

        <div
          className="page-card"
          style={{ padding: "20px", marginBottom: "20px" }}
        >
          <h2 className="section-title">Estado de leitura</h2>

          {!libraryItem ? (
            <>
              <p className="empty-state">
                Este livro não foi encontrado na tua biblioteca.
              </p>
              <button className="app-btn" onClick={handleAddToLibrary}>
                Adicionar à biblioteca
              </button>
            </>
          ) : (
            <>
              <p className="muted" style={{ marginBottom: "12px" }}>
                Estado atual: <strong>{libraryItem.reading_status}</strong>
              </p>

              <select
                value={libraryItem?.reading_status || "quero_ler"}
                onChange={(e) => handleStatusChange(e.target.value)}
                style={{
                  border: "1px solid #e2d4ff",
                  borderRadius: "12px",
                  padding: "10px 12px",
                  background: "#fcfaff",
                }}
              >
                <option value="quero_ler">Quero ler</option>
                <option value="lendo">A ler</option>
                <option value="lido">Lido</option>
              </select>

              {libraryItem && libraryItem.reading_status === "lendo" && (
                <div style={{ marginTop: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      color: "#5a4386",
                      fontWeight: "600",
                    }}
                  >
                    Progresso de leitura: {libraryItem.progress ?? 0}%
                  </label>

                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={libraryItem.progress ?? 1}
                    onChange={async (e) => {
                      const newProgress = Number(e.target.value);

                      const newStatus = newProgress === 100 ? "lido" : "lendo";

                      try {
                        await api.put(`/user-books/${libraryItem.id}`, {
                          reading_status: newStatus,
                          progress: newProgress,
                          rating: libraryItem.rating || null,
                          start_date: libraryItem.start_date || null,
                          end_date:
                            newStatus === "lido"
                              ? new Date().toISOString().split("T")[0]
                              : null,
                          notes: libraryItem.notes || "",
                        });

                        setLibraryItem((prev) =>
                          prev
                            ? {
                                ...prev,
                                reading_status: newStatus,
                                progress: newProgress,
                                end_date:
                                  newStatus === "lido"
                                    ? new Date().toISOString().split("T")[0]
                                    : null,
                              }
                            : prev
                        );
                      } catch (error) {
                        console.error("ERROR UPDATE PROGRESS:", error);
                        setMessage("Erro ao atualizar progresso.");
                      }
                    }}
                    style={{ width: "100%" }}
                  />

                  <div
                    style={{
                      width: "100%",
                      height: "10px",
                      background: "#f0e7ff",
                      borderRadius: "999px",
                      overflow: "hidden",
                      marginTop: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: `${libraryItem.progress ?? 0}%`,
                        height: "100%",
                        background: "#7dff2b",
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div
          className="page-card"
          style={{ padding: "20px", marginBottom: "20px" }}
        >
          <h2 className="section-title">Escrever review</h2>

          {!libraryItem ? (
            <p className="empty-state">
              Adiciona este livro à tua biblioteca primeiro.
            </p>
          ) : !canReview ? (
            <p className="empty-state">
              Marca este livro como <strong>lido</strong> para desbloquear a
              review.
            </p>
          ) : (
            <form className="app-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                placeholder="Título da review"
                value={formData.title}
                onChange={handleChange}
              />

              <textarea
                name="content"
                placeholder="Escreve a tua opinião sobre este livro"
                value={formData.content}
                onChange={handleChange}
                rows="5"
              />

              <input
                type="number"
                name="rating"
                min="1"
                max="5"
                value={formData.rating}
                onChange={handleChange}
              />

              <label
                style={{ display: "flex", gap: "8px", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  name="is_public"
                  checked={formData.is_public}
                  onChange={handleChange}
                />
                Tornar review pública
              </label>

              <button className="app-btn" type="submit">
                Publicar review
              </button>
            </form>
          )}
        </div>

        <div className="page-card" style={{ padding: "20px" }}>
          <h2 className="section-title">Reviews deste livro</h2>

          {reviews.length === 0 ? (
            <p className="empty-state">Ainda não há reviews para este livro.</p>
          ) : (
            <ul className="app-list">
              {reviews.map((review) => (
                <li className="app-list-item" key={review.id}>
                  <strong>{review.title}</strong>
                  <br />
                  <small>
                    Por {review.user_name} • {review.rating}/5
                  </small>
                  <p style={{ marginTop: "10px" }}>{review.content}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <aside className="side-summary">
        <div className="summary-card">
          <h3>Debug</h3>
          <ul className="summary-list">
            <li>Book route id: {id}</li>
            <li>Book loaded: {book ? "sim" : "não"}</li>
            <li>Itens na biblioteca: {libraryBooks.length}</li>
            <li>Encontrado na biblioteca: {libraryItem ? "sim" : "não"}</li>
            <li>
              Estado: {libraryItem ? libraryItem.reading_status : "nenhum"}
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default BookDetail;
