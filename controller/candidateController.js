const express=require('express');
const application=require('../model/applicationModel');
const jwt=require('jsonwebtoken');
const jobs=require('../model/jobModel');
const router=express.Router();
const candidate=require('../model/userModel');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'resumes'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext !== '.pdf') {
    return cb(new Error('Only PDF files are allowed'), false);
  }
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: fileFilter });


const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    console.log(decoded);
    req.user = decoded.user; 
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};



router.get('/veiwJobs', async(req,res)=>{
    try{
        availableJobs=await jobs.find()
        return res.status(200).json(availableJobs);
    } catch(err){
        return res.status(500).json({message: 'server error'})
    }
});

router.post(
  '/applyJob/:job_id',
  verifyToken,
  upload.single('resume'),
  async (req, res) => {
    const { job_id } = req.params;
    const { applicantName, short_message, appliedAt } = req.body;

    if (req.user.type !== 'candidate') {
      return res.status(400).json({ message: 'Only candidates can apply' });
    }

    const checkCandidate = await candidate.findOne({
      _id: req.user.id,
      type: req.user.type
    });

    if (!checkCandidate) {
      return res.status(400).json({ message: 'Login required as candidate' });
    }

    const jobCheck = await jobs.findOne({ _id: job_id });
    if (!jobCheck) {
      return res.status(400).json({ message: 'Invalid job ID' });
    }

    if (!req.file || !applicantName || !short_message || !appliedAt) {
      return res.status(400).json({ message: 'All fields including resume (PDF) required' });
    }

    const newApplication = await application.create({
      applicantName,
      job_id,
      resume: req.file.path, 
      short_message,
      appliedAt
    });

    return res.status(200).json({ message: 'Applied successfully', application: newApplication });
  }
);


module.exports=router;