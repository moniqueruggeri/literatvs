import { Routes, Route } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Profile from "./pages/Profile"
import BookDetails from "./pages/BookDetails"
import MyLibrary from "./pages/MyLibrary"
import MyReviews from "./pages/MyReviews"
import Lists from "./pages/Lists"
import ProtectedRoute from "./components/ProtectedRoute"
import Books from "./pages/Books"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<MainLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/books" element={<Books />} />
        <Route path="/books/:id" element={<BookDetails />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-library"
          element={
            <ProtectedRoute>
              <MyLibrary />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-reviews"
          element={
            <ProtectedRoute>
              <MyReviews />
            </ProtectedRoute>
          }
        />

        <Route
          path="/lists"
          element={
            <ProtectedRoute>
              <Lists />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  )
}

export default App