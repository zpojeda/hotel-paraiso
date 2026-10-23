import { useState , useEffect  } from "react"

function FormularioReserva({ reserva, guardar, cancelar }){
    const [ datos , setDatos] = useState({
        habitacion:"",
        entrada: "",
        salida: "",
        estado:"Pendiente"
    })

    useEffect(()=> {
        if (reserva) {
            setDatos({
                habitacion: reserva.habitacion,
                entrada: reserva.entrada,
                salida: reserva.salida,
                estado:reserva.estado
            })
        }else {
            setDatos({ habitacion:"", entrada: "", salida:"", estado:"Pendiente"})
        }

    }, [reserva])

    const manejarCambio = (e) => {
    setDatos({
        ...datos,
        [e.target.name]: e.target.value
    })
}

    const manejarEnvio = (e) => {
        e.preventDefault()
        if (!datos.habitacion || !datos.entrada  || !datos.salida){
            Swal.fire("Completa todos los satos")
            return
        }

        if (datos.salida <= datos.entrada){
            Swal.fire(
                "fechas incorrectas",
                "La fecha de salida debe ser posterior a la de entrada ",
                "warning"
            )
            return
        }
        guardar(datos)

    }

    return (
        <form onSubmit={manejarEnvio}>
            <div className="mb-3">
                <label className="form-label">Habitación</label>
                <select 
                className="form-select"
                name="habitacion"
                value={datos.habitacion}
                onChange={manejarCambio}
                required       
            >
                <option value="">Seleccione una habitación</option>
                <option value="Suite201">Suite 201</option>
                <option value="Doble 105"> Doble 105</option>
                <option value="Sencilla 103"> Sencilla 103</option>
                </select>
            </div>

            <div className="mb-3">
               <label className="form-label">Fecha de entrada</label> 
                <input 
                type="date"
                className="form-control"
                name="entrada"
                value={datos.entrada}
                onChange={manejarCambio}
                required
                 />
              </div>          

              <div className="mb-3">
               <label className="form-label">Fecha de salida</label> 
                <input 
                type="date"
                className="form-control"
                name="salida"
                min={datos.entrada}
                value={datos.salida}
                onChange={manejarCambio}
                required
                 />

                <div className="mb-3">
                    <label htmlFor="" className="form-label">Estado</label>
                    <select 
                    className="form-select"
                    name="estado"
                    value={datos.estado}
                    onChange={manejarCambio}
                    required >

                <option value="Pendiente">Pendiente</option>
                <option value="Confirmada">Confirmada</option>
                <option value="Cancelada">Cancelada</option>
                    </select>
                    
                    </div> 
              </div>  
                <div className="d-flex justify-content-end gap-2">
                    <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={cancelar}
                    >
                Cancelar
                </button> 

                      <button
                    type="submit"
                    className="btn btn-success">
                    <i className="bi bi-check-circle me-2"></i>
                    Guardar Reserva

                </button> 
                </div>
              
              </form>
            
           
    )
}

export default FormularioReserva