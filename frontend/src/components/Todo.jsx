import { useEffect } from "react";
import "../styles/todo.css";
import { useState } from "react";
import Edit from "./Edit";
import { Fragment } from "react";

const Todo = ({itemsInfo}) => {
  const [itemInfo, setItemInfo] = useState([]);
  const [editId, setEditId] = useState(null);

  const fetchTodos = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/todos`,{
      credentials: "include",
      headers:{
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
    //
    //
    //
    const result = await response.json();
    if (result.success) {
      setItemInfo(result.data);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [itemsInfo]);

  const handleDelete = async(id)=>{
    const response = await fetch(`${import.meta.env.VITE_API_URL}/todos/${id}`,{
      credentials: "include",
      method : 'DELETE',
      headers:{
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
    const result = await response.json();
    if(result.success){
      const updatedItems = itemInfo.filter((item)=>item.id !== id)
      setItemInfo([...updatedItems])
    }
  }

  const handleEdit = (id)=>{
    setEditId(id)
  }

  const onEditId = (a)=>{
    setEditId(a)
  }

  
  const onEditData = (obj)=>{
      console.log(obj)
      setItemInfo(prev => prev.map(item=> item.id === obj.id ?  { ...item, ...obj }: item))
      
  }

  const handleDone = (id)=>{
    setItemInfo(prev => prev.map(item=> item.id === id ?  { ...item, textBol: !item.textBol }: item))
      }
  console.log(itemInfo)

  return (
    <div>
      <div className="todo-box">
        <h3 className="input-box">title</h3>
        <h3 className="description-box">Description</h3>
        <h3 className="button-box">action</h3>
      </div>

      {itemInfo.map((item) => {
        return (
          <Fragment key={item.id}>
            <div className="todo-box" style={{backgroundColor:item.textBol?"#00ffff":'transparent'}}>
              {/* <div className="todo-box" key={item.id}> */}
              <p className="input-box">{item.title}</p>
              <p className="description-box">{item.description}</p>
              <div className="button-box">
              
                {!item.textBol && <button className="edit-btn" onClick={()=>{handleEdit(item.id)}}>edit</button>}
                <button className="done-btn" onClick={()=>handleDone(item.id)}>{!item.textBol? "done" : "not done" }</button>
                {!item.textBol && <button className="delete-btn" onClick={()=>handleDelete(item.id)}>delete</button>}
              
              </div>

            </div>
            <div>
              {editId === item.id && (
                    <Edit item={item} editData={onEditData} fetchTodos={fetchTodos} editId={onEditId}/>
                    )}
            </div>
          </Fragment>
        );
      })}
    </div>
  );
};

export default Todo;
