import { useState } from "react";
import "./PerfilCliente.css";
import { actualizarPerfilCliente, obtenerClientePorId } from "../utils/clientesStorage";

const perfilVacio = {
    nombre: "",
    telefono: "",
    fechaNacimiento: "",
    direccion: "",
    ciudad: ""
};

const camposPerfil = Object.keys(perfilVacio);

function perfilValido(datos) {
    return datos && camposPerfil.every(campo => typeof datos[campo] === "string");
}

function leerPerfilInicial(clienteId) {
    try {
        const cliente = obtenerClientePorId(clienteId);
        if (!cliente) {
            return {
                perfil: perfilVacio,
                correo: "",
                errorCarga: "No se encontró la cuenta de cliente activa."
            };
        }

        if (!perfilValido(cliente.perfil)) {
            throw new Error("El formato del perfil guardado no es válido.");
        }
        return {
            perfil: cliente.perfil,
            correo: cliente.correo,
            errorCarga: ""
        };
    } catch (errorLectura) {
        return {
            perfil: perfilVacio,
            correo: "",
            errorCarga: errorLectura.message
        };
    }
}

function PerfilCliente({ clienteId }) {
    const [estadoPerfil, setEstadoPerfil] = useState(() => leerPerfilInicial(clienteId));
    const { perfil, correo, errorCarga } = estadoPerfil;
    const [borrador, setBorrador] = useState(perfilVacio);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [error, setError] = useState("");

    const iniciarEdicion = () => {
        setBorrador(perfil);
        setError("");
        setModoEdicion(true);
    };

    const cancelarEdicion = () => {
        setBorrador(perfil);
        setError("");
        setModoEdicion(false);
    };

    const manejarCambio = (evento) => {
        const { name, value } = evento.target;
        setBorrador(actual => ({ ...actual, [name]: value }));
    };

    const guardarPerfil = (evento) => {
        evento.preventDefault();
        const perfilLimpio = Object.fromEntries(
            camposPerfil.map(campo => [campo, borrador[campo].trim()])
        );

        if (!perfilLimpio.nombre || !perfilLimpio.telefono) {
            setError("Ingresa tu nombre completo y teléfono para guardar el perfil.");
            return;
        }

        try {
            const clienteActualizado = actualizarPerfilCliente(clienteId, perfilLimpio);
            setEstadoPerfil({
                perfil: clienteActualizado.perfil,
                correo: clienteActualizado.correo,
                errorCarga: ""
            });
        } catch (errorGuardado) {
            setError(errorGuardado.message || "No se pudieron guardar los cambios.");
            return;
        }

        setBorrador(perfilLimpio);
        setError("");
        setModoEdicion(false);
    };

    const iniciales = perfil.nombre.trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(nombre => nombre[0].toUpperCase())
        .join("") || "CP";
    const fechaLegible = perfil.fechaNacimiento
        ? new Date(`${perfil.fechaNacimiento}T12:00:00`).toLocaleDateString("es-MX", {
            year: "numeric",
            month: "long",
            day: "numeric"
        })
        : "Aún no agregada";
    const errorVisible = error || errorCarga;

    return (
        <div className="perfil-cliente">
            {errorVisible && (
                <div className="perfil-cliente-alert" role="alert">
                    <i className="bi bi-exclamation-circle" aria-hidden="true"></i>
                    <span>{errorVisible}</span>
                </div>
            )}

            <section className="perfil-cliente-card" aria-label="Perfil personal">
                <div className="perfil-cliente-banner">
                    <div className="perfil-cliente-identidad">
                        <div className="perfil-cliente-avatar" aria-hidden="true">{iniciales}</div>
                        <div>
                            <span className="perfil-cliente-etiqueta">PERFIL PERSONAL</span>
                            <h3>{perfil.nombre || "Tu perfil de cliente"}</h3>
                            <p>Administra la información asociada a tu cuenta</p>
                        </div>
                    </div>
                    {!modoEdicion && (
                        <button
                            type="button"
                            className="perfil-cliente-boton perfil-cliente-boton-editar"
                            onClick={iniciarEdicion}
                        >
                            <i className="bi bi-pencil" aria-hidden="true"></i>
                            {errorCarga ? "Crear perfil" : "Editar perfil"}
                        </button>
                    )}
                </div>

                {modoEdicion ? (
                    <form className="perfil-cliente-formulario" onSubmit={guardarPerfil}>
                        <div className="perfil-cliente-grid">
                            <label className="perfil-cliente-campo">
                                <span>Nombre completo <b aria-hidden="true">*</b></span>
                                <input
                                    autoComplete="name"
                                    className="form-control"
                                    name="nombre"
                                    onChange={manejarCambio}
                                    required
                                    value={borrador.nombre}
                                />
                            </label>

                            <label className="perfil-cliente-campo">
                                <span>Teléfono <b aria-hidden="true">*</b></span>
                                <input
                                    autoComplete="tel"
                                    className="form-control"
                                    name="telefono"
                                    onChange={manejarCambio}
                                    required
                                    type="tel"
                                    value={borrador.telefono}
                                />
                            </label>

                            <label className="perfil-cliente-campo">
                                <span>Fecha de nacimiento</span>
                                <input
                                    autoComplete="bday"
                                    className="form-control"
                                    name="fechaNacimiento"
                                    onChange={manejarCambio}
                                    type="date"
                                    value={borrador.fechaNacimiento}
                                />
                            </label>

                            <label className="perfil-cliente-campo">
                                <span>Dirección</span>
                                <input
                                    autoComplete="street-address"
                                    className="form-control"
                                    name="direccion"
                                    onChange={manejarCambio}
                                    value={borrador.direccion}
                                />
                            </label>

                            <label className="perfil-cliente-campo">
                                <span>Ciudad</span>
                                <input
                                    autoComplete="address-level2"
                                    className="form-control"
                                    name="ciudad"
                                    onChange={manejarCambio}
                                    value={borrador.ciudad}
                                />
                            </label>

                            <label className="perfil-cliente-campo">
                                <span>Correo de acceso</span>
                                <input
                                    autoComplete="email"
                                    className="form-control perfil-cliente-correo"
                                    readOnly
                                    type="email"
                                    value={correo}
                                />
                                <small>Este correo identifica tu cuenta y no se puede editar aquí.</small>
                            </label>
                        </div>

                        <div className="perfil-cliente-acciones">
                            <button
                                type="button"
                                className="perfil-cliente-boton perfil-cliente-boton-cancelar"
                                onClick={cancelarEdicion}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="perfil-cliente-boton perfil-cliente-boton-guardar"
                            >
                                <i className="bi bi-check2" aria-hidden="true"></i>
                                Guardar cambios
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="perfil-cliente-detalles">
                        <div className="perfil-cliente-dato">
                            <span><i className="bi bi-envelope" aria-hidden="true"></i> Correo de acceso</span>
                            <strong>{correo}</strong>
                        </div>
                        <div className="perfil-cliente-dato">
                            <span><i className="bi bi-telephone" aria-hidden="true"></i> Teléfono</span>
                            <strong>{perfil.telefono || "Aún no agregado"}</strong>
                        </div>
                        <div className="perfil-cliente-dato">
                            <span><i className="bi bi-calendar3" aria-hidden="true"></i> Fecha de nacimiento</span>
                            <strong>{fechaLegible}</strong>
                        </div>
                        <div className="perfil-cliente-dato">
                            <span><i className="bi bi-geo-alt" aria-hidden="true"></i> Dirección</span>
                            <strong>{perfil.direccion || "Aún no agregada"}</strong>
                        </div>
                        <div className="perfil-cliente-dato">
                            <span><i className="bi bi-buildings" aria-hidden="true"></i> Ciudad</span>
                            <strong>{perfil.ciudad || "Aún no agregada"}</strong>
                        </div>
                        {!perfil.nombre && (
                            <p className="perfil-cliente-vacio">
                                Completa tus datos personales para tenerlos disponibles en tu próxima visita.
                            </p>
                        )}
                    </div>
                )}
            </section>
            <p className="perfil-cliente-nota">
                Tus datos se guardan en este navegador y no se sincronizan con otros dispositivos.
            </p>
        </div>
    );
}

export default PerfilCliente;
