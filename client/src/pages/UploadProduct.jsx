import React, { useState } from 'react'
import { FiUpload } from "react-icons/fi";
import uploadImage from '../utils/UploadImage';
import Loading from '../components/Loading';
import ViewImage from '../components/ViewImage';
import { MdDelete } from "react-icons/md";
import { useSelector } from 'react-redux';
import { IoClose } from "react-icons/io5";
import AddField from '../components/AddField';
import Axios from '../utils/Axios';
import summaryApi from '../common/summaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import successAlert from '../utils/SuccessAlert';
import { useEffect } from 'react';

const UploadProduct = () => {
  const [data, setData] = useState({
    name: "",
    image: [],
    category: [],
    subCategory: [],
    unit: "",
    stock: "",
    price: "",
    discount: "",
    description: "",
    more_details: {},
  })

  const [loading, setLoading] = useState(false)
  const [viewImageURL, setViewImageURL] = useState("")
  const allCategory = useSelector(state => state.product.allCategory)
  const [selectCategory, setSelectCategory] = useState("")
  const [selectSubCategory, setSelectSubCategory] = useState("")
  const allSubCategory = useSelector(state => state.product.allSubCategory)

  const [moreField, setMoreField] = useState([])
  const [openAddField, setOpenAddField] = useState(false)
  const [fieldName, setFieldName] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target

    setData((preve) => {
      return {
        ...preve,
        [name]: value
      }
    })
  }

  const handleUploadImage = async (e) => {
    const file = e.target.files[0]

    if (!file) {
      return
    }
    setLoading(true)

    const res = await uploadImage(file)
    const { data: ImageResponse } = res
    const imageUrl = ImageResponse.data.url

    setData((preve) => {
      return {
        ...preve,
        image: [...preve.image, imageUrl] // Append imageUrl to the array
      }
    })
    setLoading(false)
  }

  const handleDeleteImage = async (index) => {
    data.image.splice(index, 1)
    setData((preve) => {
      return {
        ...preve
      }
    })
  }

  const handleRemoveCategory = async (index) => {
    data.category.splice(index, 1)
    setData((preve) => {
      return {
        ...preve
      }
    })
  }

  const handleRemoveSubCategory = async (index) => {
    data.subCategory.splice(index, 1)
    setData((preve) => {
      return {
        ...preve
      }
    })
  }

  const handleAddField = () => {
    setData((preve) => {
      return {
        ...preve,
        more_details: {
          ...preve.more_details,
          [fieldName]: ""
        }
      }
    })
    setFieldName("")
    setOpenAddField(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("data", data)
    try {
      const res = await Axios({
        ...summaryApi.createProduct,
        data: data
      })
      const { data: resData } = res

      if (resData.success) {
        successAlert(resData.message)
        setData({
          name: "",
          image: [],
          category: [],
          subCategory: [],
          unit: "",
          stock: "",
          price: "",
          discount: "",
          description: "",
          more_details: {},
        })
      }
    } catch (error) {
      AxiosToastError(error)
    }


  }

  // useEffect(()=>{
  //   successAlert("Upload Successfully")
  // },[])
  return (
    <section>
      <div className='p-2  bg-white shadow-md flex items-center justify-between'>
        <h2 className='font-semibold'>Upload Product</h2>
      </div>
      <div className='grid p-3'>
        <form className='grid gap-4' onSubmit={handleSubmit}>
          <div className=' grid gap-1'>
            <label htmlFor="name" className='font-semibold'>Name</label>
            <input id='name' type="text" name='name' placeholder='Enter product name' value={data.name} onChange={handleChange} required className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded' />
          </div>

          <div className=' grid gap-1'>
            <label htmlFor="description" className='font-semibold'>Description</label>
            <textarea id='description' type="text" name='description' placeholder='Enter product description' value={data.description} onChange={handleChange} required multiple rows={2} className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded resize-none' />
          </div>

          <div>
            <p className='font-semibold'>Image</p>
            <div>
              <label htmlFor='productImage' className='bg-blue-50 h-24 border rounded flex justify-center items-center cursor-pointer'>
                <div className='text-center flex justify-center items-center flex-col'>
                  {
                    loading ? <Loading /> : (
                      <>
                        <FiUpload size={35} />
                        <p>Upload Image</p>
                      </>
                    )
                  }

                </div>
                <input type="file" id='productImage' className='hidden' accept='image/*' onChange={handleUploadImage} />
              </label>
              {/*display uploaded images*/}
              <div className='flex flex-wrap gap-4'>
                {
                  data.image.map((img, index) => {
                    return (
                      <div key={img + index} className='h-20 mt-1 w-20 min-w-20 bg-blue-50 border relative group'>
                        <img
                          src={img}
                          alt={img}
                          className='w-full h-full object-scale-down cursor-pointer'
                          onClick={() => setViewImageURL(img)}
                        />
                        <div onClick={() => handleDeleteImage(index)} className='absolute bottom-0 right-0 p-1 bg-red-500 hover:bg-red-600 cursor-pointer rounded text-white hidden group-hover:block'>
                          <MdDelete />
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>

          <div className='grid gap-1'>
            <label className='font-semibold'>Category</label>
            <div>
              <select className='bg-blue-50 border w-full p-2 rounded'
                value={selectCategory}
                onChange={(e) => {
                  const value = e.target.value
                  const category = allCategory.find(el => el._id === value)
                  console.log(category)

                  setData((preve) => {
                    return {
                      ...preve,
                      category: [...preve.category, category]
                    }
                  })
                  setSelectCategory("")
                }}
              >
                <option value={""}>Select Category</option>
                {
                  allCategory.map((c, index) => {
                    return (
                      <option value={c?._id}>{c.name}</option>
                    )
                  })
                }
              </select>
              <div className='flex flex-wrap gap-3'>
                {
                  data.category.map((c, index) => {
                    return (
                      <div key={c._id + index + "productsection"} className='text-sm flex items-center gap-1 bg-blue-50 mt-2'>
                        <p>{c.name}</p>
                        <div className='hover:text-red-500 cursor-pointer' onClick={() => handleRemoveCategory(index)}>
                          <IoClose size={20} />
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>

          <div className='grid gap-1'>
            <label className='font-semibold'>Sub Category</label>
            <div>
              <select className='bg-blue-50 border w-full p-2 rounded'
                value={selectSubCategory}
                onChange={(e) => {
                  const value = e.target.value
                  const subCategory = allSubCategory.find(el => el._id === value)


                  setData((preve) => {
                    return {
                      ...preve,
                      subCategory: [...preve.subCategory, subCategory]
                    }
                  })
                  setSelectSubCategory("")
                }}
              >
                <option value={""}>Select Sub Category</option>
                {
                  allSubCategory.map((c, index) => {
                    return (
                      <option value={c?._id}>{c.name}</option>
                    )
                  })
                }
              </select>
              <div className='flex flex-wrap gap-3'>
                {
                  data.subCategory.map((c, index) => {
                    return (
                      <div key={c._id + index + "subCategory"} className='text-sm flex items-center gap-1 bg-blue-50 mt-2'>
                        <p>{c.name}</p>
                        <div className='hover:text-red-500 cursor-pointer' onClick={() => handleRemoveSubCategory(index)}>
                          <IoClose size={20} />
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>

          <div className=' grid gap-1'>
            <label htmlFor="unit" className='font-semibold'>Unit</label>
            <input id='unit' type="text" name='unit' placeholder='Enter product unit' value={data.unit} onChange={handleChange} required className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded' />
          </div>

          <div className=' grid gap-1'>
            <label htmlFor="stock" className='font-semibold'>Number of Stock</label>
            <input id='stock' type="number" name='stock' placeholder='Enter product stock' value={data.stock} onChange={handleChange} required className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded' />
          </div>

          <div className=' grid gap-1'>
            <label htmlFor="price" className='font-semibold'>Price</label>
            <input id='price' type="number" name='price' placeholder='Enter product price' value={data.price} onChange={handleChange} required className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded' />
          </div>

          <div className=' grid gap-1'>
            <label htmlFor="discount" className='font-semibold'>Discount</label>
            <input id='discount' type="number" name='discount' placeholder='Enter product discount' value={data.discount} onChange={handleChange} required className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded' />
          </div>

          {/*add more fields*/}

          {
            Object?.keys(data?.more_details)?.map((k, index) => {
              return (
                <div className=' grid gap-1'>
                  <label htmlFor={k}>{k}</label>
                  <input id={k} type="text" value={data?.more_details[k]} onChange={(e) => {
                    const value = e.target.value
                    setData((preve) => {
                      return {
                        ...preve,
                        more_details: {
                          ...preve.more_details,
                          [k]: value
                        }
                      }
                    })
                  }}
                    required className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded' />
                </div>
              )
            })
          }

          <div onClick={() => setOpenAddField(true)} className='bg-primary-200 hover:bg-white py-1 px-3 w-32 text-center font-semibold border border-primary-200 hover:text-neutral-900 cursor-pointer rounded'>
            Add Fields
          </div>

          <button className='bg-primary-100 hover:bg-primary-200 py-2 rounded font-semibold '>
            Submit
          </button>

        </form>
      </div>
      {
        viewImageURL && (
          <ViewImage url={viewImageURL} close={() => setViewImageURL("")} />
        )
      }

      {
        openAddField && (
          <AddField
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
            submit={handleAddField}
            close={() => setOpenAddField(false)} />
        )
      }
    </section>
  )
}

export default UploadProduct
