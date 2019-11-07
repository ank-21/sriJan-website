const Workshop = require('./models/workshop');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Register',{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

const mustache = require('mustache');
const fs = require('fs');
const path=require('path');
var content = fs.readFileSync(path.join(__dirname, "./mail.html"), 'utf-8');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'srijannits@gmail.com',
    pass: 'srijan_nits1'
  }
});


Workshop.find( {transactionID : {$ne: null}, mailWorkshop: {$ne: true} }, (err, workshops)=>{
  let c=0;
  console.log(workshops.length)
  // workshops.forEach(workshop => {
  //   
  //     const output = mustache.render(content, {
  //       events: 'Stock Market Workshop',
  //       transactionID:workshop.transactionID,
  //       collegeName: workshop.collegeName,
  //       name: workshop.name
  //     });

  //     const mailOptions = {
  //       from: 'srijannits@gmail.com',
  //       to: workshop.mailId,
  //       subject: 'Invitation for SRIJAN NIT Silchar',        
  //       html: output
  //     };
      
  //     transporter.sendMail(mailOptions, function(error, info){
  //       if (error) {
  //         console.log('ERROR Send Mail', error);
  //       } else {
  //         console.log('Email sent: ' + workshop.mailId + '  ' + info.response);
  //         workshop.mailWorkshop=true;
  //         c+=1;
  //         console.log(''+c+ ' MAILS SENT...');
  //         workshop.save((err,workshop)=>{
  //           //console.log('Saved: ' + workshop.mailId);
  //         });
  //       }
  //     });
  //   
  // });
});
