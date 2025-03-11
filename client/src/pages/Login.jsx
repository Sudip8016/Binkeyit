import React, { useState } from 'react'
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import toast, { Toaster } from 'react-hot-toast';
import Axios from '../utils/Axios';
import summaryApi from '../common/summaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import {Link, useNavigate} from 'react-router-dom';
import fetchUserDetails from '../utils/fetchUserDetails';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';

const Login = () => {
  const [data,setData] = useState({
    email : "",
    password : ""
  })

  const [showPassword,setShowPassword] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleChange = (e)=>{
     const {name,value} = e.target
     setData((preve)=>{
        return{
          ...preve,
          [name] : value
        }
     })
  }

  const validevalue = Object.values(data).every(el => el)

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await Axios({
        ...summaryApi.login,
        data: data,
      });
  
      
  
      if (res.data.error) {
        toast.error(res.data.message)
        return; // Stop further execution
      }
  
      if (res.data.success) {
        toast.success(res.data.message)
        localStorage.setItem('accesstoken',res.data.data.accesstoken)
        localStorage.setItem('refreshToken',res.data.data.refreshToken)

        const userDetails = await fetchUserDetails()
        dispatch(setUserDetails(userDetails.data))
        setData({ email: "", password: "" });
        navigate("/");
      }
    } catch (error) {
      console.error("Error caught:", error);
      AxiosToastError(error);
    }
  };
  
  

  return (
    <section className='w-full container mx-auto px-2'>
        <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7 '>
          <p className='text-secondary-200 text-center font-semibold text-3xl'>Login To Procced</p>

          <form className='grid gap-4 py-4' onSubmit={handleSubmit}>
            <div className='grid gap-1'>
              <label htmlFor='email'>Email :</label>
              <input type="email" id='email' className='bg-blue-50 p-2 border outline-none focus-within:border-secondary-200' name='email' value={data.email} onChange={handleChange}placeholder='Enter your email'/>
            </div>
            <div className='grid gap-1'>
              <label htmlFor='password'>Password :</label>
              <div className='bg-blue-50 p-2 border flex items-center focus-within:border-secondary-200'>
              <input type={showPassword ? "text" : "password"} id='password' className='w-full outline-none' name='password' value={data.password} onChange={handleChange} placeholder='Enter your password' />
              <div onClick={()=> setShowPassword(preve => !preve)} className='cursor-pointer'>
                {
                  showPassword ? (
                       <FaEye/>
                  ) : (
                    <FaRegEyeSlash/>
                  )
                }
              </div>
              </div>
              <Link to={"/forgot-password"} className='block ml-auto hover:text-secondary-200'>Forgot Password ?</Link>
            </div>

            <button disabled={!validevalue} className={`${validevalue ? "bg-green-800 hover:bg-green-700" :  "bg-gray-500"} text-white py-2 font-semibold my-3 tracking-wide`}>Login</button>
          </form>
          <p>
            Don't have an account ? <Link to={"/register"} className='font-semibold text-green-700 hover:text-green-800'>Register</Link>
          </p>
        </div>
    </section>
  )
}

export default Login

