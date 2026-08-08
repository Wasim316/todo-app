import { Link, useNavigate } from "react-router-dom"
import '../styles/login.css'
import { useState } from "react"


const Login = () => {
    const navigate = useNavigate()
    const[email, setEmail] = useState("")
    const[password,setPassword] = useState("")
    const[loginInfo, setLoginInfo] = useState({})
    const[login, setLogin] = useState(false)

    const handleLoginSubmit = async()=>{
        setLogin(true)
        const updatedLoginInfo = {...loginInfo, email:email, password: password}
        const response = await fetch(`${import.meta.env.VITE_API_URL}/user/login`,{
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                'Content-Type' : 'application/json'
            },
            credentials: "include",
            body: JSON.stringify(updatedLoginInfo)
        })
        const result = await response.json()
        if(result.success){
            console.log(result.jwtToken)
            setLoginInfo(updatedLoginInfo)
            setLogin(false)
            localStorage.setItem("token", result.jwtToken)
            localStorage.setItem("name", result.name)
            navigate('/app')
        }
    }
  return (
    <div className="login-box">
        <input placeholder='write your email' className='login-items' value={email} onChange={(e)=>setEmail(e.target.value)}/>
        
        <input placeholder='password' className='login-items' value={password} onChange={(e)=>setPassword(e.target.value)}/>
        
        <button className='login-items login-button' onClick={handleLoginSubmit}>{login ? 'Submitting...' : 'Submit' }</button>

        <p>Don't have an account ? <span><Link to='/'>Signup</Link></span></p>
    </div>
  )
}

export default Login