import User from "../models/user.model.js";    
import Message  from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js";




export const getUsers = async(req,res)=>{
    try {
        const loggedInUser = req.user._id;
        const filterUsers=  await User.find({_id :{$ne : loggedInUser}}).select("-password")

        res.status(200).json(filterUsers)
        
    } catch (error) {
        console.log("erorr fetching the  users",error)
        return res.status(500).json({message:"internal server error"})
        
    }
}

export const getMessages = async(req,res)=>{
    try {
        const {id: userToChatId} = req.params
        const senderId = req.user._id

        const messages = await Message.find({
            $or:[
                {senderId : senderId,recieverId:userToChatId},
                {senderId : userToChatId,recieverId: senderId},
            ]
        })
        return res.status(200).json(message)
        
    } catch (error) {
            console.log("erorr fetching the messsage of users",error)
        return res.status(500).json({message:"internal server error"})
    }
}

export const sendMessage = async(req,res)=>{
    try {
        const {text,image} = req.body;
        const {id: recieverId}= req.params
        const senderId = req.user._id
        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url
        }

        const newMessage=  new Message({
            senderId,
            recieverId,
            text,
            image:imageUrl
        }) 
        await newMessage.save()

        res.status(201).json(newMessage)
        
    } catch (error) {
           console.log("erorr while sending the  messsage ",error)
        return res.status(500).json({message:"internal server error"})
    }
}