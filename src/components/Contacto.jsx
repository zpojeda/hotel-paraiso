import hotel from '../assets/hotel-exterior.jpg';
import "./Contacto.css";

function Contacto() {
    return (
        <section className="py-5 bg-light" id="contacto">
            <div className="container">
                <div className="text-center mb-5">
                    <h2 className="fw-bold">Contáctanos</h2>
                    <p className="text-secondary">
                        Estamos aquí para ayudarte. Si tienes alguna pregunta o necesitas asistencia, no dudes en contactarnos.
                    </p>
                    </div>
                <div className="row align-items-center g-4">
                    <div className="col-md-6">
                        <form>
                            <div className="mb-3">
                                <label  className="form-label">Nombre Completo</label>
                                <input type="text" className="form-control" id="nombre" placeholder="Ingresa tu nombre" required />
                             </div>

                               <div className="mb-3">
                                <label  className="form-label">Correo Electrónico</label>
                                <input type="email" className="form-control" id="email" placeholder="Ingresa tu correo electrónico" required />
                             </div>   

                                    <div className="mb-3">
                                <label  className="form-label">Mensaje</label>
                                <textarea className="form-control" id="mensaje" rows="4" placeholder="Ingresa tu mensaje" required>

                                </textarea>
                             </div> 
                             <button type="submit" className="btn btn-dark px-4">Enviar Mensaje</button>
                        </form>

                    </div>
                    <div className="col-md-6">
                        <img src={hotel} alt="Hotel" className="img-fluid rounded-4 shadow" />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Contacto;