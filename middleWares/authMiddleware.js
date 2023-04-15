const jwt=require('jsonwebtoken')

module.exports=(req,res,next)=>{
    try {
        const token=req.headers.authorization.split(" ")[1];
        const decryptedToken=jwt.verify(token,process.env.SECRET_TOKEN);
        req.body.userId=decryptedToken.userId;
        next()
    } catch (error) {
       res.send({
        success:false,
        message:'An authorized user'
       })
    }
}