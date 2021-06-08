const passport = require('passport')
const Usuarios = require('../models/Usuarios');
const bcrypt= require('bcryptjs')
const crypto = require('crypto');
const Sequelize = require('sequelize');
const OP = Sequelize.Op
const enviarMail = require('../handlers/email');

exports.authUser = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
    badRequestMessage: 'Ambos Campos son Obligatorios'
});

exports.userAutenticated = (req, res, next) => {
    if (req.isAuthenticated()){
        return next();
    }

    return res.redirect('/login');
}

exports.cerrarSesion = (req, res)=> {
    req.session.destroy(()=>{
        res.redirect('/login');
    })
}

//genera n token si el usuario es valido
exports.enviarToken = async (req, res) => {
    //verificar que exista el usuario
    const {email} = req.body;
    const usuario = await Usuarios.findOne({where: {email}})

    if (!usuario) {
        req.flash('error', 'Cuenta Inexistente');
        res.redirect('/restablecer');
    }

    //token
    usuario.token = crypto.randomBytes(20).toString('hex');
    //expiracion
    usuario.expiracion = Date.now() + 360000;
    //guardar en la base de datos dichos datos
    await usuario.save();
    //url de reset
    const resetUrl = `http://${req.headers.host}/restablecer/${usuario.token}`;
    //console.log(resetUrl);
    //enviar el Correo con el token
    await enviarMail.enviarMail({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'restablecer-password'
    });
    req.flash('correcto', "Se envió un mensaje a tu correo");
    res.redirect('/login');
}

exports.validarToken = async (req, res) => {
    const usuario = await Usuarios.findOne({where: {token: req.params.token}})
    //res.json(req.params.token);

    if (!usuario){
        req.flash('error', 'No Válido')
        res.redirect('/restablecer');
    }

    res.render('resetPassword',{
        nombrePagina: 'Restablecer Contraseña'
    })
}

exports.resetPassword = async (req, res) =>{
    //Verifica token valido y fecha de expiracion
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [OP.gte] : Date.now()
            }
        }
    })

    if (!usuario) {
        req.flash('error', 'Token No Válido');
        res.redirect('/restablecer');
    }

    //Hashear el password
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    //Remuevo el token y la fecha de expiracion
    usuario.token = null;
    usuario.expiracion = null;

    //guardar en la base de datos dichos datos
    await usuario.save();
    req.flash('correcto', 'Password modificado Correctamente')
    res.redirect('/login');
}