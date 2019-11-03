const express = require('express');
const PaytmRouter = express.Router();


var paytm_config = require('../paytm/paytm_config').paytm_config;
var paytm_checksum = require('../paytm/checksum');

const CbInput = require('../models/cbInput');
const StartInput = require('../models/startInput');
const Event = require('../models/event');
const Workshop = require('../models/workshop');
const mongoose = require('mongoose');



PaytmRouter.post('/generate_checksum',(req,res)=>{
    try {
        var paramarray = req.body;
        paytm_checksum.genchecksum(paramarray, paytm_config.MERCHANT_KEY, function (err, checksum) {
            paramarray.CHECKSUMHASH = checksum;
            var startInput = new StartInput(paramarray);
            startInput.save((err,data)=>{
                console.log("data: ",data);
                
                if(!err){
                    res.render("firstTime",{
                        list:paramarray
                    })
                }else{
                    res.redirect('error')
                }
            })
        })
    } catch (error) {
        console.log("error : ",error);
        res.redirect('error');  
    }

})

PaytmRouter.post("/cb/workshop/:id",(req,res)=>{   
    res.render('cb',{
        list:req.body,
        id: req.params.id,
        event: 'false'
    })    
})

PaytmRouter.post("/cb/event/:id",(req,res)=>{   
    res.render('cb',{
        list:req.body,
        id: req.params.id,
        event: 'true'
    })    
})

PaytmRouter.post('/verify_checksum',(req,res)=>{
    
    
    var paytmChecksum = "";
    var paytmParams = {};
    let received_data = {...req.body};
    for (var key in received_data) {
        if (key==='CHECKSUMHASH') {
            paytmChecksum = received_data[key];
        } else if(key!=='event' && key!=='id') {
            paytmParams[key] = received_data[key];
        }
    }
    console.log('verify_checksum', received_data);
    console.log('paytmChecksum', paytmChecksum);
    console.log('paytmParams', paytmParams);
    
    var isValidChecksum = paytm_checksum.verifychecksum(paytmParams, paytm_config.MERCHANT_KEY, paytmChecksum);
    if(isValidChecksum || (received_data.PAYMENTMODE==='UPI' && received_data.RESPCODE=='01')) {
        const cbInput = new CbInput(req.body);
        cbInput.save((err,data)=>{
            console.log(data)
            if(!err){
                StartInput.findOne({ORDER_ID:data.ORDERID},(err,docs)=>{
                    if(!err&&docs.TXN_AMOUNT==data.TXNAMOUNT){
                        if(req.body.event==='true'){
                            if(Event.updateTransactionId(req.body.id, data.BANKTXNID)){
                                res.render('success',{
                                    doc:data
                                });
                            }
                        
                        }
                        else if(req.body.event==='false'){
                            if(Workshop.updateTransactionId(req.body.id, data.BANKTXNID)){
                                res.render('success',{
                                    doc:data
                                });
                            }
                        }
                    }
                    else{
                        res.render('error')
                    }
                })
                
            }else{
                res.redirect('error')            }
        })
    } else {
        console.log("Checksum Mismatched");
        res.send('Payment Failed')
    }
    
})


module.exports = PaytmRouter;