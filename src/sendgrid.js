const sgMail = require('@sendgrid/mail');
const key = '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';

sgMail.setApiKey(key);

sgMail.send({
    to: 'ankitsrivastava21345@gmail.com',
    from: 'srijannits@gmail.com',
    subject: 'Sending with Twilio SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>From Srijan</strong>',
})