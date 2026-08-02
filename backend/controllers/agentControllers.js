// for ai agent

const mongoose = require('mongoose')

const { GoogleGenAI } =require('@google/genai');
const Todo = require('../models/todo');

let genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});
// console.log(process.env.GEMINI_API_KEY)


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


async function deleteData({title}){
    console.log(title)
    try{
        const deleteTodo = await Todo.findOneAndDelete({title : title})
        console.log("deleteTodo",deleteTodo)
        
    }catch(error){
        console.log(error)
    }
}

const deleteDataDeclaration = {
   
    name : "deleteData",
    description : 'Get title, description',
    parameters : {
        type : 'object',
        properties : {
            title : {
                type : 'string',
                description : 'It will be TITLE that will be formed from the input coming from textareaInfo written after delete or Delete word'
            },
            // description:{
            //     type : 'string',
            //     description : 'It will be DESCRIPTION that will be formed from the input coming from textareaInfo'
            // }
        },
        required : ['title']
    }
}

const postingDataDeclaration = {
    
    name : 'postingData',
    description : 'Get id, title, description, textBol, userId',
    parameters : {
        type : 'object',
        properties : {
            id : {
                type : 'string',
                description : 'It will be id generated automatically from frontend'
            },
            title :{
                type : 'string',
                description : 'It will be TITLE that will be formed from the input coming from textareaInfo'
            },
            description:{
                type : 'string',
                description : 'It will be DESCRIPTION that will be formed from the input coming from textareaInfo'
            },
            textBol:{
                type : 'boolean',
                description : 'It will be the Boolean value coming from textBol'
            },
            userId:{
                type : 'string',
                description : 'It will be string value comming from userId'
            }
        },
        required:['id', 'title', 'description', 'textBol', 'userId']
    }
}

const availableTools = {postingData:postingData, deleteData:deleteData}



async function agentRun(id, textareaInfo,textBol, userId){
    const History = []
    console.log("agent started")
    console.log(id, textareaInfo,textBol, userId)
    History.push({
        role: 'user',
        parts :[{
        text: JSON.stringify({
            id,
            textBol,
            content: textareaInfo,
            userId
        })
    }]
    //      [{text : `
    //   id: ${id}
    //   textBol: ${textBol}
    //   content: ${textareaInfo}
    //   userId: ${userId}
    // `}]
    })
    console.log("before gemini")
    try{
    const response = await genAI.models.generateContent({
        model : 'gemini-3.5-flash-lite',
        // model: "gemini-2.5-flash",
        contents : History,
        config: {
            systemInstruction :  `
You are a todo assistant.

Rules:
- If the user wants to create, add, save, or insert a todo, call postingData.
- If the user wants to delete, remove, or erase a todo, call deleteData.
- Never answer with plain text when a function should be called.
- Extract title and description from the  content field.
- Pass id, userId, and textBol exactly as received.
- Do not invent values.
`
        ,
        
        tools : [{
            functionDeclarations : [postingDataDeclaration, deleteDataDeclaration]
        }]
    }
    })
    console.log("after gemini")
    console.log("object stated")
    console.log("candidate: ",response.candidates[0].content)
    console.log("function calls",response.functionCalls)
    console.log("text",response.text)

    
    if(response.functionCalls?.length > 0){
        console.log(response.functionCalls);
        // const { name, args } = response.functionCalls[0]
        // const result = await availableTools[name](args)
        //  await availableTools[name](args)

        for (const call of response.functionCalls) {
                const { name, args } = call;

                const result = await availableTools[name](args);

                const functionResponse = {
            name : name,
            response : {
                result : result
            }
        }

        History.push({
            role : 'model',
            parts : [{functionCall : response.functionCalls}]
        })

        History.push({
            role : 'user',
            parts : [{functionResponse}]
        })


            }

        // const functionResponse = {
        //     name : name,
        //     response : {
        //         result : result
        //     }
        // }

        // History.push({
        //     role : 'model',
        //     parts : [{functionCall : response.functionCalls[0]}]
        // })

        // History.push({
        //     role : 'user',
        //     parts : [{functionResponse}]
        // })
    }
    else{
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
    return {
    success: true
};
    }catch(err){console.log(err)}
}

const postData = async(req,res)=>{
    try{
        console.log("req body: ",req.body)
        console.log("req user",req.user);
        const userId = req.user.id;
        const {id, textareaInfo,textBol} = req.body
        const result = await agentRun(id, textareaInfo,textBol, userId)
        // console.log("postData",result)
        res.json(result)
    }catch(err){
        console.log('data not inserted : ',err)
    } 
}

module.exports = {postData,}