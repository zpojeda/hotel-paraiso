import { useMemo, useState } from "react"
import DataTable from "react-data-table-component"
import Swal from "sweetalert2"
import FormularioTarea from "./FormularioTarea"
import { obtenerEmpleados } from "../utils/empleadosStorage"
import { cancelarTarea, guardarTarea, obtenerTareas } from "../utils/tareasStorage"

function leerDatosIniciales() {
    try {
        return {
            tareas: obtenerTareas(),
            empleados: obtenerEmpleados(),
            error: ""
        }
    } catch (error) {
        return {
            tareas: [],
            empleados: [],
            error: error.message || "No se pudieron cargar las asignaciones."
        }
    }
}

function TablaTareas({ empleadoId = null, soloLectura = false }) {
    const [datos, setDatos] = useState(leerDatosIniciales)
    const { tareas, empleados, error } = datos
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [tareaEditando, setTareaEditando] = useState(null)

    const tareasVisibles = useMemo(() => {
        const listado = empleadoId
            ? tareas.filter(tarea => tarea.empleadoId === empleadoId)
            : tareas

        return [...listado].sort((a, b) =>
            `${a.fecha}T${a.horaInicio}`.localeCompare(`${b.fecha}T${b.horaInicio}`)
        )
    }, [empleadoId, tareas])

    const empleadosActivos = empleados.filter(empleado => empleado.activo !== false)
    const obtenerNombreEmpleado = id =>
        empleados.find(empleado => empleado.id === id)?.nombre || "Empleado no disponible"

    const cerrarFormulario = () => {
        setMostrarFormulario(false)
        setTareaEditando(null)
    }

    const manejarGuardado = async formulario => {
        try {
            const tareasActualizadas = guardarTarea(formulario, tareaEditando?.id)
            setDatos(actuales => ({ ...actuales, tareas: tareasActualizadas, error: "" }))
            cerrarFormulario()
            await Swal.fire({
                icon: "success",
                title: tareaEditando ? "Asignación actualizada" : "Tarea asignada",
                confirmButtonColor: "#344c5c",
                timer: 1800,
                showConfirmButton: false
            })
        } catch (errorGuardado) {
            await Swal.fire({
                icon: "error",
                title: "No se pudo guardar la asignación",
                text: errorGuardado.message || "Ocurrió un error al guardar la tarea.",
                confirmButtonColor: "#344c5c"
            })
        }
    }

    const manejarCancelacion = async tarea => {
        const resultado = await Swal.fire({
            title: "¿Cancelar esta asignación?",
            text: "La tarea se conservará en el historial con estado Cancelada.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, cancelar tarea",
            cancelButtonText: "Volver",
            confirmButtonColor: "#344c5c"
        })

        if (!resultado.isConfirmed) {
            return
        }

        try {
            const tareasActualizadas = cancelarTarea(tarea.id)
            setDatos(actuales => ({ ...actuales, tareas: tareasActualizadas, error: "" }))
        } catch (errorCancelacion) {
            await Swal.fire({
                icon: "error",
                title: "No se pudo cancelar la tarea",
                text: errorCancelacion.message || "Ocurrió un error al cancelar la asignación.",
                confirmButtonColor: "#344c5c"
            })
        }
    }

    const columnas = [
        ...(!empleadoId ? [{
            name: "Empleado",
            selector: fila => obtenerNombreEmpleado(fila.empleadoId),
            sortable: true
        }] : []),
        {
            name: "Tarea",
            selector: fila => fila.tipo,
            sortable: true
        },
        {
            name: "Piso / habitación",
            selector: fila => [fila.piso && `Piso ${fila.piso}`, fila.habitacion && `Hab. ${fila.habitacion}`]
                .filter(Boolean)
                .join(" · ") || "—",
            sortable: true
        },
        {
            name: "Fecha",
            selector: fila => fila.fecha,
            sortable: true
        },
        {
            name: "Inicio",
            selector: fila => fila.horaInicio,
            sortable: true
        },
        {
            name: "Fin",
            selector: fila => fila.horaFin,
            sortable: true
        },
        {
            name: "Estado",
            selector: fila => fila.estado,
            sortable: true,
            cell: fila => {
                const clases = {
                    Pendiente: "text-bg-warning",
                    "En curso": "text-bg-primary",
                    Completada: "text-bg-success",
                    Cancelada: "text-bg-secondary"
                }
                return <span className={`badge ${clases[fila.estado] || "text-bg-light"}`}>{fila.estado}</span>
            }
        },
        ...(!soloLectura ? [{
            name: "Acciones",
            button: true,
            minWidth: "170px",
            cell: fila => (
                <div className="hp-tareas-acciones">
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        disabled={fila.estado === "Cancelada"}
                        onClick={() => {
                            setTareaEditando(fila)
                            setMostrarFormulario(true)
                        }}
                    >
                        <i className="bi bi-pencil-square me-1" aria-hidden="true"></i>
                        Editar
                    </button>
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        disabled={fila.estado === "Cancelada"}
                        onClick={() => manejarCancelacion(fila)}
                    >
                        Cancelar
                    </button>
                </div>
            )
        }] : [])
    ]

    return (
        <section className="hp-panel hp-tareas">
            <div className="hp-panel-header hp-tareas-header">
                <div>
                    <h2>{soloLectura ? "Mis tareas asignadas" : "Gestión de tareas"}</h2>
                    <p>
                        {soloLectura
                            ? "Consulta tus tareas, horarios y estados."
                            : "Asigna tareas al personal y administra sus horarios."}
                    </p>
                </div>
                {!soloLectura && (
                    <button
                        type="button"
                        className="btn-nueva-habitacion"
                        disabled={!empleadosActivos.length}
                        onClick={() => {
                            setTareaEditando(null)
                            setMostrarFormulario(true)
                        }}
                    >
                        <i className="bi bi-calendar-plus me-2" aria-hidden="true"></i>
                        Nueva asignación
                    </button>
                )}
            </div>

            {error && <div className="alert alert-danger" role="alert">{error}</div>}

            {!soloLectura && empleadosActivos.length === 0 && !error && (
                <div className="alert alert-warning" role="status">
                    No hay empleados activos para asignar tareas.
                </div>
            )}

            {mostrarFormulario && (
                <div className="card p-4 mb-4 hp-tareas-formulario">
                    <h3 className="h5 mb-3">{tareaEditando ? "Editar asignación" : "Asignar tarea"}</h3>
                    <FormularioTarea
                        key={tareaEditando?.id ?? "nueva"}
                        tarea={tareaEditando}
                        empleados={empleadosActivos}
                        guardar={manejarGuardado}
                        cancelar={cerrarFormulario}
                    />
                </div>
            )}

            <DataTable
                columns={columnas}
                data={tareasVisibles}
                pagination
                highlightOnHover
                striped
                responsive
                noDataComponent={soloLectura
                    ? "Aún no tienes tareas asignadas."
                    : "No hay asignaciones registradas."}
            />
        </section>
    )
}

export default TablaTareas
