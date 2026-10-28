import { useMemo, useState } from "react"
import Swal from "sweetalert2"
import { formatearPrecioHabitacion } from "../utils/habitacionesStorage"

function normalizarNombre(nombre = "") {
    return nombre.toLocaleLowerCase("es").replace(/\s+/g, "").trim();
}

function reservaUsaHabitacion(reserva, habitacion) {
    if (reserva.habitacionId != null) {
        return String(reserva.habitacionId) === String(habitacion.id);
    }

    return normalizarNombre(reserva.habitacion) === normalizarNombre(habitacion.nombre);
}

function fechasSeSuperponen(inicio, fin, reserva) {
    return inicio < reserva.salida && fin > reserva.entrada;
}

function estaDisponible(habitacion, inicio, fin, reservas, reservaEditada, permitirNoDisponible) {
    const activa = habitacion.activo !== false;
    const disponiblePorEstado = habitacion.estado === "Disponible" ||
        (permitirNoDisponible && reservaEditada && reservaUsaHabitacion(reservaEditada, habitacion));

    if (!activa || !disponiblePorEstado) {
        return false;
    }

    if (!inicio) {
        return true;
    }

    const finConsulta = fin && fin > inicio
        ? fin
        : new Date(new Date(`${inicio}T00:00:00`).getTime() + 86400000)
            .toISOString()
            .slice(0, 10);

    return !reservas.some(reserva =>
        reserva.id !== reservaEditada?.id &&
        reserva.estado !== "Cancelada" &&
        reservaUsaHabitacion(reserva, habitacion) &&
        reserva.entrada &&
        reserva.salida &&
        fechasSeSuperponen(inicio, finConsulta, reserva)
    );
}

function FormularioReserva({
    reserva,
    guardar,
    cancelar,
    clienteId,
    esAdmin,
    clientes = [],
    habitaciones = [],
    reservas = []
}){
    const [datos, setDatos] = useState(() => ({
        habitacionId: reserva?.habitacionId ?? "",
        habitacion: reserva?.habitacion ?? "",
        habitacionTipo: reserva?.habitacionTipo ?? "",
        habitacionPrecio: reserva?.habitacionPrecio ?? "",
        entrada: reserva?.entrada ?? "",
        salida: reserva?.salida ?? "",
        estado: reserva?.estado ?? "Pendiente",
        clienteId: reserva?.clienteId ?? ""
    }))

    const habitacionesDisponibles = useMemo(() => habitaciones.filter(habitacion =>
        estaDisponible(
            habitacion,
            datos.entrada,
            datos.salida,
            reservas,
            reserva,
            true
        )
    ), [habitaciones, datos.entrada, datos.salida, reservas, reserva])

    const habitacionSeleccionada = habitacionesDisponibles.find(habitacion =>
        String(habitacion.id) === String(datos.habitacionId) ||
        (!datos.habitacionId && normalizarNombre(habitacion.nombre) === normalizarNombre(datos.habitacion))
    )

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setDatos(actuales => {
            if (name === "habitacionId") {
                const habitacion = habitacionesDisponibles.find(item => String(item.id) === value);
                return {
                    ...actuales,
                    habitacionId: value,
                    habitacion: habitacion?.nombre ?? "",
                    habitacionTipo: habitacion?.tipo ?? "",
                    habitacionPrecio: habitacion?.precio ?? ""
                };
            }

            const siguientesDatos = { ...actuales, [name]: value };
            if (name === "entrada" || name === "salida") {
                const entrada = name === "entrada" ? value : actuales.entrada;
                const salida = name === "salida" ? value : actuales.salida;
                const habitacionActual = habitaciones.find(item =>
                    String(item.id) === String(actuales.habitacionId) ||
                    (!actuales.habitacionId &&
                        normalizarNombre(item.nombre) === normalizarNombre(actuales.habitacion))
                );

                if (habitacionActual && !estaDisponible(
                    habitacionActual,
                    entrada,
                    salida,
                    reservas,
                    reserva,
                    true
                )) {
                    siguientesDatos.habitacionId = "";
                    siguientesDatos.habitacion = "";
                    siguientesDatos.habitacionTipo = "";
                    siguientesDatos.habitacionPrecio = "";
                }
            }

            return siguientesDatos;
        });
    }

    const manejarEnvio = (e) => {
        e.preventDefault()
        if (!habitacionSeleccionada || !datos.entrada || !datos.salida){
            Swal.fire("Selecciona una habitación disponible y completa las fechas.")
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
        if (!estaDisponible(
            habitacionSeleccionada,
            datos.entrada,
            datos.salida,
            reservas,
            reserva,
            true
        )) {
            Swal.fire(
                "Habitación no disponible",
                "La habitación ya tiene una reserva que se superpone con esas fechas.",
                "warning"
            );
            return;
        }
        guardar({
            ...datos,
            habitacionId: habitacionSeleccionada.id,
            habitacion: habitacionSeleccionada.nombre,
            habitacionTipo: habitacionSeleccionada.tipo,
            habitacionPrecio: Number(habitacionSeleccionada.precio),
            clienteId: esAdmin ? datos.clienteId || null : clienteId
        })

    }

    return (
        <form onSubmit={manejarEnvio}>
            <div className="mb-3">
                <label className="form-label">Habitación</label>
                <select 
                className="form-select"
                    name="habitacionId"
                    value={habitacionSeleccionada ? String(habitacionSeleccionada.id) : ""}
                onChange={manejarCambio}
                required       
            >
                    <option value="">
                        {habitacionesDisponibles.length
                            ? "Seleccione una habitación disponible"
                            : "No hay habitaciones disponibles para estas fechas"}
                    </option>
                    {habitacionesDisponibles.map(habitacion => (
                        <option key={habitacion.id} value={habitacion.id}>
                            {habitacion.nombre} — {habitacion.tipo} — {formatearPrecioHabitacion(habitacion.precio)}
                        </option>
                    ))}
                </select>
                    {habitacionSeleccionada && (
                        <div className="mt-2 p-3 rounded-3 bg-light" aria-live="polite">
                            <strong>{habitacionSeleccionada.nombre}</strong>
                            <span className="d-block text-secondary small">
                                Tipo: {habitacionSeleccionada.tipo} · Precio: {formatearPrecioHabitacion(habitacionSeleccionada.precio)}
                            </span>
                        </div>
                    )}
                    {!habitacionesDisponibles.length && (
                        <small className="d-block mt-2 text-secondary">
                            Prueba otras fechas o consulta al hotel para más opciones.
                        </small>
                    )}
            </div>

            {esAdmin && (
                <div className="mb-3">
                    <label className="form-label">Cliente titular</label>
                    <select
                        className="form-select"
                        name="clienteId"
                        value={datos.clienteId}
                        onChange={manejarCambio}
                    >
                        <option value="">Sin asignar</option>
                        {clientes.map(cliente => (
                            <option key={cliente.id} value={cliente.id}>
                                {cliente.perfil?.nombre || cliente.correo} ({cliente.correo})
                            </option>
                        ))}
                    </select>
                </div>
            )}

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