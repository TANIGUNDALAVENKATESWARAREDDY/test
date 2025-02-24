const usersDatabase = require('./users.mongo');

async function userLoginModel(userData){
    try{
        
    }catch(err){
        console.log('getting an error in user model',err);
        return {success:true,message:'getting error in users model'};
    }
}

module.exports = {
    userLoginModel,
}