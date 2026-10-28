const claveClientes = "clientesHotel";
const clavePerfilDemo = "perfilClienteHotel:cliente@hotel.com";
const perfilVacio = {
    nombre: "",
    telefono: "",
    fechaNacimiento: "",
    direccion: "",
    ciudad: ""
};

function normalizarPerfil(perfil = {}) {
    return Object.fromEntries(
        Object.keys(perfilVacio).map(campo => [
            campo,
            typeof perfil[campo] === "string" ? perfil[campo] : ""
        ])
    );
}

function crearIdCliente() {
    if (globalThis.crypto?.randomUUID) {
        return globalThis.crypto.randomUUID();
    }

    return `cliente-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function normalizarCorreo(correo) {
    return correo.trim().toLowerCase();
}

export function obtenerClientes() {
    const guardados = localStorage.getItem(claveClientes);
    if (guardados !== null) {
        const clientes = JSON.parse(guardados);
        if (!Array.isArray(clientes)) {
            throw new Error("El registro de clientes guardado no tiene un formato válido.");
        }
        return clientes;
    }

    const perfilAnterior = localStorage.getItem(clavePerfilDemo);
    const clienteDemo = {
        id: "cliente-demo",
        correo: "cliente@hotel.com",
        password: "12345",
        perfil: perfilAnterior
            ? normalizarPerfil(JSON.parse(perfilAnterior))
            : { ...perfilVacio }
    };

    localStorage.setItem(claveClientes, JSON.stringify([clienteDemo]));
    return [clienteDemo];
}

export function registrarCliente({ nombre, correo, telefono, password }) {
    const clientes = obtenerClientes();
    const correoNormalizado = normalizarCorreo(correo);

    if (!nombre.trim() || !telefono.trim() || !correoNormalizado) {
        throw new Error("Completa tu nombre, correo y teléfono para crear la cuenta.");
    }

    if (password.length < 8) {
        throw new Error("La contraseña debe tener al menos 8 caracteres.");
    }

    if (clientes.some(cliente => normalizarCorreo(cliente.correo) === correoNormalizado)) {
        throw new Error("Ya existe una cuenta registrada con ese correo.");
    }

    let id = crearIdCliente();
    while (clientes.some(cliente => cliente.id === id)) {
        id = crearIdCliente();
    }

    const nuevoCliente = {
        id,
        correo: correoNormalizado,
        password,
        perfil: {
            ...perfilVacio,
            nombre: nombre.trim(),
            telefono: telefono.trim()
        }
    };

    localStorage.setItem(claveClientes, JSON.stringify([...clientes, nuevoCliente]));
    return nuevoCliente;
}

export function autenticarCliente(correo, password) {
    const correoNormalizado = normalizarCorreo(correo);
    return obtenerClientes().find(cliente =>
        normalizarCorreo(cliente.correo) === correoNormalizado &&
        cliente.password === password
    ) ?? null;
}

export function obtenerClientePorId(clienteId) {
    return obtenerClientes().find(cliente => cliente.id === clienteId) ?? null;
}

export function actualizarPerfilCliente(clienteId, perfil) {
    const clientes = obtenerClientes();
    let actualizado = false;
    const clientesActualizados = clientes.map(cliente => {
        if (cliente.id !== clienteId) {
            return cliente;
        }

        actualizado = true;
        return { ...cliente, perfil: normalizarPerfil(perfil) };
    });

    if (!actualizado) {
        throw new Error("No se encontró la cuenta de cliente que se intenta actualizar.");
    }

    localStorage.setItem(claveClientes, JSON.stringify(clientesActualizados));
    return clientesActualizados.find(cliente => cliente.id === clienteId);
}
