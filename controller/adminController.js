const express=require('express');
const admin=require('../model/userModel');
const jobs=require('../model/jobModel');
const applications=require('../model/applicationModel');
const jwt=require('jsonwebtoken');
const router=express.Router();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded.user; 
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

router.get('/viewCount',verifyToken,async(req,res)=>{

    
    if(req.user.type !='admin'){
       return res.status(400).json({message: "Only admins can view all users"})
    }

    const checkAdmin= await admin.findOne({_id:req.user.id});

    if(!checkAdmin){
        return res.status(400).json({message:"Need to be logged in "})
    }

    const usersCount= await admin.countDocuments();
    const jobCount= await jobs.countDocuments();
    const applicationCount= await applications.countDocuments();

    return res.status(200).json({message: `User Count: ${usersCount}, Job Count: ${jobCount}, Application Count: ${applicationCount}`});
});

router.patch('/block/:user_id',verifyToken,async(req,res)=>{
    const {user_id}=req.params;

    if(req.user.type != 'admin'){
        return res.status(400).json({message: "Only admins are allowed to block or unblock a user"})
    }

    checkUser= await admin.findOne({_id:user_id});

    if(!checkUser){
        return res.status(400).json({message: "No such user exists "});
    }

    checkUser.blocked=true;
    await checkUser.save()

    return res.status(200).json({message: "User blocked Successfully"})
});

router.patch('/unblock/:user_id',verifyToken,async(req,res)=>{
    const {user_id}=req.params;

    if(req.user.type != 'admin'){
        return res.status(400).json({message: "Only admins are allowed to block or unblock a user"})
    }

    checkUser= await admin.findOne({_id:user_id});

    if(!checkUser){
        return res.status(400).json({message: "No such user exists "});
    }

    checkUser.blocked=false;
    await checkUser.save()

    return res.status(200).json({message: "User unblocked Successfully"})
});

router.delete('/deleteJob/:job_id',verifyToken,async(req,res)=>{
    const {job_id}=req.params;

    if(req.user.type != 'admin'){
        return res.status(400).json({message: "Admins are onl allowed to delete a job"});
    }

    checkAdmin= await admin.findOne({_id:req.user.id});

    if(!checkAdmin){
        return res.status(400).json({message: "Login is required"});
    }

    checkJob= await jobs.findOneAndDelete(job_id);
    if(!checkJob){
        return res.status(400).json({message:"Invalid job id "});
    }else{
        return res.status(200).json({message:"Job deleted successfully"});
    }

});


router.delete('/deleteUser/:userDel_id',verifyToken,async(req,res)=>{
    const {userDel_id}=req.params;

    if(req.user.type != 'admin'){
        return res.status(400).json({message: "Admins are onl allowed to delete a job"});
    }

    checkAdmin= await admin.findOne({_id:req.user.id});

    if(!checkAdmin){
        return res.status(400).json({message: "Login is required"});
    }

    const userToDelete = await admin.findById(userDel_id);
    if (!userToDelete) {
      return res.status(404).json({ message: "User not found" });
    }


    if (userToDelete.type === 'admin') {
      return res.status(403).json({ message: "You cannot delete another admin" });
    }


    checkUser= await admin.findOneAndDelete({_id:userDel_id});
    if(!checkUser){
        return res.status(400).json({message:"Invalid user id "});
    }else{
        return res.status(200).json({message:"User deleted successfully"});
    }

});


module.exports=router;