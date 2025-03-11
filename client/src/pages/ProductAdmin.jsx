import React, { useEffect, useState } from 'react'
import summaryApi from '../common/summaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import Loading from '../components/Loading'
import ProductCardAdmin from '../components/ProductCardAdmin'
import { IoSearchOutline } from "react-icons/io5";
import EditProductAdmin from '../components/EditProductAdmin'

const ProductAdmin = () => {
  const [productData, setProductData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [totalPageCount, setTotalPageCount] = useState(1)
  const [search, setSearch] = useState("")

  const fetchProductData = async () => {
    try {
      setLoading(true)
      const res = await Axios({
        ...summaryApi.getProduct,
        data: {
          page: page,
          limit: 12,
          search: search
        }
      })

      const { data: resData } = res

      if (resData.success) {
        setTotalPageCount(resData.totalNoPage)
        setProductData(resData.data)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      fetchProductData()
    }, 300)

    return () => clearTimeout(delaySearch)
  }, [search, page])

  const handleNext = () => {
    if (page < totalPageCount) setPage(prev => prev + 1)
  }

  const handlePrevious = () => {
    if (page > 1) setPage(prev => prev - 1)
  }

  const handleOnChange = (e) => {
    setSearch(e.target.value)
    setPage(1)
  }

  return (
    <section>
      <div className='p-2 bg-white shadow-md flex items-center justify-between gap-4'>
        <h2 className='font-semibold'>Product</h2>
        <div className='h-full w-full min-w-24 max-w-56 px-4 ml-auto bg-blue-50 flex items-center gap-3 py-2 border rounded focus-within:border-primary-200'>
          <IoSearchOutline size={25}/>
          <input 
            type='text'
            placeholder='Search product here...'
            className='h-full w-full outline-none bg-transparent'
            value={search}
            onChange={handleOnChange}
          />
        </div>
      </div>
      {loading && <Loading />}
      <div className='p-4 bg-blue-50'>
        <div className='min-h-[55vh]'>
          {productData.length === 0 && !loading ? (
            <p className='text-center text-gray-500'>No products found.</p>
          ) : (
            <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'>
              {productData.map((p, index) => (
                <ProductCardAdmin key={p._id || index} data={p} />
              ))}
            </div>
          )}
        </div>
        <div className='flex justify-between my-4'>
          <button onClick={handlePrevious} disabled={page === 1} className={`border px-4 py-1 border-primary-200  hover:bg-primary-100 ${page === 1 ? "opacity-50 cursor-not-allowed" : ""}`}>Previous</button>
          <button className='w-full bg-slate-100'>{page}/{totalPageCount}</button>
          <button onClick={handleNext} disabled={page === totalPageCount} className={`border px-4 py-1 border-primary-200 hover:bg-primary-100 ${page === totalPageCount ? "opacity-50 cursor-not-allowed" : ""}`}>Next</button>
        </div>
      </div>

      
    </section>
  )
}

export default ProductAdmin
