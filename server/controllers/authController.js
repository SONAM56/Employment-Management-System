import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import moment from 'moment-timezone';
import ActivityLog from '../models/ActivityLog.js';
import Config from '../models/Config.js';

// gygb svwx lbeg mfrm

import nodemailer from 'nodemailer'

const transport = nodemailer.createTransport({
    host:'smtp.gmail.com',
    port:587,
    secure:false,
    auth:{
        user:"codewithsagar7@gmail.com",
        pass: "gygb svwx lbeg mfrm"
    }
})

const login = async (req, res) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if (!user){
            return res.status(404).json({success: false, error: "User not found"})
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){ 
            return res.status(404).json({success: false, error: "Wrong Password"})
        }
        
        // // Define Nepal Standard Time (NST) as the local time zone
        // const localTimeZone = "Asia/Kathmandu"; // Nepal's time zone
        // const currentLocalTime = moment().tz(localTimeZone);
        // const currentHour = currentLocalTime.hour();
        // const currentMinutes = currentLocalTime.minutes();

        // if (user.role !== 'admin') {
        //     const config = await Config.findOne(); 
        //     const startHour = config?.startHour || 10; 
        //     const endHour = config?.endHour || 17; 

        //     if (currentHour < startHour || (currentHour === endHour && currentMinutes > 0) || currentHour >= endHour) {
        //         return res.status(403).json({ 
        //             success: false, 
        //             error: `Login allowed only between ${startHour}:00 AM and 5:00 PM in Office time` 
        //         });
        //     }
        //     // Check for duplicate login on the same day
        //     const startOfDay = currentLocalTime.clone().startOf("day").toDate();
        //     const endOfDay = currentLocalTime.clone().endOf("day").toDate();
    
        //     const existingLog = await ActivityLog.findOne({
        //         employeeName: user.name,
        //         dayOfLog: { $gte: startOfDay, $lte: endOfDay },
        //     });
    
        //     if (existingLog) {
        //         return res.status(403).json({ success: false, error: "You have already logged in today" });
        //     }
        // }


        const token = jwt.sign({_id: user._id, role: user.role}, 
            process.env.JWT_KEY, {expiresIn: "10d"}
        )
        return res.status(200).json({success: true, token,user: {_id: user._id, name: user.name, role: user.role}});
    } catch(error){
        return res.status(500).json({success: false, error: error.message})
    }
};
const verify = (req,res) =>{
    return res.status(200).json({success: true, user: req.user})
}




const generateCode = ()=>{
    const newCode = Math.floor(1000 + Math.random() * 9000)
    return newCode
}


let userCode = generateCode()
let userEmail = ''



const sendCodeToEmail = async (req,res)=>{
    try {
        const { email } = req.body
        if(!email){
            return res.status(400).json({
                success:false,
                message:"Enter a email address"
            })
        }
       const generatedcode = userCode
       

        const mailOption = {
            from: 'codewithsagar7@gmail.com',
            to:email,
            subject:"Forgot password code",
            text: `Your password reset code is ${generatedcode}`
        }
        userEmail = email
        transport.sendMail(mailOption,function(error,info){
            if(error){
                console.log('Error sending an email: ',error)
            }else{
                console.log('Email sent',info.response)
            }
        })
        return res.status(200).json({
            success:true,
            message:"Send successfully"
        })
    } catch (error) {
        return res.status(500).json({success: false, message:error.message})
    }
}


const verfiyCode = async (req,res)=>{
    try {
        const { code } = req.body
        console.log(code)
        console.log(userCode)
        console.log(userEmail)
        if(parseInt(code) === userCode){
            return res.status(200).json({
                success:true,
                message:"Code verified successfully"
            })
        }
        return res.status(400).json({
            success:false,
            message:"Code not verified"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

const changePassword = async (req,res)=>{
    try {
        const {newPassword} =req.body
        const user = await User.findOne({
            email:userEmail
        })

        if(!user){
            return res.status(400).json({
                success:false,
                message:"No user found"
            })
        }

        const hashedPassowrd = await bcrypt.hash(newPassword,10)
        user.password= hashedPassowrd
        await user.save()


        return res.status(200).json({
            success:true,
            message: "Password changes successfully"
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}





export {login, verify, sendCodeToEmail, verfiyCode, changePassword}