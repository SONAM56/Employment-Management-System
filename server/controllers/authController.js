import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import ActivityLog from '../models/ActivityLog.js';
import moment from 'moment-timezone';
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

        // // Apply time restriction only for employees
        // if (user.role !== 'admin') {
        //     const startHour = 10; // 10:00 AM NST
        //     const endHour = 17;  // 5:00 PM NST

        //     if (currentHour < startHour || (currentHour === endHour && currentMinutes > 0) || currentHour >= endHour) {
        //         return res.status(403).json({ 
        //             success: false, 
        //             error: `Login allowed only between ${startHour}:00 AM and ${endHour}:00 PM in local time (${localTimeZone})` 
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
    
        //     // Log the successful login
        //     const log = new ActivityLog({
        //         employeeName: user.name,
        //         loginTime: new Date(),
        //         dayOfLog: startOfDay,
        //     });
        //     await log.save();
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
export {login, verify}