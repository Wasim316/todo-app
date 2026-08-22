import { useState } from 'react'
import '../styles/body.css'
import Todo from './Todo.jsx'
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify'

const Body = () => {
    const[titleInfo, setTitleInfo] = useState("");
    const[descriptionInfo, setDescriptionInfo] = useState("");
    const[itemInfo, setItemInfo] = useState([]);
    const[check, setCheck] = useState(false)
    const[refresh, setRefresh] = useState(1)
 
// ai agent
    const[textareaInfo, setTextareaInfo] = useState('')

    const userName = (localStorage.getItem('name'))

// ai agent
    const handleSubmit = async()=>{
        setCheck(true)
        const itemsUpdated = {id:uuidv4(), textareaInfo:textareaInfo, textBol: false}
        const response = await fetch(`${import.meta.env.VITE_API_URL}/agent`,{
            method:'POST',
            credentials:'include',
            headers:{
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify(itemsUpdated)
        })
        const result = await response.json()
        // console.log(result)
        if(result.success){
            toast.success(result.message)
            setRefresh(refresh+1)
            setCheck(false)
            setTextareaInfo("")
        }
        
    }
// ai agent //

    const handleAddItem = async()=>{
        const itemsUpdated = {id:uuidv4(), title:titleInfo, description:descriptionInfo, textBol: false}
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/todos`,{
            method : 'POST',
            credentials: "include",
            headers :{
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(itemsUpdated)
        });
        const result = await response.json()
        if(result.success){
            setItemInfo([...itemInfo,itemsUpdated])
            toast.success(result.message)
            setTitleInfo("")
            setDescriptionInfo("")
        }
    }
    
  return (
    <div className="body-box">
        <h2>Hello, <span>{userName}😎</span></h2>
        <div className='agent'>
            <textarea className='textarea-agent' rows={5} placeholder='You can Create task and description here!! eg:- I have to go to gym at 7 pm and also Delete your todo from here!! eg: delete <todo name>' value={textareaInfo} onChange={(e)=>setTextareaInfo(e.target.value)}></textarea>
            <button className='textarea-button' onClick={handleSubmit}>{check ? "submitting...." : "submit"}</button>
        </div>
        <div className='add-todo'>
            <input placeholder='write your todo'value={titleInfo} onChange={(e)=>setTitleInfo(e.target.value)}/>
            <textarea placeholder='write description for your todo' value={descriptionInfo} onChange={(e)=>setDescriptionInfo(e.target.value)}></textarea>
            <button onClick={handleAddItem}>add</button>
        </div>

        <Todo itemsInfo = {itemInfo} refresh={refresh}/>
    </div>
  )
}

export default Body