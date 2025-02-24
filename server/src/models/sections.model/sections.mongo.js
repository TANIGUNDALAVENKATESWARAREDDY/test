const mongoose = require('mongoose');

const sectionsSchema = new mongoose.Schema({
    class:{
        type:String,
        required:true
    },
    sectionname:{
        type:String,
        required:true
    },
    classteacherid:String,
    schoolstarttime:String,
    Schoolendtime:String
});

const sectionsdatabase = mongoose.model('sections',sectionsSchema);
module.exports = sectionsdatabase;