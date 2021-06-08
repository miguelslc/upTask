const Sequelize = require('sequelize');
const slug = require('slug');
const db = require('../config/db');
const shortid = require('shortid');

const Proyectos = db.define('proyectos',{
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: Sequelize.STRING(100),
    url: Sequelize.STRING(100),
    //Al solo tener una linea en los campos, no hace falta poner el type,
    //ni encerrarlo entre llaves
},{
    hooks: {
        beforeCreate(proyecto) {
            const url = slug(proyecto.nombre).toLowerCase();
            proyecto.url = `${url}-${shortid.generate()}`;
        }
    }
});

module.exports = Proyectos;