const mongoose = require('mongoose');
const classTopicSchema = new mongoose.Schema({
    class:{
        type:String,
        require:true
    },
    subjectid:{
        type:String,
        require:true
    },
    chapterid:{
        type:String,
        require:true
    },
    topicuid:{
        type:String,
        require:true
    },
    topicname:{
        type:String,
        require:true
    },
    topicnumber:{
        type:Number,
        require:true
    },
    uploadtype:String,
    topiclink:String,
    topicgeneratedurl:String
});

const classTopicDatabase = mongoose.model('classtopics',classTopicSchema);
module.exports= classTopicDatabase;