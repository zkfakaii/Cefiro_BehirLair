// app/script.js
// CEFIRO - Completo con auto‑guardado, modificadores, cálculo de PG, herramientas y salvaciones por clase

document.addEventListener('DOMContentLoaded', () => {
    const esInicio = window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/');
    const esFicha = window.location.pathname.includes('ficha.html');

    if (esInicio) inicializarInicio();
    if (esFicha) inicializarFicha();
});

// ============================================
// PANTALLA DE INICIO
// ============================================
function inicializarInicio() {
    console.log('🦎 Inicio');

    const btnEntrar = document.getElementById('btnEntrar');
    const panelFichas = document.getElementById('panelFichas');
    const btnNuevo = document.getElementById('btnNuevo');
    const btnImportar = document.getElementById('btnImportar');
    const listaPersonajes = document.getElementById('listaPersonajes');

    if (!btnEntrar || !panelFichas) return;

    btnEntrar.addEventListener('click', () => {
        panelFichas.classList.toggle('oculto');
        if (!panelFichas.classList.contains('oculto')) cargarLista();
    });

    if (btnNuevo) {
        btnNuevo.addEventListener('click', () => window.location.href = 'crear.html');
    }

    if (btnImportar) {
        btnImportar.addEventListener('click', importarPersonaje);
    }

    function cargarLista() {
        const personajes = obtenerPersonajes();
        if (!listaPersonajes) return;

        if (personajes.length === 0) {
            listaPersonajes.innerHTML = '<p class="vacio">No hay personajes</p>';
            return;
        }

        let html = '';
        personajes.forEach(p => {
            html += `
                <div class="item-personaje" data-id="${p.id}">
                    <span>${p.nombre} (Nv.${p.nivel} - ${p.clase})</span>
                    <button class="btn-eliminar" onclick="event.stopPropagation(); eliminarPersonaje('${p.id}')">🗑️</button>
                </div>
            `;
        });
        listaPersonajes.innerHTML = html;

        document.querySelectorAll('.item-personaje').forEach(item => {
            item.addEventListener('click', () => {
                window.location.href = `ficha.html?id=${item.dataset.id}`;
            });
        });
    }

    function obtenerPersonajes() {
        return JSON.parse(localStorage.getItem('cefiro_personajes') || '[]');
    }

    function importarPersonaje() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,.cha';

        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    let datos;
                    if (file.name.endsWith('.cha')) {
                        datos = convertirDesde5eCompanion(e.target.result);
                    } else {
                        datos = JSON.parse(e.target.result);
                    }

                    const personaje = new Personaje(datos);
                    guardarPersonaje(personaje);
                    window.location.href = `ficha.html?id=${personaje.id}`;
                } catch (error) {
                    alert('❌ Error al importar');
                    console.error(error);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    window.eliminarPersonaje = function (id) {
        if (!confirm('¿Eliminar este personaje?')) return;

        let personajes = obtenerPersonajes();
        personajes = personajes.filter(p => p.id !== id);
        localStorage.setItem('cefiro_personajes', JSON.stringify(personajes));
        localStorage.removeItem(`cefiro_${id}`);
        cargarLista();
    };
}

