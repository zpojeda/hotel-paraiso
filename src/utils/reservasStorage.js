const claveReservas = "reservasHotel";
const claveConsecutivo = "consecutivoReservasHotel";
const prefijoCodigo = "RES-";

function leerReservasGuardadas() {
    const guardadas = localStorage.getItem(claveReservas);
    if (!guardadas) {
        return [];
    }

    const reservas = JSON.parse(guardadas);
    if (!Array.isArray(reservas)) {
        throw new Error("Las reservas guardadas no tienen un formato válido.");
    }

    return reservas;
}

function obtenerSiguienteNumero(reservas) {
    const siguienteGuardado = Number.parseInt(
        localStorage.getItem(claveConsecutivo) || "1",
        10
    );
    const siguienteValido = Number.isSafeInteger(siguienteGuardado) && siguienteGuardado > 0
        ? siguienteGuardado
        : 1;
    const maximoExistente = reservas.reduce((maximo, reserva) => {
        if (typeof reserva.id !== "string") {
            return maximo;
        }

        const coincidencia = /^RES-(\d+)$/.exec(reserva.id);
        if (!coincidencia) {
            return maximo;
        }

        const numero = Number.parseInt(coincidencia[1], 10);
        return Number.isSafeInteger(numero) ? Math.max(maximo, numero + 1) : maximo;
    }, 1);

    return Math.max(siguienteValido, maximoExistente);
}

export function generarCodigoReserva(reservasActuales = []) {
    const reservasGuardadas = leerReservasGuardadas();
    const todasLasReservas = [...reservasGuardadas, ...reservasActuales];
    let siguiente = obtenerSiguienteNumero(todasLasReservas);
    let codigo = `${prefijoCodigo}${String(siguiente).padStart(3, "0")}`;
    const idsExistentes = new Set(todasLasReservas.map(reserva => reserva.id));

    while (idsExistentes.has(codigo)) {
        siguiente += 1;
        codigo = `${prefijoCodigo}${String(siguiente).padStart(3, "0")}`;
    }

    localStorage.setItem(claveConsecutivo, String(siguiente + 1));
    return codigo;
}
