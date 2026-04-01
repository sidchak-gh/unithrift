import { useAuthContext } from '../context/AuthContext';
import { Loader2Icon, Upload, X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import api, { backendUrl } from '../configs/axios';
import { getAllPublicListing, getAllUserListing } from '../app/features/listingSlice';
import axios from 'axios';


const ManageListing = () => {

  const {id} = useParams();
  const navigate = useNavigate();
  const {userListings} = useSelector((state)=>state.listing)

  const {token} = useAuthContext();
  const dispatch = useDispatch();

  const [loadingListing, setLoadingListing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    condition: '',
    price: '',
    description: '',
    images: [],
  })

 const categories = [
    'electronics',
    'books',
    'furniture',
    'clothing',
    'appliances',
    'vehicles',
    'sports',
    'other'
 ];

 const conditions = [
    'new',
    'like_new',
    'good',
    'fair',
    'poor'
 ];

  const handleInputChange = (field, value) =>{
    setFormData((prev) => ({...prev, [field]: value}) );
  }

  const handleImageUpload = async(event)=>{
    const files = Array.from(event.target.files);
    if(!files.length) return;
    if(files.length + formData.images.length > 5) return toast.error("You can upload up to 5 images");
    setFormData((prev) => ({...prev, images: [...prev.images, ...files]}));
  }

  const removeImage = (indexToRemove)=>{
    setFormData((prev)=>({
      ...prev, images: prev.images.filter((_,i)=> i !== indexToRemove)
    }))
  }

  // Get listing data for edit if `id` is provided (edit mode)
  useEffect(()=>{
    if(!id) return;

    setIsEditing(true)
    setLoadingListing(true)
    const listing = userListings.find((listing)=> listing.id === id)
    if(listing){
      setFormData(listing)
      setLoadingListing(false)
    }else {
      toast.error("Listing not found")
      navigate('/my-listings')
    }
  },[id])

  const handleSubmit = async (e) =>{
    e.preventDefault();
    toast.loading("Saving...")
    const dataCopy = structuredClone(formData)
    try {
      if(isEditing){
        dataCopy.images = formData.images.filter((image)=>typeof image === "string")
      
        const formDataInstance = new FormData();
        formDataInstance.append('itemDetails', JSON.stringify(dataCopy))

        formData.images.filter((image) => typeof image !== 'string').forEach((image)=>{formDataInstance.append('images', image)} )

        const {data} = await axios.put(`${backendUrl}/api/listing`, formDataInstance, {headers: {Authorization: `Bearer ${token}`}})

        toast.dismissAll();
        toast.success(data.message)
        dispatch(getAllUserListing({token}))
        dispatch(getAllPublicListing())
        navigate('/my-listings')
      }else{
        delete dataCopy.images;

        const formDataInstance = new FormData();

        formDataInstance.append('itemDetails', JSON.stringify(dataCopy));
        formData.images.forEach((image)=>{
          formDataInstance.append('images', image)
        })

        const {data} = await axios.post(`${backendUrl}/api/listing`, formDataInstance, {headers: {Authorization: `Bearer ${token}`}})
        
        toast.dismissAll();
        toast.success(data.message)
        dispatch(getAllUserListing({token}))
        dispatch(getAllPublicListing())
        navigate('/my-listings')
      }
    } catch (error) {
      toast.dismissAll();
      toast.error(error?.response?.data?.message || error?.message)
    }
  }

  if(loadingListing) {
    return (
     <div className='h-screen flex items-center justify-center'>
      <Loader2Icon className='size-7 animate-spin text-indigo-600'/>
     </div>
    )
  }

  return (
    <>
    <div className='min-h-screen py-8'>
      <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-800'>
          {isEditing ? "Edit Item Listing" : "List an Item"}
        </h1>
        <p className='text-gray-600 mt-2'>
          {isEditing ? "Update your item's details for buyers" : "Provide details about the physical item you're selling"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className='space-y-8'>
        {/* Basic info */}
        <Section title="Item Details">
          <div className='grid grid-cols-1 gap-6'>
            <InputField label='Item Title' value={formData.title} 
            placeholder='e.g., Used Calculus Textbook' onChange={(v) => handleInputChange('title', v)} required={true} />

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <SelectField label='Category' options={categories} value={formData.category} onChange={(v) => handleInputChange('category', v)} required={true} />
              <SelectField label='Condition' options={conditions} value={formData.condition} onChange={(v) => handleInputChange('condition', v)} required={true} />
            </div>

            <InputField label='Asking Price (Rs)' type='number' value={formData.price} placeholder='500' onChange={(v) => handleInputChange('price', v)} required={true} min={0} />

            <TextAreaField label='Description' value={formData.description} placeholder="Describe any flaws, why you're selling, etc." onChange={(v) => handleInputChange('description', v)} required={true}  />
          </div>
        </Section>

        {/* Images */}
        <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          <h2 className='text-lg font-semibold text-gray-800'>Photos</h2>
          <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center'>
            <input type="file" id='images' multiple accept='image/*' onChange={handleImageUpload} className='hidden' />
            <Upload className='w-12 h-12 mx-auto text-gray-400 mb-4'/>
            <label htmlFor='images' className='px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer'>Choose Files</label>
            <p className='text-sm text-gray-500 mt-2'>Upload photos of your item (max 5 images)</p>
          </div>
          {formData.images.length > 0 && (
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-4'>
            {formData.images.map((img, index) => (
              <div key={index} className='relative'>
                <img src={typeof img === 'string' ? img : URL.createObjectURL(img)} alt={`image ${index + 1}`} className='w-full h-24 object-cover rounded-lg' />  
                <button type='button' onClick={()=> removeImage(index)} className='absolute -top-2 -right-2 bg-red-500 rounded-full p-1 shadow hover:bg-red-600 cursor-pointer'>
                 <X className='w-4 h-4 text-white' />
                </button>
              </div>
            ))}
          </div>
         )}
        </section>

          {/* Submit button */}
        <div className='flex justify-end gap-3 text-sm'>
          <button type='button' onClick={()=> navigate(-1)} className='px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'>
            Cancel
          </button>
          <button type='submit' className='px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors'>
            {isEditing ? "Update Listing" : "Create Listing"}
          </button>
        </div>
      </form>
      </div>
    </div>
    </>
  )
}

// Common elements

const Section = ({title, children}) => (
  <div className='bg-white rounded-lg border border-gray-200 p-6 space-y-6'>
    <h2 className='text-lg font-semibold text-gray-800'>{title}</h2>
    {children}
  </div>
)

const InputField = ({label, type="text", value, onChange, placeholder, required = false, min= null, max = null})=> (
  <div className='space-y-2'>
    <label className='block text-sm font-medium text-gray-700 mb-2'>
      {label}
       {required && <span className="text-red-500 ">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      min={min}
      max={max}
      className='w-full px-3 py-1.5 text-gray-600 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
    />
  </div>
)

const SelectField = ({label, options, value, onChange, required = false}) => (
  <div className='space-y-2'>
    <label className='block text-sm font-medium text-gray-700 mb-2'>
      {label}
      {required && <span className="text-red-500 ">*</span>}
      </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required} 
      className='w-full px-3 py-1.5 text-gray-600 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
    >
      <option value="">Select...</option> 
      {options.map((opt) => (
        <option key={opt} value={opt} className="capitalize">{opt.replace("_", " ")}</option>
      ))}
    </select>
  </div>
)

const TextAreaField = ({label, value, onChange, required = false, placeholder}) => (
  <div className='space-y-2'>
    <label className='block text-sm font-medium text-gray-700 mb-2'>
      {label}
      {required && <span className="text-red-500 ">*</span>}
    </label> 
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      placeholder={placeholder}
      rows={5}
      className='w-full px-3 py-1.5 text-gray-600 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
    />
  </div>
)

export default ManageListing
