// app/script.js
// CEFIRO - Completo con auto‑guardado, modificadores y cálculo de PG

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

    window.eliminarPersonaje = function(id) {
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
function inicializarFicha() {
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
    const caInput = document.getElementById('ca');
    const fueInput = document.getElementById('fue');
    const desInput = document.getElementById('des');
    const conInput = document.getElementById('con');
    const intInput = document.getElementById('int');
    const sabInput = document.getElementById('sab');
    const carInput = document.getElementById('car');
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

    // Obtener ID de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const personajeId = urlParams.get('id');
    window.personajeIdActual = personajeId;

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
            trasfondo: trasfondoInput?.value || ''
        };
    }

    function rellenar(personaje) {
        if (nombreInput) nombreInput.value = personaje.nombre || '';
        if (nivelInput) nivelInput.value = personaje.nivel || 1;
        if (claseInput) claseInput.value = personaje.clase || '';
        if (subclaseInput) subclaseInput.value = personaje.subclase || '';
        if (razaInput) razaInput.value = personaje.raza || '';
        if (alineamientoInput) alineamientoInput.value = personaje.alineamiento || 'N';
        if (pgMaxInput) pgMaxInput.value = personaje.pg_max || 10;
        if (pgActualesInput) pgActualesInput.value = personaje.pg_actuales || 10;
        if (caInput) caInput.value = personaje.ca || 10;

        if (fueInput) fueInput.value = personaje.stats?.fue || 10;
        if (desInput) desInput.value = personaje.stats?.des || 10;
        if (conInput) conInput.value = personaje.stats?.con || 10;
        if (intInput) intInput.value = personaje.stats?.int || 10;
        if (sabInput) sabInput.value = personaje.stats?.sab || 10;
        if (carInput) carInput.value = personaje.stats?.car || 10;

        if (notasInput) notasInput.value = personaje.notas || '';
        if (rasgosInput) rasgosInput.value = personaje.rasgos || '';
        if (objetosInput) objetosInput.value = personaje.objetos || '';
        if (ataquesInput) ataquesInput.value = personaje.ataques || '';
        if (magiaInput) magiaInput.value = personaje.magia || '';
        if (trasfondoInput) trasfondoInput.value = personaje.trasfondo || '';

        actualizarModificadores();
        calcularPuntosGolpe(); // no necesita await aquí si no se requiere esperar
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

    // ============================================
    // CARGAR PERSONAJE SI HAY ID
    // ============================================
    if (personajeId) {
        const data = localStorage.getItem(`cefiro_${personajeId}`);
        if (data) {
            try {
                const personajeData = JSON.parse(data);
                rellenar(personajeData);
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
        claseInput.addEventListener('input', async () => {
            await calcularPuntosGolpe();
            autoGuardar();
        });
    }
    if (nivelInput) {
        nivelInput.addEventListener('input', async () => {
            await calcularPuntosGolpe();
            autoGuardar();
        });
    }

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