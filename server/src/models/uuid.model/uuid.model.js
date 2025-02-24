const uuiddatabase = require("./uuid.mongo");

async function getAndIncrementUuid(){
    try{
        // console.log('here is your id along with increment id');
        const tempdate  = await uuiddatabase.find({});
        // if(tempdate.length===0){
        //     await uuiddatabase.create({
        //         adminc:1007,
        //         uid:"saraswati234"
        //     });
        // }

        let returnvalue;

        if(tempdate.length>0){
            returnvalue =  tempdate[0].adminc?tempdate[0].adminc:0;
            if(returnvalue>0){
                await uuiddatabase.updateOne({uid:"saraswati234"},{adminc:returnvalue+1});
            }
        }
        // console.log('here is the uid tempdate :' ,tempdate);
        return returnvalue;
    }catch(err){
        console.error('getting an error while getting and incrementing the uuid ',err);
        return 0;
    }
}

module.exports={
    getAndIncrementUuid,
}