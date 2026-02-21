// core/personaje.js
// Clase base para personajes

class Personaje {
    constructor(data = {}) {
        this.id = data.id || null;
        this.nombre = data.nombre || '';
        this.nivel = data.nivel || 1;
        this.clase = data.clase || '';
        this.subclase = data.subclase || '';   // ← ¿Existe?
        this.raza = data.raza || '';            // ← ¿Existe?
        this.trasfondo = data.trasfondo || '';
        this.alineamiento = data.alineamiento || 'N';
        this.pg_max = data.pg_max || 10;
        this.pg_actuales = data.pg_actuales || this.pg_max;
        
        this.stats = {
            fue: data.stats?.fue || 10,
            des: data.stats?.des || 10,
            con: data.stats?.con || 10,
            int: data.stats?.int || 10,
            sab: data.stats?.sab || 10,
            car: data.stats?.car || 10
        };
    }

    calcularBonificador(valor) {
        return Math.floor((valor - 10) / 2);
    }

    getBonificadores() {
        return {
            fue: this.calcularBonificador(this.stats.fue),
            des: this.calcularBonificador(this.stats.des),
            con: this.calcularBonificador(this.stats.con),
            int: this.calcularBonificador(this.stats.int),
            sab: this.calcularBonificador(this.stats.sab),
            car: this.calcularBonificador(this.stats.car)
        };
    }

    toJSON() {
        return {
            id: this.id,
            nombre: this.nombre,
            nivel: this.nivel,
            clase: this.clase,
            subclase: this.subclase,   // ← Añadido
            raza: this.raza,            // ← Añadido
            trasfondo: this.trasfondo,
            alineamiento: this.alineamiento,
            pg_max: this.pg_max,
            pg_actuales: this.pg_actuales,
            stats: { ...this.stats }
        };
    }

    static fromJSON(json) {
        return new Personaje(json);
    }
}

// Funciones de almacenamiento local
const STORAGE_KEY = 'cefiro_ficha_actual';

function guardarEnLocalStorage(personaje) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(personaje.toJSON()));
        return true;
    } catch (e) {
        console.error('Error guardando:', e);
        return false;
    }
}

function cargarDeLocalStorage() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? new Personaje(JSON.parse(data)) : null;
    } catch (e) {
        console.error('Error cargando:', e);
        return null;
    }
}