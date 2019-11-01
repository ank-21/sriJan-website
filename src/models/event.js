const mongoose = require('mongoose');
const validator = require('validator')

const eventSchema = new mongoose.Schema({
    teamName: {
        type:String,
        trim:true,
        required:true
    },
    collegeName: {
        type: String,
        required:true
    },
    mailId:{
        type:String,
        required:true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }  
    },
    teamNumber:{
        required:true,
        type:Number
    },
    mobileNumber:{
        type:Number,
        required:true
    },
    teamMembersName: {
        type:String,
        required:true
    },
    events:[
        {
            required:true,
            type:String
        }
    ],
    transport: {
        type:String,
        required:true
    },
    arrivalDate: {
        type: String,
        required:true
    },
    departureDate: {
        type:String,
        required:true
    },
    transportDetails:{
        type:String,
        required:true
    },
    accomodation:{
        type:Boolean
    },
    transactionID:{
        type: String,
        default: null
    }
});

eventSchema.statics.updateTransactionId=function(Id,transactionID){
    if(transactionID){
        return Event.findByIdAndUpdate(Id, { $set: { 'transactionID' : transactionID } } , (err, event)=>{
            if(!err){
                return event;
            }
        })
    }
};

const Event = mongoose.model('Event',eventSchema);
module.exports = Event;