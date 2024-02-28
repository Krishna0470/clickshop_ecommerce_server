const express =require('express');
const app = express();
let dotevn = require('dotenv');
const cors = require('cors')
const authRoutes = require('./routes/authRoutes');
const  connect  = require('./db/config/config');
dotevn.config();




const port = process.env.PORT


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended:false}))
app.use(authRoutes);


app.get('/',(req,res)=>{
    res.status(200).send('Test API')
});

connect()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error('Error connecting to the database:', err);
    });