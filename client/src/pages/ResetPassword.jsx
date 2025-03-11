import React, { useEffect, useState } from 'react'
import { FaEye, FaRegEyeSlash } from 'react-icons/fa6'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import summaryApi from '../common/summaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'


const ResetPassword = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [data,setData] = useState({
        email : "",
        newPassword : "",
        confirmPassword : ""
    })
    
    const [showPassword,setShowPassword] = useState(false)
    const [showConfirmPassword,setShowConfirmPassword] = useState(false)

    const validevalue = Object.values(data).every(el => el)

    useEffect(()=>{
         if(!(location?.state?.data?.success)){
             navigate("/")
         }

         if(location?.state?.email){
             setData((preve)=>{
                return {
                    ...preve,
                    email : location?.state?.email
                }
             })
         }
    },[])

    const handleChange = (e)=>{
        const {name,value} = e.target
        setData((preve)=>{
           return{
             ...preve,
             [name] : value
           }
        })
     }

    console.log("data reset password",data)

    const handleSubmit = async(e)=>{
        e.preventDefault()

        if(data.newPassword !== data.confirmPassword){
            toast.error("New password and confirm password are not match")
            return
        }
 
 
      try {
       const res = await Axios({
         ...summaryApi.resetPassword,
         data : data
    })
    console.log("Response:", res.data);
    if(res.data.error){
       toast.error(res.data.message)
    }
    if(res.data.success){
      toast.success(res.data.message)
      navigate("/login")
      setData({
          email : "",
          newPassword : "",
          confirmPassword : ""
     
      })
    }
    
      } catch (error) {
          AxiosToastError(error)
      }
 
   }

  return (
    <section className='w-full container mx-auto px-2'>
        <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7 '>
         <p className='text-secondary-200 text-center font-semibold text-3xl'>Reset Password</p>
          <form className='grid gap-4 py-4' onSubmit={handleSubmit}>
            <div className='grid gap-1'>
              <label htmlFor='newPassword'>New Password :</label>
              <div className='bg-blue-50 p-2 border flex items-center focus-within:border-secondary-200'>
              <input type={showPassword ? "text" : "password"} id='password' className='w-full outline-none' name='newPassword' value={data.newPassword} onChange={handleChange} placeholder='Enter your new password' />
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
              <input type={showConfirmPassword ? "text" : "password"} id='password' className='w-full outline-none' name='confirmPassword' value={data.confirmPassword} onChange={handleChange} placeholder='Enter your confirm password' />
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
            

            <button disabled={!validevalue} className={`${validevalue ? "bg-green-800 hover:bg-green-700" :  "bg-gray-500"} text-white py-2 font-semibold my-3 tracking-wide`}>Change Password</button>
          </form>
          <p>
            Already have an account ? <Link to={"/register"} className='font-semibold text-green-700 hover:text-green-800'>Login</Link>
          </p>
        </div>
    </section>
  )
}

export default ResetPassword
