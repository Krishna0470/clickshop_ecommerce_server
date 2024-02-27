const express =require('express');
const app = express();
let dotevn = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const  connect  = require('./db/config/config');
dotevn.config();

const port = process.env.PORT

app.get('/',(req,res)=>{
    res.status(200).send('Test API')
});
app.use(express.json());
app.use(authRoutes)

connect();
app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
});