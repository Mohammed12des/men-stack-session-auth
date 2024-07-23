const express = require('express');
const router = express.Router();

router.get('sing-up',(req,res,next)=>{
    res.render('sign-up.ejs');
})

module.exports=router;