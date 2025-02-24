const mongoose = require('mongoose');
const subjectTeachersSchema = new mongoose.Schema({
    subjectid:String,
    teacherid:String
});
const subjectTeachersDatabase = mongoose.model('subjectTeachers',subjectTeachersSchema);
module.exports = subjectTeachersDatabase;
