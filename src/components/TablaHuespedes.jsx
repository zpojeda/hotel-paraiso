import { useMemo, useState } from "react"
import DataTable from "react-data-table-component"
import Swal from "sweetalert2"
import { actualizarEstadoCliente } from "../utils/clientesStorage"
import { obtenerReservas } from "../utils/reservasStorage"

function normalizarTexto(valor = "") {
    return String(valor)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("es")
        .trim()
}

function leerReservasIniciales() {
    try {
        return { reservas: obtenerReservas(), error: "" }
    } catch (error) {
        return {
            reservas: [],
            error: error.message || "No se pudieron cargar las reservas."
        }
    }
}

function TablaHuespedes({ clientes, onClienteActualizado }) {
    const [busqueda, setBusqueda] = useState("")
    const [huespedSeleccionadoId, setHuespedSeleccionadoId] = useState(null)
    const [estadoReservas] = useState(leerReservasIniciales)
    const { reservas, error } = estadoReservas

    const huespedesFiltrados = useMemo(() => {
        const termino = normalizarTexto(busqueda)
        return clientes.filter(cliente => {
            const nombre = cliente.perfil?.nombre || ""
            return normalizarTexto(nombre).includes(termino) ||
                normalizarTexto(cliente.correo).includes(termino)
        })
    }, [busqueda, clientes])

    const huespedSeleccionado = clientes.find(
        cliente => cliente.id === huespedSeleccionadoId
    )
    const reservasHuesped = reservas.filter(
        reserva => reserva.clienteId === huespedSeleccionadoId
    )

    const cambiarEstado = async cliente => {
        const activar = cliente.activo === false
        const resultado = await Swal.fire({
            title: activar ? "¿Activar huésped?" : "¿Inactivar huésped?",
            text: activar
                ? "El huésped podrá volver a iniciar sesión y realizar reservas."
                : "El huésped no podrá iniciar sesión ni realizar nuevas reservas. Sus datos y reservas se conservarán.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: activar ? "Sí, activar" : "Sí, inactivar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#344c5c"
        })

        if (!resultado.isConfirmed) {
            return
        }

        try {
            const clienteActualizado = actualizarEstadoCliente(cliente.id, activar)
            onClienteActualizado(clienteActualizado)
            await Swal.fire({
                title: activar ? "Huésped activado" : "Huésped inactivado",
                text: activar
                    ? "El huésped ya puede iniciar sesión y realizar reservas."
                    : "Se conservaron sus datos y el historial de reservas.",
                icon: "success",
                confirmButtonColor: "#344c5c"
            })
        } catch (error) {
            await Swal.fire({
                title: "No se pudo actualizar el estado",
                text: error.message || "Ocurrió un error al guardar los cambios.",
                icon: "error",
                confirmButtonColor: "#344c5c"
            })
        }
    }

    const columnasHuespedes = [
        {
            name: "Nombre",
            selector: fila => fila.perfil?.nombre || "Sin nombre",
            sortable: true
        },
        {
            name: "Correo",
            selector: fila => fila.correo,
            sortable: true
        },
        {
            name: "Teléfono",
            selector: fila => fila.perfil?.telefono || "—",
            sortable: true
        },
        {
            name: "Reservas",
            selector: fila => reservas.filter(reserva => reserva.clienteId === fila.id).length,
            sortable: true,
            center: true
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
                <button
                    type="button"
                    className={`btn btn-sm ${fila.activo === false ? "btn-outline-success" : "btn-outline-danger"}`}
                    aria-label={`${fila.activo === false ? "Activar" : "Inactivar"} a ${fila.perfil?.nombre || fila.correo}`}
                    onClick={evento => {
                        evento.stopPropagation()
                        cambiarEstado(fila)
                    }}
                >
                    <i
                        className={`bi ${fila.activo === false ? "bi-person-check" : "bi-person-slash"} me-1`}
                        aria-hidden="true"
                    ></i>
                    {fila.activo === false ? "Activar" : "Inactivar"}
                </button>
            )
        }
    ]

    const columnasReservas = [
        {
            name: "Código",
            selector: fila => fila.id,
            sortable: true
        },
        {
            name: "Habitación",
            selector: fila => fila.habitacion || "—",
            sortable: true
        },
        {
            name: "Entrada",
            selector: fila => fila.entrada || "—",
            sortable: true
        },
        {
            name: "Salida",
            selector: fila => fila.salida || "—",
            sortable: true
        },
        {
            name: "Estado",
            cell: fila => {
                const claseEstado = fila.estado === "Confirmada"
                    ? "text-bg-success"
                    : fila.estado === "Pendiente"
                        ? "text-bg-warning"
                        : fila.estado === "Cancelada"
                            ? "text-bg-secondary"
                            : "text-bg-light"

                return (
                    <span className={`badge ${claseEstado}`}>
                        {fila.estado || "Sin estado"}
                    </span>
                )
            },
            sortable: true,
            selector: fila => fila.estado || ""
        }
    ]

    return (
        <section className="hp-panel hp-huespedes">
            <div className="hp-panel-header">
                <div>
                    <h2>Huéspedes registrados</h2>
                    <p>Busca por nombre o correo y selecciona un huésped para consultar sus reservas.</p>
                </div>
                <span className="hp-demo-tag">{clientes.length} registrados</span>
            </div>

            <div className="hp-huespedes-busqueda">
                <label className="visually-hidden" htmlFor="buscar-huesped">
                    Buscar huéspedes por nombre o correo
                </label>
                <div className="input-group">
                    <span className="input-group-text">
                        <i className="bi bi-search" aria-hidden="true"></i>
                    </span>
                    <input
                        id="buscar-huesped"
                        type="search"
                        className="form-control"
                        placeholder="Buscar por nombre o correo..."
                        value={busqueda}
                        onChange={evento => {
                            setBusqueda(evento.target.value)
                            setHuespedSeleccionadoId(null)
                        }}
                    />
                </div>
            </div>

            <DataTable
                columns={columnasHuespedes}
                data={huespedesFiltrados}
                pagination
                highlightOnHover
                pointerOnHover
                responsive
                onRowClicked={huesped => setHuespedSeleccionadoId(huesped.id)}
                noDataComponent="No se encontraron huéspedes."
            />

            {huespedSeleccionado && (
                <section className="hp-huesped-detalle" aria-live="polite">
                    <div className="hp-panel-header">
                        <div>
                            <p className="hp-eyebrow">DETALLE DEL HUÉSPED</p>
                            <h2>{huespedSeleccionado.perfil?.nombre || "Sin nombre"}</h2>
                        </div>
                        <span className="hp-demo-tag">
                            {reservasHuesped.length} {reservasHuesped.length === 1 ? "reserva" : "reservas"}
                        </span>
                    </div>

                    <dl className="hp-huesped-datos">
                        <div>
                            <dt>Correo</dt>
                            <dd>{huespedSeleccionado.correo || "—"}</dd>
                        </div>
                        <div>
                            <dt>Teléfono</dt>
                            <dd>{huespedSeleccionado.perfil?.telefono || "—"}</dd>
                        </div>
                        <div>
                            <dt>Fecha de nacimiento</dt>
                            <dd>{huespedSeleccionado.perfil?.fechaNacimiento || "—"}</dd>
                        </div>
                        <div>
                            <dt>Dirección</dt>
                            <dd>
                                {[huespedSeleccionado.perfil?.direccion, huespedSeleccionado.perfil?.ciudad]
                                    .filter(Boolean)
                                    .join(", ") || "—"}
                            </dd>
                        </div>
                    </dl>

                    <h3 className="hp-huesped-reservas-titulo">Reservas asociadas</h3>
                    {error ? (
                        <div className="alert alert-danger mb-0" role="alert">{error}</div>
                    ) : (
                        <DataTable
                            columns={columnasReservas}
                            data={reservasHuesped}
                            pagination
                            highlightOnHover
                            responsive
                            noDataComponent="Este huésped no tiene reservas asociadas."
                        />
                    )}
                </section>
            )}

            {!huespedSeleccionado && huespedesFiltrados.length > 0 && (
                <p className="hp-huesped-seleccion text-secondary">
                    Selecciona un huésped de la tabla para ver sus datos y reservas.
                </p>
            )}

            {error && !huespedSeleccionado && (
                <div className="alert alert-danger mt-3 mb-0" role="alert">{error}</div>
            )}
        </section>
    )
}

export default TablaHuespedes
