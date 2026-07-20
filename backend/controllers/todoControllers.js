const mongoos = require('mongoose')
const Todo = require('../models/todo')

const postData = async(req,res)=>{
    try{
        const newTodo = await Todo.insertOne({
            id : req.body.id,
            title : req.body.title,
            description : req.body.description,
            textBol : req.body.textBol,
            userId: req.user.id
        });
        res.send({success : true, todo : newTodo})
    }catch(err){
        console.log('data not inserted : ',err)
    } 
}

const getAllData = async(req,res)=>{
    try{
        console.log(req.user)
        const data = await Todo.find({userId:req.user.id})
        res.json({success:true, data:data})
    }catch(err){
        console.log(err)
    }
    
}

const deleteOneData = async(req,res)=>{
    try{
        await Todo.findOneAndDelete(req.params.id)
        res.json({success:true})
    }catch(error){
        console.log(error)
    }
}

const patchData = async(req,res)=>{
    console.log(req.body)
    console.log(req.body.id)
    console.log(req.body.params)
    try{
        const updatedTodo = await Todo.findOneAndUpdate(
            {id : req.body.id},
            {title : req.body.inpValue,
            description : req.body.descipValue}
        )
        res.json({success:true})
    }catch(error){
        console.log(error)
    }
}

module.exports = {
    postData,
    getAllData,
    deleteOneData,
    patchData
}