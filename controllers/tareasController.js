const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.tareasNewTarea = async (req, res, next) => {
    //primero obtenemos el proyecto Actual
    const proyecto = await Proyectos.findOne({where: {url : req.params.url}})

    //leer el valor del input
    const {tarea} = req.body;
    //0 -> incompleta; 1 -> completa
    const estado = 0;
    //id del proyecto
    const proyectoId = proyecto.id;

    //Insert a la DB de Tareas
    const resultado = await Tareas.create({tarea, estado, proyectoId});

    //En caso de error, salteo la ejecucion
    if (!resultado) return next();
    
    //Redireccionamiento
    res.redirect(`/proyectos/${req.params.url}`);
}

exports.tareasUpdateEstadoTarea = async (req, res, next) => {
    //cuando se manda patch no se usa req.query , sino req.params
    const {id} = req.params;
    //Como en el where el id == a id, en relacion a los nombres de las variables se puede usar un solo id
    //const tarea = await Tareas.findOne({where: {id : id}})
    const tarea = await Tareas.findOne({where: {id}})
    //Si la tarea fue clickeada por el usuario quiere decir que la quiere completar
    let estado = 0;
    if (tarea.estado == estado) estado = 1;
    tarea.estado = estado;
    
    const resultado = await tarea.save();

    if (!resultado) return next();
    
    res.status(200).send('Actualizado')
}

exports.tareasDeleteEstadoTarea = async(req, res, next) => {
    const {idTarea} = req.query;
    const resultado = await Tareas.destroy({where: {id : idTarea}})

    if (!resultado) return next();

    res.status(200).send('Tarea Eliminada Correctamente');
}