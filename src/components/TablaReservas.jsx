import FormularioReserva from "./FormularioReserva"
import Swal from "sweetalert2"
import { useState , useEffect } from "react"
import DataTable from "react-data-table-component"
import { createRoot } from "react-dom/client"
import { obtenerClientePorId, obtenerClientes } from "../utils/clientesStorage"
import { generarCodigoReserva } from "../utils/reservasStorage"
import { formatearPrecioHabitacion, obtenerHabitaciones } from "../utils/habitacionesStorage"
const reservasIniciales = [
    {
        id: 1,
        habitacion: "Suite 201",
        entrada: "2026-10-19",
        salida: "2016-10-28",
        estado: "Confirmada"
    },
    {
        id: 2,
        habitacion: "Doble 106",
        entrada: "2026-11-10",
        salida: "2016-11-15",
        estado: "Pendiente"
    }
]
function TablaReservas({ clienteId, esAdmin = false }) {
    const [reservas, setReservas] = useState(() =>{
        const guardadas = localStorage.getItem("reservasHotel")
        return guardadas ? JSON.parse(guardadas) : reservasIniciales
    })
    const [clientes] = useState(() => esAdmin ? obtenerClientes() : [])
    const [busqueda, setBusqueda] = useState("")

    const abrirFormulario = async (reserva = null) => {
        if (!esAdmin) {
            try {
                const cliente = obtenerClientePorId(clienteId)
                if (!cliente || cliente.activo === false) {
                    await Swal.fire({
                        icon: "warning",
                        title: "Cuenta inactiva",
                        text: "No puedes realizar reservas con una cuenta inactiva. Contacta al hotel para recibir ayuda.",
                        confirmButtonColor: "#344c5c"
                    })
                    return
                }
            } catch (error) {
                await Swal.fire({
                    icon: "error",
                    title: "No se pudo validar la cuenta",
                    text: error.message || "Intenta nuevamente más tarde.",
                    confirmButtonColor: "#344c5c"
                })
                return
            }
        }

        let habitaciones;
        try {
            habitaciones = obtenerHabitaciones();
        } catch (error) {
            await Swal.fire({
                icon: "error",
                title: "No se pudieron cargar las habitaciones",
                text: error.message,
                confirmButtonColor: "#344c5c"
            });
            return;
        }

        const contenedor = document.createElement("div")
        const raiz = createRoot(contenedor)

        raiz.render(
            <FormularioReserva
            reserva={reserva}
            clienteId={clienteId}
            esAdmin={esAdmin}
            clientes={clientes}
            habitaciones={habitaciones}
            reservas={reservas}
            guardar={(datos) => {
                if (!esAdmin) {
                    try {
                        const cliente = obtenerClientePorId(clienteId)
                        if (!cliente || cliente.activo === false) {
                            Swal.fire({
                                icon: "warning",
                                title: "Cuenta inactiva",
                                text: "No puedes realizar reservas con una cuenta inactiva. Contacta al hotel para recibir ayuda.",
                                confirmButtonColor: "#344c5c"
                            })
                            return
                        }
                    } catch (error) {
                        Swal.fire({
                            icon: "error",
                            title: "No se pudo validar la cuenta",
                            text: error.message || "Intenta nuevamente más tarde.",
                            confirmButtonColor: "#344c5c"
                        })
                        return
                    }
                }

                if (reserva){ 
                    setReservas(actuales =>
                        actuales.map(r =>
                            r.id === reserva.id
                                ? { ...r, ...datos, clienteId: esAdmin ? datos.clienteId : r.clienteId }
                                : r
                        )
                    )

                }else {
                const nuevaReserva = {
                    id: generarCodigoReserva(reservas),
                   ...datos,
                }
                setReservas(actuales => [...actuales, nuevaReserva])
            }
                Swal.close()
            }}
            cancelar={() => Swal.close()}
            />
        )
        await Swal.fire({
            title: reserva ? "Editar Reserva" : "Nueva Reserva",
            html:contenedor,
            showConfirmButton: false,
            didClose: () => raiz.unmount()
        })
    }
    useEffect(() => {
        localStorage.setItem("reservasHotel", JSON.stringify(reservas))
    }, [reservas])

    const eliminarReserva = async (id) => {
        const resultado = await Swal.fire({
            title:" Eliminar reserva ?",
            text:"Esta accion eliminara la reserva", 
            icon:"warning",
            showCancelButton: true, 
            confirmButtonText: "Si, eliminar", 
            confirmButtonColor: "#dc3545"
        })

        if (resultado.isConfirmed){
            setReservas(actuales => 
                actuales.filter(reserva => reserva.id !== id )

            )
            Swal.fire("Reserva eliminada", )
        }
    }    

    const columnas = [
        {
            name: "Codigo",
            selector: fila => fila.id,
            sortable: true
        },
        {
            name: "Habitación",
            selector: fila => fila.habitacion,
            sortable: true
        },
        {
            name: "Tipo",
            selector: fila => fila.habitacionTipo || "—",
            sortable: true
        },
        {
            name: "Precio",
            selector: fila => fila.habitacionPrecio ?? "",
            format: fila => fila.habitacionPrecio == null
                ? "—"
                : formatearPrecioHabitacion(fila.habitacionPrecio),
            sortable: true
        },
        ...(esAdmin ? [{
            name: "Cliente",
            selector: fila => {
                const cliente = clientes.find(item => item.id === fila.clienteId);
                return cliente
                    ? cliente.perfil?.nombre || cliente.correo
                    : "Sin asignar";
            },
            sortable: true
        }] : []),
        {
            name: "Entrada",
            selector: fila => fila.entrada,
            sortable: true
        },
        {
            name: "Salida",
            selector: fila => fila.salida,
            sortable: true
        },
        {
            name: "Estado",
            selector: fila => fila.estado,
            sortable: true
        },
        {
            name: "Acciones",
            cell: fila => (
                <div className="d-flex gap-2">
                    <button
                        className="btn btn-sm btn-outline-primary"
                        title="Editar"
                        onClick={() => abrirFormulario(fila)}
                    >
                        <i className="bi bi-pencil-square"></i>
                    </button>
                    <button
                        className="btn btn-sm btn-outline-danger"
                        title="Eliminar"
                        onClick={() => eliminarReserva(fila.id)}
                    >
                        <i className="bi bi-trash"></i>
                    </button>
                </div>
            )
        }

    ]



    const reservasPropias = esAdmin
        ? reservas
        : reservas.filter(reserva => reserva.clienteId === clienteId);
    const reservasFiltradas = reservasPropias.filter(reserva =>
        reserva.habitacion.toLowerCase().includes(busqueda.toLowerCase()) ||
        reserva.estado.toLowerCase().includes(busqueda.toLowerCase())
    )

    return(
        <div>
            <div className="d-flex justify-content-between mb-3 gap-2 ">
                <input
                type="text"
                className="form-control"
                style={{ maxWidth:"280px" }}
                placeholder="Buscar reserva..."
                value={busqueda}
                onChange={e =>setBusqueda(e.target.value)}
                />
             <button
             className="btn text-white"
             style={{ backgroundColor:"#344c5c" }}
             onClick={() => abrirFormulario()}
             
             >   
             <i className="bi bi-plus-circle me-2"></i>
             {esAdmin ? "Nueva Reserva" : "Reservar habitación"}
            </button>
              </div>
            <DataTable 
            columns={columnas}
            data={reservasFiltradas}
            pagination
            highlightOnHover
            responsive
            noDataComponent={esAdmin
                ? "No se encontraron reservas"
                : "Aún no tienes reservas. Crea una para verla aquí."}
            />
          </div> 
    )
}

export default TablaReservas