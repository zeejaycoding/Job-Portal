const express=require('express')
const user=require('../model/userModel');
const jwt=require('jsonwebtoken');
const router=express.Router();
const bcrypt=require('bcrypt');

router.post('/signup', async(req,res)=>{
    const {first_name, last_name,username,email,password,type}=req.body;

    if(!first_name || !last_name || !username || !email || !password || !type){
        res.status(400).json({message: "All fields mandatory"});
        return;
    }
    if(password.length <= 8){
        res.status(400).json({message: "Password should contain more than 8 letter"});
        return;
    }
    //checking if username exists
    const usernameCheck= await user.findOne({username});
    if(usernameCheck){
        res.status(400).json({message: "username taken ,enter another username "});
        return;
    }
// checking for unqiue email
    const emailCheck= await user.findOne({email});
    if (emailCheck){
        res.status(400).json({message:"email taken, enter an unregistered email"});
        return;
    }
//hashing passowrd:
const hashPassword=await bcrypt.hash(password,10);

const NewUser=await user.create({
    username,
    email,
    first_name,
    last_name,
    password: hashPassword,
    type,
})

if (NewUser){
    console.log('User created')
    const token=jwt.sign(
        { user: {id:NewUser._id,role:NewUser.type}},
        process.env.SECRET,
        {expiresIn: '3h'}
    );
    res.status(201).json({
        _id: NewUser._id,
        type: NewUser.type
    });
    return;
} else{
    res.status(400).json({ message: "Invalid user data" });
    return;
}

});

router.post('/login', async(req,res) =>{
    const {username,password,type}= req.body;

    const checkUsername= await user.findOne({username})

    if(!checkUsername){
    res.status(400).json({message:'username invalid or user not registered'})
    }

    if(checkUsername.blocked==true){
        return res.status(400).json({message : "You are blocked from our portal"});
    }

    if (checkUsername.type != type){
        res.status(400).json({message: `No data for ${type} found, Login under correct role`});
        return;
    }

    const isMatch = await bcrypt.compare(password, checkUsername.password);
if (!isMatch) {
    res.status(400).json({ message: "Invalid password" });
    return;
}


    if(checkUsername){
        console.log("Log in successful");
        const token=jwt.sign(
            {user: {id:checkUsername._id, type:checkUsername.type}},
            process.env.SECRET,
            {expiresIn:'3h'}

        );
        res.status(201).json({
            token,
        _id: checkUsername._id,
        type: checkUsername.type
    });
    }
});


module.exports=router;