const express=require('express');
const jobs=require('../model/jobModel');
const jwt=require('jsonwebtoken');
const router=express.Router();
const employee=require('../model/userModel');
const path = require('path');
const fs = require('fs');



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


router.post('/createJob/:emp_id',verifyToken,async(req,res)=>{
    const {emp_id}=req.params;
    const {title,description,location,salary,tags,deadlines}=req.body;

      if (req.user.type !== "employee") {
    return res.status(403).json({ message: "Only employees can create jobs" });
  }
    
    const employeeCheck= await employee.findById(emp_id);

    console.log(`Employee check : ${employeeCheck}`);

    if(employeeCheck){
    } else{
        res.status(400).json({message:"Please log in to create a job"});
    }

    if (!title || !description || !location  || !deadlines){
        res.status(400).json({message:"All fields mandatory"});
        return;
    }

    const jobCheck = await jobs.findOne({
            title,
            description,
            location,
            createdBy: emp_id
        });
        if (jobCheck) {
            return res.status(400).json({ message: "Job with these details already exists" });
        }

    const newJob= await jobs.create({
        title,
        description,
        location,
        salay:salary || 0,
        tags:tags || null,
        deadlines,
        createdBy : emp_id
    })
    
    if(newJob){
        console.log('Job addedd successfully');
        res.status(200).json({message:"Job added successfully"});
    }
    else{
       return res.status(400).json({message:"Error creating job"});
    }

});

router.post('/updateTitle/:job_id', verifyToken,async(req,res)=>{
    const {job_id}=req.params;
    const {title}=req.body;

    try{

     if (req.user.type !== "employee") {
    return res.status(403).json({ message: "Only employees can update jobs" });
  }
    
    const employeeCheck= await employee.findById(req.user.id);

    console.log(`Employee check : ${employeeCheck}`);

    if(employeeCheck){
    } else{
       return res.status(400).json({message:"Please log in to update a job"});
    }

    if(! title){
        return res.status(400).json({message:"Provide a title to change"})
    }

    jobCheck= await jobs.findOne({
        _id:job_id,
        createdBy:req.user.id
    })    
    if(! jobCheck){
        return res.status(400).json({message: "Invalid job id or job not created by employee"});
    }

    jobCheck.title=title;
    await jobCheck.save()
    return res.status(200).json({mesage: `Title ${title} saved successfully `})    

}catch(err){
    return res.status(400).json({message:err})
}
})

router.post('/updateDescription/:job_id',verifyToken,async(req,res)=>{
    const {job_id}=req.params;
    const {desc}=req.body;

    try{

     if (req.user.type !== "employee") {
    return res.status(403).json({ message: "Only employees can update jobs" });
  }
    
    const employeeCheck= await employee.findById(req.user.id);

    console.log(`Employee check : ${employeeCheck}`);

    if(employeeCheck){
    } else{
       return res.status(400).json({message:"Please log in to update a job"});
    }

    if(! desc){
        return res.status(400).json({message:"Provide a description to change"})
    }

    jobCheck = await jobs.findOne({
        _id:job_id,
        createdBy:req.user.id
    })
    if(!jobCheck){
        return res.status(400).json({message: "Invalid job id or job not created by employee"})
    }

    jobCheck.description=desc;
    await jobCheck.save();
    return res.status(200).json({message:` Description changed to "${desc}" successfully `})
} catch(err){
    return res.status(400).json({message:err})
}

});

router.post('/updateLocation/:job_id',verifyToken,async(req,res)=>{
    const {job_id}=req.params;
    const {location}=req.body;

    try{

     if (req.user.type !== "employee") {
    return res.status(403).json({ message: "Only employees can update jobs" });
  }
    
    const employeeCheck= await employee.findById(req.user.id);

    console.log(`Employee check : ${employeeCheck}`);

    if(employeeCheck){
    } else{
       return res.status(400).json({message:"Please log in to update a job"});
    }

    if(! location){
        return res.status(400).json({message:"Provide a location to change"})
    }

    jobCheck = await jobs.findOne({
        _id:job_id,
        createdBy:req.user.id
    })
    if(!jobCheck){
        return res.status(400).json({message: "Invalid job id or job not created by employee"})
    }

    jobCheck.location=location;
    await jobCheck.save();
    return res.status(200).json({message:` Location changed to "${location}" successfully `})
} catch(err){
    return res.status(400).json({message: err})
}

});

router.post('/updateSalary/:job_id',verifyToken,async(req,res)=>{
    const {job_id}=req.params;
    const {salary}=req.body;

    try{

     if (req.user.type !== "employee") {
    return res.status(403).json({ message: "Only employees can update jobs" });
  }
    
    const employeeCheck= await employee.findById(req.user.id);

    console.log(`Employee check : ${employeeCheck}`);

    if(employeeCheck){
    } else{
       return res.status(400).json({message:"Please log in to update a job"});
    }

    if(!salary){
        return res.status(400).json({message:"Provide a salary to change"})
    }

    jobCheck = await jobs.findOne({
        _id:job_id,
        createdBy:req.user.id
    })
    if(!jobCheck){
        return res.status(400).json({message: "Invalid job id or job not created by employee"})
    }

    jobCheck.salary=salary;
    await jobCheck.save();
    return res.status(200).json({message:` Salary changed to "${salary}" successfully `})
} catch(err){
    return res.status(400).json({message: err})
}

});

router.post('/updateDeadlines/:job_id',verifyToken,async(req,res)=>{
    const {job_id}=req.params;
    const {deadlines}=req.body;

    try{

     if (req.user.type !== "employee") {
    return res.status(403).json({ message: "Only employees can update jobs" });
  }
    
    const employeeCheck= await employee.findById(req.user.id);

    console.log(`Employee check : ${employeeCheck}`);

    if(employeeCheck){
    } else{
       return res.status(400).json({message:"Please log in to update a job"});
    }

    if(!deadlines){
        return res.status(400).json({message:"Provide a deadline to change"})
    }

    jobCheck = await jobs.findOne({
        _id:job_id,
        createdBy:req.user.id
    })
    if(!jobCheck){
        return res.status(400).json({message: "Invalid job id or job not created by employee"})
    }

    jobCheck.deadlines=deadlines;
    await jobCheck.save();
    return res.status(200).json({message:` Deadline changed to "${deadlines}" successfully `})
} catch(err){
    return res.status(400).json({message: err})
}

});

router.delete('/deleteJob/:job_id',verifyToken,async(req,res)=>{
    const {job_id}=req.params;

    if(req.user.type != 'employee'){
        return res.status(400).json({message :"Employees can only delete jobs"})
    };

    const jobCheck= await jobs.findOneAndDelete({
        _id: job_id,
        createdBy:req.user.id})

         if(!jobCheck){
        return res.status(400).json({message: "Unable to delete job"})
    }
    return res.status(200).json('Job deleted successfully');
});

 router.get('/viewApplications/:job_id', verifyToken, async (req, res) => {
  const { job_id } = req.params;

  if (req.user.type !== 'employee') {
    return res.status(403).json({ message: 'Only employees can view applications.' });
  }

  try {
    const job = await jobs.findOne({ _id: job_id, createdBy: req.user.id });
    if (!job) {
      return res.status(404).json({ message: 'Job not found or not posted by this employer.' });
    }

    const applications = await application.find({ job_id });

    const modifiedApps = applications.map(app => {
      return {
        ...app._doc,
        resumeUrl: `${req.protocol}://${req.get('host')}/resumes/${path.basename(app.resume)}`
      };
    });

    return res.status(200).json(modifiedApps);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});
  

module.exports=router;