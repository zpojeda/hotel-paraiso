import { useState } from "react"
import { Routes, Route, useNavigate } from "react-router-dom"
import Home from "./pages/Home"
import Dashboard from "./pages/admin/Dashboard"
import ClienteDashboard from "./pages/cliente/ClienteDashboard"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  const [usuario, setUsuario] = useState(() => {
    return localStorage.getItem("usuarioHotel")
  })
  const [clienteId, setClienteId] = useState(() => {
    return localStorage.getItem("usuarioHotelId") ||
      (localStorage.getItem("usuarioHotel") === "cliente" ? "cliente-demo" : null)
  })

  const navigate = useNavigate()
  
  const iniciarSesion = (rol, nuevoClienteId = null) => {
    setUsuario(rol)
    localStorage.setItem("usuarioHotel", rol)
    if (rol === "cliente" && nuevoClienteId) {
      setClienteId(nuevoClienteId)
      localStorage.setItem("usuarioHotelId", nuevoClienteId)
    } else {
      setClienteId(null)
      localStorage.removeItem("usuarioHotelId")
    }
    navigate(rol === "admin" ? "/admin" : "/cliente")
  }
  const cerrarSesion = () => {
    setUsuario(null)
    setClienteId(null)
    localStorage.removeItem("usuarioHotel")
    localStorage.removeItem("usuarioHotelId")
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
            <ClienteDashboard clienteId={clienteId} onLogout={cerrarSesion} />

          </ProtectedRoute>
        }
        />
         
    
    </Routes>
  )
}

export default App