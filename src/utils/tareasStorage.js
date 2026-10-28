import { obtenerEmpleadoPorId } from "./empleadosStorage"

const claveTareas = "tareasEmpleadosHotel"
export const estadosTarea = ["Pendiente", "En curso", "Completada", "Cancelada"]
export const tiposTarea = [
    "Recepción",
    "Limpieza",
    "Mantenimiento",
    "Cocina",
    "Administración",
    "Otra"
]

export function obtenerTareas() {
    const guardadas = localStorage.getItem(claveTareas)
    if (guardadas === null) {
        return []
    }

    const tareas = JSON.parse(guardadas)
    if (!Array.isArray(tareas)) {
        throw new Error("El registro de tareas guardado no tiene un formato válido.")
    }

    return tareas
}

function validarTarea(datos, tareas, tareaId) {
    const empleadoId = datos.empleadoId
    const tipo = datos.tipo?.trim() ?? ""
    const piso = datos.piso?.trim() ?? ""
    const habitacion = datos.habitacion?.trim() ?? ""
    const fecha = datos.fecha?.trim() ?? ""
    const horaInicio = datos.horaInicio?.trim() ?? ""
    const horaFin = datos.horaFin?.trim() ?? ""
    const estado = datos.estado?.trim() ?? "Pendiente"

    if (!empleadoId || !tipo || !fecha || !horaInicio || !horaFin) {
        throw new Error("Completa el empleado, tipo de tarea, fecha y horario.")
    }

    const empleado = obtenerEmpleadoPorId(empleadoId)
    if (!empleado || empleado.activo === false) {
        throw new Error("No se pueden asignar tareas a un empleado inactivo o inexistente.")
    }

    const partesFecha = /^\d{4}-\d{2}-\d{2}$/.test(fecha)
        ? fecha.split("-").map(Number)
        : null
    const fechaParseada = partesFecha
        ? new Date(Date.UTC(partesFecha[0], partesFecha[1] - 1, partesFecha[2]))
        : null
    if (!fechaParseada || Number.isNaN(fechaParseada.getTime()) ||
        fechaParseada.toISOString().slice(0, 10) !== fecha) {
        throw new Error("Selecciona una fecha válida.")
    }
    if (!tiposTarea.includes(tipo)) {
        throw new Error("Selecciona un tipo de tarea válido.")
    }
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(horaInicio) ||
        !/^([01]\d|2[0-3]):[0-5]\d$/.test(horaFin) ||
        horaInicio >= horaFin) {
        throw new Error("La hora de finalización debe ser posterior a la hora de inicio.")
    }
    if (!estadosTarea.includes(estado)) {
        throw new Error("Selecciona un estado válido para la tarea.")
    }

    if (estado !== "Cancelada") {
        const conflicto = tareas.some(tarea =>
            tarea.id !== tareaId &&
            tarea.estado !== "Cancelada" &&
            tarea.empleadoId === empleadoId &&
            tarea.fecha === fecha &&
            horaInicio < tarea.horaFin &&
            horaFin > tarea.horaInicio
        )

        if (conflicto) {
            throw new Error("Conflicto de horario: el empleado ya tiene otra tarea asignada en ese horario.")
        }
    }

    return { empleadoId, tipo, piso, habitacion, fecha, horaInicio, horaFin, estado }
}

function crearIdTarea(tareas) {
    let id
    do {
        id = globalThis.crypto?.randomUUID
            ? globalThis.crypto.randomUUID()
            : `tarea-${Date.now()}-${Math.random().toString(36).slice(2)}`
    } while (tareas.some(tarea => tarea.id === id))

    return id
}

export function guardarTarea(datos, tareaId = null) {
    const tareas = obtenerTareas()
    const datosValidados = validarTarea(datos, tareas, tareaId)

    if (tareaId) {
        let encontrada = false
        const tareasActualizadas = tareas.map(tarea => {
            if (tarea.id !== tareaId) {
                return tarea
            }

            encontrada = true
            return { ...tarea, ...datosValidados }
        })

        if (!encontrada) {
            throw new Error("No se encontró la tarea que se intenta actualizar.")
        }

        localStorage.setItem(claveTareas, JSON.stringify(tareasActualizadas))
        return tareasActualizadas
    }

    const tareasActualizadas = [
        ...tareas,
        { id: crearIdTarea(tareas), ...datosValidados }
    ]
    localStorage.setItem(claveTareas, JSON.stringify(tareasActualizadas))
    return tareasActualizadas
}

export function cancelarTarea(tareaId) {
    const tareas = obtenerTareas()
    let encontrada = false
    const tareasActualizadas = tareas.map(tarea => {
        if (tarea.id !== tareaId) {
            return tarea
        }

        encontrada = true
        return { ...tarea, estado: "Cancelada" }
    })

    if (!encontrada) {
        throw new Error("No se encontró la tarea que se intenta cancelar.")
    }

    localStorage.setItem(claveTareas, JSON.stringify(tareasActualizadas))
    return tareasActualizadas
}
