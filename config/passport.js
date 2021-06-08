const passport = require('passport');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;

//Referencia al modelo que vamos a auntenticar
const Usuarios = require('../models/Usuarios');

//Local strategy - Login con credenciales propias
passport.use(
    new LocalStrategy(
        //por defaul passport espera un user and password
        //podemos reescribir esos datos
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, callback) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: {
                        email,
                        activo: 1
                    }
                });
                bcrypt.compareSync(password, usuario.password, (err, res) => {
                    if (err) return callback(err);
                    if (!res) return callback(new Error('Password Incorrecto'));
                
                })
                return callback(null, usuario);
                
            } catch (error) {
                //El usuario no existe
                return done(null, false, {
                    message: 'Cuenta no existente'
                })
            }
        }
    )
);
// Passport requiere una funcion extra
//Serializar el usuario
passport.serializeUser((usuario, callback)=>{
    callback(null, usuario);
});
//Deserializar el usuario
passport.deserializeUser((usuario, callback)=>{
    callback(null, usuario);
});

module.exports = passport;