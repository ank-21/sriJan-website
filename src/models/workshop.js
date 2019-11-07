const mongoose = require('mongoose')

const workshopSchema = new mongoose.Schema({
    name: {
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
    },
    mobileNumber:{
        type:Number,
        required:true
    },
    transactionID:{
        type: String,
        default: null
    },
    mailWorkshop:{
        type: Boolean,
        default: false
    }
});

workshopSchema.statics.updateTransactionId=function(Id,transactionID){
    if(transactionID){
        return Workshop.findByIdAndUpdate(Id, { $set: { 'transactionID' : transactionID } } , (err, workshop)=>{
            if(!err){
                return workshop;
            }
        })
    }
};

const Workshop = mongoose.model('workshop',workshopSchema);
module.exports = Workshop;