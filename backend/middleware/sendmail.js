const nodemailer = require('nodemailer')


const sendmail = async (email, subject, text) => {
    // Gmail SMTP transport
    const transport = nodemailer.createTransport({
        service: "gmail", // <-- use Gmail directly
        auth: {
            user: process.env.GMAIL,  // from .env
            pass: process.env.GPASS,  // app password from .env
        },
        tls: {
            rejectUnauthorized: false, // ignore self-signed certs
        }
    });

    // send mail

    try {
        await transport.sendMail({
            from: process.env.GMAIL,
            to: email,
            subject,
            text,
        });
        console.log("Email sent");
    } catch (error) {
        console.error("Error sending email:", error);
    }

}

module.exports = sendmail

