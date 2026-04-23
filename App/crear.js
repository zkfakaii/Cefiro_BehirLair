// app/crear.jsa
// Lógica para la pantalla de creación de personaje

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🆕 Pantalla de creación');

    // Si no hay datos del paso 1, es una creación nueva: limpiar equipo temporal
// Si no hay datos del paso 1, es una creación nueva: limpiar equipo temporal
if (!localStorage.getItem('cefiro_paso1')) {
    localStorage.removeItem('cefiro_equipo_temp');
    console.log('🧹 Equipo temporal limpiado para nueva creación');
} else {
    console.log('📋 Continuando creación existente, equipo temporal conservado');
}

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


    let modoCalculoPG = 'media';          // 'media', 'max', 'tirada'
    let ultimaTiradaBase = 0;            // Suma de los dados sin mod CON (solo para modo tirada)
    let ultimoNivelTirada = 1;           // Nivel con el que se hizo la última tirada
    let ultimoDadoTirada = 8;            // Dado de golpe usado en la última tirada

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



    function aplicarModoCalculoPG() {
    if (modoCalculoPG === 'media') {
        calcularMediaPG();
    } else if (modoCalculoPG === 'max') {
        calcularMaxPG();
    } else if (modoCalculoPG === 'tirada') {
        // Reconstruir el total usando la base guardada y el nuevo CON
        const con = currentStatValues.con;
        const conMod = Math.floor((con - 10) / 2);
        const total = ultimaTiradaBase + conMod * ultimoNivelTirada;
        pgPreview.textContent = total;
        console.log(`🎲 PG con tirada previa: ${total} (base ${ultimaTiradaBase} + CON ${conMod}*${ultimoNivelTirada})`);
    }
}

 async function actualizarPreviewPG() {
    const clase = claseSelect.value;
    const nivel = parseInt(nivelInput?.value) || 1;
    const con = currentStatValues.con;
    const conMod = Math.floor((con - 10) / 2);

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

    // Guardar datos de la tirada para reconstruir después
    ultimoDadoTirada = dado;
    ultimoNivelTirada = nivel;

    let total = dado + conMod; // nivel 1
    for (let i = 2; i <= nivel; i++) {
        total += Math.floor(Math.random() * dado) + 1 + conMod;
    }

    // Calcular la base sin modificador de CON (para conservar la tirada)
    const conModNivel1 = conMod;
    const conModOtros = conMod * (nivel - 1);
    ultimaTiradaBase = total - conModNivel1 - conModOtros;

    pgPreview.textContent = total;
    console.log(`🎲 Tirada de PG: ${total} (base ${ultimaTiradaBase}, dado ${hitDice}, +${conMod} por CON)`);
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
window.irAlPaso2 = async function() {
    // Verificar que todos los campos existen
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

    // Calcular PG con regla de MEDIA justo antes de guardar
    await calcularMediaPG();
    const pgCalculado = parseInt(pgPreview.textContent) || 10;
    console.log('📊 PG guardado en paso1:', pgCalculado);

    const datosPaso1 = {
        nombre: elementos.nombre.value,
        raza: elementos.raza.value,
        clase: elementos.clase.value,
        subclase: elementos.subclase.value,
        nivel: elementos.nivel.value,
        background: elementos.background.value,
        stats: { ...currentStatValues },
        pg_max: pgCalculado,      // <-- Añadido
        pg_actuales: pgCalculado  // <-- Añadido
    };

    localStorage.setItem('cefiro_paso1', JSON.stringify(datosPaso1));
    window.location.href = 'crear_2.html';
};

    // ============================================
    // EVENTOS PARA LOS BOTONES DE ESTADÍSTICAS
    // ============================================
    document.querySelectorAll('.stat-up').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const statRow = btn.closest('.stat-row');
            const stat = statRow.dataset.stat;
            handleStatChange(stat, 1);
            if (stat === 'con') {
                aplicarModoCalculoPG();
            }
        });
    });

    document.querySelectorAll('.stat-down').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const statRow = btn.closest('.stat-row');
            const stat = statRow.dataset.stat;
            handleStatChange(stat, -1);
            if (stat === 'con') {
                aplicarModoCalculoPG();
            }
        });
    });


    claseSelect.addEventListener('change', () => {
        if (modoCalculoPG === 'media') calcularMediaPG();
        else if (modoCalculoPG === 'max') calcularMaxPG();
        else if (modoCalculoPG === 'tirada') actualizarPreviewPG(); // Re-tirar al cambiar clase
    });

    nivelInput.addEventListener('input', () => {
        if (modoCalculoPG === 'media') calcularMediaPG();
        else if (modoCalculoPG === 'max') calcularMaxPG();
        else if (modoCalculoPG === 'tirada') actualizarPreviewPG(); // Re-tirar al cambiar nivel
    });

    // ============================================
    // EVENTOS PARA BOTONES DE PG
    // ============================================
    if (btnCalcular) {
        btnCalcular.addEventListener('click', async () => {
            modoCalculoPG = 'tirada';
            await actualizarPreviewPG(); // Esto ya guarda internamente los valores base
        });
    }
    if (btnMax) {
        btnMax.addEventListener('click', async () => {
            modoCalculoPG = 'max';
            await calcularMaxPG();
        });
    }
    if (btnMedia) {
        btnMedia.addEventListener('click', async () => {
            modoCalculoPG = 'media';
            await calcularMediaPG();
        });
    }

    // ============================================
    // CARGAR OPCIONES DE LOS SELECTORES
    // ============================================
    async function cargarOpciones() {
        try {
            const razas = await window.dndData.cargarRazas();
            llenarSelect(razaSelect, razas, 'name', 'name');

            const clases = await window.dndData.cargarClases();
            llenarSelect(claseSelect, clases, 'name', 'name');

            const backgrounds = await window.dndData.cargarBackgrounds();
            llenarSelect(backgroundSelect, backgrounds, 'name', 'name');

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
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Forzar el cálculo con la regla de MEDIA justo antes de leer el preview
        await calcularMediaPG();
        let pgCalculado = parseInt(pgPreview.textContent);

        // Respaldo manual si el preview sigue siendo inválido
        if (isNaN(pgCalculado) || pgCalculado <= 0) {
            const claseNombre = claseSelect.options[claseSelect.selectedIndex]?.text || claseSelect.value;
            const nivel = parseInt(nivelInput.value) || 1;
            const con = currentStatValues.con;
            const conMod = Math.floor((con - 10) / 2);
            const hitDiceMap = {
                barbarian: 12, bard: 8, cleric: 8, druid: 8, fighter: 10, monk: 8,
                paladin: 10, ranger: 10, rogue: 8, sorcerer: 6, warlock: 8, wizard: 6
            };
            let dado = 8;
            const claseLower = claseNombre.toLowerCase();
            for (let k in hitDiceMap) if (claseLower.includes(k)) { dado = hitDiceMap[k]; break; }
            const pgNivel1 = dado + conMod;
            const pgNivelesExtra = (nivel - 1) * (Math.floor(dado / 2) + 1 + conMod);
            pgCalculado = pgNivel1 + pgNivelesExtra;
            console.log('⚠️ PG por respaldo:', pgCalculado);
        }

        console.log('✅ PG guardado:', pgCalculado);

        const personajeData = {
            nombre: document.getElementById('nombre').value,
            nivel: parseInt(nivelInput.value) || 1,
            clase: claseSelect.options[claseSelect.selectedIndex]?.text || claseSelect.value,
            subclase: subclaseSelect.options[subclaseSelect.selectedIndex]?.text || '',
            raza: razaSelect.options[razaSelect.selectedIndex]?.text || razaSelect.value,
            trasfondo: backgroundSelect.options[backgroundSelect.selectedIndex]?.text || backgroundSelect.value,
            alineamiento: 'N',
            pg_max: pgCalculado,
            pg_actuales: pgCalculado,
            stats: { ...currentStatValues }
        };

        const personaje = new Personaje(personajeData);
        if (!personaje.id) personaje.id = 'pj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem(`cefiro_${personaje.id}`, JSON.stringify(personaje.toJSON?.() || personaje));

        let personajes = JSON.parse(localStorage.getItem('cefiro_personajes') || '[]');
        personajes.push({ id: personaje.id, nombre: personaje.nombre, nivel: personaje.nivel, clase: personaje.clase });
        localStorage.setItem('cefiro_personajes', JSON.stringify(personajes));

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