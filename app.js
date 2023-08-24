require('dotenv').config()
const express = require('express');

const {dbConnect}=require('./db/connect')
const userRoutes=require('./routes/userRoutes')
const cookieParser=require('cookie-parser')
const {requireAuth}=require('./middleware/authMiddleware')

const app = express();

const port=process.env.PORT||3000;
// middleware
app.use(express.static('public'));
app.use(express.json())
app.use(cookieParser())

// view engine
app.set('view engine', 'ejs');

// database connection


  const start=async()=>{
    try {
      await dbConnect(process.env.MONGO_URI)
      app.listen(port,()=>console.log(`Server listening to port ${port}`));

    } catch (error) {
      console.log(error)
    }
  }
  start()
// routes
app.get('/', requireAuth,(req, res) => res.render('home'));
app.get('/smoothies',requireAuth,(req, res) => res.render('smoothies'));


app.use(userRoutes);

