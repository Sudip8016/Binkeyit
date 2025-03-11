import React, { useEffect, useState } from 'react'
import UploadSubCategoryModel from '../components/UploadSubCategoryModel'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import summaryApi from '../common/summaryApi'
import DisplayTable from '../components/DisplayTable'
import { createColumnHelper } from '@tanstack/react-table'
import ViewImage from '../components/ViewImage'
import { FaPencil } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import EditSubCategory from '../components/EditSubCategory'
import ConfirmBox from '../components/ConfirmBox'
import toast from 'react-hot-toast'

const SubCategoryPage = () => {
  const [openAddSubCategory,setOpenAddSubCategory] = useState(false)
  const [data,setData] = useState([])
  const [loading,setLoading] = useState(false)
  const columnHelper = createColumnHelper()
  const [ImageURL,setImageURL] = useState("")
  const [openEdit,setOpenEdit] = useState(false)
  const [editData,setEditData] = useState({
    _id : ""
  })
  const [deleteSubCategory,setDeleteSubCategory] = useState({
      _id : ""
  })
  const [openConfirmBoxDelete,setOpenConfirmBoxDelete] = useState(false)

  const fetchSubCategory = async()=>{
    try {
      setLoading(true)
      const res = await Axios({
        ...summaryApi.getSubCategory
      })
      const { data : resData } = res
      if(resData.success){
         setData(resData.data)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally{
        setLoading(false)
    }
  }

  useEffect(()=>{
    fetchSubCategory()
  },[])

  const column = [
    columnHelper.accessor('name',{
       header : "Name"
    }),
    columnHelper.accessor('image',{
      header : "Image",
      cell : ({row})=>{
        console.log("row",row.original.image)
        return <div className='flex justify-center items-center'>
           <img 
          src={row.original.image}
          alt={row.original.name}
          className='w-8 h-8 cursor-pointer'
          onClick={()=>{
            setImageURL(row.original.image)
          }}
        />
        </div>
      }
   }),
   columnHelper.accessor('category',{
    header : "Category",
    cell : ({row})=>{
      return(
        <>
         {
          row.original.category.map((c,index)=>{
            return(
              <p key={c._id+"table"} className='shadow-md px-1 inline-block'>{c.name}</p>
            )
          })
         }
        </>
      )
    }
 }),
 columnHelper.accessor("_id",{
   header : "Action",
   cell : ({row})=>{
     return(
      <div className='flex items-center justify-center gap-3'>
        <button onClick={()=>{
          setOpenEdit(true)
          setEditData(row.original)
        }} className='p-2 bg-green-100 rounded-full hover:text-green-600'>
           <FaPencil size={20}/>
        </button>
        <button onClick={()=>{
          setOpenConfirmBoxDelete(true)
          setDeleteSubCategory(row.original)
        }} className='p-2 bg-red-100 rounded-full text-red-500 hover:text-red-600'>
          <MdDelete size={20}/>
        </button>
      </div>
     )
   }
 })
  ]

  const handleDeleteSubCategory = async()=>{
       try {
        const res = await Axios({
          ...summaryApi.deleteSubCategory,
          data : deleteSubCategory
      })
      const {data : resData} = res
            if(resData.success){
                toast.success(resData.message)
                fetchSubCategory()
                setOpenConfirmBoxDelete(false)
                setDeleteSubCategory({_id : ""})
            }
       } catch (error) {
        AxiosToastError(error)
       }
  }
  return (
    <section>
      <div className='p-2  bg-white shadow-md flex items-center justify-between'>
        <h2 className='font-semibold'>Sub Category</h2>
        <button onClick={()=>setOpenAddSubCategory(true)} className='text-sm border border-primary-200 hover:bg-primary-200 px-3 py-1 rounded'>Add Sub Category</button>
      </div>

      <div className='overflow-auto w-full max-w-[95vw]'>
        <DisplayTable
          data={data}
          column={column}
        />
      </div>

      {
         openAddSubCategory && (
            <UploadSubCategoryModel close={()=>setOpenAddSubCategory(false)}
              fetchData={fetchSubCategory}
            />
         )
      }

      {
        ImageURL && 
        <ViewImage url={ImageURL} close={()=>setImageURL("")}/>
      }

      {
        openEdit && 
        <EditSubCategory
          data={editData}
          close={()=>setOpenEdit(false)}
          fetchData={fetchSubCategory}
        />
      }

      {
        openConfirmBoxDelete && (
          <ConfirmBox
           cancel={()=>setOpenConfirmBoxDelete(false)}
           close={()=>setOpenConfirmBoxDelete(false)}
           confirm={handleDeleteSubCategory}
          />
        )
      }
    </section>
  )
}

export default SubCategoryPage
