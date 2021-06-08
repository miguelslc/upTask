const express = require('express');
const router = express.Router();

//Sanitizamos data proveniente del front
//Es mejor realizarlo en el router

const {body} = require('express-validator');

const projectsController = require ('../controllers/projectsController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

module.exports = function(){
    //Ruta para el home
    router.get('/', 
        authController.userAutenticated,
        projectsController.routesHome
    );
    router.get('/nuevo_proyecto', 
        authController.userAutenticated,
        projectsController.routesNewProject
    )
    router.post('/nuevo_proyecto', 
        authController.userAutenticated,
        body('nombre').not().isEmpty().trim().escape(),
        projectsController.routesNewProjectPost
    );
    //Listar Proyectos
    router.get('/proyectos/:url', 
        authController.userAutenticated,
        projectsController.proyectoUrl
    );
    //Editar Proyecto
    router.get('/proyecto/editar/:id', 
        authController.userAutenticated,
        projectsController.proyectoFormularioEditar
    );
    //Nuevo Proyecto
    router.post('/nuevo_proyecto/:id', 
                authController.userAutenticated,
                body('nombre').not().isEmpty().trim().escape(),
                projectsController.routesUpdateProjectPost
    );
    //Eliminar Proyecto
    router.delete('/proyectos/:url', 
        authController.userAutenticated,
        projectsController.proyectoEliminar
    );
    //Tareas
    //Listar Proyectos
    router.post('/proyectos/:url', 
        authController.userAutenticated,
        tareasController.tareasNewTarea
    );
    //Actualizar el estado de una tarea
    router.patch('/tareas/:id', 
        authController.userAutenticated,
        tareasController.tareasUpdateEstadoTarea
    );
    //Eliminar una tarea
    router.delete('/tareas/:id', 
        authController.userAutenticated,
        tareasController.tareasDeleteEstadoTarea
    );
    //Crear Nueva Cuenta
    router.get('/register', usuariosController.usuariosRegistrarUsuarios);
    //Crear Nueva Cuenta
    router.post('/register', usuariosController.usuariosRegistrarNuevoUsuario);
        //Confirmar cuenta
        router.get('/confirmar/:correo', usuariosController.usuariosConfirmarCuentaUsuario)
    //Login
    router.get('/login', usuariosController.usuariosLoginUsuarios);
    //Login
    router.post('/login', authController.authUser);
    //logout
    router.get('/logout', authController.cerrarSesion);
    //restablecer password
    router.get('/restablecer', usuariosController.usuariosRestablecerUsuarioPassword);
    //restablecer password
    router.post('/restablecer', authController.enviarToken);
    //restablecer password
    router.get('/restablecer/:token', authController.validarToken);
    router.post('/restablecer/:token', authController.resetPassword);

    return router;
}



