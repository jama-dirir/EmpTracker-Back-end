const router=require('express').Router();
const User=require('../models/userModel');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

router.post('/register',async(req,res)=>{
    try {
        //check, if the user already exists
        const userExists=User.findOne({email:req.body.email});
        if(userExists){
            throw new error('User has already exists');
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
         throw new error(`User doesn't exists`)
     }
 
     //Check, if the password is correct
     const correctPassword=await bcrypt.compare(
         req.body.password,
         user.password
     )
 
     if(!correctPassword){
         throw new error(`Invalid password !`)
     }
 
     //Create and assign token 
     const token=await jwt.sign({userId:user._id},process.env.SECRET_TOKEN,{expiresIn:'1d'})
     res.send({
         success:true,
         data:token
     })
     
   } catch (error) {
     res.send({
        success:false,
        message:error.message
     })
   }

})

module.exports=router