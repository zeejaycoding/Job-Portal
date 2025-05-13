const mongoose=require('mongoose')

const application=mongoose.Schema({
    applicantName:{
        type:String,
        required:true
    },
    job_id:{
        type: mongoose.Schema.Types.ObjectId,
    required: true
},
    resume:{
        type:String,
        required:true
    },
    short_message:{
        type:String,
        required:true
    },
    appliedAt:{
        type:Date,
        required:true
    }
})

module.exports=mongoose.model("application",application);