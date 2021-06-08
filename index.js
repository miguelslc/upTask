const express = require ('express');
const routes = require('./routes/index');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

//importamos las variables de entorno
require('dotenv').config({path: 'variables.env'});

//helpers con algunas funciones 
const helpers = require('./utils/helpers');

const db = require('./config/db');
//importamos el modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');
//Sequelize está basado en promises
db.sync()
    .then(()=> console.log('conexion a la DB exitosa'))
    .catch(error => console.log(error))

//crear una app de express
const app = express();
//Habilitar view engine - pug
app.set('view engine', 'pug');

//añadimos las vistas
app.set('views', path.join(__dirname, './views'));
//app.use(expressValidator());

//donde cargar los archivos estaticos
app.use(express.static('public'));

//Agregar flash messages
app.use(flash());

app.use(cookieParser());

//sessiones nos permite navegar entre distintas paginas
//sin volver a loguearnos
app.use(session({
    secret: '*ultraSuperSecreto*',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.varDump = helpers.vardump;
    //res.locals -> node internamente crea variables que se pueden utilizar internamente
    res.locals.flashMessage= req.flash();
    res.locals.userData = {...req.user} || null;
    next();
});
//habilitar bodyParser para leer datos de los formularios
//express ya lo tiene incorporado
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//agregamos las rutas
app.use('/', routes());

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, port, ()=>{
    console.log('server running on port '+port)
});