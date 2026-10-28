import { obtenerClientes } from "./clientesStorage"

const claveEmpleados = "empleadosHotel"
export const cargosEmpleado = [
    "Recepción",
    "Limpieza",
    "Mantenimiento",
    "Cocina",
    "Administración"
]

export function obtenerEmpleados() {
    const guardados = localStorage.getItem(claveEmpleados)
    if (guardados === null) {
        return []
    }

    const empleados = JSON.parse(guardados)
    if (!Array.isArray(empleados)) {
        throw new Error("El registro de empleados guardado no tiene un formato válido.")
    }

    return empleados
}

function validarEmpleado(datos, empleados, empleadoId) {
    const documento = datos.documento.trim()
    const nombre = datos.nombre.trim()
    const correo = datos.correo.trim().toLowerCase()
    const telefono = datos.telefono.trim()
    const cargo = datos.cargo.trim()
    const password = datos.password ?? ""
    const confirmarPassword = datos.confirmarPassword ?? ""

    if (!documento || !nombre || !correo || !telefono || !cargo) {
        throw new Error("Completa todos los campos del empleado.")
    }
    if (documento.length < 5 || documento.length > 20) {
        throw new Error("El documento debe tener entre 5 y 20 caracteres.")
    }
    if (nombre.length < 2 || !cargosEmpleado.includes(cargo)) {
        throw new Error("Ingresa un nombre válido y selecciona un cargo disponible.")
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        throw new Error("Ingresa un correo electrónico válido.")
    }

    const digitosTelefono = telefono.replace(/\D/g, "").length
    if (digitosTelefono < 7 || digitosTelefono > 15) {
        throw new Error("El teléfono debe contener entre 7 y 15 dígitos.")
    }

    const documentoNormalizado = documento.toLocaleLowerCase("es")
    const correoNormalizado = correo.toLocaleLowerCase("es")
    if (correoNormalizado === "admin@hotel.com") {
        throw new Error("Ese correo está reservado para la cuenta administrativa.")
    }

    if (obtenerClientes().some(cliente =>
        cliente.correo?.trim().toLocaleLowerCase("es") === correoNormalizado
    )) {
        throw new Error("Ese correo ya está registrado en una cuenta de huésped.")
    }

    const duplicado = empleados.find(empleado =>
        empleado.id !== empleadoId &&
        (
            empleado.documento?.trim().toLocaleLowerCase("es") === documentoNormalizado ||
            empleado.correo?.trim().toLocaleLowerCase("es") === correoNormalizado
        )
    )
    if (duplicado) {
        throw new Error("Ya existe un empleado con ese documento o correo.")
    }

    if (!empleadoId && password.length < 8) {
        throw new Error("La contraseña del empleado debe tener al menos 8 caracteres.")
    }
    if (password && password.length < 8) {
        throw new Error("La contraseña debe tener al menos 8 caracteres.")
    }
    if (password !== confirmarPassword) {
        throw new Error("Las contraseñas no coinciden.")
    }
    if (empleadoId) {
        const empleadoExistente = empleados.find(empleado => empleado.id === empleadoId)
        if (!empleadoExistente) {
            throw new Error("No se encontró el empleado que se intenta actualizar.")
        }
        if (!empleadoExistente.password && !password) {
            throw new Error("Configura una contraseña para habilitar el acceso de este empleado.")
        }
    }

    return {
        documento,
        nombre,
        correo,
        telefono,
        cargo,
        ...(password ? { password } : {})
    }
}

function crearIdEmpleado(empleados) {
    let id
    do {
        id = globalThis.crypto?.randomUUID
            ? globalThis.crypto.randomUUID()
            : `empleado-${Date.now()}-${Math.random().toString(36).slice(2)}`
    } while (empleados.some(empleado => empleado.id === id))

    return id
}

export function guardarEmpleado(datos, empleadoId = null) {
    const empleados = obtenerEmpleados()
    const datosValidados = validarEmpleado(datos, empleados, empleadoId)

    if (empleadoId) {
        let encontrado = false
        const empleadosActualizados = empleados.map(empleado => {
            if (empleado.id !== empleadoId) {
                return empleado
            }

            encontrado = true
            return {
                ...empleado,
                ...datosValidados,
                activo: empleado.activo !== false
            }
        })

        if (!encontrado) {
            throw new Error("No se encontró el empleado que se intenta actualizar.")
        }

        localStorage.setItem(claveEmpleados, JSON.stringify(empleadosActualizados))
        return empleadosActualizados
    }

    const nuevoEmpleado = {
        id: crearIdEmpleado(empleados),
        ...datosValidados,
        activo: true
    }
    const empleadosActualizados = [...empleados, nuevoEmpleado]
    localStorage.setItem(claveEmpleados, JSON.stringify(empleadosActualizados))
    return empleadosActualizados
}

export function actualizarEstadoEmpleado(empleadoId, activo) {
    if (typeof activo !== "boolean") {
        throw new Error("El estado del empleado debe ser activo o inactivo.")
    }

    const empleados = obtenerEmpleados()
    let encontrado = false
    const empleadosActualizados = empleados.map(empleado => {
        if (empleado.id !== empleadoId) {
            return empleado
        }

        encontrado = true
        return { ...empleado, activo }
    })

    if (!encontrado) {
        throw new Error("No se encontró el empleado que se intenta actualizar.")
    }

    localStorage.setItem(claveEmpleados, JSON.stringify(empleadosActualizados))
    return empleadosActualizados
}

export function autenticarEmpleado(correo, password) {
    const correoNormalizado = correo.trim().toLocaleLowerCase("es")
    const empleado = obtenerEmpleados().find(actual =>
        actual.correo.trim().toLocaleLowerCase("es") === correoNormalizado &&
        actual.password === password
    ) ?? null

    if (empleado?.activo === false) {
        throw new Error("Esta cuenta de empleado está inhabilitada. Contacta al administrador.")
    }

    return empleado
}

export function obtenerEmpleadoPorId(empleadoId) {
    return obtenerEmpleados().find(empleado => empleado.id === empleadoId) ?? null
}
