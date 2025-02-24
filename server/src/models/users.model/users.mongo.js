const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');



const usersSchema = new mongoose.Schema({
    username:{type:String,required:true,unique:true},//registration number
    email:String,//email
    password:{type:String,required:true},//password
    role:{
        type:String,enum:['student','teacher','superadmin','admin','staff'],required:true //roles
    },
    mobile:String,
    changepassworddata:{
        type:Date,
        default:Date.now
    }
});
usersSchema.index({username:1},{unique:true});

usersSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password ,salt);
    next();
});

const usersDatabase = mongoose.model('users',usersSchema);

module.exports = usersDatabase;

