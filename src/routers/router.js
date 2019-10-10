const express = require('express');
const router = express.Router();
const Event = require('../models/event');
const Workshop = require('../models/workshop');
const mongoose = require('mongoose');

router.post('/event', (req,res)=>{
    const event = new Event(req.body);
    try {
        console.log(req.body);
        event.save((err,data)=>{
            console.log(data);
            if(!err){
                res.redirect('event/list?id=' + data._id)
            }else{
                res.redirect('error')
            }
        });    
    } catch (error) {
        console.log('error during insert operation : ' + error);
    }
})



router.get('/event/list',(req,res)=>{
    let id = req.query.id;
    Event.findOne({_id:id},(err,docs)=>{
        if(!err){
            console.log(docs);
            res.render("eventList",{  //its a view page 
                list:docs
            })  //this is rendering the views while redirect lets us to a new url
        }
    })
})


router.post('/workshop',(req,res)=> {
    const workshop = new Workshop(req.body);
    try {
        console.log(req.body);
        workshop.save((err,data)=>{
            console.log(data);
            if(!err){
                res.redirect('workshop/list?id=' + data._id)
            }else{
                res.redirect('error')
            }
        })
    } catch (error) {
        console.log('error during insert operation : ' + error);
    }
})

router.get('/workshop/list',(req,res)=>{
    let id = req.query.id;
    Workshop.findOne({_id:id},(err,docs)=>{
        if(!err){
            console.log(docs);
            res.render("workshopList",{  //its a view page 
                list:docs
            })  //this is rendering the views while redirect lets us to a new url
        }
    })
})

module.exports = router;