import { useMemo, useState } from "react"
import DataTable from "react-data-table-component"
import Swal from "sweetalert2"
import FormularioEmpleado from "./FormularioEmpleado"
import {
    actualizarEstadoEmpleado,
    guardarEmpleado,
    obtenerEmpleados
} from "../utils/empleadosStorage"

function normalizarTexto(valor = "") {
    return String(valor)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("es")
        .trim()
}

function leerEmpleadosIniciales() {
    try {
        return { empleados: obtenerEmpleados(), error: "" }
    } catch (error) {
        return {
            empleados: [],
            error: error.message || "No se pudieron cargar los empleados."
        }
    }
}

function TablaEmpleados() {
    const [estadoEmpleados, setEstadoEmpleados] = useState(leerEmpleadosIniciales)
    const { empleados, error } = estadoEmpleados
    const [busqueda, setBusqueda] = useState("")
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [empleadoEditando, setEmpleadoEditando] = useState(null)

    const empleadosFiltrados = useMemo(() => {
        const termino = normalizarTexto(busqueda)
        return empleados.filter(empleado =>
            normalizarTexto(empleado.nombre).includes(termino) ||
            normalizarTexto(empleado.documento).includes(termino) ||
            normalizarTexto(empleado.cargo).includes(termino)
        )
    }, [busqueda, empleados])

    const abrirRegistro = () => {
        setEmpleadoEditando(null)
        setMostrarFormulario(true)
    }

    const editarEmpleado = empleado => {
        setEmpleadoEditando(empleado)
        setMostrarFormulario(true)
    }

    const cancelarFormulario = () => {
        setMostrarFormulario(false)
        setEmpleadoEditando(null)
    }

    const manejarGuardado = async datos => {
        try {
            const empleadosActualizados = guardarEmpleado(datos, empleadoEditando?.id)
            setEstadoEmpleados({ empleados: empleadosActualizados, error: "" })
            cancelarFormulario()
            await Swal.fire({
                icon: "success",
                title: empleadoEditando ? "Empleado actualizado" : "Empleado registrado",
                confirmButtonColor: "#344c5c",
                timer: 1800,
                showConfirmButton: false
            })
        } catch (errorGuardado) {
            await Swal.fire({
                icon: "error",
                title: "No se pudo guardar el empleado",
                text: errorGuardado.message || "Ocurrió un error al guardar los datos.",
                confirmButtonColor: "#344c5c"
            })
        }
    }

    const cambiarEstado = async empleado => {
        const activar = empleado.activo === false
        const resultado = await Swal.fire({
            title: activar ? "¿Activar empleado?" : "¿Inhabilitar empleado?",
            text: activar
                ? "El empleado volverá a figurar como activo."
                : "El registro del empleado se conservará y podrá activarse nuevamente.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: activar ? "Sí, activar" : "Sí, inhabilitar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#344c5c"
        })

        if (!resultado.isConfirmed) {
            return
        }

        try {
            const empleadosActualizados = actualizarEstadoEmpleado(empleado.id, activar)
            setEstadoEmpleados({ empleados: empleadosActualizados, error: "" })
            await Swal.fire({
                icon: "success",
                title: activar ? "Empleado activado" : "Empleado inhabilitado",
                confirmButtonColor: "#344c5c",
                timer: 1800,
                showConfirmButton: false
            })
        } catch (errorEstado) {
            await Swal.fire({
                icon: "error",
                title: "No se pudo actualizar el estado",
                text: errorEstado.message || "Ocurrió un error al actualizar el empleado.",
                confirmButtonColor: "#344c5c"
            })
        }
    }

    const columnas = [
        {
            name: "Documento",
            selector: fila => fila.documento,
            sortable: true
        },
        {
            name: "Nombre",
            selector: fila => fila.nombre,
            sortable: true
        },
        {
            name: "Correo",
            selector: fila => fila.correo,
            sortable: true
        },
        {
            name: "Teléfono",
            selector: fila => fila.telefono,
            sortable: true
        },
        {
            name: "Cargo",
            selector: fila => fila.cargo,
            sortable: true
        },
        {
            name: "Estado",
            selector: fila => fila.activo === false ? "Inactivo" : "Activo",
            sortable: true,
            cell: fila => (
                <span className={`badge ${fila.activo === false ? "text-bg-secondary" : "text-bg-success"}`}>
                    {fila.activo === false ? "Inactivo" : "Activo"}
                </span>
            )
        },
        {
            name: "Acciones",
            button: true,
            cell: fila => (
                <div className="hp-empleados-acciones">
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-primary hp-empleado-accion"
                        aria-label={`Editar a ${fila.nombre}`}
                        onClick={() => editarEmpleado(fila)}
                    >
                        <i className="bi bi-pencil-square me-1" aria-hidden="true"></i>
                        Editar
                    </button>
                    <button
                        type="button"
                        className={`btn btn-sm hp-empleado-accion ${fila.activo === false ? "btn-outline-success" : "btn-outline-danger"}`}
                        aria-label={`${fila.activo === false ? "Activar" : "Inhabilitar"} a ${fila.nombre}`}
                        onClick={() => cambiarEstado(fila)}
                    >
                        <i
                            className={`bi ${fila.activo === false ? "bi-person-check" : "bi-person-slash"} me-1`}
                            aria-hidden="true"
                        ></i>
                        {fila.activo === false ? "Activar" : "Inhabilitar"}
                    </button>
                </div>
            )
        }
    ]

    return (
        <section className="hp-panel hp-empleados">
            <div className="hp-panel-header hp-empleados-header">
                <div>
                    <h2>Gestión de empleados</h2>
                    <p>Registra, consulta y actualiza la información del personal del hotel.</p>
                </div>
                <button type="button" className="btn-nueva-habitacion" onClick={abrirRegistro}>
                    <i className="bi bi-person-plus me-2" aria-hidden="true"></i>
                    Nuevo empleado
                </button>
            </div>

            {error && <div className="alert alert-danger" role="alert">{error}</div>}

            {mostrarFormulario && (
                <div className="card p-4 mb-4 hp-empleados-formulario">
                    <h3 className="h5 mb-3">
                        {empleadoEditando ? "Editar empleado" : "Registrar empleado"}
                    </h3>
                    <FormularioEmpleado
                        key={empleadoEditando?.id ?? "nuevo"}
                        empleado={empleadoEditando}
                        guardar={manejarGuardado}
                        cancelar={cancelarFormulario}
                    />
                </div>
            )}

            <div className="hp-empleados-busqueda">
                <label className="visually-hidden" htmlFor="buscar-empleado">
                    Buscar empleado por nombre, documento o cargo
                </label>
                <div className="input-group">
                    <span className="input-group-text">
                        <i className="bi bi-search" aria-hidden="true"></i>
                    </span>
                    <input
                        id="buscar-empleado"
                        type="search"
                        className="form-control"
                        placeholder="Buscar por nombre, documento o cargo..."
                        value={busqueda}
                        onChange={evento => setBusqueda(evento.target.value)}
                    />
                </div>
            </div>

            <DataTable
                columns={columnas}
                data={empleadosFiltrados}
                pagination
                highlightOnHover
                striped
                responsive
                noDataComponent={empleados.length
                    ? "No se encontraron empleados con esa búsqueda."
                    : "No hay empleados registrados."}
            />
        </section>
    )
}

export default TablaEmpleados
