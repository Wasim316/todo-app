import {  useState } from 'react'
import '../styles/edit.css'

const Edit = ({item, editData, fetchTodos, editId}) => {
    console.log(item)
    const[inpValue, setInpValue] = useState(item.title)
    const[descipValue, setDescripValue] = useState(item.description)
    const [finalEdit, setFinalEdit] = useState({})
    const handleAdd = async(id)=>{
        const editedData = {...finalEdit,id:item.id, inpValue, descipValue,textBol:item.textBol}
        const response = await fetch(`${import.meta.env.VITE_API_URL}/todos/${id}`,{
            method : 'PATCH',
            credentials: "include",
            headers : {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(editedData)
        });
        const result = await response.json()
        if(result.success){
            fetchTodos()
            setFinalEdit(editedData)
            editData(editedData)
            editId(null)
        }
        
    }

    const handleCancel = ()=>{
        editId(null)
    }


    console.log(finalEdit)
  return (
    <div className='edit-box'>
        <input className='input-box' value={inpValue} onChange={(e)=>setInpValue(e.target.value)}></input>
        <textarea className='description-box' value={descipValue} onChange={(e)=>setDescripValue(e.target.value)}></textarea>
        <button onClick={()=>handleAdd(item.id)}>add</button>
        <button onClick={handleCancel}>cancel</button>
    </div>
  )
}

export default Edit