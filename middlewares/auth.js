

exports.isAdmin = (req,res,next)=>{
    try {
        const {username,password} = req.cookies;
        // console.log(username);
        if(!username || !password){
            return res.redirect('/')
        }
        next();
    } catch (err) {
        res.json({
            success:false,
            message:err.message 
        })
    }
}