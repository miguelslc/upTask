const slug = require('slug');
const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.routesHome = async (req, res) =>{
    //console.log(res.locals.userData.id);
    const usuarioId = res.locals.userData.id;
    const proyectos = await Proyectos.findAll({where: {usuarioId}});
    res.render('index', {
        nombrePagina: 'Proyecto Uptask',
        proyectos
    });
};

exports.routesNewProject = async (req, res) => {
    const proyectos = await Proyectos.findAll();
    res.render('nuevoProyecto',{
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    })
}

exports.routesNewProjectPost = async (req, res) => {
    //Validacion datos en input
    const usuarioId = res.locals.userData.id;
    const proyectos = await Proyectos.findAll({where: {usuarioId}});

    const {nombre} = req.body;

    let errores = [];

    if (!nombre) errores.push({'texto':'Agregar Nombre del Proyecto'})

    //si hay errores
    if (errores.length > 0) {
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores, 
            proyectos
        })
    } else {
        //No hay errores
        //Insertar en la DB
        
        //const url = slug(nombre).toLowerCase();
        //const proyecto = await Proyectos.create({nombre, url});
        const usuarioId = res.locals.userData.id;
        await Proyectos.create({nombre, usuarioId});
        res.redirect('/');
    }
}

exports.proyectoUrl = async (req, res, next) =>{
    const usuarioId = res.locals.userData.id;
    //const proyectos = await Proyectos.findAll({where: {usuarioId}});
    const proyectosPromise = Proyectos.findAll({where: {usuarioId}});

    const proyectoPromise = Proyectos.findOne({
        where: {
            url: req.params.url,
            usuarioId
        }
    });
    //Las consultas a la DB no depende una de la otra por lo tanto podemos usar promises
    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    if (!proyecto) return next();

    const tareas = await Tareas.findAll({where: {proyectoId : proyecto.id}});

    res.render('tareas',{
        nombrePagina: 'Tareas del Proyecto',
        proyectos,
        proyecto, 
        tareas
    })
}

exports.proyectoFormularioEditar = async (req, res) => {
    const usuarioId = res.locals.userData.id;
    //const proyectos = await Proyectos.findAll({where: {usuarioId}});

    const proyectosPromise = Proyectos.findAll({where: {usuarioId}});
    
    const proyectoPromise = Proyectos.findOne({
        where: {
            id: req.params.id, usuarioId
        }
    });
    //Las consultas a la DB no depende una de la otra por lo tanto podemos usar promises
    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    res.render('nuevoProyecto',{
        nombrePagina: 'Editar Proyecto',
        proyectos,
        proyecto
    })
}

exports.routesUpdateProjectPost = async (req, res)=>{
    //Validacion datos en input
    const usuarioId = res.locals.userData.id;
    const proyectos = Proyectos.findAll({where: {usuarioId}});

    const {nombre} = req.body;

    let errores = [];

    if (!nombre) errores.push({'texto':'Agregar Nombre del Proyecto'})

    //si hay errores
    if (errores.length > 0) {
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores, 
            proyectos
        })
    } else {
        //No hay errores
        //Insertar en la DB
        const proyecto = await Proyectos.update(
            { nombre: nombre },
            { where: { id: req.params.id } }
        );
        res.redirect('/');
    }
}

exports.proyectoEliminar = async (req, res, next) => {
    const {urlProyecto} = req.query;
    const resultado = await Proyectos.destroy({where: {url : urlProyecto}})

    if (!resultado) return next();

    res.status(200).send('Proyecto Eliminado Correctamente');
}