const passUserToView= (req,res,next)=>{
    if(req.session.user){
        res.local.user=req.session.user;
    }
    else{
        res.local.user=null;
    }
    next()
};
module.exports=passUserToView;