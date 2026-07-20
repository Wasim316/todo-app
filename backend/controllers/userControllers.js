const mongoos = require('mongoose')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const signup = async(req,res)=>{
    try{
        // console.log(req.body)
        const newUser = await User.findOne({id:req.body.id});
        if(!newUser){
            const newUserInserted = await User.insertOne({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            })
            console.log(newUserInserted)
            res.json({success: true, data:newUserInserted})
        }else{
            res.json({success:false})
        }
        
    }catch(err){
        console.log('data not inserted : ',err)
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
            sameSite: "lax",
            secure: false,
            // sameSite: "none",
            // secure: true,
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
            sameSite: "lax",
            secure: false,
            // sameSite: "none",
            // secure: true,
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