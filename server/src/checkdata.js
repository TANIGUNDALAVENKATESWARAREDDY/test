const studentdatabase = require("./models/student.model/student.mongo");

async function checkdata(req,res){
    console.log('heelo upendra');
    // const duplicates = await studentdatabase.aggregate([
    //     { $group: { _id: "$stdregid", ids: { $push: "$_id" }, count: { $sum: 1 } } },
    //     { $match: { count: { $gt: 1 } } }
    // ]);

    // for (const doc of duplicates) {
    //     const [keepId, ...deleteIds] = doc.ids;
    //     await studentdatabase.deleteMany({ _id: { $in: deleteIds } });
    // }
    // await studentdatabase.collection.dropIndex("stdregid_1");
    // console.log("Dropped non-unique index on stdregid");
    // await studentdatabase.collection.createIndex({ stdregid: 1 }, { unique: true });
    // console.log("Created unique index on stdregid");
    const ans =await studentdatabase.collection.indexes();
    console.log('ans: ',ans);
}
module.exports = checkdata;