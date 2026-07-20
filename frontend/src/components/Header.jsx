import { useNavigate } from 'react-router-dom';
import '../styles/header.css'

const Header = () => {
  const navigate = useNavigate()

  const handleLogout = async()=>{
    const response = await fetch(`${import.meta.env.VITE_API_URL}/user/logout`,{
      method: 'POST',
      credentials : 'include'
    });
    const result = await response.json()
    if(result.success){
      localStorage.removeItem('token')
      localStorage.removeItem('name')
      navigate('/login')
    }
  }
  return (
    <div className="header-box">
        <h1 className='logo'>Todo App</h1>
        <button className='logout-btn' onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Header