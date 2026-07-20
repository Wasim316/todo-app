import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter,Routes, Route, Navigate} from 'react-router-dom'
import Signup from './components/Signup.jsx'
import Login from './components/Login.jsx'

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  return token
    ? children
    : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  return token
    ? <Navigate to="/app" />
    : children;
};

createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<PublicRoute> <Signup/> </PublicRoute>}/>
        <Route path='/login' element={<PublicRoute> <Login/> </PublicRoute>}/>
        <Route path='/app' element={<ProtectedRoute> <App/> </ProtectedRoute>}/>

        <Route path='/app/*' element={<ProtectedRoute> <App/> </ProtectedRoute>}/>
        <Route path='/*' element={<PublicRoute> <Signup/> </PublicRoute>}/>
        <Route path='/login/*' element={<PublicRoute> <Login/> </PublicRoute>}/>
      </Routes>
      {/* <App /> */}
    </BrowserRouter>
    
  </StrictMode>,
)
