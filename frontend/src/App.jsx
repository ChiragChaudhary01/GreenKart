import './index.css';
import { ToastContainer } from "react-toastify";
import Signup from "./pages/Auth/Signup.jsx"
import { Routes, Route } from "react-router-dom";
import Login from './pages/Auth/Login.jsx';
import VerifyOTP from './pages/Auth/VerifyOTP.jsx';
import LandingPage from './pages/LandingPage/LandingPage.jsx';

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/verify-otp' element={<VerifyOTP />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        toastClassName="bg-gray-800 text-white rounded-lg shadow-lg text-sm sm:text-base md:text-lg w-[70%] sm:w-auto"
        bodyClassName="flex items-center"
        closeButton={false}
      />
    </>
  )
}

export default App
