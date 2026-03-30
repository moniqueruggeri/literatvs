import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./Home.css";
import "../styles/bookGrid.css";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [currentlyReading, setCurrentlyReading] = useState([]);
  const [wantToRead, setWantToRead] = useState([]);
  const [finishedBooks, setFinishedBooks] = useState([]);
  const [latestReview, setLatestReview] = useState(null);
  const [listsWithBooks, setListsWithBooks] = useState([]);

  const fetchLibrary = async () => {
    try {
      const response = await api.get("/user-books");

      const readingNow = response.data.filter(
        (book) => book.reading_status === "lendo"
      );

      const want = response.data.filter(
        (book) => book.reading_status === "quero_ler"
      );

      const finished = response.data.filter(
        (book) => book.reading_status === "lido"
      );

      setCurrentlyReading(readingNow);
      setWantToRead(want);
      setFinishedBooks(finished);
    } catch (error) {
      console.error("ERROR FETCH LIBRARY:", error);
    }
  };

  const fetchLatestReview = async () => {
    try {
      const response = await api.get("/reviews/me");
      if (response.data.length > 0) {
        setLatestReview(response.data[0]);
      } else {
        setLatestReview(null);
      }
    } catch (error) {
      console.error("ERROR FETCH LATEST REVIEW:", error);
    }
  };

  const fetchListsWithBooks = async () => {
    try {
      const response = await api.get("/lists/with-books");
      setListsWithBooks(response.data);
    } catch (error) {
      console.error("ERROR FETCH LISTS WITH BOOKS:", error);
    }
  };

  useEffect(() => {
    fetchLibrary();
    fetchLatestReview();
    fetchListsWithBooks();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!query.trim()) {
      setMessage("Escreve algo para pesquisar.");
      return;
    }

    navigate(`/books?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="page-grid two">
      <div className="page-card">
        <h1 className="section-title">Olá{user ? `, ${user.name}` : ""} ✨</h1>
        <p className="muted">
          Pesquisa livros, adiciona à tua biblioteca e acompanha as tuas
          leituras.
        </p>

        <form
          onSubmit={handleSearch}
          className="inline-form"
          style={{ marginTop: "20px", marginBottom: "20px" }}
        >
          <input
            type="text"
            placeholder="Pesquisar por título, autor ou ISBN..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ minWidth: "260px" }}
          />
          <button className="app-btn" type="submit">
            Pesquisar
          </button>
        </form>

        {message && <div className="message-box">{message}</div>}

        <div style={{ display: "grid", gap: "24px", marginBottom: "24px" }}>
          {currentlyReading.length > 0 && (
            <div>
              <h2
                className="section-title"
                style={{ fontSize: "1.1rem", marginBottom: "12px" }}
              >
                A ler neste momento
              </h2>

              <div className="cover-grid">
                {currentlyReading.slice(0, 4).map((book) => (
                  <article className="cover-card" key={book.id}>
                    <div className="cover-image-wrap">
                      <Link to={`/books/${book.book_id}`}>
                        {book.cover_url ? (
                          <img src={book.cover_url} alt={book.title} />
                        ) : (
                          <div style={{ padding: "1rem", color: "#7c6f98" }}>
                            Sem capa
                          </div>
                        )}
                      </Link>
                    </div>

                    <div className="cover-content">
                      <div>
                        <Link
                          to={`/books/${book.book_id}`}
                          style={{ color: "inherit", textDecoration: "none" }}
                        >
                          <h3 className="cover-title">{book.title}</h3>
                        </Link>

                        <p className="cover-author">{book.author}</p>
                        <div className="cover-meta">📖 A ler</div>
                      </div>

                      <div style={{ marginTop: "12px" }}>
                        <div
                          style={{
                            width: "100%",
                            height: "10px",
                            background: "#f0e7ff",
                            borderRadius: "999px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${book.progress ?? 0}%`,
                              height: "100%",
                              background: "#7dff2b",
                            }}
                          ></div>
                        </div>
                        <small
                          style={{
                            color: "#7c6f98",
                            marginTop: "6px",
                            display: "block",
                          }}
                        >
                          {book.progress ?? 0}% concluído
                        </small>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {(wantToRead.length > 0 || finishedBooks.length > 0) && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              {/* QUERO LER */}
              <div>
                <h3
                  className="section-title"
                  style={{ fontSize: "1rem", marginBottom: "10px" }}
                >
                  📚 Quero ler
                </h3>

                {wantToRead.length === 0 ? (
                  <p className="empty-state">Sem livros nesta secção.</p>
                ) : (
                  <div className="quero-ler-container">
                    {wantToRead.slice(0, 6).map((book) => (
                      <article className="" key={book.id}>
                        <div className="">
                          <Link to={`/books/${book.book_id}`}>
                            {book.cover_url ? (
                              <img
                                src={book.cover_url}
                                alt={book.title}
                                className="small-card"
                              />
                            ) : (
                              <div
                                style={{ padding: "1rem", color: "#7c6f98" }}
                              >
                                Sem capa
                              </div>
                            )}
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>

              {/* LIDOS */}
              <div>
                <h3
                  className="section-title"
                  style={{ fontSize: "1rem", marginBottom: "10px" }}
                >
                  ✅ Lidos
                </h3>

                {finishedBooks.length === 0 ? (
                  <p className="empty-state">
                    Ainda não tens livros marcados como lidos.
                  </p>
                ) : (
                  <div className="lidos-container">
                    {finishedBooks.slice(0, 6).map((book) => (
                      <article className="" key={book.id}>
                        <div className="">
                          <Link to={`/books/${book.book_id}`}>
                            {book.cover_url ? (
                              <img
                                src={book.cover_url}
                                alt={book.title}
                                className="small-card"
                              />
                            ) : (
                              <div
                                style={{ padding: "1rem", color: "#7c6f98" }}
                              >
                                Sem capa
                              </div>
                            )}
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="page-card">

      <div className="">
        <h2 className="section-title">Última review criada</h2>

        {!latestReview ? (
          <p className="empty-state">Ainda não criaste nenhuma review.</p>
          ) : (
            <div className="quick-card" style={{ alignItems: "stretch" }}>
            <div style={{ width: "80px", flexShrink: 0 }}>
              <Link to={`/books/${latestReview.book_id}`}>
                {latestReview.book_cover_url ? (
                  <img
                  src={latestReview.book_cover_url}
                  alt={latestReview.book_title}
                  style={{
                    width: "80px",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "14px",
                      display: "block",
                    }}
                    />
                    ) : (
                      <div
                      style={{
                        width: "80px",
                      height: "120px",
                      borderRadius: "14px",
                      background: "#f3ebff",
                      display: "grid",
                      placeItems: "center",
                      color: "#7c6f98",
                      fontSize: "0.85rem",
                    }}
                  >
                    Sem capa
                  </div>
                )}
              </Link>
            </div>

            <div style={{ flex: 1 }}>
              <p
                style={{
                  margin: "0 0 6px",
                  color: "#7c6f98",
                  fontSize: "0.9rem",
                }}
                >
                {latestReview.book_title}
              </p>

              <strong style={{ display: "block", marginBottom: "8px" }}>
                {latestReview.title}
              </strong>

              <p style={{ margin: "0 0 10px", color: "#7c6f98" }}>
                ⭐ {latestReview.rating}/5
              </p>

              <p style={{ margin: 0, color: "#5a4386" }}>
                {latestReview.content?.length > 140
                  ? `${latestReview.content.slice(0, 140)}...`
                  : latestReview.content}
              </p>
            </div>
          </div>
        )}

        <div className="" style={{ marginTop: "20px" }}>
          <h2 className="section-title">Minhas listas</h2>

          {listsWithBooks.length === 0 ? (
            <p className="empty-state">Ainda não criaste listas.</p>
            ) : (
              <div style={{ display: "grid", gap: "16px" }}>
              {listsWithBooks.slice(0, 4).map((list) => (
                <Link
                key={list.id}
                to="/lists"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  border: "1px solid #e2d4ff",
                  borderRadius: "18px",
                    padding: "14px",
                    background: "#fcfaff",
                    display: "grid",
                    gap: "12px",
                  }}
                  >
                  <div>
                    <strong style={{ display: "block", marginBottom: "4px" }}>
                      {list.name}
                    </strong>
                    <small style={{ color: "#7c6f98" }}>
                      {list.books.length} livro(s)
                    </small>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      minHeight: "70px",
                    }}
                  >
                    {list.books.length === 0 ? (
                      <span style={{ color: "#7c6f98", fontSize: "0.9rem" }}>
                        Lista vazia
                      </span>
                    ) : (
                      list.books.slice(0, 3).map((book, index) => (
                        <div
                        key={book.id}
                        style={{
                          width: "52px",
                          height: "78px",
                            borderRadius: "12px",
                            overflow: "hidden",
                            border: "2px solid white",
                            marginLeft: index === 0 ? 0 : "-14px",
                            boxShadow: "0 8px 18px rgba(109, 72, 170, 0.14)",
                            background: "#f3ebff",
                            zIndex: 3 - index,
                          }}
                        >
                          {book.cover_url ? (
                            <img
                            src={book.cover_url}
                            alt={book.title}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                display: "block",
                              }}
                            />
                          ) : null}
                        </div>
                      ))
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
