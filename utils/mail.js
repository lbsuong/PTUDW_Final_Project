const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: "smtp.google.com",
    port: 465,
    secure: true,
    service: 'Gmail',

    auth: {
        user: 'webfinalproject.ss@gmail.com',
        pass: 'rootroot',
    }

});

module.exports = transporter;