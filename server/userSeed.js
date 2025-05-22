import User from './models/User.js'
import bcrypt from 'bcrypt'
import connectToDatabase from './db/db.js'
const userRegister = async () => {
    connectToDatabase()
    try {
        const hashPassword = await bcrypt.hash("admin", 10)
        const newUser = new User({
            name: "Super Admin",
            email: "superadmin@gmail.com",
            password: hashPassword,
            role: "superadmin"
        })
        await newUser.save()
    } catch(error){
        console.log(error)
    }
}

userRegister();
