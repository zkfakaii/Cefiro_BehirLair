// app/crear_3.js
// Lógica para la pantalla de habilidades y herramientas (paso 3)

document.addEventListener('DOMContentLoaded', () => {
    console.log('🆕 Pantalla de habilidades');

    // Cargar datos de los pasos anteriores
    const datosPaso1 = JSON.parse(localStorage.getItem('cefiro_paso1') || '{}');
    const datosPaso2 = JSON.parse(localStorage.getItem('cefiro_paso2') || '{}');

    if (!datosPaso1.stats || !datosPaso1.nivel) {
        alert('Error: faltan datos del personaje. Vuelve a empezar.');
        window.location.href = 'crear.html';
        return;
    }

    const stats = datosPaso1.stats;
    const nivel = datosPaso1.nivel;
    const clase = datosPaso1.clase;
    const background = datosPaso1.background;

    // Calcular bono de competencia
    function calcularBonoCompetencia(nivel) {
        return Math.floor((nivel - 1) / 4) + 2;
    }
    const bonoComp = calcularBonoCompetencia(nivel);

    // Lista de habilidades con su característica asociada
    const habilidadesData = [
        { nombre: 'Acrobacias', stat: 'des' },
        { nombre: 'Arcanos', stat: 'int' },
        { nombre: 'Atletismo', stat: 'fue' },
        { nombre: 'Engaño', stat: 'car' },
        { nombre: 'Historia', stat: 'int' },
        { nombre: 'Interpretación', stat: 'car' },
        { nombre: 'Intimidación', stat: 'car' },
        { nombre: 'Investigación', stat: 'int' },
        { nombre: 'Juego de manos', stat: 'des' },
        { nombre: 'Medicina', stat: 'sab' },
        { nombre: 'Naturaleza', stat: 'int' },
        { nombre: 'Percepción', stat: 'sab' },
        { nombre: 'Perspicacia', stat: 'sab' },
        { nombre: 'Persuasión', stat: 'car' },
        { nombre: 'Religión', stat: 'int' },
        { nombre: 'Sigilo', stat: 'des' },
        { nombre: 'Supervivencia', stat: 'sab' },
        { nombre: 'Trato con animales', stat: 'sab' }
    ];

    // Función para calcular modificador de característica
    function calcularModificador(valor) {
        return Math.floor((valor - 10) / 2);
    }

    // MAPA MANUAL DE COMPETENCIAS POR CLASE (SRD)
    const competenciasClase = {
        'Bárbaro': 'Elige 2 entre: Atletismo, Intimidación, Naturaleza, Percepción, Supervivencia',
        'Barbarian': 'Elige 2 entre: Atletismo, Intimidación, Naturaleza, Percepción, Supervivencia',
        'Bardo': 'Elige 3 entre: cualquier habilidad',
        'Bard': 'Elige 3 entre: cualquier habilidad',
        'Clérigo': 'Elige 2 entre: Historia, Perspicacia, Medicina, Persuasión, Religión',
        'Cleric': 'Elige 2 entre: Historia, Perspicacia, Medicina, Persuasión, Religión',
        'Druida': 'Elige 2 entre: Arcanos, Trato con animales, Perspicacia, Medicina, Naturaleza, Percepción, Religión, Supervivencia',
        'Druid': 'Elige 2 entre: Arcanos, Trato con animales, Perspicacia, Medicina, Naturaleza, Percepción, Religión, Supervivencia',
        'Explorador': 'Elige 3 entre: Atletismo, Trato con animales, Perspicacia, Investigación, Naturaleza, Percepción, Sigilo, Supervivencia',
        'Ranger': 'Elige 3 entre: Atletismo, Trato con animales, Perspicacia, Investigación, Naturaleza, Percepción, Sigilo, Supervivencia',
        'Guerrero': 'Elige 2 entre: Acrobacias, Trato con animales, Atletismo, Historia, Perspicacia, Intimidación, Percepción, Supervivencia',
        'Fighter': 'Elige 2 entre: Acrobacias, Trato con animales, Atletismo, Historia, Perspicacia, Intimidación, Percepción, Supervivencia',
        'Hechicero': 'Elige 2 entre: Arcanos, Engaño, Perspicacia, Intimidación, Persuasión, Religión',
        'Sorcerer': 'Elige 2 entre: Arcanos, Engaño, Perspicacia, Intimidación, Persuasión, Religión',
        'Mago': 'Elige 2 entre: Arcanos, Historia, Perspicacia, Investigación, Medicina, Religión',
        'Wizard': 'Elige 2 entre: Arcanos, Historia, Perspicacia, Investigación, Medicina, Religión',
        'Monje': 'Elige 2 entre: Acrobacias, Atletismo, Historia, Perspicacia, Religión, Sigilo',
        'Monk': 'Elige 2 entre: Acrobacias, Atletismo, Historia, Perspicacia, Religión, Sigilo',
        'Paladín': 'Elige 2 entre: Atletismo, Perspicacia, Intimidación, Medicina, Persuasión, Religión',
        'Paladin': 'Elige 2 entre: Atletismo, Perspicacia, Intimidación, Medicina, Persuasión, Religión',
        'Pícaro': 'Elige 4 entre: Acrobacias, Atletismo, Engaño, Perspicacia, Intimidación, Investigación, Percepción, Interpretación, Persuasión, Juego de manos, Sigilo',
        'Rogue': 'Elige 4 entre: Acrobacias, Atletismo, Engaño, Perspicacia, Intimidación, Investigación, Percepción, Interpretación, Persuasión, Juego de manos, Sigilo'
    };

    // MAPA MANUAL DE COMPETENCIAS POR BACKGROUND (SRD)
    const competenciasBackground = {
        'Acolyte': 'Religión, y una entre Perspicacia o Persuasión',
        'Charlatan': 'Engaño, y una entre Juego de manos o Sigilo',
        'Criminal': 'Engaño, y una entre Investigación o Sigilo',
        'Artisan': 'Persuasión, y una entre Perspicacia o Historia',
        'Entertainer': 'Interpretación, y una entre Acrobacias o Engaño',
        'Folk Hero': 'Trato con animales, y una entre Supervivencia o Atletismo',
        'Gladiator': 'Interpretación, y una entre Atletismo o Intimidación',
        'Guild Artisan': 'Perspicacia, y una entre Persuasión o Historia',
        'Guild Merchant': 'Perspicacia, y una entre Persuasión o Historia',
        'Hermit': 'Religión, y una entre Medicina o Naturaleza',
        'Knight': 'Historia, y una entre Persuasión o Atletismo',
        'Noble': 'Historia, y una entre Persuasión o Interpretación',
        'Outlander': 'Atletismo, y una entre Supervivencia o Trato con animales',
        'Pirate': 'Atletismo, y una entre Percepción o Intimidación',
        'Sage': 'Arcanos, y una entre Historia o Investigación',
        'Sailor': 'Atletismo, y una entre Percepción o Trato con animales',
        'Soldier': 'Atletismo, y una entre Intimidación o Percepción',
        'Spy': 'Engaño, y una entre Investigación o Sigilo',
        'Urchin': 'Juego de manos, y una entre Sigilo o Investigación'
    };

    // MAPA DE HERRAMIENTAS POR CLASE (texto informativo)
    const herramientasClase = {
        'Bárbaro': 'Ninguna herramienta adicional',
        'Barbarian': 'Ninguna herramienta adicional',
        'Bardo': 'Tres instrumentos musicales a tu elección',
        'Bard': 'Tres instrumentos musicales a tu elección',
        'Clérigo': 'Ninguna',
        'Cleric': 'Ninguna',
        'Druida': 'Kit de herboristería',
        'Druid': 'Kit de herboristería',
        'Explorador': 'Ninguna',
        'Ranger': 'Ninguna',
        'Guerrero': 'Ninguna',
        'Fighter': 'Ninguna',
        'Hechicero': 'Ninguna',
        'Sorcerer': 'Ninguna',
        'Mago': 'Ninguna',
        'Wizard': 'Ninguna',
        'Monje': 'Un tipo de herramienta de artesano o instrumento musical',
        'Monk': 'Un tipo de herramienta de artesano o instrumento musical',
        'Paladín': 'Ninguna',
        'Paladin': 'Ninguna',
        'Pícaro': 'Herramientas de ladrón',
        'Rogue': 'Thieves\' tools'
    };

    // Lista de herramientas del SRD (en inglés, para comparar)
    const herramientasSRD = [
        "alchemist's supplies", "brewer's supplies", "calligrapher's supplies", "carpenter's tools",
        "cartographer's tools", "cobbler's tools", "cook's utensils", "glassblower's tools", "jeweler's tools",
        "leatherworker's tools", "mason's tools", "painter's supplies", "potter's tools", "smith's tools",
        "tinker's tools", "weaver's tools", "woodcarver's tools", "disguise kit", "forgery kit",
        "gaming set", "herbalism kit", "musical instrument", "navigator's tools", "poisoner's kit",
        "thieves' tools"
    ];

    const textoClase = competenciasClase[clase] || 'Competencias de clase no especificadas. Elige libremente.';
    const textoBackground = competenciasBackground[background] || 'Competencias de background no especificadas. Elige libremente.';
    const textoHerramientas = herramientasClase[clase] || 'No se especifican herramientas para esta clase.';


    // Mostrar el texto informativo de herramientas
const textoHerramientasElem = document.getElementById('texto-herramientas');
if (textoHerramientasElem) {
    textoHerramientasElem.textContent = `Tu clase (${clase}) permite: ${textoHerramientas}`;
}
    // Mostrar información de competencias
    const container = document.getElementById('skills-container');
    
    const infoDiv = document.createElement('div');
    infoDiv.className = 'puntos-restantes';
    infoDiv.style.marginBottom = '20px';
    infoDiv.style.fontSize = '1.2em';
    infoDiv.style.lineHeight = '1.5';
    infoDiv.innerHTML = `
        <p>📚 <strong>Competencias recomendadas:</strong></p>
        <p><strong>Clase (${clase}):</strong> ${textoClase}</p>
        <p><strong>Background (${background}):</strong> ${textoBackground}</p>
        <p style="font-size:0.9em; margin-top:5px;">⚡ Puedes marcar las habilidades que desees. ¡Tú decides!</p>
    `;
    container.parentNode.insertBefore(infoDiv, container);

    // Generar el HTML de habilidades
    let html = '';

    habilidadesData.forEach(habilidad => {
        const statMod = calcularModificador(stats[habilidad.stat]);
        html += `
            <div class="stat-row" data-habilidad="${habilidad.nombre}" style="justify-content: flex-start;">
                <label style="min-width: 120px;">${habilidad.nombre}</label>
                <span class="stat-mod" style="margin-right: 10px;">(${statMod >= 0 ? '+' : ''}${statMod})</span>
                <input type="checkbox" class="skill-check" style="width: 20px; height: 20px; margin-left: auto;">
                <span class="skill-total" style="margin-left: 10px; font-weight: bold; min-width: 40px;">${statMod >= 0 ? '+' : ''}${statMod}</span>
            </div>
        `;
    });

    container.innerHTML = html;

    // Actualizar total cuando se marca/desmarca un checkbox
    function actualizarTotal(habilidadRow) {
        const checkbox = habilidadRow.querySelector('.skill-check');
        const statModSpan = habilidadRow.querySelector('.stat-mod');
        const totalSpan = habilidadRow.querySelector('.skill-total');
        const statMod = parseInt(statModSpan.textContent.match(/[+-]?\d+/)[0]);

        if (checkbox.checked) {
            const total = statMod + bonoComp;
            totalSpan.textContent = (total >= 0 ? '+' : '') + total;
        } else {
            totalSpan.textContent = (statMod >= 0 ? '+' : '') + statMod;
        }
    }

    document.querySelectorAll('.skill-check').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const row = e.target.closest('.stat-row');
            actualizarTotal(row);
        });
    });

