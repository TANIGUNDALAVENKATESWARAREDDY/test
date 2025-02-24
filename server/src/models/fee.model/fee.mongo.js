const mongoose = require('mongoose');

const tempModeDataSchema = new mongoose.Schema({
    modeuid:String,
    modetype:String,
    modeamount:Number
});

const feehistorySchema = new mongoose.Schema({
    stdclass:String,//student class
    stdsectionid:String,//student section ID
    stdname:String,//student name
    stdregid:String,//student register ID
    stdamountpaidnow:Number,//student amount paid now
    feecomments:String,//fee comments
    feepaiddate:{
        type:Date,
        default:Date.now,
    },//student fee paid date
    feecollectedstaffid:String,
    paidby:String,
    modedata:[tempModeDataSchema],
    staffrole:String,
    receiptnumber:String,
    totalfee:Number,//total fee
    feediscount:Number,//fee discount
    totalpaid:Number,//total paid
    nextfeedate:{
        type:Date,
    }
});

const feehistorydatabase = mongoose.model('feehistory',feehistorySchema);
module.exports = feehistorydatabase;
