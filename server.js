const express=require('express');
require('dotenv').config()
require('./config/dbConfig')
const usersRoute=require('./routes/usersRoute')
const projectsRoute=require('./routes/projectsRoute')

const app=express();
app.use(express.json())
app.use('/api/users',usersRoute)
app.use('/api/projects',projectsRoute)
const port=process.env.PORT || 5500;


app.listen(port,()=>console.log(`Server listening on port ${port}`));