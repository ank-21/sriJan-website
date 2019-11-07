const Event = require('../models/event');
const mongoose = require('mongoose');
const sgMail = require('@sendgrid/mail');
const mustache = require('mustache');
const fs = require('fs');
const path=require('path');
var content = fs.readFileSync(path.join(__dirname, "./mail.html"), 'utf-8');


const key='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';

sgMail.setApiKey(key);

Event.find({transactionID: {$ne : null} }, (err, event)=>{
  console.log(event);
});

// var view = {
//   events: [
//     "IPL Auction"
//   ],
//   transactionID: "125707823931",
//   __i: "5dbd8ed1f6949e74f4e8899b",
//   teamName: "titans 5",
//   collegeName: "nit silchar",
//   mailId: "yashbanthia199820@gmail.com",
//   mobileNumber: 8133023176,
//   teamNumber: 3,
//   teamMembersName: "1)yash\r\n2)ansaar\r\n3)bhaskar",
//   transport: "none",
//   arrivalDate: "2019-11-09",
//   departureDate: "2019-11-09",
//   transportDetails: "none",
//   __v: 0
// };
// var output = mustache.render(content, view);

// const msg = {
//   to: 'aryan.major@gmail.com',
//   from: 'support@srijan-nits.com',
//   subject: 'Invitation to SRiJAN 1.0 NIT Silchar',
//   text: 'Confirmation Email',
//   html: output,
// };
// sgMail.send(msg);