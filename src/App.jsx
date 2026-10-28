import { useState } from "react"
import { Routes, Route, useNavigate } from "react-router-dom"
import Home from "./pages/Home"
import Dashboard from "./pages/admin/Dashboard"
import ClienteDashboard from "./pages/cliente/ClienteDashboard"
import EmpleadoDashboard from "./pages/empleado/EmpleadoDashboard"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  const [usuario, setUsuario] = useState(() => {
    return localStorage.getItem("usuarioHotel")
  })
  const [usuarioId, setUsuarioId] = useState(() => {
    return localStorage.getItem("usuarioHotelId") ||
      (localStorage.getItem("usuarioHotel") === "cliente" ? "cliente-demo" : null)
  })

  const navigate = useNavigate()
  
  const iniciarSesion = (rol, nuevoUsuarioId = null) => {
    setUsuario(rol)
    localStorage.setItem("usuarioHotel", rol)
    if ((rol === "cliente" || rol === "empleado") && nuevoUsuarioId) {
      setUsuarioId(nuevoUsuarioId)
      localStorage.setItem("usuarioHotelId", nuevoUsuarioId)
    } else {
      setUsuarioId(null)
      localStorage.removeItem("usuarioHotelId")
    }
    const rutasPorRol = {
      admin: "/admin",
      cliente: "/cliente",
      empleado: "/empleado"
    }
    navigate(rutasPorRol[rol] || "/")
  }
  const cerrarSesion = () => {
    setUsuario(null)
    setUsuarioId(null)
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
            <ClienteDashboard clienteId={usuarioId} onLogout={cerrarSesion} />

          </ProtectedRoute>
        }
        />

        <Route
          path="/empleado"
          element={
            <ProtectedRoute usuario={usuario} rolPermitido="empleado">
              <EmpleadoDashboard empleadoId={usuarioId} onLogout={cerrarSesion} />
            </ProtectedRoute>
          }
        />
         
    
    </Routes>
  )
}

export default App