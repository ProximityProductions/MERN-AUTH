import userModel from "../Models/UserModel.js";

export const getProfile = async (req,res)=>{
    try {
        const {userId} = req.body;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, userData:{
            username:user.username,
            isVerified:user.isVerified,
        } });
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}
