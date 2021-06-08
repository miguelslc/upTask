import Swal from 'sweetalert2';

export const actualizarAvance = () => {
    //Seleccionar las tareas existentes
    const tareas = document.querySelectorAll('li.tarea');
    if (tareas.length) {
        //seleccionar las tareas completadas
        const tareasCompletas = document.querySelectorAll('i.completo');
        console.log(tareasCompletas);
        //calcular el avance
        const avance = Math.round((tareasCompletas.length / tareas.length ) * 100);
        console.log(avance);
        //actualizar el avance
        const porcentaje = document.querySelector('#porcentaje');
        porcentaje.style.width = avance+'%'

        if (avance === 100){
            Swal.fire(
                'Proyecto completo!',
                'Felicidades, has terminado el proyecto',
                'success'
            );
        }
    }
}