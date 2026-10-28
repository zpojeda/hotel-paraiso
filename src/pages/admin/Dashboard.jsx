import { useState } from 'react'
import Swal from 'sweetalert2'
import DataTable from 'react-data-table-component'
import Sidebar from '../../components/Sidebar'
import './Dashboard.css'
import TablaReservas from '../../components/TablaReservas'
import TablaHabitaciones from '../../components/TablaHabitaciones'
import TablaHuespedes from '../../components/TablaHuespedes'
import TablaEmpleados from '../../components/TablaEmpleados'
import TablaTareas from '../../components/TablaTareas'
import { obtenerClientes } from '../../utils/clientesStorage'

const reservas = [
  { id: 'R-001', huesped: 'Laura Gómez', habitacion: 'Suite 201', fecha: '18/10/2026', estado: 'Confirmada' },
  { id: 'R-002', huesped: 'Carlos Ruiz', habitacion: 'Doble 105', fecha: '19/10/2026', estado: 'Pendiente' },
  { id: 'R-003', huesped: 'Ana Torres', habitacion: 'Suite 203', fecha: '20/10/2026', estado: 'Confirmada' },
]

const secciones = ['Resumen', 'Habitaciones', 'Reservas', 'Huéspedes', 'Empleados', 'Tareas']

const estilosTablaReservas = {
  headRow: {
    style: {
      minHeight: '48px',
      backgroundColor: '#faf8f5',
      borderBottomColor: '#ebe6df'
    }
  },
  headCells: {
    style: {
      color: '#777',
      fontSize: '13px',
      fontWeight: 600,
      paddingLeft: '12px',
      paddingRight: '12px'
    }
  },
  rows: {
    style: {
      minHeight: '52px',
      color: '#292d31',
      fontSize: '14px'
    },
    highlightOnHoverStyle: {
      backgroundColor: '#faf8f5',
      outline: 'none'
    }
  },
  cells: {
    style: {
      paddingLeft: '12px',
      paddingRight: '12px'
    }
  },
  pagination: {
    style: {
      borderTopColor: '#f0ece6',
      color: '#777'
    }
  }
}

