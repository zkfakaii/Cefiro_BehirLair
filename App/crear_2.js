// app/crear_2.js
// Lógica para la pantalla de trasfondo (paso 2)

document.addEventListener('DOMContentLoaded', () => {
    console.log('🆕 Pantalla de trasfondo');

    // Cargar datos del paso 1 desde localStorage
    const datosPaso1 = JSON.parse(localStorage.getItem('cefiro_paso1') || '{}');
    console.log('Datos del paso 1:', datosPaso1);

    // Referencias a los contenedores dinámicos
    const idealesContainer = document.getElementById('ideales-container');
    const vinculosContainer = document.getElementById('vinculos-container');
    const defectosContainer = document.getElementById('defectos-container');

    // Función para crear un nuevo campo de texto con botón eliminar
    function crearCampoDinamico(valorInicial = '') {
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

    // Botones para añadir nuevos campos
    document.getElementById('agregar-ideal').addEventListener('click', () => {
        idealesContainer.appendChild(crearCampoDinamico());
    });

    document.getElementById('agregar-vinculo').addEventListener('click', () => {
        vinculosContainer.appendChild(crearCampoDinamico());
    });

    document.getElementById('agregar-defecto').addEventListener('click', () => {
        defectosContainer.appendChild(crearCampoDinamico());
    });

    // Botón "Siguiente" (guarda y va a página 3)
    document.getElementById('btn-siguiente').addEventListener('click', () => {
        // Recoger todos los valores
        const alineamiento = document.getElementById('alineamiento').value;
        const rasgos = document.getElementById('rasgos').value;

        const ideales = [];
        document.querySelectorAll('#ideales-container .input-dinamico').forEach(input => {
            if (input.value.trim()) ideales.push(input.value.trim());
        });

        const vinculos = [];
        document.querySelectorAll('#vinculos-container .input-dinamico').forEach(input => {
            if (input.value.trim()) vinculos.push(input.value.trim());
        });

        const defectos = [];
        document.querySelectorAll('#defectos-container .input-dinamico').forEach(input => {
            if (input.value.trim()) defectos.push(input.value.trim());
        });

        const historia = document.getElementById('historia').value;

        // Combinar con datos del paso 1
        const datosPaso2 = {
            ...datosPaso1,
            alineamiento,
            rasgos,
            ideales,
            vinculos,
            defectos,
            historia
        };

        // Guardar en localStorage
        localStorage.setItem('cefiro_paso2', JSON.stringify(datosPaso2));

        // Redirigir a la página 3
        window.location.href = 'crear_3.html';
    });
});