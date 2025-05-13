const express=require('express')
const mongo=require('./mongoConnection');
const dotenv= require('dotenv').config();
const path = require('path');
const userController=require('./controller/userController');
const employeeController=require('./controller/employeeController');
const candidateController=require('./controller/candidateController');
const adminController=require('./controller/adminController');

mongo();
app=express();

app.use(express.json());

app.use('/',userController);
app.use('/employee',employeeController);
app.use('/candidate',candidateController);
app.use('/admin',adminController);
app.use('/resumes', express.static(path.join(__dirname, 'resumes')));


port=process.env.PORT || 8000


app.listen(port,()=> {
    console.log(`listening on port ${port}`)
} )