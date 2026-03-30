import { useEffect, useState } from "react";
import api from "../services/api";
import ProtectedRoute from "../components/ProtectedRoute";
import "../styles/bookGrid.css";

const ListsContent = () => {
  const [lists, setLists] = useState([]);
  const [books, setBooks] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [listBooks, setListBooks] = useState([]);
  const [listsWithBooks, setListsWithBooks] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_public: true,
  });

  const fetchData = async () => {
    try {
      const [listsRes, booksRes] = await Promise.all([
        api.get("/lists"),
        api.get("/books"),
      ]);

      setLists(listsRes.data);
      setBooks(booksRes.data);
    } catch (error) {
      console.error("ERROR FETCH LISTS:", error);
      setMessage("Erro ao carregar listas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchListBooks = async (id) => {
    try {
      const res = await api.get(`/lists/${id}/books`);
      setSelectedList(res.data.list);
      setListBooks(res.data.books);
    } catch (error) {
      console.error("ERROR FETCH LIST BOOKS:", error);
    }
  };

  const handleCreateList = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await api.post("/lists", formData);
      setMessage("Lista criada com sucesso.");
      setFormData({
        name: "",
        description: "",
        is_public: true,
      });
      fetchData();
    } catch (error) {
      console.error("ERROR CREATE LIST:", error);
      setMessage("Erro ao criar lista.");
    }
  };

  const handleAddBook = async (bookId) => {
    if (!selectedList) return;

    try {
      await api.post(`/lists/${selectedList.id}/books`, {
        book_id: bookId,
      });

      await fetchListBooks(selectedList.id);
      setMessage("Livro adicionado à lista.");
    } catch (error) {
      console.error("ERROR ADD BOOK TO LIST:", error);
      setMessage(error.response?.data?.message || "Erro ao adicionar livro.");
    }
  };

  const handleRemoveBook = async (bookId) => {
    if (!selectedList) return;

    try {
      await api.delete(`/lists/${selectedList.id}/books/${bookId}`);
      await fetchListBooks(selectedList.id);
      setMessage("Livro removido da lista.");
    } catch (error) {
      console.error("ERROR REMOVE BOOK FROM LIST:", error);
      setMessage("Erro ao remover livro da lista.");
    }
  };

  if (loading) return <p>A carregar...</p>;

  return (
    <div className="book-grid-layout">
      <div className="book-grid-panel">
        <div className="book-grid-header">
          <div>
            <h1>Listas</h1>
            <p>Cria listas e organiza livros por tema, mood ou objetivo.</p>
          </div>
        </div>

        {message && <div className="message-box">{message}</div>}

        <form
          className="inline-form"
          onSubmit={handleCreateList}
          style={{ marginBottom: "20px" }}
        >
          <input
            type="text"
            placeholder="Nome da lista"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Descrição"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          <button className="app-btn" type="submit">
            Criar lista
          </button>
        </form>

        <div style={{ marginBottom: "24px" }}>
          <h2
            className="section-title"
            style={{ fontSize: "1.05rem", marginBottom: "14px" }}
          >
            Minhas listas
          </h2>

          {lists.length === 0 ? (
            <p className="empty-state">Ainda não criaste listas.</p>
          ) : (
            <div style={{ display: "grid", gap: "16px" }}>
              {lists.map((list) => {
                const booksFromThisList =
                  selectedList?.id === list.id ? listBooks : [];

                return (
                  <button
                    key={list.id}
                    onClick={() => fetchListBooks(list.id)}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      border:
                        selectedList?.id === list.id
                          ? "2px solid #9f67ff"
                          : "1px solid #e2d4ff",
                      borderRadius: "18px",
                      padding: "14px",
                      background: "#fcfaff",
                      display: "grid",
                      gap: "12px",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <div>
                      <strong style={{ display: "block", marginBottom: "4px" }}>
                        {list.name}
                      </strong>
                      <small style={{ color: "#7c6f98" }}>
                        {selectedList?.id === list.id
                          ? `${listBooks.length} livro(s)`
                          : "Clica para ver os livros"}
                      </small>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        minHeight: "70px",
                      }}
                    >
                      {selectedList?.id === list.id && listBooks.length > 0 ? (
                        listBooks.slice(0, 3).map((book, index) => (
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
                      ) : (
                        <span style={{ color: "#7c6f98", fontSize: "0.9rem" }}>
                          {selectedList?.id === list.id
                            ? "Lista vazia"
                            : "Selecionar lista"}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {!selectedList ? (
          <p className="empty-state">Seleciona uma lista para ver os livros.</p>
        ) : (
          <>
            <div className="book-grid-header" style={{ marginTop: "10px" }}>
              <div>
                <h2>{selectedList.name}</h2>
                <p>{selectedList.description || "Sem descrição."}</p>
              </div>
            </div>

            {listBooks.length === 0 ? (
              <p className="empty-state">
                Ainda não existem livros nesta lista.
              </p>
            ) : (
              <div className="cover-grid">
                {listBooks.map((book) => (
                  <article className="cover-card" key={book.id}>
                    <div className="cover-image-wrap">
                      {book.cover_url ? (
                        <img src={book.cover_url} alt={book.title} />
                      ) : (
                        <div style={{ padding: "1rem", color: "#7c6f98" }}>
                          Sem capa
                        </div>
                      )}
                    </div>

                    <div className="cover-content">
                      <h3 className="cover-title">{book.title}</h3>
                      <p className="cover-author">{book.author}</p>

                      <div className="cover-actions">
                        <button
                          className="small-btn secondary"
                          onClick={() => handleRemoveBook(book.id)}
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const Lists = () => {
  return (
    <ProtectedRoute>
      <ListsContent />
    </ProtectedRoute>
  );
};

export default Lists;
