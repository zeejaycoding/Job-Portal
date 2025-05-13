const express=require('express')
const mongo=require('./mongoConnection');
const dotenv= require('dotenv').config()
const userController=require('./controller/userController');

mongo();
app=express();

app.use(express.json());

app.use('/',userController);

port=process.env.PORT || 8000


app.listen(port,()=> {
    console.log(`listening on port ${port}`)
} )