import { useState } from "react"
import { inferirTipoHabitacion } from "../utils/habitacionesStorage"

function FormularioHabitacion({ habitacion, guardar, cancelar }) {
    const [formulario, setFormulario] = useState({
        nombre: habitacion?.nombre ?? "",
        tipo: habitacion?.tipo ?? (
            habitacion ? inferirTipoHabitacion(habitacion.nombre) : "Estándar"
        ),
        precio: habitacion?.precio ?? "",
        estado: habitacion?.estado ?? "Disponible"
    })

    const manejarCambio = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        })
    }
    const manejarEnvio = (e) => {
        e.preventDefault()
        guardar({
            ...formulario,
            precio: Number(formulario.precio)
        })
    }
    return (
        <form onSubmit={manejarEnvio}>
            <div className="mb-3">
                <label className="form-label">Nombre de la Habitación</label>
                <input
                    type="text"
                    name="nombre"
                    className="form-control"
                    value={formulario.nombre}
                    onChange={manejarCambio}
                    required
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Tipo de habitación</label>
                <select
                    className="form-select"
                    name="tipo"
                    value={formulario.tipo}
                    onChange={manejarCambio}
                    required
                >
                    <option value="Estándar">Estándar</option>
                    <option value="Premium">Premium</option>
                    <option value="Suite">Suite</option>
                    <option value="Otra">Otra</option>
                </select>
            </div>

            <div className="mb-3">
                <label className="form-label">Precio habitación</label>
                <input
                    type="number"
                    className="form-control"
                    name="precio"
                    min="1"
                    value={formulario.precio}
                    onChange={manejarCambio}
                    required
                />
            </div>

            <div className="mb-3">
                <label htmlFor="" className="form-label">Estado</label>
                <select
                    className="form-select"
                    name="estado"
                    value={formulario.estado}
                    onChange={manejarCambio}
                    required >

                    <option value="Disponible">Disponible</option>
                    <option value="Ocupada">Ocupada</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                </select>

            </div>

            <div className="d-flex justify-content-end gap-2">
                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={cancelar}
                >
                    Cancelar
                </button>

                <button
                    type="submit"
                    className="btn btn-success">
                    <i className="bi bi-check-circle me-2"></i>
                    {habitacion ? "Actualizar Habitación" : "Guardar Habitación"}

                </button>
            </div>

        </form>


    )
}

export default FormularioHabitacion