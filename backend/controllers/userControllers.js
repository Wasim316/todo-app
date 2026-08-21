const mongoos = require('mongoose')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { userSchemaValidation } = require('../middlewares/userValidation')
const { userLoginValidation } = require('../middlewares/userValidation')

const signup = async(req,res)=>{
    try{
        //Validate request body
        const {error, value} = userSchemaValidation.validate(req.body)

        if(error){
            return res.status(400).json({
                success: false, message: error.details[0].message
            })
        }

        //Use the validated/cleaned data
        const {name, email, password} = value

        //Check whether email is already exists

        const newUser = await User.findOne({email});

        //If email not present add the user
        if(!newUser){
            const newUserInserted = await User.insertOne({
                name,
                email,
                password
            })
            // console.log(newUserInserted)
            res.status(200).json({success: true, data:newUserInserted, message: "Sign up success"})
        }else{
            res.status(409).json({success:false, message:"User already exists"})
        }
        
    }catch(err){
        // console.log('data not inserted : ',err)
        res.send(500).json({success:false, message: "Internal server error. Please try again!!"})
        res.status(500).json({success:false, message: "Internal server error"})
    } 
}

const login =async(req,res)=>{
    try{
        const {error, value} = userLoginValidation.validate(req.body)
        if(error){
            res.status(400).json({
                success: false, message: error.details[0].message
            })
        }
        // console.log(value)
        // console.log(error)
        const{email, password} = value
        // const user = await User.findOne({email: req.body.email, password: req.body.password})
        const user = await User.findOne({email})
        // console.log("user",user)
        if(!user){
            // console.log("no user")
            return res.status(400).json({success:false, message:"No User with this email exists. Please signup"})
        }

        if(user && user.password !== password){
            // console.log("wrong password")
            return res.status(400).json({success:false, message:"Wrong password. Try again"})
        }

        const jwtToken = jwt.sign({
            name: user.name,
            email: user.email,
            id: user._id
            },
            process.env.JWT_TOKEN,
            {expiresIn:"24h"}
            ) 
        res.cookie("token", jwtToken,{
            httpOnly : true,
            // sameSite: "lax",
            // secure: false,
            sameSite: "none",
            secure: true,
            maxAge: 24 * 60 * 60 * 1000
        })
        res.status(200).json({success:true, name:user.name, id: user._id, jwtToken, message: "logged in successfully"})

    }catch(err){
        // console.log(err)
        res.status(500).json({success:false, message: "Internal server error. Please try again"})
    }
}

const logout =async(req,res)=>{
    try{ 
        res.clearCookie("token",{
            httpOnly : true,
            // sameSite: "lax",
            // secure: false,
            sameSite: "none",
            secure: true,
        })
        res.status(200).json({success:true, message: "logout"})

    }catch(err){
         res.status(500).json({success:false, message: "Internal server error. Please try again"})
    }
}

module.exports = {
    signup,
    login,
    logout
}