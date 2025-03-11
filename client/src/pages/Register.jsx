import React, { useState } from 'react'
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import toast, { Toaster } from 'react-hot-toast';
import Axios from '../utils/Axios';
import summaryApi from '../common/summaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import {Link, useNavigate} from 'react-router-dom';


const Register = () => {
  const [data,setData] = useState({
    name : "",
    email : "",
    password : "",
    confirmPassword : ""
  })

  const [showPassword,setShowPassword] = useState(false)
  const [showConfirmPassword,setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()

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
  
    if (data.password !== data.confirmPassword) {
      toast.error("Password and Confirm Password do not match");
      return;
    }
  
    try {
      const res = await Axios({
        ...summaryApi.register,
        data: data,
      });
  
      console.log("API Response:", res.data); // Debug API response
  
      if (res.data.error) {
        toast.error(res.data.message || "An error occurred");
        return;
      }
  
      if (res.data.success) {
        toast.success(res.data.message || "Registration successful");
        setData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        navigate("/login");
      }
    } catch (error) {
      console.error("Error caught:", error); // Debug errors
      AxiosToastError(error);
    }
  };
  

  return (
    <section className='w-full container mx-auto px-2'>
        <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7 '>
          <p className='text-secondary-200 text-center font-semibold text-3xl'>Welcome to Binkeyit</p>

          <form className='grid gap-4 mt-6' onSubmit={handleSubmit}>
            <div className='grid gap-1'>
              <label htmlFor='name'>Name :</label>
              <input type="text" id='name' autoFocus className='bg-blue-50 p-2 border outline-none focus-within:border-secondary-200' name='name' value={data.name} onChange={handleChange} placeholder='Enter your name' />
            </div>
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
            </div>
            <div className='grid gap-1'>
              <label htmlFor='confirmPassword'>Confirm Password :</label>
              <div className='bg-blue-50 p-2 border flex items-center focus-within:border-secondary-200'>
              <input type={showConfirmPassword ? "text" : "password"} id='confirmPassword' className='w-full outline-none' name='confirmPassword' value={data.confirmPassword} onChange={handleChange} placeholder='Enter your confirm password' />
              <div onClick={()=> setShowConfirmPassword(preve => !preve)} className='cursor-pointer'>
                {
                  showConfirmPassword ? (
                       <FaEye/>
                  ) : (
                    <FaRegEyeSlash/>
                  )
                }
              </div>
              </div>
            </div>

            <button disabled={!validevalue} className={`${validevalue ? "bg-green-800 hover:bg-green-700" :  "bg-gray-500"} text-white py-2 font-semibold my-3 tracking-wide`}>Register</button>
          </form>
          <p>
            Already have an account ? <Link to={"/login"} className='font-semibold text-green-700 hover:text-green-800'>Login</Link>
          </p>
        </div>
    </section>
  )
}

export default Register
