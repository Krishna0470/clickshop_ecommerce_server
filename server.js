const express =require('express');
const app = express();
let dotevn = require('dotenv');
const cors = require('cors')
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const  connect  = require('./db/config/config');
dotevn.config();




const port = process.env.PORT


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended:false}))
app.use(authRoutes);
app.use(userRoutes);


app.get('/',(req,res)=>{
    res.status(200).send('Test API')
});

// app.use(express.static(__dirname + "/../client"));

app.use(express.urlencoded({extended : false}));




connect();

app.listen(port,()=>{
    console.log(`server running at http://localhost:${port}`)
  });
    