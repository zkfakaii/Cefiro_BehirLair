// app/crear.js
// Lógica para la pantalla de creación de personaje

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🆕 Pantalla de creación');

    
    const razaSelect = document.getElementById('raza');
    const claseSelect = document.getElementById('clase');
    const subclaseSelect = document.getElementById('subclase');
    const backgroundSelect = document.getElementById('background');
    const nivelInput = document.getElementById('nivel_creacion');
    const conInput = document.getElementById('con');
    const pgPreview = document.getElementById('pg_preview');
    const btnCalcular = document.getElementById('btnCalcularPG'); // <-- nuevo
   

    if (!window.dndData) {
        alert('Error: no se pudo cargar el sistema de datos');
        return;
    }

    // ============================================
    // FUNCIONES AUXILIARES
    // ============================================
    function llenarSelect(select, items, campo) {
        select.innerHTML = '<option value="">Selecciona una opción</option>';
        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item[campo] || item.name || 'unknown';
            option.textContent = item.name || 'Sin nombre';
            select.appendChild(option);
        });
    }

    // Caché para los dados de golpe (evita llamadas repetidas a la API)
    const hitDiceCache = {};

    async function actualizarPreviewPG() {
        const clase = claseSelect.value;
        const nivel = parseInt(nivelInput?.value) || 1;
        const con = parseInt(conInput?.value) || 10;

        if (!clase) {
            pgPreview.textContent = '0';
            return;
        }

        // Usar caché si ya tenemos el dado para esta clase
        if (!hitDiceCache[clase]) {
            hitDiceCache[clase] = await window.dndData.obtenerHitDiceDeClase(clase);
        }
        const hitDice = hitDiceCache[clase];

        const match = hitDice.match(/d(\d+)/);
        const dado = match ? parseInt(match[1]) : 8;
        const conMod = Math.floor((con - 10) / 2);

        let total = 0;
        total += dado + conMod; // nivel 1
        for (let i = 2; i <= nivel; i++) {
            total += Math.floor(Math.random() * dado) + 1 + conMod;
        }

        pgPreview.textContent = total;
        console.log(`🎲 Tirada de PG: ${total} (dado ${hitDice}, +${conMod} por CON)`);
    }

    if (btnCalcular) {
        btnCalcular.addEventListener('click', actualizarPreviewPG);
    }
    const form = document.getElementById('form-crear');

        // ============================================
    // CARGAR OPCIONES DE LOS SELECTORES
    // ============================================
    async function cargarOpciones() {
        try {
            const razas = await window.dndData.cargarRazas();
            llenarSelect(razaSelect, razas, 'name');

            const clases = await window.dndData.cargarClases();
            llenarSelect(claseSelect, clases, 'name');

            const backgrounds = await window.dndData.cargarBackgrounds();
            llenarSelect(backgroundSelect, backgrounds, 'name');

            console.log('✅ Selectores cargados');
        } catch (error) {
            console.error('❌ Error cargando opciones:', error);
        }
    }

    // ============================================
    // EVENTOS
    // ============================================
    // Cargar subclases al cambiar clase
    claseSelect.addEventListener('change', async () => {
        const claseNombre = claseSelect.value;
        subclaseSelect.innerHTML = '<option value="">Selecciona una subclase</option>';
        if (!claseNombre) return;

        try {
            const subclases = await window.dndData.obtenerSubclasesPorClase(claseNombre);
            subclases.forEach(sub => {
                const option = document.createElement('option');
                option.value = sub.name;
                option.textContent = sub.name;
                subclaseSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error cargando subclases:', error);
        }
    });

 

    // ============================================
    // CREAR PERSONAJE
    // ============================================
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const pgCalculado = parseInt(pgPreview.textContent) || 10;

        const personajeData = {
            nombre: document.getElementById('nombre').value,
            nivel: parseInt(nivelInput.value) || 1,
            clase: claseSelect.value,
            subclase: subclaseSelect.value,
            raza: razaSelect.value,
            trasfondo: backgroundSelect.value,
            alineamiento: 'N',
            pg_max: pgCalculado,
            pg_actuales: pgCalculado,
            stats: {
                fue: parseInt(document.getElementById('fue').value),
                des: parseInt(document.getElementById('des').value),
                con: parseInt(conInput.value),
                int: parseInt(document.getElementById('int').value),
                sab: parseInt(document.getElementById('sab').value),
                car: parseInt(document.getElementById('car').value)
            }
        };

        const personaje = new Personaje(personajeData);

        if (typeof guardarPersonaje === 'function') {
            guardarPersonaje(personaje);
        } else {
            // Fallback manual
            if (!personaje.id) {
                personaje.id = 'pj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            }
            localStorage.setItem(`cefiro_${personaje.id}`, JSON.stringify(personaje.toJSON?.() || personaje));
            let personajes = JSON.parse(localStorage.getItem('cefiro_personajes') || '[]');
            personajes.push({ id: personaje.id, nombre: personaje.nombre, nivel: personaje.nivel, clase: personaje.clase });
            localStorage.setItem('cefiro_personajes', JSON.stringify(personajes));
        }

        window.location.href = `ficha.html?id=${personaje.id}`;
    });

    // ============================================
    // INICIALIZACIÓN
    // ============================================
    await cargarOpciones();
    await actualizarPreviewPG();
});