// for ai agent

const mongoose = require('mongoose')

const { GoogleGenAI } =require('@google/genai');
const Todo = require('../models/todo');

let genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

async function postingData({id, title, description, textBol, userId}){
    const newTodo = await Todo.create({
            id : id,
            title : title,
            description : description,
            textBol : textBol,
            userId: userId
        });
        console.log(newTodo)
}

const postingDataDeclaration = {
    name : 'postingData',
    description : 'Get id, title, description, textBol, userId',
    parameters : {
        type : 'OBJECT',
        properties : {
            id : {
                type : 'STRING',
                description : 'It will be id generated automatically from frontend'
            },
            title :{
                type : 'STRING',
                description : 'It will be TITLE that will be formed from the input coming from textareaInfo'
            },
            description:{
                type : 'STRING',
                description : 'It will be DESCRIPTION that will be formed from the input coming from textareaInfo'
            },
            textBol:{
                type : 'BOOLEAN',
                description : 'It will be the Boolean value coming from textBol'
            },
            userId:{
                type : 'STRING',
                description : 'It will be string value comming from userId'
            }
        },
        required:['id', 'title', 'description', 'textBol', 'userId']
    }
}

const availableTools = {postingData:postingData}
const History = []

async function agentRun(id, textareaInfo,textBol, userId){
    console.log("agent started")
    console.log(id, textareaInfo,textBol, userId)
    History.push({
        role: 'user',
        parts : [{text : `
      id: ${id}
      textBol: ${textBol}
      content: ${textareaInfo}
      userId: ${userId}
    `}]
    })
    const response = await genAI.models.generateContent({
        model : 'gemini-3.5-flash-lite',
        contents : History,
        config: {
            systemInstruction :  `
You must ALWAYS call the postingData function if needed.
Extract title and description from content.
Pass id, userId and textBol exactly as provided.
Do not answer any random question.
`
        ,
        
        tools : [{
            functionDeclarations : [postingDataDeclaration]
        }]
    }
    })
    console.log("object stated")
    console.log("candidate: ",response.candidates[0].content)
    console.log("function calls",response.functionCalls)
    console.log("text",response.text)
    
    if(response.functionCalls?.length > 0){
        console.log(response.functionCalls);
        const { name, args } = response.functionCalls[0]
        const result = await availableTools[name](args)

        const functionResponse = {
            name : name,
            response : {
                result : result
            }
        }

        History.push({
            role : 'model',
            parts : [{functionCall : response.functionCalls[0]}]
        })

        History.push({
            role : 'user',
            parts : [{functionResponse}]
        })
    }else{
        History.push({
            role : 'model',
            parts : [{text : `
      id: ${id}
      textBol: ${textBol}
      content: ${textareaInfo}
      userId: ${userId}
    `}]
        })
    }
    console.log(response.text)
}

const postData = async(req,res)=>{
    try{
        console.log("req body: ",req.body)
        console.log("req user",req.user);
        const userId = req.user.id;
        const {id, textareaInfo,textBol} = req.body
        await agentRun(id, textareaInfo,textBol, userId)
    }catch(err){
        console.log('data not inserted : ',err)
    } 
}

module.exports = {postData,}