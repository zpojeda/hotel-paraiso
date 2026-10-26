import { useState , useEffect  } from "react"
import FormularioHabitacion from "./FormularioHabitacion"
import Swal from "sweetalert2"

import DataTable from "react-data-table-component"

const habitacionesIniciales =[
    {
        id:1,
        nombre:"Habitación Estandar",
        precio:150000,
        estado:"Disponible"

    }, 
    {
        id:2,
        nombre:"Habitación Premiun",
        precio:250000,
        estado:"Disponible"

    },
    {
        id:3,
        nombre:"Habitación Suite",
        precio:500000,
        estado:"Mantenimiento"

    }
]


function TablaHabitaciones() {
    const [habitaciones, setHabitaciones] = useState(() => {
        const guardadas = localStorage.getItem("habitacionesHotel")
        return guardadas ? JSON.parse(guardadas) : habitacionesIniciales
    })
    const [mostrarFormulario , setMostrarFormulario] = useState(false)
    const [habitacionEditando, setHabitacionEditando] = useState(null)
    
    useEffect(() => {
        localStorage.setItem("habitacionesHotel", JSON.stringify(habitaciones))
    }, [habitaciones] )

    const [busqueda , setBusqueda] = useState("")

    const editarHabitacion = (habitacion) => {
        setHabitacionEditando(habitacion)
        setMostrarFormulario(true)
    }

    const guardarHabitacion = (datos) => {
        if (habitacionEditando) {
            const habitacionesActualizadas = habitaciones.map((habitacion) =>
                habitacion.id === habitacionEditando.id
                    ? { ...datos, id: habitacion.id }
                    : habitacion
            )
            localStorage.setItem("habitacionesHotel", JSON.stringify(habitacionesActualizadas))
            setHabitaciones(habitacionesActualizadas)
            Swal.fire({
                title: "Habitacion actualizada",
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            })
        } else {
            setHabitaciones((actuales) => [
                ...actuales,
                {
                    ...datos,
                    id: Math.max(0, ...actuales.map((habitacion) => habitacion.id)) + 1
                }
            ])
        }

        setMostrarFormulario(false)
        setHabitacionEditando(null)
    }

    const cancelarFormulario = () => {
        setMostrarFormulario(false)
        setHabitacionEditando(null)
    }

    const eliminarHabitacion = (habitacion) => {
        Swal.fire({
            title :"Eliminar Habitación ?",
            text: `Se quitará la habitación ${habitacion.nombre}`, 
            icon:"warning",
            showCancelButton: true,
            confirmButtonText:"Si, eliminar",
            cancelButtonText:"Cancelar",
            confirmButtonColor:"#344c5c",

        }).then((resultado) => {
            if (resultado.isConfirmed) {
                setHabitaciones(
                    habitaciones.filter((h) => h.id !== habitacion.id)
                )
                Swal.fire({
                    title:"Eliminada",
                    text:"La habitacion se elimino correctamente",
                    icon:"success", 
                    confirmButtonColor:"#344c5c"

                })
            }
        })
    }

    const columnas =[
        {
            name:"ID",
            selector:fila => fila.id,
            sortable:true
        }, 
        {
            name:"Habitación",
            selector:fila => fila.nombre,
            sortable:true
        }, 
        {
            name:"Precio",
            selector:fila => fila.precio,
            format: fila => `$${fila.precio.toLocaleString('es-CO')}`, 
            sortable:true
        },
        {
            name:"Estado",
            selector:fila => fila.estado,
            sortable:true
        }, 
        {
            name:"Acciones",
            cell: (fila) => (
                <div className="d-flex gap-2">
                    <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => editarHabitacion(fila)}
                    >
                        <i className="bi bi-pencil-square"></i>
                    </button>

                    <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => eliminarHabitacion(fila)}
                    >
                        <i className="bi bi-trash"></i>
                    </button>

                </div>
            )

        } 
        
    ]

    const habitacionesFiltradas = habitaciones.filter((habitacion) =>
        habitacion.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        habitacion.estado.toLowerCase().includes(busqueda.toLowerCase()) 
    ) 


    return(
        <section className="hp-panel">
            
            <div className="d-flex justify-content-between align-items-center mb-3">
            
            <h2 className="mb-0">Gestión de habitaciones</h2>
            <button
            className="btn-nueva-habitacion"
            onClick={() => {
                setHabitacionEditando(null)
                setMostrarFormulario(true)
            }}
            >
                + Nueva Habitación 
            </button>

             </div>   

            {mostrarFormulario && (
                <div className="card p-4 mb-4">
                    <h5 className="mb-3">
                        {habitacionEditando ? "Editar Habitación" : "Registrar Habitación"}
                    </h5>
                    <FormularioHabitacion 
                    key={habitacionEditando?.id ?? "nueva"}
                    habitacion={habitacionEditando}
                    guardar={guardarHabitacion}
                    cancelar={cancelarFormulario}
                    />
                </div>
            )}


            <p className="text-secondary"> Consulta y Administración de habitaciones </p>
        
            <div className="mt-4">

                  <input 
                  type="text"
                  className="form-control mb-3"
                  placeholder="Buscar por habitacion nombre o estado"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  />  

                <DataTable  
                columns={columnas}
                data={habitacionesFiltradas}
                pagination
                highlightOnHover
                striped
                responsive
                noDataComponent="No hay habitaciones registradas"
                
                />
            </div>
        
        </section>
    )
}

export  default TablaHabitaciones