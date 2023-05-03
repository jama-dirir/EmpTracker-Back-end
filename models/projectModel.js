const mongoose=require('mongoose');

const memberSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId
    },
    role:{
        type:String,
        ref:'users',
        required:true
    }
})

const projectSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true,
        default:'active'
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        require:true
    },
    members:[memberSchema],
},{timestamps:true})

module.exports=mongoose.model('projects',projectSchema)