import { useState } from 'react'
import '../styles/body.css'
import Todo from './Todo.jsx'
import { v4 as uuidv4 } from 'uuid';

const Body = () => {
    const[titleInfo, setTitleInfo] = useState("");
    const[descriptionInfo, setDescriptionInfo] = useState("");
    const[itemInfo, setItemInfo] = useState([]);

    const userName = (localStorage.getItem('name'))

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
            setTitleInfo("")
            setDescriptionInfo("")
        }
    }
    
  return (
    <div className="body-box">
        <h2>Hello, {userName}</h2>
        <div className='add-todo'>
            <input placeholder='write your todo'value={titleInfo} onChange={(e)=>setTitleInfo(e.target.value)}/>
            <textarea placeholder='write description for your todo' value={descriptionInfo} onChange={(e)=>setDescriptionInfo(e.target.value)}></textarea>
            <button onClick={handleAddItem}>add</button>
        </div>

        <Todo itemsInfo = {itemInfo}/>
    </div>
  )
}

export default Body