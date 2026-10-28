import { Navigate } from "react-router-dom";

function ProtectedRoute({ usuario ,  rolPermitido, children }){
    if (!usuario) {
        return <Navigate to="/" replace/>
    }

    if (usuario !== rolPermitido){
        const rutasPorRol = {
            admin: "/admin",
            cliente: "/cliente",
            empleado: "/empleado"
        }
        return <Navigate to={rutasPorRol[usuario] || "/"} replace />
    }

    return children
}

export default ProtectedRoute