// app/crear_3.js
// Lógica para la pantalla de habilidades y herramientas (paso 3)

document.addEventListener('DOMContentLoaded', () => {
    console.log('🆕 Pantalla de habilidades');

    // Cargar datos de los pasos anteriores
    const datosPaso1 = JSON.parse(localStorage.getItem('cefiro_paso1') || '{}');
    const datosPaso2 = JSON.parse(localStorage.getItem('cefiro_paso2') || '{}');

    if (!datosPaso1.stats || !datosPaso1.nivel) {
        alert('Error: faltan datos del personaje. Vuelve a empezar.');
        window.location.href = 'crear.html';
        return;
    }

    const stats = datosPaso1.stats;
    const nivel = datosPaso1.nivel;
    const clase = datosPaso1.clase;
    const background = datosPaso1.background;

    // Calcular bono de competencia
    function calcularBonoCompetencia(nivel) {
        return Math.floor((nivel - 1) / 4) + 2;
    }
    const bonoComp = calcularBonoCompetencia(nivel);

    // Lista de habilidades con su característica asociada
    const habilidadesData = [
        { nombre: 'Acrobacias', stat: 'des' },
        { nombre: 'Arcanos', stat: 'int' },
        { nombre: 'Atletismo', stat: 'fue' },
        { nombre: 'Engaño', stat: 'car' },
        { nombre: 'Historia', stat: 'int' },
        { nombre: 'Interpretación', stat: 'car' },
        { nombre: 'Intimidación', stat: 'car' },
        { nombre: 'Investigación', stat: 'int' },
        { nombre: 'Juego de manos', stat: 'des' },
        { nombre: 'Medicina', stat: 'sab' },
        { nombre: 'Naturaleza', stat: 'int' },
        { nombre: 'Percepción', stat: 'sab' },
        { nombre: 'Perspicacia', stat: 'sab' },
        { nombre: 'Persuasión', stat: 'car' },
        { nombre: 'Religión', stat: 'int' },
        { nombre: 'Sigilo', stat: 'des' },
        { nombre: 'Supervivencia', stat: 'sab' },
        { nombre: 'Trato con animales', stat: 'sab' }
    ];

    // Función para calcular modificador de característica
    function calcularModificador(valor) {
        return Math.floor((valor - 10) / 2);
    }

    // MAPA MANUAL DE COMPETENCIAS POR CLASE (SRD)
    const competenciasClase = {
        'Bárbaro': 'Elige 2 entre: Atletismo, Intimidación, Naturaleza, Percepción, Supervivencia',
        'Barbarian': 'Elige 2 entre: Atletismo, Intimidación, Naturaleza, Percepción, Supervivencia',
        'Bardo': 'Elige 3 entre: cualquier habilidad',
        'Bard': 'Elige 3 entre: cualquier habilidad',
        'Clérigo': 'Elige 2 entre: Historia, Perspicacia, Medicina, Persuasión, Religión',
        'Cleric': 'Elige 2 entre: Historia, Perspicacia, Medicina, Persuasión, Religión',
        'Druida': 'Elige 2 entre: Arcanos, Trato con animales, Perspicacia, Medicina, Naturaleza, Percepción, Religión, Supervivencia',
        'Druid': 'Elige 2 entre: Arcanos, Trato con animales, Perspicacia, Medicina, Naturaleza, Percepción, Religión, Supervivencia',
        'Explorador': 'Elige 3 entre: Atletismo, Trato con animales, Perspicacia, Investigación, Naturaleza, Percepción, Sigilo, Supervivencia',
        'Ranger': 'Elige 3 entre: Atletismo, Trato con animales, Perspicacia, Investigación, Naturaleza, Percepción, Sigilo, Supervivencia',
        'Guerrero': 'Elige 2 entre: Acrobacias, Trato con animales, Atletismo, Historia, Perspicacia, Intimidación, Percepción, Supervivencia',
        'Fighter': 'Elige 2 entre: Acrobacias, Trato con animales, Atletismo, Historia, Perspicacia, Intimidación, Percepción, Supervivencia',
        'Hechicero': 'Elige 2 entre: Arcanos, Engaño, Perspicacia, Intimidación, Persuasión, Religión',
        'Sorcerer': 'Elige 2 entre: Arcanos, Engaño, Perspicacia, Intimidación, Persuasión, Religión',
        'Mago': 'Elige 2 entre: Arcanos, Historia, Perspicacia, Investigación, Medicina, Religión',
        'Wizard': 'Elige 2 entre: Arcanos, Historia, Perspicacia, Investigación, Medicina, Religión',
        'Monje': 'Elige 2 entre: Acrobacias, Atletismo, Historia, Perspicacia, Religión, Sigilo',
        'Monk': 'Elige 2 entre: Acrobacias, Atletismo, Historia, Perspicacia, Religión, Sigilo',
        'Paladín': 'Elige 2 entre: Atletismo, Perspicacia, Intimidación, Medicina, Persuasión, Religión',
        'Paladin': 'Elige 2 entre: Atletismo, Perspicacia, Intimidación, Medicina, Persuasión, Religión',
        'Pícaro': 'Elige 4 entre: Acrobacias, Atletismo, Engaño, Perspicacia, Intimidación, Investigación, Percepción, Interpretación, Persuasión, Juego de manos, Sigilo',
        'Rogue': 'Elige 4 entre: Acrobacias, Atletismo, Engaño, Perspicacia, Intimidación, Investigación, Percepción, Interpretación, Persuasión, Juego de manos, Sigilo'
    };

    // MAPA MANUAL DE COMPETENCIAS POR BACKGROUND (SRD)
    const competenciasBackground = {
        'Acolyte': 'Religión, y una entre Perspicacia o Persuasión',
        'Charlatan': 'Engaño, y una entre Juego de manos o Sigilo',
        'Criminal': 'Engaño, y una entre Investigación o Sigilo',
        'Artisan': 'Persuasión, y una entre Perspicacia o Historia',
        'Entertainer': 'Interpretación, y una entre Acrobacias o Engaño',
        'Folk Hero': 'Trato con animales, y una entre Supervivencia o Atletismo',
        'Gladiator': 'Interpretación, y una entre Atletismo o Intimidación',
        'Guild Artisan': 'Perspicacia, y una entre Persuasión o Historia',
        'Guild Merchant': 'Perspicacia, y una entre Persuasión o Historia',
        'Hermit': 'Religión, y una entre Medicina o Naturaleza',
        'Knight': 'Historia, y una entre Persuasión o Atletismo',
        'Noble': 'Historia, y una entre Persuasión o Interpretación',
        'Outlander': 'Atletismo, y una entre Supervivencia o Trato con animales',
        'Pirate': 'Atletismo, y una entre Percepción o Intimidación',
        'Sage': 'Arcanos, y una entre Historia o Investigación',
        'Sailor': 'Atletismo, y una entre Percepción o Trato con animales',
        'Soldier': 'Atletismo, y una entre Intimidación o Percepción',
        'Spy': 'Engaño, y una entre Investigación o Sigilo',
        'Urchin': 'Juego de manos, y una entre Sigilo o Investigación'
    };

    // MAPA DE HERRAMIENTAS POR CLASE (texto informativo)
    const herramientasClase = {
        'Bárbaro': 'Ninguna herramienta adicional',
        'Barbarian': 'Ninguna herramienta adicional',
        'Bardo': 'Tres instrumentos musicales a tu elección',
        'Bard': 'Tres instrumentos musicales a tu elección',
        'Clérigo': 'Ninguna',
        'Cleric': 'Ninguna',
        'Druida': 'Kit de herboristería',
        'Druid': 'Herbalism kit',
        'Explorador': 'Ninguna',
        'Ranger': 'Ninguna',
        'Guerrero': 'Ninguna',
        'Fighter': 'Ninguna',
        'Hechicero': 'Ninguna',
        'Sorcerer': 'Ninguna',
        'Mago': 'Ninguna',
        'Wizard': 'Ninguna',
        'Monje': 'Un tipo de herramienta de artesano o instrumento musical',
        'Monk': 'One type of artisan\'s tools or musical instrument',
        'Paladín': 'Ninguna',
        'Paladin': 'Ninguna',
        'Pícaro': 'Herramientas de ladrón',
        'Rogue': 'Thieves\' tools'
    };

    // Lista de herramientas del SRD (en inglés, para comparar)
    const herramientasSRD = [
        "alchemist's supplies", "brewer's supplies", "calligrapher's supplies", "carpenter's tools",
        "cartographer's tools", "cobbler's tools", "cook's utensils", "glassblower's tools", "jeweler's tools",
        "leatherworker's tools", "mason's tools", "painter's supplies", "potter's tools", "smith's tools",
        "tinker's tools", "weaver's tools", "woodcarver's tools", "disguise kit", "forgery kit",
        "gaming set", "herbalism kit", "musical instrument", "navigator's tools", "poisoner's kit",
        "thieves' tools"
    ];

    const textoClase = competenciasClase[clase] || 'Competencias de clase no especificadas. Elige libremente.';
    const textoBackground = competenciasBackground[background] || 'Competencias de background no especificadas. Elige libremente.';
    const textoHerramientas = herramientasClase[clase] || 'No se especifican herramientas para esta clase.';

    // Mostrar el texto informativo de herramientas
    const textoHerramientasElem = document.getElementById('texto-herramientas');
    if (textoHerramientasElem) {
        textoHerramientasElem.textContent = `Tu clase (${clase}) permite: ${textoHerramientas}`;
    }

    // Mostrar información de competencias
    const container = document.getElementById('skills-container');
    const infoDiv = document.createElement('div');
    infoDiv.className = 'puntos-restantes';
    infoDiv.style.marginBottom = '20px';
    infoDiv.style.fontSize = '1.2em';
    infoDiv.style.lineHeight = '1.5';
    infoDiv.innerHTML = `
        <p>📚 <strong>Competencias recomendadas:</strong></p>
        <p><strong>Clase (${clase}):</strong> ${textoClase}</p>
        <p><strong>Background (${background}):</strong> ${textoBackground}</p>
        <p style="font-size:0.9em; margin-top:5px;">⚡ Puedes marcar las habilidades que desees. ¡Tú decides!</p>
    `;
    container.parentNode.insertBefore(infoDiv, container);

    // Generar el HTML de habilidades
    let html = '';

    habilidadesData.forEach(habilidad => {
        const statMod = calcularModificador(stats[habilidad.stat]);
        html += `
            <div class="stat-row" data-habilidad="${habilidad.nombre}" style="justify-content: flex-start;">
                <label style="min-width: 120px;">${habilidad.nombre}</label>
                <span class="stat-mod" style="margin-right: 10px;">(${statMod >= 0 ? '+' : ''}${statMod})</span>
                <input type="checkbox" class="skill-check" style="width: 20px; height: 20px; margin-left: auto;">
                <span class="skill-total" style="margin-left: 10px; font-weight: bold; min-width: 40px;">${statMod >= 0 ? '+' : ''}${statMod}</span>
            </div>
        `;
    });

    container.innerHTML = html;

    // Actualizar total cuando se marca/desmarca un checkbox
    function actualizarTotal(habilidadRow) {
        const checkbox = habilidadRow.querySelector('.skill-check');
        const statModSpan = habilidadRow.querySelector('.stat-mod');
        const totalSpan = habilidadRow.querySelector('.skill-total');
        const statMod = parseInt(statModSpan.textContent.match(/[+-]?\d+/)[0]);

        if (checkbox.checked) {
            const total = statMod + bonoComp;
            totalSpan.textContent = (total >= 0 ? '+' : '') + total;
        } else {
            totalSpan.textContent = (statMod >= 0 ? '+' : '') + statMod;
        }
    }

    document.querySelectorAll('.skill-check').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const row = e.target.closest('.stat-row');
            actualizarTotal(row);
        });
    });

    // ============================================
    // SECCIÓN DE HERRAMIENTAS (campos dinámicos)
    // ============================================
    const herramientasContainer = document.getElementById('herramientas-container');
    const agregarHerramientaBtn = document.getElementById('agregar-herramienta');

    // Función para crear un campo de herramienta con botón eliminar
    function crearCampoHerramienta(valorInicial = '') {
        const div = document.createElement('div');
        div.className = 'campo-dinamico';
        div.style.display = 'flex';
        div.style.gap = '10px';
        div.style.marginBottom = '10px';
        div.style.alignItems = 'center';

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-crear input-dinamico';
        input.value = valorInicial;
        input.style.flex = '1';
        input.style.padding = '8px 12px';
        input.style.border = '2px solid #33260f';
        input.style.borderRadius = '20px';
        input.style.backgroundColor = '#E6AB45';
        input.style.color = '#000000';
        input.placeholder = 'Ej: thieves\' tools, kit de herboristería...';

        const btnEliminar = document.createElement('button');
        btnEliminar.type = 'button';
        btnEliminar.className = 'btn-eliminar-dinamico';
        btnEliminar.textContent = '✖';
        btnEliminar.style.padding = '8px 12px';
        btnEliminar.style.border = '2px solid #33260f';
        btnEliminar.style.borderRadius = '20px';
        btnEliminar.style.backgroundColor = '#b3541c';
        btnEliminar.style.color = '#F0D8A0';
        btnEliminar.style.cursor = 'pointer';
        btnEliminar.style.fontWeight = 'bold';

        btnEliminar.addEventListener('click', () => {
            div.remove();
        });

        div.appendChild(input);
        div.appendChild(btnEliminar);
        return div;
    }

    if (agregarHerramientaBtn) {
        agregarHerramientaBtn.addEventListener('click', () => {
            herramientasContainer.appendChild(crearCampoHerramienta());
        });
    }

    // ============================================
    // BOTÓN "FINALIZAR"
    // ============================================
    document.getElementById('btn-finalizar').addEventListener('click', () => {
        // Recoger competencias
        const competencias = {};
        document.querySelectorAll('.stat-row').forEach(row => {
            const habilidad = row.dataset.habilidad;
            const checkbox = row.querySelector('.skill-check');
            competencias[habilidad] = checkbox.checked;
        });

        // Recoger herramientas
        const herramientasInputs = document.querySelectorAll('#herramientas-container .input-dinamico');
        const herramientas = [];
        herramientasInputs.forEach(input => {
            const valor = input.value.trim();
            if (valor) {
                const valorLower = valor.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                const encontrada = herramientasSRD.find(h => h.toLowerCase().includes(valorLower) || valorLower.includes(h.toLowerCase()));
                herramientas.push(encontrada || valor);
            }
        });

        const personajeCompleto = {
            ...datosPaso1,
            ...datosPaso2,
            competencias,
            herramientas
        };

        console.log('Personaje completo:', personajeCompleto);

        const personaje = new Personaje(personajeCompleto);

        if (typeof guardarPersonaje === 'function') {
            guardarPersonaje(personaje);
        } else {
            if (!personaje.id) {
                personaje.id = 'pj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            }
            localStorage.setItem(`cefiro_${personaje.id}`, JSON.stringify(personaje.toJSON?.() || personaje));
            let personajes = JSON.parse(localStorage.getItem('cefiro_personajes') || '[]');
            personajes.push({ id: personaje.id, nombre: personaje.nombre, nivel: personaje.nivel, clase: personaje.clase });
            localStorage.setItem('cefiro_personajes', JSON.stringify(personajes));
        }

        localStorage.removeItem('cefiro_paso1');
        localStorage.removeItem('cefiro_paso2');

        window.location.href = `ficha.html?id=${personaje.id}`;
    });
});

    // ============================================
    // BOTÓN "FINALIZAR"
    // ============================================
    document.getElementById('btn-finalizar').addEventListener('click', () => {
        // Recoger competencias
        const competencias = {};
        document.querySelectorAll('.stat-row').forEach(row => {
            const habilidad = row.dataset.habilidad;
            const checkbox = row.querySelector('.skill-check');
            competencias[habilidad] = checkbox.checked;
        });

       // Recoger herramientas
const herramientasInputs = document.querySelectorAll('#herramientas-container .input-dinamico');
const herramientas = [];
herramientasInputs.forEach(input => {
    const valor = input.value.trim();
    if (valor) {
        const valorLower = valor.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const encontrada = herramientasSRD.find(h => h.toLowerCase().includes(valorLower) || valorLower.includes(h.toLowerCase()));
        herramientas.push(encontrada || valor);
    }
});

        const personajeCompleto = {
            ...datosPaso1,
            ...datosPaso2,
            competencias,
            herramientas
        };

        console.log('Personaje completo:', personajeCompleto);

        const personaje = new Personaje(personajeCompleto);

        if (typeof guardarPersonaje === 'function') {
            guardarPersonaje(personaje);
        } else {
            if (!personaje.id) {
                personaje.id = 'pj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            }
            localStorage.setItem(`cefiro_${personaje.id}`, JSON.stringify(personaje.toJSON?.() || personaje));
            let personajes = JSON.parse(localStorage.getItem('cefiro_personajes') || '[]');
            personajes.push({ id: personaje.id, nombre: personaje.nombre, nivel: personaje.nivel, clase: personaje.clase });
            localStorage.setItem('cefiro_personajes', JSON.stringify(personajes));
        }

        localStorage.removeItem('cefiro_paso1');
        localStorage.removeItem('cefiro_paso2');

        window.location.href = `ficha.html?id=${personaje.id}`;
    });
});