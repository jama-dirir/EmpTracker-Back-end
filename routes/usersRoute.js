const router=require('express').Router();
const User=require('../models/userModel');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

const authMiddleware = require('../middleWares/authMiddleware');

//Register new user
router.post('/register',async(req,res)=>{
    try {
        //check, if the user already exists
        const userExists=await User.findOne({email:req.body.email});
        if(userExists){
            throw new Error('User has already exists');
        }

        //Hash the password
        const salt=await bcrypt.genSalt(10);
        const hashPassword=await bcrypt.hash(req.body.password,salt)
        req.body.password=hashPassword

        //Save the user
        const user= new User(req.body);
        await user.save()

        res.send({
            success:true,
            message:'User registered successfully.'
        })

    } catch (error) {
        res.send({
            success:false,
            message:error.message
        })
        
    }
})

//Login user
router.post('/login',async(req,res)=>{
   try {
     //check, if the user exists
     const user=await User.findOne({email:req.body.email});
     if(!user){
        throw new Error(`User doesn't exists`)
     }
 
     //Check, if the password is correct
     const correctPassword=await bcrypt.compare(
         req.body.password,
         user.password
     )
 
     if(!correctPassword){
        throw new Error(`Invalid password !`)
     }
 
     //Create and assign token 
     const token=await jwt.sign({userId:user._id},process.env.SECRET_TOKEN,{expiresIn:'1d'})
     res.send({
         success:true,
         data:token,
         message:'Logged successfully'
     })
     
   } catch (error) {
     res.send({
        success:false,
        message:error.message
     })
   }

})

//Get Logged in user
router.get('/logged-in-user',authMiddleware,async(req,res)=>{
    try {
        const user=await User.findOne({_id:req.body.userId})
         //Ignore the password from the user object
         user.password=undefined;

         res.send({
            success:true,
            data:user,
            message:'User found'
         })
    } catch (error) {
        res.send({
        success:false,
        message:error.message
     })
    }
})

module.exports=router