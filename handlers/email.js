const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const {htmlToText} = require('html-to-text');
const util = require('util');
const emailConfig = require('../config/email');


let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
        user: emailConfig.user,
        pass: emailConfig.pass
    }
});

//Generar html
const generarHTML = (archivo, options = {}) => {
    const html = pug.renderFile(`${__dirname}/../views/email/${archivo}.pug`, options);
    return juice(html);
}

exports.enviarMail = async (options)=> {
    const html = generarHTML(options.archivo, options);
    const text = htmlToText(html, {
        wordwrap: 130
    });
    let mailOptions = {
        
        from: 'UpTask <no-reply@upstask.com',
        to: options.usuario.email,
        subject: options.subject,
        text,
        html, 
    }
    const enviar = util.promisify(transport.sendMail, transport);
    return enviar.call(transport, mailOptions)
    //transport.sendMail(mailOptions);
}



