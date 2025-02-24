const mongoose = require('mongoose');
//student schema 
const studentSchema = new mongoose.Schema({
        stdautoregornot:Boolean,//student registration auto enerate or not
        stdregid:{
                type: String,
                unique: true,
                required: true,
                index: true
        }, //student registration id
        //student details
        stdfirstname:{
                type:String,
            },//student first name
        stdmiddlename:String,//student middle name
        stdlastname:{
                type:String,
            },//student last name
        stddob:Date,//student date of birth
        stdgender:{
                type:String,
            },//student gender
        stdclass:{
                type:String,
            },//student class
        stdsectionid:String,
        stdjoingyear:{
                type:String,
            },//student joing year
        stdprevschool:String,// student previous school if any
        stdprevschtc:String,//previous school tc link

        stdparentorguard:String,// student have guardian or parent-> false represents parent 

        //parent details

        //father details
        stdfatherfirstname:String,//student father first name
        stdfathermiddlename:String,//student father middle name
        stdfatherlastname:String,//student father last name
        stdfatheroccupation:String,//student father occupation
        stdfatheremail:String,//student father email
        stdfatherphone:Number,//student father mobile number

        //mother details
        stdmotherfirstname:String,//student mother first name
        stdmothermiddlename:String,//student mother middle name
        stdmotherlastname:String,//student mother last name
        stdmotheroccupation:String,//student mother occupation
        stdmotheremail:String,//student mother email
        stdmotherphone:Number,//student mother phone


        //guardian details
        stdguardfirstname:String,//student guardian first name
        stdguardmiddlename:String,//student guardian middle name
        stdguardlastname:String,//student guardian  last name
        stdguardoccupation:String,//student guardian occupation name
        stdguardemail:String,//student guardian email
        stdguardphone:Number,//student guardian mobile number


        //Address Details

        //temporary address
        stdtempaddhousenum:{
                        type:String,

                },//student temporary address house number
                        stdtempaddstreet:{
                        type:String,

                },//student temporary address street
                        stdtempaddcity:{
                        type:String,

                },//student temporary address city
                        stdtempadddistrict:{
                        type:String,

                },//student temporary address district
                        stdtempaddstate:{
                        type:String,

                },//student temporary address state
                        stdtempaddpincode:{
                        type:String,

                },//student temporary address pincode
                        stdtempaddcountry:{
                        type:String,

                },//student temporary address country

        stdtempandpermsame:Boolean,// student permanent address and temporary address are same
        //permanent address
        stdpermaddhousenum:{
                        type:String,

                },//student permanent address house number
                        stdpermaddstreet:{
                        type:String,

                },//student permanent address street
                        stdpermaddcity:{
                        type:String,

                },//student permanent address city
                        stdpermadddistrict:{
                        type:String,

                },//student permanent address district
                        stdpermaddstate:{
                        type:String,

                },//student permanent address state
                        stdpermaddpincode:{
                        type:String,

                },//student permanent address pincode
                        stdpermaddcountry:{
                        type:String,

                },//student permanent address country
        //fee details
        stdtotalfee:Number,//student total fee
        stdtotalpaid:Number,//student total fee paid
        stdfeediscount:Number,//student fee discount

        //transport fee details
        stdtransportfeestatus:String,
        stdtransporttotalfee:Number,
        stdtransportfeepaid:Number,
        stdtransportfrom:String,
        transportstartdate:Date,

        //referred by some one
        stdrefsomeone:Boolean,//is some one referred the student
        stdreferredid:String//referred id

});
studentSchema.index({stdclass:1});//class
studentSchema.index({stdregid:1},{ unique: true });//student register id
studentSchema.index({stdclass:1,stdsectionid:1});//student section id
studentSchema.index({stdclass:1,stdsectionid:1, stdtransportfeestatus:1}); //for students transport fee
const studentdatabase = mongoose.model('students',studentSchema);
module.exports = studentdatabase;