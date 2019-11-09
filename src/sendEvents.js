const Workshop = require('./models/workshop');
const mongoose = require('mongoose');
const sgMail = require('@sendgrid/mail');
const key = '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';

mongoose.connect('mongodb://localhost:27017/Register',{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

sgMail.setApiKey(key);



const mustache = require('mustache');
const fs = require('fs');
const path=require('path');
var content = fs.readFileSync(path.join(__dirname, "./mail.html"), 'utf-8');


Workshop.find( {transactionID : {$ne: null}, maildId: 'arundhatiatreya@gmail.com' , mailWorkshop: {$ne: true} }, (err, workshops)=>{
  let c=0;
  console.log(workshops.length)
  workshops.forEach(workshop => {
    
      const output = mustache.render(content, {
        events: 'Stock Market Workshop',
        transactionID:workshop.transactionID,
        collegeName: workshop.collegeName,
        name: workshop.name
      });

      sgMail.send({
        to: 'aryan.major@gmail.com',
        from: 'srijannits@gmail.com',
        subject: 'Invitation to SRIJAN 1.0 NITS',
        text: 'Successful Registration',
        html: output,
    });
    
  });
});
