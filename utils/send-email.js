"use strict";

const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
dotenv.config();

exports.sendEmail = async function (emails, subject , content) {
    return new Promise(async (resolve, reject)=>{
        try{
            console.log("Reached sendEmail")
            if (typeof emails=="object") emails.join(", ");
            console.log("email_host : ", process.env.EMAIL_HOST);
            console.log("email_port : ", process.env.EMAIL_PORT);
            console.log("email_user: ",process.env.EMAIL_USER);
            console.log("email_password : ",process.env.EMAIL_PASSWORD);

            let transporter = nodemailer.createTransport({
                host : process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                secure: process.env.EMAIL_PORT == 465 ? true : false,
                auth : {
                    user : process.env.EMAIL_USER,
                    pass : process.env.EMAIL_PASSWORD,
                },
            });

            let info = await transporter.sendMail({
                from : '"Pomograd" <support@pomograd.ru>',
                to  : emails,
                subject : subject,
                html : content,
            });

            console.log("info : ",info);

            resolve(true);
        }catch (error) {
            reject(false);
        }
    });
};

