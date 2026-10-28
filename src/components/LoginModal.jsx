
import { useState } from "react";
import Swal from "sweetalert2";
import { autenticarCliente, registrarCliente } from "../utils/clientesStorage";
import { autenticarEmpleado } from "../utils/empleadosStorage";

function LoginModal({ mostrar, cerrar, onLogin }) {
  const [modo, setModo] = useState("login");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");

  if (!mostrar) return null;

  const iniciarSesion = (e) => {
    e.preventDefault()

    if (correo.trim().toLowerCase() === "admin@hotel.com" && password === "12345") {
      Swal.fire({
      icon:"success",
      title:"Bienvenid@", 
      text:"Sesión iniciada correctamente",
      confirmButtonText:"Continuar",
      confirmButtonColor:"#344c5c"
    }).then(() => {
      cerrar()
      onLogin("admin")
    })
      return;
    }

    try {
      const empleado = autenticarEmpleado(correo, password);
      if (empleado) {
        Swal.fire({
          icon: "success",
          title: `¡Bienvenido, ${empleado.nombre}!`,
          text: "Sesión iniciada correctamente",
          confirmButtonText: "Continuar",
          confirmButtonColor: "#344c5c"
        }).then(() => {
          cerrar()
          onLogin("empleado", empleado.id)
        })
        return
      }

      const cliente = autenticarCliente(correo, password);
      if (!cliente) {
        throw new Error("El correo o la contraseña son incorrectos.");
      }

      Swal.fire({
        icon: "success",
        title: "¡Bienvenido!",
        text: "Sesión iniciada correctamente",
        confirmButtonText: "Continuar",
        confirmButtonColor: "#344c5c"
      }).then(() => {
        cerrar()
        onLogin("cliente", cliente.id)
      })
    } catch (error) {
      Swal.fire({
        icon:"error",
        title: "Acceso denegado",
        text: error.message,
        confirmButtonText:"Intentar nuevamente",
        confirmButtonColor: "#344c5c"
      })
    }
  };

  const crearCuenta = (e) => {
    e.preventDefault();

    if (password.length < 8) {
      Swal.fire({
        icon: "warning",
        title: "Contraseña demasiado corta",
        text: "Usa al menos 8 caracteres para crear tu cuenta.",
        confirmButtonColor: "#344c5c"
      });
      return;
    }

    if (password !== confirmarPassword) {
      Swal.fire({
        icon: "warning",
        title: "Las contraseñas no coinciden",
        text: "Verifica ambas contraseñas antes de continuar.",
        confirmButtonColor: "#344c5c"
      });
      return;
    }

    try {
      const cliente = registrarCliente({ nombre, correo, telefono, password });
      Swal.fire({
        icon: "success",
        title: "Cuenta creada",
        text: "Tu cuenta está lista. Iniciarás sesión ahora.",
        confirmButtonText: "Continuar",
        confirmButtonColor: "#344c5c"
      }).then(() => {
        cerrar();
        onLogin("cliente", cliente.id);
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "No se pudo crear la cuenta",
        text: error.message,
        confirmButtonText: "Entendido",
        confirmButtonColor: "#344c5c"
      });
    }
  };

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.65)" }}
    >
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content rounded-4 shadow">
          <div className="modal-header border-0">
            <h4 className="modal-title fw-bold">
              {modo === "login" ? "Bienvenido" : "Crear cuenta"}
            </h4>
            <button
              type="button"
              className="btn-close"
              onClick={cerrar}
            />
          </div>

          <div className="modal-body px-4 pb-4">
            <p className="text-muted">
              {modo === "login" ? "Ingresa a tu cuenta del hotel" : "Regístrate para gestionar tus reservas"}
            </p>

            {modo === "login" ? <form onSubmit={iniciarSesion}>
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
            </form> : <form onSubmit={crearCuenta}>
              <div className="mb-3">
                <label className="form-label">Nombre completo</label>
                <input
                  type="text"
                  className="form-control"
                  autoComplete="name"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Correo electrónico</label>
                <input
                  type="email"
                  className="form-control"
                  autoComplete="email"
                  placeholder="correo@ejemplo.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Teléfono</label>
                <input
                  type="tel"
                  className="form-control"
                  autoComplete="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Contraseña (mínimo 8 caracteres)</label>
                <input
                  type="password"
                  className="form-control"
                  autoComplete="new-password"
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label">Confirmar contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  autoComplete="new-password"
                  value={confirmarPassword}
                  onChange={(e) => setConfirmarPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn w-100 text-white py-2"
                style={{ backgroundColor: "#6b7017" }}
              >
                Crear cuenta
              </button>
            </form>}

            <p className="text-center mt-3 mb-0">
              {modo === "login" ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setModo(modo === "login" ? "registro" : "login");
                }}
              >
                {modo === "login" ? "Regístrate" : "Inicia sesión"}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
