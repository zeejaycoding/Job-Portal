const mongoose= require ('mongoose');

const connection=async ()=>{
try{
    const connect= await mongoose.connect(process.env.MONGO_URI);
    console.log('Mongo DB connected successfully');

} catch(err){
    console.log(err);
}
}

module.exports= connection;