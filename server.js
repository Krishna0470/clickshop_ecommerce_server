const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const product =require('./routes/product')
const imageRoute = require('./routes/image')
const orderRoutes = require('./routes/orderRoutes.js');
const connect = require('./db/config')
const categoryRoutes = require('./routes/category');
let dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');

dotenv.config();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); 
    },
  });

  const upload = multer({ storage: storage });

  app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));



app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(categoryRoutes); 
app.use(authRoutes);
app.use(userRoutes);
app.use(product);
app.use(orderRoutes);
app.use(imageRoute);
app.use('/categories', categoryRoutes);

app.get("/config/paypal", (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});


const port = process.env.PORT;

app.get('/', (req, res) => {
    res.status(200).send('Test API');
});

// app.post('/upload', upload.single('image'), (req, res) => {
  
//   const imageUrl = `http://localhost:4000/uploads/${req.file.filename}`;
//   res.json({ imageUrl });
// });

app.use('/uploads', express.static(path.join(__dirname,'uploads')))

// app.use(express.static(__dirname + "/../client"));

app.use(express.urlencoded({extended : false}));

connect();

app.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
});