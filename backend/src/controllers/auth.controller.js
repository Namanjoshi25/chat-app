import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import {generateToken }from '../lib/utils.js'
import cloudinary from '../lib/cloudinary.js'
export const signup = async (req,res)=>{
    const  {fullName,email,password} = req.body
    try {
        if(password.length < 6){
            return res.status(400).json("Password should be more than 6")
        }
        if(!fullName || !email || !password) res.status(400).json({message:"All fields are required"})
        const user = await User.findOne({email})
        if(user) return res.status(401).json("User already exists")
         const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const newUser = new User({
         fullName,
         email,
         password:hashedPassword 
        })
        if(newUser){
            generateToken(newUser._id,res)
            await newUser.save()
        }
        res.status(200).json({_id : newUser._id,fullName : newUser.fullName,email : newUser.email,profilePic : newUser.profilePic})
    } catch (error) {
       res.status(500).json({message:"Error in user signup"})
    }
}
export const login = async(req,res)=>{
    const {email,password} = req.body;
    try {
        const user = await User.findOne({email})
        if(!user)return res.status(400).json({message:"User does not exits"})

            const isPasswordCorrect = await bcrypt.compare(password ,user.password)
            if(!isPasswordCorrect)return res.status(400).json({message:"Invalid credentails"})


                generateToken(user._id,res)
                  res.status(200).json
                  ({_id : newUser._id,
                    fullName : newUser.fullName,
                    email : newUser.email,
                    profilePic : newUser.profilePic
                })
    } catch (error) {
               res.status(500).json({message:"Error in user login"})

    }

}
export const logout = (req,res)=>{
    try {
        res.cookie("token","",{
            maxAge:0
        })
        res.status(200).json({message: "User logout"})
    } catch (error) {
                       res.status(500).json({message:"Error in user logout"})

    }

}

export const updateProfile = async(req,res)=>{
const profilePic = req.file;

try {
    const userId = req.user._id
    if(!profilePic) return res.status(400).json({message:"Profile pic required  "})
            const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        const uploadResponse = await cloudinary.uploader.upload(base64Image)
    const updatedUser  = await User.findByIdAndUpdate(
        userId,
        {profilePic : uploadResponse.secure_url},
        {new :true}
    )
    res.status(200).json(updatedUser)
} catch (error) {
    console.log("error in updating user profile pic",error);
    return res.status(500).json({message: "internal server error"})
}
}


export const checkAuth = async(req,res)=>{
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log("error in checking the auth of user",error);
        res.status(500).json({message:"internal server error"})
    }
}