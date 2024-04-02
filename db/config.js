const mongoose = require ('mongoose');
const dotenv = require ('dotenv');



dotenv.config();
 

async function connect () {
    await mongoose.connect(process.env.MONGODB_URL)
    .then((message)=>{
        console.log("Database connection established")
    })
    .catch((error)=>{
        console.log("Database not connected:",error)
    })
}

module.exports= connect;