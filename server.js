const express=require('express');
require('dotenv').config()
require('./config/dbConfig')
const usersRoute=require('./routes/usersRoute')

const app=express();
app.use(express.json())
app.use('/api/users',usersRoute)
const port=process.env.PORT || 5500;


app.listen(port,()=>console.log(`Server listening on port ${port}`));