import './Navbar.css'

function Navbar({ abrirLogin }) {

    return(
        <nav className="navbar navbar-expand-lg bg-dark navbar-dark hotel-navbar">
            <div className="container">
                <a href="" className="navbar-brand fw-bold">
                    Hotel Paraiso
                </a>

                <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#menu"
                >
                <span className="navbar-toggler-icon"></span>    

                </button>
                   <div className="collapse navbar-collapse" id="menu">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <a href="#" className="nav-link">Inicio</a>
                        </li>
                         <li className="nav-item">
                            <a href="#" className="nav-link">Habitaciones</a>
                        </li>

                         <li className="nav-item">
                            <a href="#" className="nav-link">Servicios</a>
                        </li>
                         <li className="nav-item">
                            <a href="#" className="nav-link">Contacto</a>
                        </li>
                    </ul>
                    <button
                    type="button"
                    className="btn ms-lg-3"
                    style={{ backgroundColor: "#f3d6a4", color: "#344c5c" }}
                    onClick={abrirLogin}
                    >
                    Iniciar sesión
                    </button>
                    </div> 

            </div>
        </nav>
    )
}

export default Navbar 