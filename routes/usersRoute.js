const router=require('express').Router();
const User=require('../models/userModel');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const authMiddleware = require('../../client/src/middleWares/authMiddleware');

router.post('/register',async(req,res)=>{
    try {
        const firstName=req.body.firstName;
        const lastName=req.body.lastName;
        const email=req.body.email;
        const password=req.body.password;

        //Checking empty fields 
        if(firstName =='' || lastName =='' || email =='' || password ==''){
            throw new Error(`Please provide empty fields !`);
        }else{
            throw new Error(`Please provide empty fields !`);
        }

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

router.get('/logged-in-user',authMiddleware,async(req,res)=>{
    try {
        const user=await user.findOne({_id:req.body.userId})
         //Ignore the password
         user.password=undefined;
         res.send({
            success:true,
            data:user,
            message:'User found'
         })
    } catch (error) {
        throw Error(error.message)
    }
})

module.exports=router