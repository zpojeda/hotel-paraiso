import { useState } from "react"
import { cargosEmpleado } from "../utils/empleadosStorage"

function FormularioEmpleado({ empleado, guardar, cancelar }) {
    const [formulario, setFormulario] = useState({
        documento: empleado?.documento ?? "",
        nombre: empleado?.nombre ?? "",
        correo: empleado?.correo ?? "",
        telefono: empleado?.telefono ?? "",
        cargo: empleado?.cargo ?? "",
        password: "",
        confirmarPassword: ""
    })

    const manejarCambio = evento => {
        const { name, value } = evento.target
        setFormulario(actual => ({ ...actual, [name]: value }))
    }

    const manejarEnvio = evento => {
        evento.preventDefault()
        guardar(formulario)
    }

    return (
        <form onSubmit={manejarEnvio}>
            <div className="hp-empleados-form-grid">
                <div className="mb-3">
                    <label className="form-label" htmlFor="empleado-documento">Documento</label>
                    <input
                        id="empleado-documento"
                        type="text"
                        name="documento"
                        className="form-control"
                        autoComplete="off"
                        minLength={5}
                        maxLength={20}
                        value={formulario.documento}
                        onChange={manejarCambio}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label" htmlFor="empleado-nombre">Nombre completo</label>
                    <input
                        id="empleado-nombre"
                        type="text"
                        name="nombre"
                        className="form-control"
                        autoComplete="name"
                        minLength={2}
                        maxLength={100}
                        value={formulario.nombre}
                        onChange={manejarCambio}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label" htmlFor="empleado-correo">Correo</label>
                    <input
                        id="empleado-correo"
                        type="email"
                        name="correo"
                        className="form-control"
                        autoComplete="email"
                        maxLength={254}
                        value={formulario.correo}
                        onChange={manejarCambio}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label" htmlFor="empleado-telefono">Teléfono</label>
                    <input
                        id="empleado-telefono"
                        type="tel"
                        name="telefono"
                        className="form-control"
                        autoComplete="tel"
                        pattern="[+0-9() -]{7,25}"
                        title="Ingresa un teléfono válido de entre 7 y 15 dígitos."
                        maxLength={25}
                        value={formulario.telefono}
                        onChange={manejarCambio}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label" htmlFor="empleado-cargo">Cargo</label>
                    <select
                        id="empleado-cargo"
                        name="cargo"
                        className="form-select"
                        value={formulario.cargo}
                        onChange={manejarCambio}
                        required
                    >
                        <option value="">Selecciona un cargo</option>
                        {cargosEmpleado.map(cargo => (
                            <option key={cargo} value={cargo}>{cargo}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label" htmlFor="empleado-password">
                        {empleado ? "Nueva contraseña (opcional)" : "Contraseña de acceso"}
                    </label>
                    <input
                        id="empleado-password"
                        type="password"
                        name="password"
                        className="form-control"
                        autoComplete="new-password"
                        minLength={8}
                        value={formulario.password}
                        onChange={manejarCambio}
                        required={!empleado || !empleado.password}
                    />
                    <small className="form-text text-secondary">
                        {empleado
                            ? empleado.password
                                ? "Déjala vacía para conservar la contraseña actual."
                                : "Este empleado aún no tiene acceso; establece una contraseña para habilitarlo."
                            : "Mínimo 8 caracteres. El empleado usará esta contraseña para iniciar sesión."}
                    </small>
                </div>
                {(!empleado || !empleado.password || formulario.password) && (
                    <div className="mb-3">
                        <label className="form-label" htmlFor="empleado-confirmar-password">
                            Confirmar contraseña
                        </label>
                        <input
                            id="empleado-confirmar-password"
                            type="password"
                            name="confirmarPassword"
                            className="form-control"
                            autoComplete="new-password"
                            minLength={8}
                            value={formulario.confirmarPassword}
                            onChange={manejarCambio}
                            required={!empleado || !empleado.password || Boolean(formulario.password)}
                        />
                    </div>
                )}
            </div>

            <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-outline-secondary" onClick={cancelar}>
                    Cancelar
                </button>
                <button type="submit" className="btn-nueva-habitacion">
                    <i className="bi bi-check-circle me-2" aria-hidden="true"></i>
                    {empleado ? "Actualizar empleado" : "Registrar empleado"}
                </button>
            </div>
        </form>
    )
}

export default FormularioEmpleado
