const express =require('express');
const app = express();
let dotevn = require('dotenv');
dotevn.config();

const port = process.env.PORT

app.get('/',(req,res)=>{
    res.send('Test API')
});

//New change
app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
});