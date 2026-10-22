import { useState } from 'react'
import Swal from 'sweetalert2'
import Sidebar from '../../components/Sidebar'
import './Dashboard.css'

const reservas = [
  { id: 'R-001', huesped: 'Laura Gómez', habitacion: 'Suite 201', fecha: '18/10/2026', estado: 'Confirmada' },
  { id: 'R-002', huesped: 'Carlos Ruiz', habitacion: 'Doble 105', fecha: '19/10/2026', estado: 'Pendiente' },
  { id: 'R-003', huesped: 'Ana Torres', habitacion: 'Suite 203', fecha: '20/10/2026', estado: 'Confirmada' },
]

const secciones = ['Resumen', 'Habitaciones', 'Reservas', 'Huéspedes']

function Dashboard({ onLogout }) {
  const [seccion, setSeccion] = useState('Resumen')
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
            <p className="hp-subtitle">{seccion === 'Resumen' ? 'Resumen general de la operación del hotel' : 'Módulo en preparación para las próximas clases'}</p>
          </div>
          <div className="hp-user"><span className="hp-avatar">A</span><span>Administrador</span></div>
        </header>

        {seccion === 'Resumen' ? (
          <>
            <section className="hp-stats" aria-label="Indicadores del hotel">
              {[
                { titulo: 'Habitaciones', valor: '24', detalle: 'Total registradas', icono: '▤' },
                { titulo: 'Reservas', valor: '18', detalle: 'Reservas activas', icono: '▣' },
                { titulo: 'Huéspedes', valor: '42', detalle: 'Huéspedes registrados', icono: '♙' },
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
              <div className="hp-panel-header"><div><h2>Reservas recientes</h2><p>Últimos registros del hotel</p></div><span className="hp-demo-tag">Datos de ejemplo</span></div>
              <div className="hp-table-wrap">
                <table className="hp-table">
                  <thead><tr><th>Código</th><th>Huésped</th><th>Habitación</th><th>Ingreso</th><th>Estado</th></tr></thead>
                  <tbody>
                    {reservas.map((reserva) => (
                      <tr key={reserva.id}>
                        <td>{reserva.id}</td><td>{reserva.huesped}</td><td>{reserva.habitacion}</td><td>{reserva.fecha}</td>
                        <td><span className={`hp-status ${reserva.estado === 'Confirmada' ? 'confirmed' : 'pending'}`}>{reserva.estado}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        ) : (
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
