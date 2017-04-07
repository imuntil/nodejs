/**
 * Created by 斌 on 2017/4/4.
 */
const nodemailer = require('nodemailer')

module.exports = function (credentials) {
    const mailTransport = nodemailer.createTransport({
        service:'Gmail',
        auth:{
            user: credentials.gmail.user,
            pass: credentials.gmail.password,
        }
    })
    let from = `'Meadowlark Travel' <info@meadowlarktravel.com>`;
    let errorRecipient = 'imuntil@gmail.com';

    return {
        send(to, subj, body) {
            mailTransport.sendMail({
                from: from,
                to: to,
                subject: subj,
                html: body,
                generateTextFromHtml: true,
            }, error => {
                if (error) console.error(`Unable to send email: ${error}`)
            })
        },
        emailError(message, filename, exception) {
            let body =
                `<h1>Meadowlark Travel Site Error </h1>
                message: <br> 
                <pre> ${message}</pre>
                <pre> ${exception}</pre>
                <br>`;
            mailTransport.sendMail({
                from:from,
                to:errorRecipient,
                subject: 'Meadowlark Travel Site Error',
                html: body,
                generateTextFromHtml:true,
            }, error => {
                if (error) console.error(`Unable to send email: ${error}`)
            })
        }
    }
}