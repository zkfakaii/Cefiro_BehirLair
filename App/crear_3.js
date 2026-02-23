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

    // MAPA DE HERRAMIENTAS POR BACKGROUND (SRD 2024)
const herramientasBackground = {
    'Acolyte': 'Calligrapher\'s Supplies',
    'Artisan': 'Artisan\'s Tools (your choice)',
    'Charlatan': 'Forgery Kit',
    'Criminal': 'Thieves\' Tools',
    'Entertainer': 'Musical Instrument (your choice)',
    'Farmer': 'Carpenter\'s Tools',
    'Guard': 'Gaming Set (your choice)',
    'Guide': 'Cartographer\'s Tools',
    'Hermit': 'Herbalism Kit',
    'Merchant': 'Navigator\'s Tools',
    'Noble': 'Gaming Set (your choice)',
    'Sage': 'Calligrapher\'s Supplies',
    'Sailor': 'Navigator\'s Tools',
    'Scribe': 'Calligrapher\'s Supplies',
    'Soldier': 'Gaming Set (your choice)',
    'Wayfarer': 'Thieves\' Tools'
};

  // Base de datos completa de herramientas del SRD
const herramientasDB = [
    // === HERRAMIENTAS DE ARTESANO ===
    { 
        nombre: "Alchemist's supplies", 
        tipo: "Artisan's tools", 
        precio: "50 gp", 
        peso: "8 lb.", 
        descripcion: "Permite crear ácido, fuego de alquimista y pociones. Útil para identificar sustancias.", 
        habilidad: "Intelligence", 
        utilizar: "Identificar una sustancia (DC 15) o iniciar fuego (DC 15)" 
    },
    { 
        nombre: "Brewer's supplies", 
        tipo: "Artisan's tools", 
        precio: "20 gp", 
        peso: "9 lb.", 
        descripcion: "Para elaborar cerveza, vino y otras bebidas alcohólicas.", 
        habilidad: "Intelligence", 
        utilizar: "Detectar venenos en bebidas (DC 15)" 
    },
    { 
        nombre: "Calligrapher's supplies", 
        tipo: "Artisan's tools", 
        precio: "10 gp", 
        peso: "5 lb.", 
        descripcion: "Permite escribir e identificar caligrafías.", 
        habilidad: "Dexterity", 
        utilizar: "Forjar documentos (DC 15), identificar escritor (DC 10)" 
    },
    { 
        nombre: "Carpenter's tools", 
        tipo: "Artisan's tools", 
        precio: "8 gp", 
        peso: "6 lb.", 
        descripcion: "Para trabajar la madera.", 
        habilidad: "Strength", 
        utilizar: "Construir objetos de madera, apuntalar puertas (DC 15)" 
    },
    { 
        nombre: "Cartographer's tools", 
        tipo: "Artisan's tools", 
        precio: "15 gp", 
        peso: "6 lb.", 
        descripcion: "Para crear mapas y comprender representaciones del terreno.", 
        habilidad: "Wisdom", 
        utilizar: "Crear mapas precisos, interpretar mapas antiguos (DC 15)" 
    },
    { 
        nombre: "Cobbler's tools", 
        tipo: "Artisan's tools", 
        precio: "5 gp", 
        peso: "5 lb.", 
        descripcion: "Para reparar y crear calzado.", 
        habilidad: "Dexterity", 
        utilizar: "Ocultar mensajes en suelas de zapatos (DC 15)" 
    },
    { 
        nombre: "Cook's utensils", 
        tipo: "Artisan's tools", 
        precio: "1 gp", 
        peso: "8 lb.", 
        descripcion: "Utensilios para preparar comidas y detectar alteraciones en alimentos.", 
        habilidad: "Wisdom", 
        utilizar: "Detectar comida envenenada (DC 15), crear platos exquisitos" 
    },
    { 
        nombre: "Glassblower's tools", 
        tipo: "Artisan's tools", 
        precio: "30 gp", 
        peso: "5 lb.", 
        descripcion: "Para trabajar el vidrio y crear objetos de cristal.", 
        habilidad: "Dexterity", 
        utilizar: "Crear objetos de vidrio, identificar puntos débiles en cristal (DC 15)" 
    },
    { 
        nombre: "Jeweler's tools", 
        tipo: "Artisan's tools", 
        precio: "25 gp", 
        peso: "2 lb.", 
        descripcion: "Para trabajar metales preciosos y gemas.", 
        habilidad: "Intelligence", 
        utilizar: "Identificar piedras preciosas, valorar joyas (DC 15)" 
    },
    { 
        nombre: "Leatherworker's tools", 
        tipo: "Artisan's tools", 
        precio: "5 gp", 
        peso: "5 lb.", 
        descripcion: "Para trabajar el cuero y crear prendas de cuero.", 
        habilidad: "Dexterity", 
        utilizar: "Reparar armaduras de cuero, crear objetos de cuero" 
    },
    { 
        nombre: "Mason's tools", 
        tipo: "Artisan's tools", 
        precio: "10 gp", 
        peso: "8 lb.", 
        descripcion: "Para trabajar la piedra y detectar construcciones inseguras.", 
        habilidad: "Strength", 
        utilizar: "Encontrar puntos débiles en muros de piedra (DC 15), construir estructuras" 
    },
    { 
        nombre: "Painter's supplies", 
        tipo: "Artisan's tools", 
        precio: "10 gp", 
        peso: "5 lb.", 
        descripcion: "Suministros para pintar y crear obras de arte.", 
        habilidad: "Charisma", 
        utilizar: "Crear retratos, falsificar pinturas (DC 15)" 
    },
    { 
        nombre: "Potter's tools", 
        tipo: "Artisan's tools", 
        precio: "10 gp", 
        peso: "3 lb.", 
        descripcion: "Para trabajar la cerámica y crear vasijas.", 
        habilidad: "Dexterity", 
        utilizar: "Crear recipientes de cerámica, ocultar objetos en vasijas" 
    },
    { 
        nombre: "Smith's tools", 
        tipo: "Artisan's tools", 
        precio: "20 gp", 
        peso: "8 lb.", 
        descripcion: "Para trabajar el metal y forjar armas y armaduras.", 
        habilidad: "Strength", 
        utilizar: "Reparar armaduras metálicas, forjar objetos de metal, abrir cerraduras de metal (DC 20)" 
    },
    { 
        nombre: "Tinker's tools", 
        tipo: "Artisan's tools", 
        precio: "50 gp", 
        peso: "10 lb.", 
        descripcion: "Para reparar mecanismos y crear pequeños artilugios.", 
        habilidad: "Dexterity", 
        utilizar: "Reparar mecanismos, crear juguetes mecánicos, desactivar mecanismos simples (DC 15)" 
    },
    { 
        nombre: "Weaver's tools", 
        tipo: "Artisan's tools", 
        precio: "1 gp", 
        peso: "5 lb.", 
        descripcion: "Para trabajar textiles y crear tejidos.", 
        habilidad: "Dexterity", 
        utilizar: "Crear ropa, identificar telas por textura (DC 10)" 
    },
    { 
        nombre: "Woodcarver's tools", 
        tipo: "Artisan's tools", 
        precio: "1 gp", 
        peso: "5 lb.", 
        descripcion: "Para tallar madera y crear objetos de madera.", 
        habilidad: "Dexterity", 
        utilizar: "Tallar figuras, crear flechas, identificar tipos de madera (DC 10)" 
    },

    // === KITS ===
    { 
        nombre: "Disguise kit", 
        tipo: "Kit", 
        precio: "25 gp", 
        peso: "3 lb.", 
        descripcion: "Incluye maquillaje, pelucas y accesorios para cambiar la apariencia.", 
        habilidad: "Charisma", 
        utilizar: "Crear un disfraz (DC 15)" 
    },
    { 
        nombre: "Forgery kit", 
        tipo: "Kit", 
        precio: "15 gp", 
        peso: "5 lb.", 
        descripcion: "Papeles especiales, tintas y sellos para falsificar documentos.", 
        habilidad: "Intelligence", 
        utilizar: "Falsificar documento (DC 15)" 
    },
    { 
        nombre: "Herbalism kit", 
        tipo: "Kit", 
        precio: "5 gp", 
        peso: "3 lb.", 
        descripcion: "Para identificar y preparar plantas medicinales y venenos. Necesario para crear antitoxinas y pociones de curación.", 
        habilidad: "Intelligence", 
        utilizar: "Identificar planta (DC 15), preparar antídoto (DC 15)" 
    },
    { 
        nombre: "Poisoner's kit", 
        tipo: "Kit", 
        precio: "50 gp", 
        peso: "2 lb.", 
        descripcion: "Para extraer y aplicar venenos.", 
        habilidad: "Intelligence", 
        utilizar: "Aplicar veneno (DC 15), identificar veneno (DC 15)" 
    },

    // === JUEGOS ===
    { 
        nombre: "Dice set", 
        tipo: "Gaming set", 
        precio: "1 sp", 
        peso: "-", 
        descripcion: "Juego de dados para juegos de azar.", 
        habilidad: "Wisdom", 
        utilizar: "Hacer trampa (DC 15) o jugar limpiamente." 
    },
    { 
        nombre: "Playing card set", 
        tipo: "Gaming set", 
        precio: "5 sp", 
        peso: "-", 
        descripcion: "Baraja para juegos de cartas.", 
        habilidad: "Wisdom", 
        utilizar: "Hacer trampa (DC 15) o jugar limpiamente." 
    },
    { 
        nombre: "Three-Dragon Ante set", 
        tipo: "Gaming set", 
        precio: "1 gp", 
        peso: "-", 
        descripcion: "Juego de cartas popular en tabernas.", 
        habilidad: "Wisdom", 
        utilizar: "Jugar profesionalmente (DC 15)" 
    },

    // === INSTRUMENTOS MUSICALES ===
    { 
        nombre: "Bagpipes", 
        tipo: "Musical instrument", 
        precio: "30 gp", 
        peso: "6 lb.", 
        descripcion: "Instrumento de viento de origen tribal.", 
        habilidad: "Charisma", 
        utilizar: "Interpretar (DC 15)" 
    },
    { 
        nombre: "Drum", 
        tipo: "Musical instrument", 
        precio: "6 gp", 
        peso: "3 lb.", 
        descripcion: "Instrumento de percusión.", 
        habilidad: "Charisma", 
        utilizar: "Interpretar (DC 15)" 
    },
    { 
        nombre: "Dulcimer", 
        tipo: "Musical instrument", 
        precio: "25 gp", 
        peso: "10 lb.", 
        descripcion: "Instrumento de cuerda percutida.", 
        habilidad: "Charisma", 
        utilizar: "Interpretar (DC 15)" 
    },
    { 
        nombre: "Flute", 
        tipo: "Musical instrument", 
        precio: "2 gp", 
        peso: "1 lb.", 
        descripcion: "Instrumento de viento de madera.", 
        habilidad: "Charisma", 
        utilizar: "Interpretar (DC 15)" 
    },
    { 
        nombre: "Horn", 
        tipo: "Musical instrument", 
        precio: "3 gp", 
        peso: "2 lb.", 
        descripcion: "Instrumento de viento-metal.", 
        habilidad: "Charisma", 
        utilizar: "Interpretar (DC 15)" 
    },
    { 
        nombre: "Lute", 
        tipo: "Musical instrument", 
        precio: "35 gp", 
        peso: "2 lb.", 
        descripcion: "Instrumento de cuerda pulsada, favorito de bardos.", 
        habilidad: "Charisma", 
        utilizar: "Interpretar (DC 15)" 
    },
    { 
        nombre: "Lyre", 
        tipo: "Musical instrument", 
        precio: "30 gp", 
        peso: "2 lb.", 
        descripcion: "Instrumento de cuerda similar a una pequeña arpa.", 
        habilidad: "Charisma", 
        utilizar: "Interpretar (DC 15)" 
    },
    { 
        nombre: "Pan flute", 
        tipo: "Musical instrument", 
        precio: "12 gp", 
        peso: "2 lb.", 
        descripcion: "Conjunto de flautas de diferentes longitudes.", 
        habilidad: "Charisma", 
        utilizar: "Interpretar (DC 15)" 
    },
    { 
        nombre: "Shawm", 
        tipo: "Musical instrument", 
        precio: "2 gp", 
        peso: "1 lb.", 
        descripcion: "Instrumento de viento de lengüeta, precursor del oboe.", 
        habilidad: "Charisma", 
        utilizar: "Interpretar (DC 15)" 
    },
    { 
        nombre: "Viol", 
        tipo: "Musical instrument", 
        precio: "30 gp", 
        peso: "1 lb.", 
        descripcion: "Instrumento de cuerda frotada, antecesor del violín.", 
        habilidad: "Charisma", 
        utilizar: "Interpretar (DC 15)" 
    },

    // === OTRAS HERRAMIENTAS ===
    { 
        nombre: "Navigator's tools", 
        tipo: "Tool", 
        precio: "25 gp", 
        peso: "2 lb.", 
        descripcion: "Incluye brújula, mapas y sextante para navegación marítima.", 
        habilidad: "Wisdom", 
        utilizar: "Determinar posición (DC 15), evitar perderse en el mar" 
    },
    { 
        nombre: "Thieves' tools", 
        tipo: "Tool", 
        precio: "25 gp", 
        peso: "1 lb.", 
        descripcion: "Incluye ganzúas, lima, espejo pequeño, tijeras y alicates para abrir cerraduras y desarmar trampas.", 
        habilidad: "Dexterity", 
        utilizar: "Abrir cerradura (DC 15), desarmar trampa (DC 15)" 
    }
];
    
