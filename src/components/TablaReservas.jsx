import FormularioReserva from "./FormularioReserva"
import Swal from "sweetalert2"
import { useState } from "react"
import DataTable from "react-data-table-component"
import { createRoot } from "react-dom/client"
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
function TablaReservas() {
    const [reservas, setReservas] = useState(reservasIniciales)
    const [busqueda, setBusqueda] = useState("")
    const abrirFormulario = async () => {
        const contenedor = document.createElement("div")
        const raiz = createRoot(contenedor)

        raiz.render(
            <FormularioReserva
            reserva={null}
            guardar={(datos) => {
                console.log("Nueva reserva:" , datos)
                Swal.close()
            }}
            cancelar={() => Swal.close()}
            />
        )
        await Swal.fire({
            title: "Nueva Reserva",
            html:contenedor,
            showConfirmButton: false,
            didClose: () => raiz.unmount()
        })
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
                        onClick={() => alert(`Editar Reserva ${fila.id}`)}
                    >
                        <i className="bi bi-pencil-square"></i>
                    </button>
                    <button
                        className="btn btn-sm btn-outline-danger"
                        title="Eliminar"
                        onClick={() => alert(`Eliminar Reserva ${fila.id}`)}
                    >
                        <i className="bi bi-trash"></i>
                    </button>
                </div>
            )
        }

    ]

    const reservasFiltradas = reservas.filter(reserva =>
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
             onClick={abrirFormulario}
             
             >   
             <i className="bi bi-plus-circle me-2"></i>
             Nueva Reserva
            </button>
              </div>
            <DataTable 
            columns={columnas}
            data={reservasFiltradas}
            pagination
            highlightOnHover
            responsive
            noDataComponent="No se encontraro reservas"
            />
          </div> 
    )
}

export default TablaReservas