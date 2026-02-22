// app/crear.js
// Lógica para la pantalla de creación de personaje

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🆕 Pantalla de creación');

    const razaSelect = document.getElementById('raza');
    const claseSelect = document.getElementById('clase');
    const subclaseSelect = document.getElementById('subclase');
    const backgroundSelect = document.getElementById('background');
    const nivelInput = document.getElementById('nivel_creacion');
    const pgPreview = document.getElementById('pg_preview');
    const btnCalcular = document.getElementById('btnCalcularPG');
    const btnMax = document.getElementById('btnMaxPG');
    const btnMedia = document.getElementById('btnMediaPG');
    const form = document.getElementById('form-crear');

    // ============================================
    // SISTEMA DE COMPRA DE PUNTOS (27 puntos)
    // ============================================
    const statCosts = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };
    const MAX_STAT = 15;
    const MIN_STAT = 8;
    const TOTAL_POINTS = 27;

    let currentStatValues = {
        fue: 8, des: 8, con: 8, int: 8, sab: 8, car: 8
    };
    window.currentStatValues = currentStatValues; // Para depurar desde consola

    console.log('Valores iniciales de stats:', currentStatValues);

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

    // Caché para los dados de golpe
    const hitDiceCache = {};

    async function actualizarPreviewPG() {
        const clase = claseSelect.value;
        const nivel = parseInt(nivelInput?.value) || 1;
        const con = currentStatValues.con;

        if (!clase) {
            pgPreview.textContent = '0';
            return;
        }

        if (!hitDiceCache[clase]) {
            hitDiceCache[clase] = await window.dndData.obtenerHitDiceDeClase(clase);
        }
        const hitDice = hitDiceCache[clase];
        const match = hitDice.match(/d(\d+)/);
        const dado = match ? parseInt(match[1]) : 8;
        const conMod = Math.floor((con - 10) / 2);

        let total = dado + conMod; // nivel 1
        for (let i = 2; i <= nivel; i++) {
            total += Math.floor(Math.random() * dado) + 1 + conMod;
        }

        pgPreview.textContent = total;
        console.log(`🎲 Tirada de PG: ${total} (dado ${hitDice}, +${conMod} por CON)`);
    }

    async function calcularMaxPG() {
        const clase = claseSelect.value;
        const nivel = parseInt(nivelInput?.value) || 1;
        const con = currentStatValues.con;

        if (!clase) {
            pgPreview.textContent = '0';
            return;
        }

        if (!hitDiceCache[clase]) {
            hitDiceCache[clase] = await window.dndData.obtenerHitDiceDeClase(clase);
        }
        const hitDice = hitDiceCache[clase];
        const match = hitDice.match(/d(\d+)/);
        const dado = match ? parseInt(match[1]) : 8;
        const conMod = Math.floor((con - 10) / 2);

        const total = (dado + conMod) * nivel;
        pgPreview.textContent = total;
        console.log(`⚡ PG máximo: ${total} (dado ${hitDice}, +${conMod} por CON)`);
    }

    async function calcularMediaPG() {
        const clase = claseSelect.value;
        const nivel = parseInt(nivelInput?.value) || 1;
        const con = currentStatValues.con;

        if (!clase) {
            pgPreview.textContent = '0';
            return;
        }

        if (!hitDiceCache[clase]) {
            hitDiceCache[clase] = await window.dndData.obtenerHitDiceDeClase(clase);
        }
        const hitDice = hitDiceCache[clase];
        const match = hitDice.match(/d(\d+)/);
        const dado = match ? parseInt(match[1]) : 8;
        const conMod = Math.floor((con - 10) / 2);

        const primerNivel = dado + conMod;
        const mediaPorNivel = Math.floor(dado / 2) + 1 + conMod;
        const total = primerNivel + mediaPorNivel * (nivel - 1);

        pgPreview.textContent = total;
        console.log(`📊 PG medio: ${total} (dado ${hitDice}, +${conMod} por CON)`);
    }

    // ============================================
    // FUNCIONES PARA POINT BUY
    // ============================================
    function getTotalSpentPoints() {
        console.log('Calculando puntos gastados, currentStatValues:', currentStatValues);
        let total = 0;
        for (let stat in currentStatValues) {
            const value = currentStatValues[stat];
            total += statCosts[value] || 0;
        }
        return total;
    }

    function updateAllStatsDisplay() {
        console.log('Ejecutando updateAllStatsDisplay');
        const spent = getTotalSpentPoints();
        const puntosRestantes = document.getElementById('puntos-totales');
        if (puntosRestantes) {
            puntosRestantes.textContent = TOTAL_POINTS - spent;
        }

        for (let stat in currentStatValues) {
            const input = document.getElementById(stat);
            if (input) {
                input.value = currentStatValues[stat];
            }
        }

        // Habilitar/deshabilitar botones según puntos y límites
        document.querySelectorAll('.stat-row').forEach(row => {
            const stat = row.dataset.stat;
            const upBtn = row.querySelector('.stat-up');
            const downBtn = row.querySelector('.stat-down');
            const currentVal = currentStatValues[stat];

            if (upBtn) {
                const nextVal = currentVal + 1;
                const currentTotalCost = getTotalSpentPoints();
                const nextStatCost = (statCosts[nextVal] || 0) - (statCosts[currentVal] || 0);
                upBtn.disabled = (nextVal > MAX_STAT) || (currentTotalCost + nextStatCost > TOTAL_POINTS);
            }
            if (downBtn) {
                downBtn.disabled = currentVal <= MIN_STAT;
            }
        });
    }

    function handleStatChange(stat, change) {
        const newVal = currentStatValues[stat] + change;
        if (newVal < MIN_STAT || newVal > MAX_STAT) return;

        const oldCost = statCosts[currentStatValues[stat]] || 0;
        const newCost = statCosts[newVal] || 0;
        const currentTotal = getTotalSpentPoints();
        const newTotal = currentTotal + (newCost - oldCost);

        if (newTotal > TOTAL_POINTS) return;

        currentStatValues[stat] = newVal;
        updateAllStatsDisplay();
    }

    // ============================================
    // FUNCIÓN PARA IR AL PASO 2 (mejorada)
    // ============================================
    window.irAlPaso2 = function() {
        // Comprobar que todos los elementos existen
        const elementos = {
            nombre: document.getElementById('nombre'),
            raza: document.getElementById('raza'),
            clase: document.getElementById('clase'),
            subclase: document.getElementById('subclase'),
            nivel: document.getElementById('nivel_creacion'),
            background: document.getElementById('background')
        };

        for (let key in elementos) {
            if (!elementos[key]) {
                console.error(`Error: No se encuentra el campo "${key}" en el DOM.`);
                alert(`Error interno: falta el campo ${key}. No se puede continuar.`);
                return;
            }
        }

        // Obtener los valores
        const datosPaso1 = {
            nombre: elementos.nombre.value,
            raza: elementos.raza.value,
            clase: elementos.clase.value,
            subclase: elementos.subclase.value,
            nivel: elementos.nivel.value,
            background: elementos.background.value,
            stats: { ...currentStatValues }
        };

        // Guardar en localStorage
        localStorage.setItem('cefiro_paso1', JSON.stringify(datosPaso1));

        // Redirigir a la página 2 (asegúrate de que el archivo se llame así)
        window.location.href = 'crear_2.html';
    };

    // ============================================
    // EVENTOS PARA LOS BOTONES DE ESTADÍSTICAS
    // ============================================
    document.querySelectorAll('.stat-up').forEach(btn => {
        btn.addEventListener('click', (e) => {
            console.log('Click en botón +');
            e.preventDefault();
            const statRow = btn.closest('.stat-row');
            const stat = statRow.dataset.stat;
            handleStatChange(stat, 1);
            actualizarPreviewPG(); // Recalcula PG si cambia CON
        });
    });

    document.querySelectorAll('.stat-down').forEach(btn => {
        btn.addEventListener('click', (e) => {
            console.log('Click en botón -');
            e.preventDefault();
            const statRow = btn.closest('.stat-row');
            const stat = statRow.dataset.stat;
            handleStatChange(stat, -1);
            actualizarPreviewPG(); // Recalcula PG si cambia CON
        });
    });

    // ============================================
    // EVENTOS PARA BOTONES DE PG
    // ============================================
    if (btnCalcular) {
        btnCalcular.addEventListener('click', actualizarPreviewPG);
    }
    if (btnMax) {
        btnMax.addEventListener('click', calcularMaxPG);
    }
    if (btnMedia) {
        btnMedia.addEventListener('click', calcularMediaPG);
    }

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
    // EVENTO CAMBIO DE CLASE (cargar subclases)
    // ============================================
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
                fue: currentStatValues.fue,
                des: currentStatValues.des,
                con: currentStatValues.con,
                int: currentStatValues.int,
                sab: currentStatValues.sab,
                car: currentStatValues.car
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
    try {
        console.log('Llamando a updateAllStatsDisplay');
        updateAllStatsDisplay(); // Muestra los valores iniciales (8 en todo)

        console.log('Cargando opciones...');
        await cargarOpciones();
        console.log('Opciones cargadas');

        console.log('Actualizando preview PG');
        await actualizarPreviewPG();
    } catch (error) {
        console.error('Error en la inicialización:', error);
    }
});