// ============================================
// MODAL DE CONSULTA DE HERRAMIENTAS
// ============================================
const modal = document.getElementById('modal-herramientas');
const btnAbrirModal = document.getElementById('btn-ver-herramientas');
const btnCerrar = document.getElementById('cerrar-modal');
const listaContainer = document.getElementById('lista-herramientas');

function cerrarModal() {
    modal.style.display = 'none';
}

function mostrarDetalle(herramienta) {
    // Si ya hay un detalle visible, lo ocultamos
    const visible = document.querySelector('.herramienta-detalle.visible');
    if (visible) visible.classList.remove('visible');

    // Buscamos el detalle correspondiente a este item
    const detalle = herramienta.querySelector('.herramienta-detalle');
    if (detalle) detalle.classList.add('visible');
}

function construirListaHerramientas() {
    listaContainer.innerHTML = '';
    herramientasDB.sort((a, b) => a.nombre.localeCompare(b.nombre)).forEach(herramienta => {
        const item = document.createElement('div');
        item.className = 'herramienta-item';

        const nombre = document.createElement('strong');
        nombre.textContent = herramienta.nombre;
        item.appendChild(nombre);

        const detalle = document.createElement('div');
        detalle.className = 'herramienta-detalle';
        detalle.innerHTML = `
            <p><strong>Tipo:</strong> ${herramienta.tipo}</p>
            <p><strong>Precio:</strong> ${herramienta.precio}</p>
            <p><strong>Peso:</strong> ${herramienta.peso}</p>
            <p><strong>Habilidad asociada:</strong> ${herramienta.habilidad}</p>
            <p><strong>Utilizar:</strong> ${herramienta.utilizar}</p>
            <p><strong>Descripción:</strong> ${herramienta.descripcion}</p>
        `;

        item.appendChild(detalle);
        item.addEventListener('click', () => mostrarDetalle(item));
        listaContainer.appendChild(item);
    });
}

