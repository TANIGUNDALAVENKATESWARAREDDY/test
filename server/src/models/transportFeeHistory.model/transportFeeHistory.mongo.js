const mongoose = require('mongoose');

const tempTransportModeDataSchema = new mongoose.Schema({
    modeuid:String,
    modetype:String,
    modeamount:Number
});

const transportFeeHistorySchema = new mongoose.Schema({
    stdclass:String, //student class
    stdsectionid:String, //student section
    stdname:String, //student name
    stdregid:String , //student regid
    stdamountpaidnow:Number ,//student amount paid now
    transportfeecomments:String, // transport fee comments
    transportfeepaiddata:{
        type:Date,
        default:Date.now,
    },// transport fee paid date
    transportfeecollectedstaffid:String,
    paidby:String,
    modedata:[tempTransportModeDataSchema],
    staffrole:String,
    receiptnumber:String,
    totaltransportfee:Number,
    totalpaid:Number,
    transportnextfeedate:{
        type:Date,
    },
    stdtransportfrom:String,// transport from
    stdgender:String,// student gender
    stdmobile:Number,//father or guardian mobile number

});
transportFeeHistorySchema.index({receiptnumber:1});
transportFeeHistorySchema.index({stdregid:1});

const transportFeehistoryDatabase = mongoose.model('transportfeehistory',transportFeeHistorySchema);
module.exports = transportFeehistoryDatabase;