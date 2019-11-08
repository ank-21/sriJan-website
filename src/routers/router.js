const express = require('express');
const router = express.Router();
const PDFDocument = require('./pdfTable');
const Event = require('../models/event');
const Workshop = require('../models/workshop');
const mongoose = require('mongoose');
var paytm_config = require('../paytm/paytm_config').paytm_config;

router.post('/event', (req,res)=>{
    const event = new Event(req.body);
    try {
        if(req.body.transactionID==='srijan.nits1.0'){
            event.transactionID = 'offline'
            event.save((err,data)=>{
                console.log('data',data);
                if(!err){
                    res.redirect('event/list?id=' + data._id)
                }else{
                    res.render('error',{
                        errorMsg:'Wrong Input Found'
                    })
                }
            });
        }else{
            res.send("Authentication Failed");
        }
            
    } catch (error) {
        console.log('error during insert operation : ' + error);
    }
})



router.get('/event/list',(req,res)=>{
    let id = req.query.id;
    Event.findOne({_id:id},(err,docs)=>{
        console.log('1st',docs)
        console.log("2nd",docs._doc);
        if(!err){
            let fee = 0;
            if(docs._doc.events.indexOf('IPL Auction') > -1 || docs._doc.events.indexOf('Business Quiz Competition') > -1){
                fee=100;
            }
            else{
                fee=300;
            }
            const list = {
                ...docs._doc,
                ORDERID: 'ORDER'+Date.now(),
                CUSTID : 'CUST'+Date.now(),
                MID : paytm_config.MID,
                fee
            };
            console.log('LIST', list);
            res.render("eventList",{  //its a view page 
                list
            })  
        }else{
            res.redirect('error')
        }
    })
})


router.post('/workshop',(req,res)=> {
    const workshop = new Workshop(req.body);
    try {
        if(req.body.transactionID==='srijan.nits1.0'){
            workshop.transactionID = 'offline'
            workshop.save((err,data)=>{
                console.log("data : ",data);
                if(!err){
                    res.redirect('workshop/list?id=' + data._id)
                }res.render('error',{
                    errorMsg:'Wrong Input Found',
                    errorCode: 0
                })
            })
        }else{
            res.send("Authentication Failed")
        }  
    } catch (error) {
        console.log('error during insert operation : ' + error);
    }
})

router.get('/workshop/list',(req,res)=>{
    let id = req.query.id;
    Workshop.findOne({_id:id},(err,docs)=>{
        if(!err){
            const list = {
                ...docs._doc,
                ORDERID: 'ORDER'+Date.now(),
                CUSTID : 'CUST'+Date.now(),
                MID : paytm_config.MID,                  
            };
            console.log("docs : ",list);
            res.render("workshopList",{  //its a view page 
                list
            })  
        }
        else{
            res.redirect('error')
        }
    })
})

router.post('/authWorkshop',(req,res)=> {
    console.log(req.body);
    if(req.body.transactionID === 'srijan.nits1.0'){
        Workshop.findByIdAndUpdate(req.body.id, { $set: { 'transactionID' : 'Verified' } } , (err, workshop)=>{
            if(!err){
                res.send("Authentication successful.Now you can pay offline.")
            }
        })}
        else{
            res.send("Authentication Failed")
        }   
})

router.post('/authEvent',(req,res)=> {
    console.log(req.body);
    if(req.body.transactionID === 'srijan.nits1.0'){
        Event.findByIdAndUpdate(req.body.id, { $set: { 'transactionID' : 'Verified' } } , (err, event)=>{
            if(!err){
                res.send("Authentication successful.Now you can pay offline.")
            }
        })}
        else{
            res.send("Authentication Failed")
        }   
})

router.post('/checkWorkshop',(req,res)=> {
    console.log(req.body);
    res.render('paytm',{
        docs:req.body,
        cb: `http://13.235.80.162/paytmPath/cb/workshop/${req.body.id}`
    })
    
})

router.post('/checkEvent',(req,res)=> {
    console.log(req.body);
    res.render('paytm',{
        docs:req.body,
        cb: `http://13.235.80.162/paytmPath/cb/event/${req.body.id}`
    })
    
})

router.get('/getAllEvents/9123421208',(req,res)=>{
    Event.find((err, data)=>{
        res.send(data);
    });
});

router.get('/getAllWorkshops/9123421208',(req,res)=>{
    Workshop.find((err, data)=>{
        res.send(data);
    });
});

router.get('/error',(req,res)=>{
    res.render('error',{
        errorCode: 4
    })
})

router.get('/views/fetchEvents', (req, res)=> {
    Event.find((err, data)=>{
        res.render('displayrecords', {
            event: true,
            encodedData: encodeURIComponent(JSON.stringify(data)),
            options:['Pitching Competition', 'Business Model Canvas Competition', 'Business Quiz Competition', 'Board Room', 'Intern Fair', 'Bonfire Chat', 'IPL Auction']
        })
    });
});


router.get('/views/fetchWorkshops', (req, res)=> {
    Workshop.find((err, data)=>{
        res.render('displayrecords', {
            event: false,
            encodedData: encodeURIComponent(JSON.stringify(data)),
            options:['']
        })
    });
});

router.get('/views/pdf/:event',(req,res)=>{
    
    const table0 = {
        headers: ["Team Name", "Email ID", "Mobile Number"],
        rows: []
    };
    let c=0;
    if(req.params.event==='workshop'){
        Workshop.find({transactionID: {$ne: null}}, (err,workshops)=>{
            table0.headers[0]="Name";
            const doc = new PDFDocument();
            doc.pipe(res);
            doc.fontSize(15).font('Helvetica-Bold').text(`List for ${req.params.event} `, {
                align: 'center'
            });
            doc.moveDown();
            doc.moveDown();
            workshops.forEach((workshop)=>{
                table0.rows.push([workshop.name, workshop.mailId, workshop.mobileNumber]);
                c+=1;
                if(c===workshops.length){
                    doc.table(table0, {
                        prepareHeader: () => doc.font('Helvetica-Bold'),
                        prepareRow: (row, i) => doc.font('Helvetica').fontSize(12)
                    });
                    doc.moveDown();
                    doc.end();
                    c=-1;
                }
            });
            if(c===workshops.length){
                doc.table(table0, {
                    prepareHeader: () => doc.font('Helvetica-Bold'),
                    prepareRow: (row, i) => doc.font('Helvetica').fontSize(12)
                });
                doc.moveDown();
                doc.end();
            }
        });
    }
    else{
        Event.find({events: req.params.event, transactionID: {$ne: null}}, (err,events)=>{
        
            const doc = new PDFDocument();
            doc.pipe(res);
            doc.fontSize(15).font('Helvetica-Bold').text(`List for ${req.params.event} `, {
                align: 'center'
            });
            doc.moveDown();
            doc.moveDown();
            events.forEach((event)=>{
                table0.rows.push([event.teamName, event.mailId, event.mobileNumber]);
                c+=1;
                if(c===events.length){
                    doc.table(table0, {
                        prepareHeader: () => doc.font('Helvetica-Bold'),
                        prepareRow: (row, i) => doc.font('Helvetica').fontSize(12)
                    });
                    doc.moveDown();
                    doc.end();
                    c=-1;
                }
            });
            if(c===events.length){
                doc.table(table0, {
                    prepareHeader: () => doc.font('Helvetica-Bold'),
                    prepareRow: (row, i) => doc.font('Helvetica').fontSize(12)
                });
                doc.moveDown();
                doc.end();
            }
        });
    }
});

module.exports = router;