if (btnAbrirModal) {
    btnAbrirModal.addEventListener('click', () => {
        construirListaHerramientas();
        modal.classList.add('show');
    });
}

if (btnCerrar) {
    function cerrarModal() {
        modal.classList.remove('show');
    }
}

// Cerrar si se hace clic fuera del contenido
window.addEventListener('click', (e) => {
    if (e.target === modal) cerrarModal();
});
    const textoClase = competenciasClase[clase] || 'Competencias de clase no especificadas. Elige libremente.';
    const textoBackground = competenciasBackground[background] || 'Competencias de background no especificadas. Elige libremente.';
    const textoHerramientasClase = herramientasClase[clase] || 'No se especifican herramientas para esta clase.';
const textoHerramientasBg = herramientasBackground[background] || 'No se especifican herramientas para este background.';

    // Mostrar el texto informativo de herramientas
  // Mostrar el texto informativo de herramientas (clase + background)
const textoHerramientasElem = document.getElementById('texto-herramientas');
if (textoHerramientasElem) {
    textoHerramientasElem.innerHTML = `
        <strong>Herramientas de clase:</strong> ${textoHerramientasClase}<br>
        <strong>Herramientas de background (${background}):</strong> ${textoHerramientasBg}
    `;
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
        div.className = 'campo-dinamico'; // Ya debería tener estilos en CSS
    
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-crear input-dinamico herramienta-input'; // Añadimos clase específica
        input.value = valorInicial;
        input.placeholder = 'Ej: thieves\' tools, kit de herboristería...';
    
        const btnEliminar = document.createElement('button');
        btnEliminar.type = 'button';
        btnEliminar.className = 'btn-eliminar-dinamico btn-herramienta-eliminar'; // Clase específica
        btnEliminar.textContent = '✖';
    
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

        // Recoger herramientas (guardamos el texto tal cual)
const herramientasInputs = document.querySelectorAll('#herramientas-container .input-dinamico');
const herramientas = [];
herramientasInputs.forEach(input => {
    const valor = input.value.trim();
    if (valor) {
        herramientas.push(valor); // Se guarda exactamente lo que el usuario escribió
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