// ============================================
// PANTALLA DE FICHA
// ============================================
async function inicializarFicha() {
    console.log('📜 Inicializando ficha de personaje');

    // Referencias a elementos del formulario
    const nombreInput = document.getElementById('nombre');
    const nivelInput = document.getElementById('nivel');
    const claseInput = document.getElementById('clase');
    const subclaseInput = document.getElementById('subclase');
    const razaInput = document.getElementById('raza');
    const alineamientoInput = document.getElementById('alineamiento');
    const pgMaxInput = document.getElementById('pg_max');
    const pgActualesInput = document.getElementById('pg_actuales');
    const pgTempInput = document.getElementById('pg_temp');
    const btnLimpiarTemp = document.getElementById('btnLimpiarTemp');
    const caInput = document.getElementById('ca');
    const fueInput = document.getElementById('fue');
    const desInput = document.getElementById('des');
    const conInput = document.getElementById('con');
    const intInput = document.getElementById('int');
    const sabInput = document.getElementById('sab');
    const carInput = document.getElementById('car');
    // Salvaciones y competencia
    const profBonusSpan = document.getElementById('prof-bonus');
    const saveFue = document.getElementById('save-fue');
    const saveDes = document.getElementById('save-des');
    const saveCon = document.getElementById('save-con');
    const saveInt = document.getElementById('save-int');
    const saveSab = document.getElementById('save-sab');
    const saveCar = document.getElementById('save-car');
    const profSaveFue = document.getElementById('prof-save-fue');
    const profSaveDes = document.getElementById('prof-save-des');
    const profSaveCon = document.getElementById('prof-save-con');
    const profSaveInt = document.getElementById('prof-save-int');
    const profSaveSab = document.getElementById('prof-save-sab');
    const profSaveCar = document.getElementById('prof-save-car');
    // Textareas
    const notasInput = document.getElementById('notas');
    const rasgosInput = document.getElementById('rasgos');
    const objetosInput = document.getElementById('objetos');
    const ataquesInput = document.getElementById('ataques');
    const magiaInput = document.getElementById('magia');
    const trasfondoInput = document.getElementById('trasfondo');
    const mensajeDiv = document.getElementById('mensaje');

    // Modificadores
    const modFue = document.getElementById('mod-fue');
    const modDes = document.getElementById('mod-des');
    const modCon = document.getElementById('mod-con');
    const modInt = document.getElementById('mod-int');
    const modSab = document.getElementById('mod-sab');
    const modCar = document.getElementById('mod-car');

    // Botones
    const guardarBtn = document.getElementById('guardarBtn');
    const exportarBtn = document.getElementById('exportarBtn');
    const importarBtn = document.getElementById('importarBtn');

    // Herramientas (dinámicas)
    const herramientasContainer = document.getElementById('herramientas-container');
    const agregarHerramientaBtn = document.getElementById('agregar-herramienta');

    // Obtener ID de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const personajeId = urlParams.get('id');
    window.personajeIdActual = personajeId;
    let pgTemp = 0;

    // ============================================
    // FUNCIONES
    // ============================================
    function mostrarMensaje(texto, tipo = 'exito') {
        if (!mensajeDiv) return;
        mensajeDiv.textContent = texto;
        mensajeDiv.className = `mensaje ${tipo}`;
        setTimeout(() => {
            mensajeDiv.textContent = '';
            mensajeDiv.className = 'mensaje';
        }, 3000);
    }

    function calcularModificador(valor) {
        return Math.floor((valor - 10) / 2);
    }

    function calcularBonoCompetencia(nivel) {
        return Math.floor((nivel - 1) / 4) + 2;
    }

    function actualizarSalvaciones() {
        const stats = {
            fue: parseInt(fueInput?.value) || 10,
            des: parseInt(desInput?.value) || 10,
            con: parseInt(conInput?.value) || 10,
            int: parseInt(intInput?.value) || 10,
            sab: parseInt(sabInput?.value) || 10,
            car: parseInt(carInput?.value) || 10
        };
        const nivel = parseInt(nivelInput?.value) || 1;
        const bonoComp = calcularBonoCompetencia(nivel);

        const saves = ['fue', 'des', 'con', 'int', 'sab', 'car'];
        saves.forEach(stat => {
            const mod = calcularModificador(stats[stat]);
            const isProficient = document.getElementById(`prof-save-${stat}`)?.checked || false;
            const total = mod + (isProficient ? bonoComp : 0);
            const saveSpan = document.getElementById(`save-${stat}`);
            if (saveSpan) saveSpan.textContent = (total >= 0 ? '+' : '') + total;
        });
    }

    function actualizarProfBonus() {
        const nivel = parseInt(nivelInput?.value) || 1;
        const bono = calcularBonoCompetencia(nivel);
        if (profBonusSpan) profBonusSpan.textContent = (bono >= 0 ? '+' : '') + bono;
    }

    function actualizarHabilidades(stats) {
        const skillsList = document.getElementById('skills-list');
        if (!skillsList) return;

        const habilidades = [
            'Acrobacias', 'Arcanos', 'Atletismo', 'Engaño', 'Historia',
            'Interpretación', 'Intimidación', 'Investigación', 'Juego de manos',
            'Medicina', 'Naturaleza', 'Percepción', 'Perspicacia', 'Persuasión',
            'Religión', 'Sigilo', 'Supervivencia', 'Trato con animales'
        ];

        const mapaHabilidad = {
            'Acrobacias': 'des', 'Arcanos': 'int', 'Atletismo': 'fue',
            'Engaño': 'car', 'Historia': 'int', 'Interpretación': 'car',
            'Intimidación': 'car', 'Investigación': 'int', 'Juego de manos': 'des',
            'Medicina': 'sab', 'Naturaleza': 'int', 'Percepción': 'sab',
            'Perspicacia': 'sab', 'Persuasión': 'car', 'Religión': 'int',
            'Sigilo': 'des', 'Supervivencia': 'sab', 'Trato con animales': 'sab'
        };

        let html = '';
        habilidades.forEach(habilidad => {
            const stat = mapaHabilidad[habilidad];
            const valorStat = stats[stat] || 10;
            const mod = calcularModificador(valorStat);
            html += `<div class="skill-item"><span class="skill-name">${habilidad}</span> <span class="skill-mod">${mod >= 0 ? '+' : ''}${mod}</span></div>`;
        });
        skillsList.innerHTML = html;
    }

    function actualizarModificadores() {
        const stats = {
            fue: parseInt(fueInput?.value) || 10,
            des: parseInt(desInput?.value) || 10,
            con: parseInt(conInput?.value) || 10,
            int: parseInt(intInput?.value) || 10,
            sab: parseInt(sabInput?.value) || 10,
            car: parseInt(carInput?.value) || 10
        };

        if (modFue) modFue.textContent = `( ${calcularModificador(stats.fue) >= 0 ? '+' : ''}${calcularModificador(stats.fue)} )`;
        if (modDes) modDes.textContent = `( ${calcularModificador(stats.des) >= 0 ? '+' : ''}${calcularModificador(stats.des)} )`;
        if (modCon) modCon.textContent = `( ${calcularModificador(stats.con) >= 0 ? '+' : ''}${calcularModificador(stats.con)} )`;
        if (modInt) modInt.textContent = `( ${calcularModificador(stats.int) >= 0 ? '+' : ''}${calcularModificador(stats.int)} )`;
        if (modSab) modSab.textContent = `( ${calcularModificador(stats.sab) >= 0 ? '+' : ''}${calcularModificador(stats.sab)} )`;
        if (modCar) modCar.textContent = `( ${calcularModificador(stats.car) >= 0 ? '+' : ''}${calcularModificador(stats.car)} )`;

        actualizarHabilidades(stats);
        actualizarSalvaciones();
        actualizarProfBonus();
    }

    async function calcularPuntosGolpe() {
        const clase = claseInput?.value;
        const nivel = parseInt(nivelInput?.value) || 1;
        const conStat = parseInt(conInput?.value) || 10;
        const conMod = calcularModificador(conStat);

        if (!clase) return;

        let hitDice = '1d8';
        if (window.dndData?.obtenerHitDiceDeClase) {
            hitDice = await window.dndData.obtenerHitDiceDeClase(clase);
        }

        const match = hitDice.match(/d(\d+)/);
        const dado = match ? parseInt(match[1]) : 8;

        const pgPrimerNivel = dado + conMod;
        const pgNivelesSiguientes = (Math.floor(dado / 2) + 1 + conMod) * (nivel - 1);
        const pgMax = pgPrimerNivel + pgNivelesSiguientes;

        if (pgMaxInput) {
            pgMaxInput.value = pgMax;
            if (parseInt(pgActualesInput?.value) > pgMax) {
                pgActualesInput.value = pgMax;
            }
        }
    }

    function obtenerDatos() {
        // Recoger herramientas
        const herramientasInputs = document.querySelectorAll('#herramientas-container .input-dinamico');
        const herramientas = [];
        herramientasInputs.forEach(input => {
            const valor = input.value.trim();
            if (valor) herramientas.push(valor);
        });

        return {
            id: window.personajeIdActual,
            nombre: nombreInput?.value || 'Nuevo',
            nivel: parseInt(nivelInput?.value) || 1,
            clase: claseInput?.value || 'Aventurero',
            subclase: subclaseInput?.value || '',
            raza: razaInput?.value || '',
            alineamiento: alineamientoInput?.value || 'N',
            pg_max: parseInt(pgMaxInput?.value) || 10,
            pg_actuales: parseInt(pgActualesInput?.value) || 10,
            pg_temp: parseInt(pgTempInput?.value) || 0,
            ca: parseInt(caInput?.value) || 10,
            stats: {
                fue: parseInt(fueInput?.value) || 10,
                des: parseInt(desInput?.value) || 10,
                con: parseInt(conInput?.value) || 10,
                int: parseInt(intInput?.value) || 10,
                sab: parseInt(sabInput?.value) || 10,
                car: parseInt(carInput?.value) || 10
            },
            notas: notasInput?.value || '',
            rasgos: rasgosInput?.value || '',
            objetos: objetosInput?.value || '',
            ataques: ataquesInput?.value || '',
            magia: magiaInput?.value || '',
            trasfondo: trasfondoInput?.value || '',
            herramientas: herramientas,
            proficienciasSalvacion: {
                fue: profSaveFue?.checked || false,
                des: profSaveDes?.checked || false,
                con: profSaveCon?.checked || false,
                int: profSaveInt?.checked || false,
                sab: profSaveSab?.checked || false,
                car: profSaveCar?.checked || false
            }
        };
    }

    async function rellenar(personaje) {
        // Datos básicos
        if (nombreInput) nombreInput.value = personaje.nombre || '';
        if (nivelInput) nivelInput.value = personaje.nivel || 1;
        if (claseInput) claseInput.value = personaje.clase || '';
        if (subclaseInput) subclaseInput.value = personaje.subclase || '';
        if (razaInput) razaInput.value = personaje.raza || '';
        if (alineamientoInput) alineamientoInput.value = personaje.alineamiento || 'N';
        if (pgMaxInput) {
            const max = personaje.pg_max ?? 10;
            pgMaxInput.value = max;
        }
        if (pgActualesInput) {
            let actual = personaje.pg_actuales;
            const max = personaje.pg_max ?? 10;
            if (actual === undefined || actual === null || actual <= 0 || actual > max) {
                actual = max;
            }
            pgActualesInput.value = actual;
        }

        // Cargar PG temporales guardados (o 0 si no existe)
        pgTemp = personaje.pg_temp || 0;
        if (pgTempInput) pgTempInput.value = pgTemp;
        if (caInput) caInput.value = personaje.ca || 10;

        // Stats
        if (fueInput) fueInput.value = personaje.stats?.fue || 10;
        if (desInput) desInput.value = personaje.stats?.des || 10;
        if (conInput) conInput.value = personaje.stats?.con || 10;
        if (intInput) intInput.value = personaje.stats?.int || 10;
        if (sabInput) sabInput.value = personaje.stats?.sab || 10;
        if (carInput) carInput.value = personaje.stats?.car || 10;

        // Textareas
        if (notasInput) notasInput.value = personaje.notas || '';
        if (rasgosInput) rasgosInput.value = personaje.rasgos || '';
        if (objetosInput) objetosInput.value = personaje.objetos || '';
        if (ataquesInput) ataquesInput.value = personaje.ataques || '';
        if (magiaInput) magiaInput.value = personaje.magia || '';
        if (trasfondoInput) trasfondoInput.value = personaje.trasfondo || '';

        // Competencias de salvación
        if (personaje.proficienciasSalvacion) {
            if (profSaveFue) profSaveFue.checked = personaje.proficienciasSalvacion.fue || false;
            if (profSaveDes) profSaveDes.checked = personaje.proficienciasSalvacion.des || false;
            if (profSaveCon) profSaveCon.checked = personaje.proficienciasSalvacion.con || false;
            if (profSaveInt) profSaveInt.checked = personaje.proficienciasSalvacion.int || false;
            if (profSaveSab) profSaveSab.checked = personaje.proficienciasSalvacion.sab || false;
            if (profSaveCar) profSaveCar.checked = personaje.proficienciasSalvacion.car || false;
        }

        // Herramientas
        if (herramientasContainer) {
            herramientasContainer.innerHTML = '';
            if (personaje.herramientas && personaje.herramientas.length) {
                personaje.herramientas.forEach(herramienta => {
                    herramientasContainer.appendChild(crearCampoHerramienta(herramienta));
                });
            }
        }

        await actualizarSalvacionesPorClase();
        actualizarModificadores();
        calcularPuntosGolpe();
    }

    function autoGuardar() {
        const datos = obtenerDatos();
        if (typeof Personaje === 'function') {
            const personaje = new Personaje(datos);
            if (window.personajeIdActual) personaje.id = window.personajeIdActual;
            if (typeof guardarPersonaje === 'function') {
                guardarPersonaje(personaje);
            } else {
                guardarEnLocalStorage(personaje);
            }
        } else {
            guardarEnLocalStorage(datos);
        }
        mostrarMensaje('✓ Auto-guardado');
    }

    function guardarEnLocalStorage(personaje) {
        if (!personaje.id) {
            personaje.id = 'pj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }
        localStorage.setItem(`cefiro_${personaje.id}`, JSON.stringify(personaje));

        let personajes = JSON.parse(localStorage.getItem('cefiro_personajes') || '[]');
        const index = personajes.findIndex(p => p.id === personaje.id);
        const resumen = {
            id: personaje.id,
            nombre: personaje.nombre,
            nivel: personaje.nivel,
            clase: personaje.clase
        };
        if (index >= 0) personajes[index] = resumen;
        else personajes.push(resumen);
        localStorage.setItem('cefiro_personajes', JSON.stringify(personajes));
    }

    // Normaliza un nombre de salvación de la API a tu formato interno ('fue', 'des', ...)
    function normalizarSalvacion(nombre) {
        if (!nombre) return '';
        const n = nombre.toLowerCase().trim();

        // Mapeo de posibles nombres de la API v1 a tus claves internas ('fue', 'des', ...)
        if (n.includes('str') || n.includes('fuerza') || n.includes('strength')) return 'fue';
        if (n.includes('dex') || n.includes('destreza') || n.includes('dexterity')) return 'des';
        if (n.includes('con') || n.includes('constitucion') || n.includes('constitución') || n.includes('constitution')) return 'con';
        if (n.includes('int') || n.includes('inteligencia') || n.includes('intelligence')) return 'int';
        if (n.includes('wis') || n.includes('sabiduria') || n.includes('sabiduría') || n.includes('wisdom')) return 'sab';
        if (n.includes('cha') || n.includes('carisma') || n.includes('charisma')) return 'car';

        // Si no coincide, devolvemos el nombre original (por si acaso)
        return n;
    }

    async function actualizarSalvacionesPorClase() {
        const clase = claseInput?.value;
        if (!clase) return;

        try {
            const salvaciones = await window.dndData.obtenerSalvacionesPorClase(clase);
            // Normaliza todas las salvaciones de la API a tu formato
            const salvNorm = salvaciones.map(normalizarSalvacion);
            const saves = ['fue', 'des', 'con', 'int', 'sab', 'car'];
            saves.forEach(save => {
                const chk = document.getElementById(`prof-save-${save}`);
                if (chk) {
                    const esCompetente = salvNorm.includes(save);
                    chk.checked = esCompetente;
                }
            });
            actualizarSalvaciones();
            autoGuardar();
        } catch (error) {
            console.error('Error actualizando salvaciones por clase:', error);
        }
    }

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

    // Inicializar herramientas (botón de añadir)
    if (agregarHerramientaBtn && herramientasContainer) {
        agregarHerramientaBtn.addEventListener('click', () => {
            herramientasContainer.appendChild(crearCampoHerramienta());
        });
    }

    // ============================================
    // EVENTOS PARA PG TEMPORALES
    // ============================================
    if (pgTempInput) {
        pgTempInput.addEventListener('input', () => {
            pgTemp = parseInt(pgTempInput.value) || 0;
            autoGuardar(); // Guardar automáticamente al cambiar el valor
        });
    }

    if (btnLimpiarTemp) {
        btnLimpiarTemp.addEventListener('click', () => {
            if (pgTempInput) {
                pgTempInput.value = 0;
                pgTemp = 0;
                autoGuardar(); // Guardar después de limpiar
            }
        });
    }

    // ============================================
    // CARGAR PERSONAJE SI HAY ID
    // ============================================
    if (personajeId) {
        const data = localStorage.getItem(`cefiro_${personajeId}`);
        if (data) {
            try {
                const personajeData = JSON.parse(data);
                await rellenar(personajeData);
                console.log('✅ Personaje cargado:', personajeData.nombre);
            } catch (e) {
                console.error('❌ Error al cargar personaje:', e);
            }
        }
    }

    // ============================================
    // EVENTOS DE CAMBIO (auto‑guardado + modificadores)
    // ============================================
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            autoGuardar();
            if (['fue', 'des', 'con', 'int', 'sab', 'car'].includes(input.id)) {
                actualizarModificadores();
            }
        });
        input.addEventListener('change', autoGuardar);
    });

    // Listeners específicos para clase y nivel (cálculo de PG)
    if (claseInput) {
        claseInput.addEventListener('change', async () => {
            await calcularPuntosGolpe();
            await actualizarSalvacionesPorClase();
            autoGuardar();
        });
    }
    if (nivelInput) {
        nivelInput.addEventListener('change', async () => {
            await calcularPuntosGolpe();
            autoGuardar();
        });
    }

    // Listeners para checkboxes de competencias de salvación
    const saveCheckboxes = [profSaveFue, profSaveDes, profSaveCon, profSaveInt, profSaveSab, profSaveCar];
    saveCheckboxes.forEach(chk => {
        if (chk) {
            chk.addEventListener('change', () => {
                actualizarSalvaciones();
                autoGuardar();
            });
        }
    });

    // ============================================
    // BOTONES
    // ============================================
    if (guardarBtn) {
        guardarBtn.addEventListener('click', () => {
            autoGuardar();
            mostrarMensaje('✅ Guardado manual');
        });
    }

    if (exportarBtn) {
        exportarBtn.addEventListener('click', () => {
            const datos = obtenerDatos();
            const json = JSON.stringify(datos, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${datos.nombre.replace(/\s+/g, '_')}.json`;
            a.click();
        });
    }

    if (importarBtn) {
        importarBtn.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json,.cha';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        let datos;
                        if (file.name.endsWith('.cha')) {
                            datos = convertirDesde5eCompanion(e.target.result);
                        } else {
                            datos = JSON.parse(e.target.result);
                        }
                        const personaje = new Personaje(datos);
                        if (window.personajeIdActual) personaje.id = window.personajeIdActual;
                        rellenar(personaje);
                        autoGuardar();
                        mostrarMensaje('✅ Importado');
                    } catch (error) {
                        alert('❌ Error al importar');
                        console.error(error);
                    }
                };
                reader.readAsText(file);
            };
            input.click();
        });
    }

    console.log('✅ Ficha inicializada');
}