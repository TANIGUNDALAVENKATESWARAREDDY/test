const coursesdatabase = require('./courses.mongo');

async function addNewCourseModel(courseData){
    try{
        const response = await coursesdatabase.create({
            courseuid:courseData.courseuid,//unique id
            coursecode:courseData.coursecode,//subject code
            coursename:courseData.coursename,//subject name
            coursecredits:courseData.coursecredits,//subject credits
            coursedescription:courseData.coursedescription//subject description
        });

        if(response){
            return {success:true,message:"successfully added the course"};
        }else{
            return {success:false,message:"getting an error while adding the course"};
        }
    }catch(err){
        console.log('getting an error in courses model ',err);
        return {success:false,message:'getting an error in model'};
    }

}

async function getAllCoursesDataModel(){
    try{
        const response = await coursesdatabase.find({});
        if(response){
            return {success:true,allcourses:response};
        }else{
            return {success:false};
        }
    }catch(err){
        console.log('getting an error in courses model',err);
        return {success:false};
    }
}

module.exports =  {
    addNewCourseModel,
    getAllCoursesDataModel
}