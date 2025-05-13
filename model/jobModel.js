const mongoose=require('mongoose');


const jobSchema= mongoose.Schema(
    {
        title:{
            type: String,
            required: true
        },
        description:{
            type:String,
            required: true
        },
        location:{
            type: String,
            required: true
        },
        salary:{
            type: Number,
        },
        tags:{
            type: [String]
        },
        deadlines:{
            type: Date,
            required: true
        },
        createdBy:{
                type: mongoose.Schema.Types.ObjectId,
            ref :"Employee"
        }
    
});

module.exports=mongoose.model('jobs',jobSchema)