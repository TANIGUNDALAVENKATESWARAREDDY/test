const monoogse = require('mongoose');

const chaptersSchema = new monoogse.Schema({
    class:{
        type:String,
        require:true
    },
    subjectid:{
        type:String,
        require:true
    },
    chapteruid:{
        type:String,
        require:true
    },
    chaptername:{
        type:String,
        require:true
    },
    chapternumber:{
        type:Number,
        require:true
    }

});

const classChapterDatabase = monoogse.model('chapters',chaptersSchema);
module.exports = classChapterDatabase;