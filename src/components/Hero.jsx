import piscina from '../assets/piscina.jpg'
import './Hero.css'

function Hero() {
    return (
        <section
            className="hero-hotel d-flex align-items-center "
            style={{ backgroundImage: `url(${piscina})` }}
        >
            <div className="container hero-contenido">
                <p className="hero-subtitulo">
                    Bienvenidos a Hotel Paraiso
                </p>
                <h1 className="display-2 fw-bold">El descanso que necesitas</h1>
                <p className="lead">Disfruta de una experiencia inolvidable en nuestro hotel</p>
                <a href="#habitaciones" className="btn btn-light btn-lg mt-3">Ver habitaciones</a>
            </div>
        </section>
    )
}

export default Hero