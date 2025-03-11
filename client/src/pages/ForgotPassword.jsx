import React, { useState } from 'react'
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import toast, { Toaster } from 'react-hot-toast';
import Axios from '../utils/Axios';
import summaryApi from '../common/summaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import {Link, useNavigate} from 'react-router-dom';


const ForgotPassword = () => {
  const [data,setData] = useState({
    email : ""
  })

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

  const handleSubmit = async(e)=>{
       e.preventDefault()


     try {
      const res = await Axios({
        ...summaryApi.forgot_password,
        data : data
   })
   console.log("Response:", res.data);
   if(res.data.error){
      toast.error(res.data.message)
   }
   if(res.data.success){
     toast.success(res.data.message)
     navigate("/verification-otp",{
      state : data
    })
     setData({
         email : ""
    
     })
   }
   
     } catch (error) {
         AxiosToastError(error)
     }

  }

  return (
    <section className='w-full container mx-auto px-2'>
        <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7 '>
         <p className='text-secondary-200 text-center font-semibold text-3xl'>Forgot Password</p>
          <form className='grid gap-4 py-4' onSubmit={handleSubmit}>
            <div className='grid gap-1'>
              <label htmlFor='email'>Email :</label>
              <input type="email" id='email' className='bg-blue-50 p-2 border outline-none focus-within:border-secondary-200' name='email' value={data.email} onChange={handleChange}placeholder='Enter your email'/>
            </div>
            

            <button disabled={!validevalue} className={`${validevalue ? "bg-green-800 hover:bg-green-700" :  "bg-gray-500"} text-white py-2 font-semibold my-3 tracking-wide`}>Send OTP</button>
          </form>
          <p>
            Already have an account ? <Link to={"/register"} className='font-semibold text-green-700 hover:text-green-800'>Login</Link>
          </p>
        </div>
    </section>
  )
}

export default ForgotPassword


