import { Navigate } from "react-router-dom";

function ProtectedRoute({ usuario ,  rolPermitido, children }){
    if (!usuario) {
        return <Navigate to="/" replace/>
    }

    if (usuario !== rolPermitido){
        return <Navigate to={usuario === "admin" ? "/admin" : "/cliente"} replace />
    }

    return children
}

export default ProtectedRoute