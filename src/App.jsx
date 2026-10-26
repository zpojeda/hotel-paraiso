import { useState } from "react"
import { Routes, Route, Navigate, useNavigate } from "react-router-dom"
import Home from "./pages/Home"
import Dashboard from "./pages/admin/Dashboard"
import ClienteDashboard from "./pages/cliente/ClienteDashboard"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  const [usuario, setUsuario] = useState(() => {
    return localStorage.getItem("usuarioHotel")
  })

  const navigate = useNavigate()
  
  const iniciarSesion = (rol) => {
    setUsuario(rol)
    localStorage.setItem("usuarioHotel", rol)
    navigate(rol === "admin" ? "/admin" : "/cliente")
  }
  const cerrarSesion = () => {
    setUsuario(null)
    localStorage.removeItem("usuarioHotel")
    navigate("/")
  }
  return (
    <Routes>
      <Route
        path="/"
        element={<Home onLogin={iniciarSesion} />}
       
      />
      <Route
        path="/admin"
        element={
            <ProtectedRoute usuario={usuario} rolPermitido="admin"> 
            <Dashboard onLogout={cerrarSesion} />
            </ProtectedRoute>
        }
        />

        <Route
        path="/cliente"
        element={
          <ProtectedRoute usuario={usuario} rolPermitido="cliente">
            <ClienteDashboard onLogout={cerrarSesion} />

          </ProtectedRoute>
        }
        />
         
    
    </Routes>
  )
}

export default App