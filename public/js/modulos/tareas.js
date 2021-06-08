import Swal from 'sweetalert2';
import axios from 'axios';
import {actualizarAvance} from '../funciones/avance';

const tareas = document.querySelector('.listado-pendientes');

if (tareas) {
    tareas.addEventListener('click', e => {
        if (e.target.classList.contains('fa-check-circle')){
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;
            const url = `${location.origin}/tareas/${idTarea}`;
            axios.patch(url,{idTarea})
                .then(response => {
                    if (response.status == 200) {
                        icono.classList.toggle('completo');
                        actualizarAvance();
                    }
                })
                .catch(()=>{
                    Swal.fire({
                        type: 'error',
                        title: 'Ocurrio un error',
                        text: 'No se pudo actualizar el estado'
                    });
                })
        }
        if (e.target.classList.contains('fa-trash')){
            const tareaHTML = e.target.parentElement.parentElement;
            const idTarea = tareaHTML.dataset.tarea;
            Swal.fire({
                title: 'Deseas eliminar esta Tarea',
                text: "Una tarea eliminada no se puede recuperar",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, Borrar!',
                cancelButtonText: 'No, Cancelar!'
            }).then((result) => {
                if (result.value) {
                    const url = `${location.origin}/tareas/${idTarea}`;
                    axios.delete(url,{params: {idTarea}})
                    .then(response => {
                        console.log(response.status);
                        if (response.status == 200){
                            tareaHTML.parentElement.removeChild(tareaHTML);
                            Swal.fire(
                                'Tarea Eliminada!',
                                response.data,
                                'success'
                            );
                            actualizarAvance();
                        }
                    })
                    .catch(()=>{
                        Swal.fire({
                            type: 'error',
                            title: 'Ocurrio un error',
                            text: 'No se pudo eliminar la tarea'
                        });
                    })
                }
            })
        }
    });
}

export default tareas;