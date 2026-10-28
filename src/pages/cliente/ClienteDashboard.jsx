import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import TablaReservas from "../../components/TablaReservas";
import PerfilCliente from "../../components/PerfilCliente";
import "../admin/Dashboard.css"

function ClienteDashboard({ clienteId, onLogout }){
    const [seccion, setSeccion] = useState("Mis reservas")
    const opciones =["Mis reservas", "Mi perfil"]

return (
    <div className="hp-dashboard">
        <Sidebar
         titulo="Espacio del cliente"
         opciones={opciones}
         seccion={seccion}
         cambiarSeccion={setSeccion}
         cerrarSesion={onLogout}           
        />
<main className="hp-main">
    <header className="hp-header">
        <div>
            <p className="hp-eyebrown">PANEL DEL CLIENTE</p>
            <h1>{seccion}</h1>
            <p>Bienvenido al hotel Paraiso</p>
        </div>
    </header>
    <section className="hp-panel">
        <div className="hp-panel-header">
            <h2>{seccion}</h2>
            <p>
                {seccion === "Mis reservas"
                   ? "Consulta aqui tus reservas"
                   : "Aqui podras consultar tu información personal."
            }
            </p>
        </div>
        {seccion === "Mis reservas" && <TablaReservas clienteId={clienteId} />}
        {seccion === "Mi perfil" && <PerfilCliente key={clienteId} clienteId={clienteId} />}
    </section>
</main>

    </div>
)
}

export default ClienteDashboard