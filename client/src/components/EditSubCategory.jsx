import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";
import uploadImage from '../utils/UploadImage';
import { useSelector } from 'react-redux';
import Axios from '../utils/Axios';
import summaryApi from '../common/summaryApi';
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'

const EditSubCategory = ({ close, data, fetchData }) => {
    const [subCategorydata, setSubCategoryData] = useState({
        _id : data._id,
        name: data.name,
        image: data.image,
        category: data.category || []
    })
    const allCategory = useSelector(state => state.product.allCategory)
    console.log("all category sub category page", allCategory)
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setSubCategoryData((preve) => {
            return {
                ...preve,
                [name]: value

            }
        })
    }

    const handleUploadSubCategoryImage = async (e) => {
        const file = e.target.files[0]

        if (!file) {
            return
        }

        setLoading(true)

        const res = await uploadImage(file)
        const { data: ImageRes } = res
        setLoading(false)

        setSubCategoryData((preve) => {
            return {
                ...preve,
                image: ImageRes.data.url
            }
        })

    }

    const handleRemoveCategorySelected = (categoryId) => {
        const index = subCategorydata.category.findIndex(el => el._id === categoryId)
        subCategorydata.category.splice(index, 1)
        setSubCategoryData((preve) => {
            return {
                ...preve
            }
        })
    }

    const handleSubmitSubcategory = async (e) => {
        e.preventDefault()
        try {
            const res = await Axios({
                ...summaryApi.updateSubCategory,
                data: subCategorydata
            })

            const { data: resData } = res
            if (resData.success) {
                toast.success(resData.message)
                if (close) {
                    close()
                }
                if(fetchData){
                    fetchData()
                }
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }



    return (
        <section className='fixed top-0 bottom-0 left-0 right-0 p-4 bg-neutral-800 bg-opacity-60 flex items-center justify-center'>
            <div className='bg-white max-w-4xl w-full p-4 rounded'>
                <div className='flex items-center justify-between gap-3'>
                    <h1 className='font-semibold'>Edit Sub Category</h1>
                    <button onClick={close} className='w-fit block ml-auto'>
                        <IoClose size={25} />
                    </button>
                </div>
                <form className='my-3 grid gap-3' onSubmit={handleSubmitSubcategory} >
                    <div className='grid gap-1'>
                        <label htmlFor='name'> Name</label>
                        <input
                            type='text'
                            id='name'
                            name='name'
                            value={subCategorydata.name}
                            onChange={handleChange}
                            placeholder='Enter category name'
                            className='p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded'
                        />
                    </div>

                    <div className='grid gap-1'>
                        <p>Image</p>
                        <div className='flex flex-col lg:flex-row items-center gap-3'>
                            <div className='border bg-blue-50 h-36 w-full lg:w-36 flex items-center justify-center rounded'>
                                {
                                    !subCategorydata.image ? (
                                        <p className='text-sm text-neutral-500'>No Image</p>
                                    ) : (

                                        <img src={subCategorydata.image} alt="category" className='w-full h-full object-scale-down' />
                                    )
                                }
                            </div>
                            <label htmlFor='uploadSubCategoryImage'>
                                <div className={`
                                ${!subCategorydata.name ? "bg-gray-300" : "border-primary-200 bg-primary-100 hover:bg-primary-200"}
                                    px-4 py-2 rounded cursor-pointer border font-medium
                                `}>
                                    {
                                        loading ? "Loading..." : "Upload Image"
                                    }

                                </div>
                                <input disabled={!subCategorydata.name} onChange={handleUploadSubCategoryImage} type="file" id='uploadSubCategoryImage' className='hidden' />
                            </label>

                        </div>
                    </div>
                    <div className='grid gap-1'>
                        <label>Select Category</label>
                        <div className='border focus-within:border-primary-200'>
                            {/* display value*/}
                            <div className='flex flex-wrap gap-2'>
                                {
                                    subCategorydata.category.map((cat, index) => {
                                        return (
                                            <p key={cat._id + "selectedValue"} className='bg-white shadow-md flex items-center justify-between p-2 rounded-md w-full sm:w-auto'>
                                                {cat.name}
                                                <div className='cursor-pointer hover:text-red-600 ml-4' onClick={() => handleRemoveCategorySelected(cat._id)}>
                                                    <IoClose size={20} />
                                                </div>
                                            </p>

                                        )
                                    })
                                }
                            </div>
                            {/* select category*/}
                            <select
                                className='w-full p-2 bg-transparent outline-none'
                                onChange={(e) => {
                                    const value = e.target.value
                                    const categoryDetails = allCategory.find(el => el._id == value)
                                    setSubCategoryData((preve) => {
                                        return {
                                            ...preve,
                                            category: [...preve.category, categoryDetails]
                                        }
                                    })
                                }}

                            >
                                <option value={""}>Select Category</option>
                                {
                                    allCategory.map((category, index) => {
                                        return (
                                            <option value={category?._id} key={category._id + "subcategory"}>{category?.name}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                    </div>

                    <button className={`px-4 py-2 border
                          ${subCategorydata?.name && subCategorydata?.image && subCategorydata?.category[0] ? "bg-primary-200 hover:bg-primary-100" : "bg-gray-200"}
                          font-semibold
                        
                        `}

                    >
                        Submit
                    </button>


                </form>
            </div>
        </section>
    )
}

export default EditSubCategory

