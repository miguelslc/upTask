const Usuarios = require('../models/Usuarios');
const enviarMail = require('../handlers/email');

exports.usuariosRegistrarUsuarios =(req, res)=>{
    res.render('crearCuenta',{
        nombrePagina: 'Crear Cuenta'
    })
}

exports.usuariosRegistrarNuevoUsuario = async (req, res)=>{
    //leer los datos
    const {email, password} = req.body;
    //verificar si no hay errores
    try{
        //crear el usuario
        await Usuarios.create({
            email,
            password
        });
        //Crear una URL de CONFIRMAR
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;
        //crear el objeto de usuario
        const usuario = {
            email
        }
        //enviar email
        await enviarMail.enviarMail({
            usuario,
            subject: 'Confirma tu cuenta UpTask',
            confirmarUrl,
            archivo: 'confirmar-cuenta'
        });
        req.flash('correcto', "Se envió un mensaje a tu correo para confirmar tu cuenta");
        // redirigir al usuario
        res.redirect('/login');
    } catch (error) {
        req.flash('error', error.errors.map(err => err.message))
        res.render('crearCuenta',{
            nombrePagina: 'Crear Cuenta',
            flashMessage: req.flash(),
            email,
            password
        })
    }
    
}

exports.usuariosLoginUsuarios =(req, res)=>{
    const {error} = res.locals.flashMessage;
    res.render('iniciarSesion',{
        nombrePagina: 'Inicia Sesion',
        error: error
    })
}

exports.usuariosRestablecerUsuarioPassword = (req, res) => {
    res.render('restablecerPassword', {
        nombrePagina: 'Restablece tu Contraseña',
    })
}

exports.usuariosConfirmarCuentaUsuario = async (req, res) => {
    //res.json(req.params.correo);
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    })

    if (!usuario) {
        req.flash('error', 'No Válido')
        res.redirect('/register');
    }

    usuario.activo = 1;
    await usuario.save();
    req.flash('correcto', 'Cuenta Activada con Exito')
    res.redirect('/login');
}