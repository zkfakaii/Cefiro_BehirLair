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
        const searchUrl = `${OPEN5E_BASE_URL}classes/?search=${encodeURIComponent(claseNombre)}&limit=1`;
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();
        if (!searchData.results?.length) return [];
        const clase = searchData.results[0];
        const slug = clase.slug || clase.name.toLowerCase().replace(/\s+/g, '-');
        const detailUrl = `${OPEN5E_BASE_URL}classes/${slug}/`;
        const detailResponse = await fetch(detailUrl);
        const claseDetail = await detailResponse.json();
        return claseDetail.archetypes || claseDetail.subclasses || [];
    } catch (error) {
        console.error('Error obteniendo subclases:', error);
        return [];
    }
}
async function obtenerHitDiceDeClase(claseNombre) {
    try {
        const url = `${OPEN5E_BASE_URL}classes/?search=${encodeURIComponent(claseNombre)}&limit=1`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.results?.length) {
            return data.results[0].hit_dice || '1d8';
        }
    } catch (error) {
        console.error('Error obteniendo hit dice:', error);
    }
    return '1d8';
}

window.dndData = {
    cargarClases,
    cargarRazas,
    cargarBackgrounds,
    obtenerSubclasesPorClase,
    obtenerHitDiceDeClase
};
console.log('✅ data-loader.js cargado (sin exports)');