
import './App.css'
import Body from './components/Body'
import Header from './components/Header'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div>
      <Header/>
      <Body/>
      <ToastContainer/>
    </div>
  )
}

export default App
