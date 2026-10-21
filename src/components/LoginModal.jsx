
import { useState } from "react";
import Swal from "sweetalert2";

function LoginModal({ mostrar, cerrar, onLogin }) {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  if (!mostrar) return null;

  const iniciarSesion = (e) => {
    e.preventDefault();

    if (
      correo.trim() === "admin@hotel.com" &&
      password === "12345"
    ) {
    Swal.fire({
      icon:"success",
      title:"Bienvenid@", 
      text:"Sesión iniciada correctamente",
      confirmButtonText:"Continuar",
      confirmButtonColor:"#344c5c"
    }).then(() => {
      cerrar()
      onLogin()
    })
    } else {
      Swal.fire({
        icon:"error",
        title: "Acceso denegado",
        text: "El correo o la contraseña son incorrectos",
        confirmButtonText:"Intentar nuevamente",
        confirmButtonColor: "344c5c"
      })
    }

  };

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.65)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4 shadow">
          <div className="modal-header border-0">
            <h4 className="modal-title fw-bold">
              Bienvenido
            </h4>
            <button
              type="button"
              className="btn-close"
              onClick={cerrar}
            />
          </div>

          <div className="modal-body px-4 pb-4">
            <p className="text-muted">
              Ingresa a tu cuenta del hotel
            </p>

            <form onSubmit={iniciarSesion}>
              <div className="mb-3">
                <label className="form-label">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="correo@ejemplo.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label">
                  Contraseña
                </label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn w-100 text-white py-2"
                style={{ backgroundColor: "#6b7017" }}
              >
                Iniciar sesión
              </button>
            </form>

            <p className="text-center mt-3 mb-0">
              ¿No tienes cuenta?{" "}
              <a href="#" onClick={(e) => e.preventDefault()}>
                Regístrate
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
