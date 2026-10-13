import piscina from '../assets/piscina.jpg';
import restaurante from '../assets/restaurante.jpg';
import lobby from '../assets/lobby.jpg';
import './Servicios.css';

function Servicios() {
    const servicios = [
        {
            nombre: "Piscina",
            imagen: piscina,
            descripcion: "Relájate y disfruta de nuestra piscina al aire libre con vistas panorámicas."
        },
        {
            nombre: "Restaurante",
            imagen: restaurante,
            descripcion: "Disfruta de una experiencia culinaria excepcional en nuestro restaurante de alta gama."
        },
        {
            nombre: "Lobby",
            imagen: lobby,
            descripcion: "Relájate en nuestro acogedor lobby con mobiliario de calidad y un ambiente acogedor."
        }
    ];

    return (
        <section className="py-5 bg-light" id="servicios">
            <div className="container">
                <div className="text-center mb-5">
                    <h2 className="fw-bold">Nuestros Servicios</h2>
                    <p className="text-secondary">
                        Disfruta de nuestros servicios diseñados para tu comodidad y bienestar
                    </p>
                </div>
                <div className="row align-items-center g-3">
                    {servicios.map((servicio, index) => (
                        <div className="col-12 mb-0" key={servicio.nombre}>
                            <div className="row align-items-center g-4">
                                <div className={`col-md-6 ${index % 2 !== 0 ? "order-md-2" : ""}`}>
                                    <img src={servicio.imagen}
                                        alt={servicio.nombre} 
                                        className=" img-fluid rounded-4 servicio-img" />
                                </div>
                                <div className="col-md-6">
                                    <div className="px-md-4">
                                        <h3 className="fw-bold">{servicio.nombre}</h3>
                                        <p className="text-secondary">{servicio.descripcion}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    ))} 
                </div>
            </div>
        </section>
    );
}

export default Servicios;