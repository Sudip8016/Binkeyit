import { Outlet, useLocation } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import toast, { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import fetchUserDetails from './utils/fetchUserDetails';
import { setUserDetails } from './store/userSlice';
import { setAllCategory,setAllSubCategory,setLoadingCategory } from './store/productSlice';
import { useDispatch } from 'react-redux';
import Axios from './utils/Axios';
import summaryApi from './common/summaryApi';
import { handleAddItemCart } from './store/cartProduct'
import GlobalProvider from './provider/GlobalProvider';
import CartMobileLink from './components/CartMobile';


function App() {
  const dispatch = useDispatch()
  const location = useLocation()

  const fetchUser = async ()=>{
    const userData = await fetchUserDetails()
    dispatch(setUserDetails(userData.data))
  }

  const fetchCategory = async()=>{
    try {
       dispatch(setLoadingCategory(true))
        const res = await Axios({
            ...summaryApi.getCategory
        })
        const {data : resData} = res

        if(resData.success){
          dispatch(setAllCategory(resData.data))
            
        }
        
    } catch (error) {
        
    }finally{
        dispatch(setLoadingCategory(false))
    }
}

 const fetchSubCategory = async()=>{
    try {
       
        const res = await Axios({
            ...summaryApi.getSubCategory
        })
        const {data : resData} = res

        if(resData.success){
          dispatch(setAllSubCategory(resData.data))
            
        }
        
    } catch (error) {
        
    }finally{
        
    }
}



  useEffect(()=>{
    fetchUser()
    fetchCategory()
    fetchSubCategory()
    //fetchCartItem()
  },[])

  return (
   <GlobalProvider>
    <Header/>
     <main className='min-h-[80vh]'>
       <Outlet/>
     </main>
     <Footer/>
     <Toaster/>
     {
        location.pathname !== '/checkout' && (
          <CartMobileLink/>
        )
      }
   </GlobalProvider>
  )
}

export default App
