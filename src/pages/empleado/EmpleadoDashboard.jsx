import { useState } from "react"
import Swal from "sweetalert2"
import Sidebar from "../../components/Sidebar"
import TablaTareas from "../../components/TablaTareas"
import { obtenerEmpleadoPorId } from "../../utils/empleadosStorage"
import "../admin/Dashboard.css"

function cargarEmpleado(empleadoId) {
    try {
        return { empleado: obtenerEmpleadoPorId(empleadoId), error: "" }
    } catch (error) {
        return {
            empleado: null,
            error: error.message || "No se pudo cargar la cuenta del empleado."
        }
    }
}

function EmpleadoDashboard({ empleadoId, onLogout }) {
    const [seccion, setSeccion] = useState("Mis tareas")
    const [estadoCuenta] = useState(() => cargarEmpleado(empleadoId))
    const { empleado, error } = estadoCuenta
    const cuentaActiva = empleado && empleado.activo !== false

    const confirmarSalida = async () => {
        const resultado = await Swal.fire({
            title: "¿Deseas cerrar sesión?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, salir",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#344c5c"
        })

        if (resultado.isConfirmed) {
            onLogout()
        }
    }

    if (!cuentaActiva) {
        return (
            <main className="hp-dashboard hp-main">
                <section className="hp-panel hp-empleado-inactivo" role="alert">
                    <h1>No se puede acceder al panel</h1>
                    <p>
                        {error || "La cuenta del empleado está inhabilitada o ya no existe. Contacta al administrador."}
                    </p>
                    <button type="button" className="btn-nueva-habitacion" onClick={onLogout}>
                        Cerrar sesión
                    </button>
                </section>
            </main>
        )
    }

    return (
        <div className="hp-dashboard">
            <Sidebar
                titulo="Espacio del empleado"
                opciones={["Mis tareas"]}
                seccion={seccion}
                cambiarSeccion={setSeccion}
                cerrarSesion={confirmarSalida}
            />
            <main className="hp-main">
                <header className="hp-header">
                    <div>
                        <p className="hp-eyebrow">PANEL DEL EMPLEADO</p>
                        <h1>Bienvenido, {empleado.nombre}</h1>
                        <p className="hp-subtitle">{empleado.cargo} · Consulta tus asignaciones</p>
                    </div>
                    <div className="hp-user">
                        <span className="hp-avatar">{empleado.nombre.charAt(0).toUpperCase()}</span>
                        <span>{empleado.nombre}</span>
                    </div>
                </header>
                <TablaTareas empleadoId={empleadoId} soloLectura />
                <footer className="hp-footer">Hotel Paraíso · Panel del empleado</footer>
            </main>
        </div>
    )
}

export default EmpleadoDashboard
