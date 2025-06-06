import  jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

export const protectRoute = async (req,res,next)=>{
    try {
        const token = req.cookies.token
        if(!token) res.status(400).json({message:"User not authorized"})
            const decodedToken = jwt.verify(token,process.env.JWT_SECRET)
        if(!decodedToken) return res.status(401).json({message:"Invalid token"})

            const user = await User.findById(decodedToken.userId).select("-passoword");

            if(!user) return res.status(404).json({message:"User not found"})
                req.user= user;
            next()
        
    } catch (error) {
        console.log("error while authenicating",error);
        res.status(500).json({message:"Internal Error"})
    }
}