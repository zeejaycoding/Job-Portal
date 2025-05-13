const mongoose=require('mongoose')
const { stringify } = require('querystring')


const userSchema=mongoose.Schema(
    {
        username:{
            type: String,
            required: true,
            unique: [true, 'Username already taken']
        },
        email:{
            type: String,
            required:true,
            unique: [true, 'Email address already taken']
        },
        first_name:{
            type: String,
            required: true
        },
        last_name:{
            type:String,
            required:true
        },
        password:{
            type: String,
            required: true
        },
        type:{
            type: String,
            required: true
        }
    }
)

module.exports=mongoose.model('User',userSchema);