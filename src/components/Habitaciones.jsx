import HabitacionCard from "./HabitacionCard";
import './Habitaciones.css'
import estandar from "../assets/estandar.jpeg"
import premium from "../assets/premium.jpeg"
import suite from "../assets/suite.jpeg"

const habitaciones = [
    {
        id: 1,
        nombre: "Habitación Estándar",
        descripcion: "Habitación cómoda con vista al mar",
        precio: 150000,
        imagen: estandar
    },

    {
        id: 2,
        nombre: "Habitación Premium",
        descripcion: "Habitación de lujo con servicios exclusivos",
        precio: 250000,
        imagen: premium
    },
    {
        id: 3,
        nombre: "Suite Presidencial",
        descripcion: "Suite con espacio amplio y amenities de alta gama",
        precio: 500000,
        imagen: suite
    }
];

function Habitaciones() {
    return (
        <section className="py-5 bg-light" id="habitaciones">
            <div className="container">
                <h2 className="text-center fw-bold mb-3">Nuestras Habitaciones</h2>
                <p className="text-center text-secondary mb-5">
                    Descubre nuestras habitaciones diseñadas para tu comodidad y descanso
                </p>

                <div className="row">
                    {habitaciones.map((habitacion) => (
                        <HabitacionCard
                            key={habitacion.id}
                            {...habitacion}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Habitaciones