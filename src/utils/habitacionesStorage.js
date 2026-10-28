export const habitacionesIniciales = [
    {
        id: 1,
        nombre: "Habitación Estandar",
        tipo: "Estándar",
        precio: 150000,
        estado: "Disponible"
    },
    {
        id: 2,
        nombre: "Habitación Premiun",
        tipo: "Premium",
        precio: 250000,
        estado: "Disponible"
    },
    {
        id: 3,
        nombre: "Habitación Suite",
        tipo: "Suite",
        precio: 500000,
        estado: "Mantenimiento"
    }
];

export function inferirTipoHabitacion(nombre = "") {
    const texto = nombre.toLocaleLowerCase("es");
    if (texto.includes("suite")) return "Suite";
    if (texto.includes("premium") || texto.includes("premiun")) return "Premium";
    if (texto.includes("estandar") || texto.includes("estándar")) return "Estándar";
    return "Otra";
}

export function obtenerHabitaciones() {
    const guardadas = localStorage.getItem("habitacionesHotel");
    if (guardadas === null) {
        return habitacionesIniciales;
    }

    const habitaciones = JSON.parse(guardadas);
    if (!Array.isArray(habitaciones)) {
        throw new Error("Las habitaciones guardadas no tienen un formato válido.");
    }

    return habitaciones.map(habitacion => ({
        ...habitacion,
        tipo: habitacion.tipo || inferirTipoHabitacion(habitacion.nombre)
    }));
}

export function formatearPrecioHabitacion(precio) {
    return `$${Number(precio).toLocaleString("es-CO")}`;
}
