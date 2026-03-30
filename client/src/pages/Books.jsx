import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import api from "../services/api"
import "../styles/bookGrid.css"

const Books = () => {
  const [searchParams] = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [libraryBooks, setLibraryBooks] = useState([])
  const [localBooks, setLocalBooks] = useState([])

  const fetchLibrary = async () => {
    try {
      const response = await api.get("/user-books")
      setLibraryBooks(response.data)
    } catch (error) {
      console.error("ERROR FETCH LIBRARY:", error)
    }
  }

  const fetchLocalBooks = async () => {
    try {
      const response = await api.get("/books")
      setLocalBooks(response.data)
    } catch (error) {
      console.error("ERROR FETCH LOCAL BOOKS:", error)
    }
  }

  const runSearch = async (searchValue) => {
    setMessage("")
    setResults([])

    if (!searchValue.trim()) {
      setMessage("Escreve algo para pesquisar.")
      return
    }

    try {
      setLoading(true)

      const openRes = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(searchValue)}`
      )
      const openData = await openRes.json()

      const openBooks = (openData.docs || []).slice(0, 6).map((book) => {
        const isbn = Array.isArray(book.isbn) ? book.isbn[0] : null
        const author = Array.isArray(book.author_name)
          ? book.author_name.join(", ")
          : "Autor desconhecido"

        let coverUrl = ""

        if (isbn) {
          coverUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`
        } else if (book.cover_i) {
          coverUrl = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        }

        return {
          source: "open",
          title: book.title || "Sem título",
          author,
          genre: Array.isArray(book.subject) ? book.subject[0] : "",
          isbn,
          cover_url: coverUrl,
          synopsis: "",
        }
      })

      const googleRes = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchValue)}`
      )
      const googleData = await googleRes.json()

      const googleBooks = (googleData.items || []).slice(0, 6).map((item) => {
        const info = item.volumeInfo

        return {
          source: "google",
          title: info.title || "Sem título",
          author: info.authors ? info.authors.join(", ") : "Autor desconhecido",
          genre: info.categories?.[0] || "",
          isbn: info.industryIdentifiers?.[0]?.identifier || null,
          cover_url: info.imageLinks?.thumbnail || "",
          synopsis: info.description || "",
        }
      })

      const combined = [...googleBooks, ...openBooks]

      const uniqueBooks = combined.filter(
        (book, index, self) =>
          index ===
          self.findIndex(
            (b) =>
              b.title.toLowerCase() === book.title.toLowerCase() &&
              b.author.toLowerCase() === book.author.toLowerCase()
          )
      )

      const normalized = uniqueBooks.map((book) => {
        const existingLocalBook = localBooks.find((localBook) => {
          const sameIsbn =
            localBook.isbn && book.isbn && localBook.isbn === book.isbn

          const sameTitleAndAuthor =
            localBook.title?.toLowerCase() === book.title?.toLowerCase() &&
            localBook.author?.toLowerCase() === book.author?.toLowerCase()

          return sameIsbn || sameTitleAndAuthor
        })

        return {
          ...book,
          id: existingLocalBook?.id || null,
        }
      })

      setResults(normalized)
    } catch (error) {
      console.error("ERROR SEARCH:", error)
      setMessage("Erro ao pesquisar livros.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLibrary()
    fetchLocalBooks()
  }, [])

  useEffect(() => {
    if (initialQuery && localBooks.length >= 0) {
      runSearch(initialQuery)
    }
  }, [initialQuery, localBooks])

  const handleSearch = async (e) => {
    e.preventDefault()
    runSearch(query)
  }

  const isBookInLibrary = (book) => {
    return libraryBooks.some((libraryBook) => {
      const sameIsbn =
        libraryBook.isbn &&
        book.isbn &&
        libraryBook.isbn === book.isbn

      const sameTitleAndAuthor =
        libraryBook.title?.toLowerCase() === book.title?.toLowerCase() &&
        libraryBook.author?.toLowerCase() === book.author?.toLowerCase()

      return sameIsbn || sameTitleAndAuthor
    })
  }

  const handleAddToLibrary = async (book) => {
    setMessage("")

    try {
      await api.post("/books/import-and-add", book)
      setMessage("Livro adicionado à biblioteca com sucesso!")
      await fetchLibrary()
      await fetchLocalBooks()
    } catch (error) {
      console.error("ERROR IMPORT AND ADD:", error)

      const backendError =
        error.response?.data?.message ||
        "Erro ao adicionar livro à biblioteca."

      setMessage(backendError)
    }
  }

  return (
    <div className="page-card">
      <h1 className="section-title">Resultados da pesquisa</h1>

      <form onSubmit={handleSearch} className="inline-form" style={{ marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="Pesquisar por título, autor, ISBN..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ minWidth: "260px" }}
        />
        <button className="app-btn" type="submit">Pesquisar</button>
      </form>

      {loading && <p>A pesquisar livros...</p>}
      {message && <div className="message-box">{message}</div>}

      {results.length > 0 && (
        <div className="cover-grid">
          {results.map((book, index) => {
            const alreadyAdded = isBookInLibrary(book)

            return (
              <article className="cover-card" key={`${book.title}-${index}`}>
                <div className="cover-image-wrap">
                  {book.id ? (
                    <Link to={`/books/${book.id}`}>
                      {book.cover_url ? (
                        <img src={book.cover_url} alt={book.title} />
                      ) : (
                        <div style={{ padding: "1rem", color: "#7c6f98" }}>Sem capa</div>
                      )}
                    </Link>
                  ) : book.cover_url ? (
                    <img src={book.cover_url} alt={book.title} />
                  ) : (
                    <div style={{ padding: "1rem", color: "#7c6f98" }}>Sem capa</div>
                  )}
                </div>

                <div className="cover-content">
                  {book.id ? (
                    <Link
                      to={`/books/${book.id}`}
                      style={{ color: "inherit", textDecoration: "none" }}
                    >
                      <h3 className="cover-title">{book.title}</h3>
                    </Link>
                  ) : (
                    <h3 className="cover-title">{book.title}</h3>
                  )}

                  <p className="cover-author">{book.author}</p>

                  {book.genre && <div className="cover-meta">{book.genre}</div>}

                  <div className="cover-actions">
                    <button
                      className="small-btn"
                      onClick={() => handleAddToLibrary(book)}
                      disabled={alreadyAdded}
                    >
                      {alreadyAdded ? "Adicionado" : "Adicionar à biblioteca"}
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Books