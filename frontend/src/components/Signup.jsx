import { Link, useNavigate } from 'react-router-dom'
import '../styles/signup.css'
import { useState } from 'react'

const Signup = () => {
    const navigate = useNavigate()
    const[name, setName] = useState("")
    const[email, setEmail] =useState("")
    const[password, setPassword] = useState("")
    const[userInfo, setUserInfo] = useState({})
    const handleSubmit = async()=>{
        const updatedUserInfo = {...userInfo, name:name, email:email, password:password}
        const response = await fetch(`${import.meta.env.VITE_API_URL}/user`,{
            method : 'POST',
            headers:{
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(updatedUserInfo)
        });
        const result = await response.json()
        if(result.success){
            console.log(result.data)
            navigate('/login')
        }
    }
    

  return (
    <div className='signup-box'>
        <input placeholder='write your name' className='signup-items' value={name} onChange={(e)=>setName(e.target.value)}/>
        
        <input placeholder='write your email' className='signup-items' value={email} onChange={(e)=>setEmail(e.target.value)}/>
        
        <input placeholder='password' className='signup-items' value={password} onChange={(e)=>setPassword(e.target.value)}/>
        
        <button className='signup-items' onClick={handleSubmit}>Submit</button>

        <p>Already have an account ? <span><Link to='/login'>Login</Link></span></p>
    </div>
  )
}

export default Signup