function Dashboard({ onLogout }) {
  const [seccion, setSeccion] = useState('Resumen')

  const [reservasClientes] = useState(() =>{
    const guardadas = localStorage.getItem("reservasHotel")
    return guardadas ? JSON.parse(guardadas) : []
  })
  const [clientes, setClientes] = useState(() => obtenerClientes())

    const confirmadas = reservasClientes.filter(
    reserva => reserva.estado === "Confirmada"
  ).length

  const pendientes = reservasClientes.filter(
    reserva => reserva.estado === "Pendiente"
  ).length

  const reservasRecientes = [
    ...reservas.map((reserva, indice) => ({
      ...reserva,
      tableKey: `demo-${indice}`
    })),
    ...reservasClientes.map(reserva => ({
      ...reserva,
      tableKey: `cliente-${reserva.id}`,
      huesped: clientes.find(cliente => cliente.id === reserva.clienteId)?.perfil?.nombre ||
        clientes.find(cliente => cliente.id === reserva.clienteId)?.correo ||
        "Sin asignar",
      fecha: reserva.entrada || "—"
    }))
  ]

  const columnasReservasRecientes = [
    {
      name: "Código",
      selector: fila => fila.id,
      sortable: true
    },
    {
      name: "Huésped",
      selector: fila => fila.huesped || "Sin asignar",
      sortable: true
    },
    {
      name: "Habitación",
      selector: fila => fila.habitacion || "—",
      sortable: true
    },
    {
      name: "Ingreso",
      selector: fila => fila.fecha || "—",
      sortable: true
    },
    {
      name: "Estado",
      selector: fila => fila.estado || "Sin estado",
      sortable: true,
      cell: fila => (
        <span className={`hp-status ${fila.estado === "Confirmada" ? "confirmed" : "pending"}`}>
          {fila.estado || "Sin estado"}
        </span>
      )
    }
  ]

  const confirmarSalida =() =>{
   
    Swal.fire({
      title:"¿Deseas cerrar Sesión?",
      text: "Regresaras a la pagina principal",
      icon: "question", 
      showCancelButton:true, 
      confirmButtonText:"Si, salir",
      cancelButtonText:"Cancelar", 
      confirmButtonColor:"#344c5c"
    }).then((resultado) => {
      if (resultado.isConfirmed) {
      onLogout()
    }
  })
}
  return (
    <div className="hp-dashboard">
      
      <Sidebar
        titulo='Administración'
        opciones={secciones}
        seccion={seccion}
        cambiarSeccion={setSeccion}
        cerrarSesion={confirmarSalida}
      />

      <main className="hp-main">
        <header className="hp-header">
          <div>
            <p className="hp-eyebrow">PANEL ADMINISTRATIVO</p>
            <h1>{seccion === 'Resumen' ? 'Bienvenido al Hotel Paraíso' : seccion}</h1>
            <p className="hp-subtitle">
              {seccion === 'Resumen'
                ? 'Resumen general de la operación del hotel'
                : seccion === 'Huéspedes'
                  ? 'Consulta de huéspedes y sus reservas asociadas'
                  : seccion === 'Empleados'
                    ? 'Registro y administración del personal del hotel'
                    : seccion === 'Tareas'
                      ? 'Asignación y seguimiento de tareas del personal'
                      : 'Consulta y gestión de reservas del hotel'}
            </p>
          </div>
          <div className="hp-user"><span className="hp-avatar">A</span><span>Administrador</span></div>
        </header>

        {seccion === 'Resumen' ? (
          <>
            <section className="hp-stats" aria-label="Indicadores del hotel">
              {[
                { titulo: 'Habitaciones', valor: '24', detalle: 'Total registradas', icono: '▤' },
                { titulo: 'Reservas', valor: reservasClientes.length, detalle: 'Reservas activas', icono: '▣' },
                { titulo: 'Confirmadas', valor: confirmadas, detalle :'Reservas confirmadas', icono: '✔️' },
                { titulo: 'Pendientes', valor: pendientes, detalle :'Reservas pendientes', icono: '⏳' },
                { titulo: 'Huéspedes', valor: clientes.length, detalle: 'Huéspedes registrados', icono: '♙' },
                { titulo: 'Ocupación', valor: '75%', detalle: 'Ocupación estimada', icono: '◕' },
              ].map((dato) => (
                <article className="hp-stat" key={dato.titulo}>
                  <div className="hp-stat-top"><span>{dato.titulo}</span><span className="hp-stat-icon">{dato.icono}</span></div>
                  <strong>{dato.valor}</strong>
                  <small>{dato.detalle}</small>
                </article>
              ))}
            </section>

            <section className="hp-panel">
              <div className="hp-panel-header">
                <div>
                  <h2>Reservas recientes</h2>
                  <p>Últimos registros del hotel</p>
                </div>
                <span className="hp-demo-tag">{reservasRecientes.length} reservas</span>
              </div>
              <DataTable
                columns={columnasReservasRecientes}
                data={reservasRecientes}
                keyField="tableKey"
                customStyles={estilosTablaReservas}
                pagination
                paginationPerPage={5}
                paginationRowsPerPageOptions={[5, 10, 15]}
                highlightOnHover
                striped
                responsive
                noDataComponent="No hay reservas recientes para mostrar."
              />
            </section>
          </>
        ): seccion === "Habitaciones" ? (
          <TablaHabitaciones />

        ) : seccion === "Reservas" ? (
          <TablaReservas esAdmin />

        ) : seccion === "Huéspedes" ? (
          <TablaHuespedes clientes={clientes} onClienteActualizado={clienteActualizado => {
            setClientes(actuales => actuales.map(cliente =>
              cliente.id === clienteActualizado.id ? clienteActualizado : cliente
            ))
          }} />

        ) : seccion === "Empleados" ? (
          <TablaEmpleados />

        ) : seccion === "Tareas" ? (
          <TablaTareas />

        ): (
          <section className="hp-panel hp-placeholder">
            <span className="hp-placeholder-icon">✦</span>
            <h2>Gestión de {seccion.toLowerCase()}</h2>
            <p>En las próximas clases construiremos las funcionalidades de este módulo.</p>
            <button type="button" onClick={() => setSeccion('Resumen')}>Volver al resumen</button>
          </section>
        )}
        <footer className="hp-footer">Hotel Paraíso · Proyecto académico React</footer>
      </main>
    </div>
  )
}

export default Dashboard
