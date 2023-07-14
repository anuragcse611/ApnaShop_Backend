require('dotenv').config();

const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const moment = require('moment-timezone');

moment().tz("Asia/Calcutta").format();
process.env.TZ = 'Asia/Calcutta';

const verifyEmail = (tomail, subject, textmessage, item ) => {
    const transporter = nodemailer.createTransport(smtpTransport({
        host:process.env.MAIL_HOST,
        secureConnection: false,
        tls: {
            rejectUnauthorized: false
        },
        port: 587,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        }
    }));

    const mailOptions = {
        from: `Ritualist  ${process.env.MAIL_FROM}`, // sender address
        to: tomail, // list of receivers
        subject: subject, // Subject line
        text: textmessage, // plain text body
        html: '<div style="font-family:Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2"><div style="margin:50px auto;width:70%;padding:20px 0"><div style="border-bottom:1px solid #eee"><a href="" style="font-size:1.4em;color:#00466a;text-decoration:none;font-weight:600">Ritualist</a></div><p style="font-size:1.1em">Hi,</p><p>Lost your way? No problem, Let us guide you back with a password rebirth.</p><h2 style="background:#00466a;margin:0 auto;width:max-content;padding:0 10px;color:#fff;border-radius:4px">'+ item.otp +'</h2><hr style="border:none;border-top:1px solid #eee"><div style="float:right;padding:8px 0;color:#aaa;font-size:.8em;line-height:1;font-weight:300"><p>Ritualist</p><p>Gomia</p><p>Jharkhand</p></div></div></div>',
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log('Error in sending Otp to your email ::', error);
            return false
        } else {
            console.log('otp Email sent: ' + JSON.stringify(info, null, 2));
            return true
        }
    });
}

module.exports = verifyEmail