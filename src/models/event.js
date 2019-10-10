const mongoose = require('mongoose')

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
        required:true
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
    }
});

const Event = mongoose.model('Event',eventSchema);
module.exports = Event;