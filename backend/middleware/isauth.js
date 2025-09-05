const jwt = require('jsonwebtoken')
const User = require('../model/User')


const isauth = async(req,res,next) => {
    try {
        
        const token = req.headers.token;
        if(!token){
            return res.status(403).json({message:"please login to access"})
        }

        // decoded jwt signed

        const decodedData = jwt.verify(token,process.env.JWT_SECRET)
        req.user = await User.findById(decodedData._id);
        console.log(req.user)
        next()
    } catch (error) {   
        return res.status(403).json({message:"please login to access"})
    }
}

module.exports = { isauth }