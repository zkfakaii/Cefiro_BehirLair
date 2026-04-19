// sistemas/dnd5e/data-loader.js

const OPEN5E_BASE_URL = 'https://api.open5e.com/v1/';

async function fetchOpen5e(endpoint) {
    const url = `${OPEN5E_BASE_URL}${endpoint}/?limit=100`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error(`❌ Error cargando ${endpoint}:`, error);
        return [];
    }
}

async function cargarClases() {
    return fetchOpen5e('classes');
}

async function cargarRazas() {
    return fetchOpen5e('races');
}

async function cargarBackgrounds() {
    return fetchOpen5e('backgrounds');
}

async function obtenerSubclasesPorClase(claseNombre) {
    try {
        // Buscar la clase por nombre para obtener sus detalles
        const searchUrl = `${OPEN5E_BASE_URL}classes/?search=${encodeURIComponent(claseNombre)}&limit=1`;
        const searchResp = await fetch(searchUrl);
        const searchData = await searchResp.json();
        if (!searchData.results?.length) return [];
        const clase = searchData.results[0];
        const slug = clase.slug;
        const detailUrl = `${OPEN5E_BASE_URL}classes/${slug}/`;
        const detailResp = await fetch(detailUrl);
        const claseDetail = await detailResp.json();
        return claseDetail.archetypes || [];
    } catch (error) {
        console.error('Error obteniendo subclases:', error);
        return [];
    }
}

async function obtenerHitDiceDeClase(claseNombre) {
    const clases = await cargarClases();
    const clase = clases.find(c => c.name.toLowerCase() === claseNombre.toLowerCase());
    return clase?.hit_dice || '1d8';
}

async function obtenerSalvacionesPorClase(claseNombre) {
    try {
        const clases = await cargarClases();
        const clase = clases.find(c => c.name.toLowerCase() === claseNombre.toLowerCase());
        if (!clase) return [];
        
        // En v1, las salvaciones vienen como string "Strength, Constitution"
        const raw = clase.prof_saving_throws || '';
        if (!raw) return [];
        
        // Mapear nombres a abreviaturas
        const map = {
            'strength': 'STR',
            'dexterity': 'DEX',
            'constitution': 'CON',
            'intelligence': 'INT',
            'wisdom': 'WIS',
            'charisma': 'CHA'
        };
        
        const salvaciones = raw.split(',').map(s => {
            const nombre = s.trim().toLowerCase();
            return map[nombre] || null;
        }).filter(abrev => abrev !== null);
        
        console.log(`🛡️ Salvaciones para ${claseNombre}:`, salvaciones);
        return salvaciones;
    } catch (error) {
        console.error('Error obteniendo salvaciones:', error);
        return [];
    }
}

window.dndData = {
    cargarClases,
    cargarRazas,
    cargarBackgrounds,
    obtenerSubclasesPorClase,
    obtenerHitDiceDeClase,
    obtenerSalvacionesPorClase
};

console.log('✅ data-loader.js (v1) cargado correctamente');