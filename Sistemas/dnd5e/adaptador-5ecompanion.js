// sistemas/dnd5e/adaptador-5ecompanion.js

function convertirDesde5eCompanion(contenidoCha) {
    try {
        const datos = JSON.parse(contenidoCha);
        console.log('✅ Archivo .cha parseado');
        
        // Nivel
        let nivel = 1;
        if (datos.jobs && datos.jobs.length > 0) {
            nivel = datos.jobs[0].level || 1;
        }
        
        // Clase
        let clase = 'Aventurero';
        if (datos.jobs && datos.jobs.length > 0) {
            const jobId = datos.jobs[0].jobId || '';
            if (jobId === 'sorcerer') clase = 'Hechicero';
            else if (jobId === 'wizard') clase = 'Mago';
            else if (jobId === 'fighter') clase = 'Guerrero';
            else if (jobId === 'rogue') clase = 'Pícaro';
            else clase = jobId;
        }
        
        // Alineamiento
        const alineamientoMap = {
            'LAWFUL_GOOD': 'LB', 'NEUTRAL_GOOD': 'NB', 'CHAOTIC_GOOD': 'CB',
            'LAWFUL_NEUTRAL': 'LN', 'NEUTRAL': 'N', 'CHAOTIC_NEUTRAL': 'CN',
            'LAWFUL_EVIL': 'LM', 'NEUTRAL_EVIL': 'NM', 'CHAOTIC_EVIL': 'CM'
        };
        const alineamiento = alineamientoMap[datos.alignmentName] || 'N';
        
        // Stats
        const stats = {
            fue: parseInt(datos.strength) || 10,
            des: parseInt(datos.dexterity) || 10,
            con: parseInt(datos.constitution) || 10,
            int: parseInt(datos.intelligence) || 10,
            sab: parseInt(datos.wisdom) || 10,
            car: parseInt(datos.charisma) || 10
        };
        
        // HP
        let pg_max = parseInt(datos.baseHp || datos.hp || 10);
        let pg_actuales = parseInt(datos.hp || pg_max);
        
        return {
            nombre: datos.name || 'Sin nombre',
            nivel: nivel,
            clase: clase,
            trasfondo: datos.background?.backgroundId || '',
            alineamiento: alineamiento,
            pg_max: pg_max,
            pg_actuales: pg_actuales,
            stats: stats
        };
        
    } catch (error) {
        console.error('❌ Error:', error);
        throw new Error('No se pudo leer el archivo');
    }
}