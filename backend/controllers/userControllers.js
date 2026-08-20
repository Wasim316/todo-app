const mongoos = require('mongoose')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { userSchemaValidation } = require('../middlewares/userValidation')

const signup = async(req,res)=>{
    try{
        //Validate request body
        const {error, value} = userSchemaValidation.validate(req.body)

        if(error){
            res.status(400).json({
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
            res.send(200).json({success: true, data:newUserInserted, message: "Sign up success"})
        }else{
            res.status(409).json({success:false, message:"User already exists"})
        }
        
    }catch(err){
        // console.log('data not inserted : ',err)
        res.send(500).json({success:false, message: "Internal server error"})
    } 
}

const login =async(req,res)=>{
    try{
        const user = await User.findOne({email: req.body.email, password: req.body.password})
        if(!user){
            res.json("please check email or password")
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
        res.json({success:true, name:user.name, id: user._id, jwtToken})

    }catch(err){
        console.log(err)
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
        res.json({success:true})

    }catch(err){
        console.log(err)
    }
}

module.exports = {
    signup,
    login,
    logout
}