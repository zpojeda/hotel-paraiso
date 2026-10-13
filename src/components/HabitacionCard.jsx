function HabitacionCard({imagen , nombre, descripcion, precio}) {
    return (
    <div className="col-md-4 mb-4">
        <div className="card h-100 border-0 shadow-sm">
            <img src={imagen} alt={nombre} className="card-img-top" />
        

        <div className="card-body p-4">
            <h4 className="card-title fw-bold">{nombre}</h4>
            <p className="card-text text-secondary">{descripcion}</p>
            <p className="fw-bold">
               Desde: ${precio.toLocaleString('es-CO')} COP
               </p>

            <a href="" className="btn btn-outline-dark d-block mx-auto w-50">Ver detalles</a>
        </div>
    </div>
    </div>        
            )

}

export default HabitacionCard