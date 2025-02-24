const mongoose = require('mongoose');
const classSubjectsSchema = new mongoose.Schema({
    class:String,
    subjectid:String
});
const classSubjectsDatabase = mongoose.model('classSubjects',classSubjectsSchema);
module.exports = classSubjectsDatabase;