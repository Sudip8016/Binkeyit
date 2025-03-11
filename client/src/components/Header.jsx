import React, { useEffect, useState } from 'react'
import logo from '../assets/logo.png'
import Search from './Search'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaUser } from "react-icons/fa";
import useMobile from '../hooks/useMobile';
import { FaCartPlus } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import UserMenu from './UserMenu';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { useGlobalContext } from '../provider/GlobalProvider';
import DisplayCartItem from './DisplayCartItem';

const Header = () => {
   const [isMobile] = useMobile()
   const location = useLocation()
   const isSearchPage = location.pathname === '/search'
   const navigate = useNavigate()
   const user = useSelector((state) => state?.user)
   const [openUserMenu, setOpenUserMenu] = useState(false)
   const cartItem = useSelector(state => state.cartItem.cart)
   // const [totalPrice,setTotalPrice] = useState(0)
   // const [totalQty,setTotalQty] = useState(0)
   const { totalPrice, totalQty} = useGlobalContext()
   const [openCartSection,setOpenCartSection] = useState(false)
  
   const redirectToLoginPage = () => {
      navigate("/login")
   }

   const handleCloseUserMenu = ()=>{
      setOpenUserMenu(false)
   }

   const handleMobileUser = ()=>{
      if(!user._id){
         navigate("/login")
         return
      }
      
      navigate("/user")
   }

   //total item and total price
   // useEffect(()=>{
   //   const qty = cartItem.reduce((prev,curr)=>{
   //      return prev + curr.quantity
   //   },0)
   //   setTotalQty(qty)
     
   //   const tPrice = cartItem.reduce((prev,curr)=>{
   //     return prev + (curr.productId.price * curr.quantity)
   //   },0)
   //   setTotalPrice(tPrice)
   // },[cartItem])


   return (
      <header className='h-24 lg:h-20 shadow-md sticky top-0 z-40 flex flex-col justify-center gap-1 bg-white'>
         {
            !(isSearchPage && isMobile) && (
               <div className='container mx-auto flex items-center px-2 justify-between'>
                  {/*logo*/}
                  <div className='h-full'>
                     <Link to={"/"} className='h-full flex justify-center items-center'>
                        <img
                           src={logo}
                           width={170}
                           height={60}
                           alt='logo'
                           className='hidden lg:block'
                        />
                        <img
                           src={logo}
                           width={120}
                           height={60}
                           alt='logo'
                           className='lg:hidden'
                        />
                     </Link>
                  </div>
                  {/*search*/}
                  <div className='hidden lg:block'>
                     <Search />
                  </div>

                  {/*login and my cart*/}
                  <div className=''>
                     {/*user icon display in only mobile*/}
                     <button className='text-neutral-600 lg:hidden' onClick={handleMobileUser}>
                        <FaUser size={26} />
                     </button>

                     {/*desktop part*/}
                     <div className='hidden lg:flex items-center gap-12'>
                        {
                           user?._id ? (
                              <div className='relative'>
                                 <div onClick={() => setOpenUserMenu(preve => !preve)} className='flex select-none items-center gap-1 cursor-pointer'>
                                    <p>Account</p>
                                    {
                                       openUserMenu ? (
                                          <FaAngleUp size={23} />
                                       ) : (
                                          <FaAngleDown size={23} />
                                       )
                                    }

                                 </div>
                                 {
                                    openUserMenu && (
                                       <div className='absolute right-0  top-12'>
                                          <div className='bg-white rounded p-4 min-w-52 lg:shadow-lg'>
                                             <UserMenu close={handleCloseUserMenu}/>
                                          </div>
                                       </div>
                                    )
                                 }

                              </div>
                           ) : (
                              <button onClick={redirectToLoginPage} className='text-lg px-2'>Login</button>
                           )
                        }

                        <button onClick={()=>setOpenCartSection(true)} className='flex items-center gap-2 bg-green-700 hover:bg-green-800 px-3 py-2 rounded text-white'>
                           {/*Add to cart icon*/}
                           <div className='animate-bounce'>
                              <FaCartPlus size={26} />
                           </div>
                           <div className='font-semibold'>
                              {
                                 cartItem[0] ? (
                                    <div>
                                       <p>{totalQty} Items</p>
                                       <p>{DisplayPriceInRupees(totalPrice)}</p>
                                    </div>
                                 ) : (
                                    <p>My Cart</p>
                                 )
                              }
                             
                           </div>
                        </button>
                     </div>
                  </div>
               </div>
            )
         }

         <div className='container mx-auto px-2 lg:hidden'>
            <Search />
         </div>

         {
            openCartSection && (
                <DisplayCartItem close={()=>setOpenCartSection(false)}/>
            )
        }
      </header>
   )
}

export default Header
