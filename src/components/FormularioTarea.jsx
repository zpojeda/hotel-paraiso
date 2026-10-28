import { useState } from "react"
import { estadosTarea, tiposTarea } from "../utils/tareasStorage"

function FormularioTarea({ tarea, empleados, guardar, cancelar }) {
    const [formulario, setFormulario] = useState({
        empleadoId: tarea?.empleadoId ?? "",
        tipo: tarea?.tipo ?? "",
        piso: tarea?.piso ?? "",
        habitacion: tarea?.habitacion ?? "",
        fecha: tarea?.fecha ?? "",
        horaInicio: tarea?.horaInicio ?? "",
        horaFin: tarea?.horaFin ?? "",
        estado: tarea?.estado ?? "Pendiente"
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
            <div className="hp-tareas-form-grid">
                <div className="mb-3">
                    <label className="form-label" htmlFor="tarea-empleado">Empleado</label>
                    <select
                        id="tarea-empleado"
                        name="empleadoId"
                        className="form-select"
                        value={formulario.empleadoId}
                        onChange={manejarCambio}
                        required
                    >
                        <option value="">Selecciona un empleado activo</option>
                        {empleados.map(empleado => (
                            <option key={empleado.id} value={empleado.id}>
                                {empleado.nombre} — {empleado.cargo}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label" htmlFor="tarea-tipo">Tipo de tarea</label>
                    <select
                        id="tarea-tipo"
                        name="tipo"
                        className="form-select"
                        value={formulario.tipo}
                        onChange={manejarCambio}
                        required
                    >
                        <option value="">Selecciona el tipo de tarea</option>
                        {tiposTarea.map(tipo => (
                            <option key={tipo} value={tipo}>{tipo}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label" htmlFor="tarea-piso">Piso (opcional)</label>
                    <input
                        id="tarea-piso"
                        type="text"
                        name="piso"
                        className="form-control"
                        maxLength={30}
                        value={formulario.piso}
                        onChange={manejarCambio}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label" htmlFor="tarea-habitacion">Habitación (opcional)</label>
                    <input
                        id="tarea-habitacion"
                        type="text"
                        name="habitacion"
                        className="form-control"
                        maxLength={30}
                        value={formulario.habitacion}
                        onChange={manejarCambio}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label" htmlFor="tarea-fecha">Fecha</label>
                    <input
                        id="tarea-fecha"
                        type="date"
                        name="fecha"
                        className="form-control"
                        value={formulario.fecha}
                        onChange={manejarCambio}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label" htmlFor="tarea-inicio">Hora de inicio</label>
                    <input
                        id="tarea-inicio"
                        type="time"
                        name="horaInicio"
                        className="form-control"
                        value={formulario.horaInicio}
                        onChange={manejarCambio}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label" htmlFor="tarea-fin">Hora de finalización</label>
                    <input
                        id="tarea-fin"
                        type="time"
                        name="horaFin"
                        className="form-control"
                        value={formulario.horaFin}
                        onChange={manejarCambio}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label" htmlFor="tarea-estado">Estado</label>
                    <select
                        id="tarea-estado"
                        name="estado"
                        className="form-select"
                        value={formulario.estado}
                        onChange={manejarCambio}
                        required
                    >
                        {estadosTarea.map(estado => (
                            <option key={estado} value={estado}>{estado}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-outline-secondary" onClick={cancelar}>
                    Cancelar
                </button>
                <button type="submit" className="btn-nueva-habitacion">
                    <i className="bi bi-check-circle me-2" aria-hidden="true"></i>
                    {tarea ? "Guardar cambios" : "Asignar tarea"}
                </button>
            </div>
        </form>
    )
}

export default FormularioTarea
