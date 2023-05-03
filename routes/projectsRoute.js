const router=require('express').Router();
const authMiddleware=require("../middleWares/authMiddleware")
const Project=require('../models/projectModel')



router.post('/create-project',authMiddleware,async(req,res)=>{
    try {
        const newProject=new Project(req.body);
        await newProject.save();
        res.send({
            success:true,
            data:newProject,
            message:'project created successfully'
        })

    } catch (error) {
        res.send({
            success:false,
            message:error.message
        })
    }
})

router.post('/get-all-projects',authMiddleware,async(req,res)=>{
    try {
        const filters=req.body.filters;
        const projects=await Project.find(filters || {}).sort({createdAt:-1});
        if(!projects){
            throw new Error('Project not found')
        }
        res.send({
            success:true,
            data:projects,
        })
    } catch (error) {
        res.send({
            success:false,
            message:error.message
        })
    }
})

router.post('/edit-project',authMiddleware,async(req,res)=>{
    try {
        await Project.findByIdAndUpdate(req.body._id,req.body)
        res.send({
            success:true,
            message:'project updated successfully'
        })
    } catch (error) {
      res.send({
        success:false,
        message:error.message
      })
    }
})


router.post('/delete-project',authMiddleware,async(req,res)=>{
    try {
        await Project.findByIdAndDelete(req.body._id)
        res.send({
            success:true,
            message:'project deleted successfully'
        })
    } catch (error) {
      res.send({
        success:false,
        message:error.message
      })
    }
})


module.exports=router