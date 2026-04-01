import React from 'react'
import { BadgeCheck, MapPin, Tag, Box, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ListingCard = ({listing}) => {
    const navigate = useNavigate();
    const currency = import.meta.env.VITE_CURRENCY || 'Rs ';

  return (
    <div className='relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition'>
      {/* Featured banner */}
      {listing.featured && (        
        <>
            <div className="py-1 relative">
                <div className="absolute top-0 left-0 w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-center text-xs font-semibold py-1 tracking-wide uppercase z-10">
                Featured
                </div>
            </div>
        </>
      )}

      {/* Image Header */}
      <div className='w-full h-48 bg-gray-200 relative'>
        {listing.images && listing.images.length > 0 ? (
          <img src={listing.images[0]} alt={listing.title} className='w-full h-full object-cover' />
        ) : (
          <div className='flex items-center justify-center w-full h-full text-gray-400'>No Image</div>
        )}
      </div>

      <div className='p-5 pt-4'>
        {/* header  */}
        <div className='flex items-center justify-between mb-2'>
            <span className='text-xs font-medium bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full capitalize'>{listing.category}</span>
            <span className='text-xs font-medium bg-gray-100 text-gray-600 px-3 py-1 rounded-full capitalize'>{listing.condition?.replace("_", " ")}</span>
        </div>

        <div className='mb-3'>
            <h2 className='text-lg font-semibold text-gray-800 line-clamp-1'>{listing.title}</h2>
        </div>
        
        {/* description */}
        <p className='text-sm text-gray-600 mb-4 line-clamp-2'>{listing.description}</p>
        
        {/* Stats */}
        <div className='flex items-center text-sm text-gray-500 mb-4'>
            <MapPin className='size-4 mr-1'/>
            <span className='capitalize'>{listing.owner?.campus || "Campus undisclosed"}</span>
        </div>

        <hr className='my-4 border-gray-200'/>

        {/* /footer */}
        <div className='flex items-center justify-between'>
            <div className='flex items-baseline'>
                <span className='text-xl font-bold text-slate-800'>
                    {currency}
                    {listing.price?.toLocaleString()}
                </span>
            </div>
            <button onClick={()=> {navigate(`/listing/${listing.id}`); scrollTo(0,0)}} className='px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition'>
                View Item
            </button>
        </div>
      </div>
    </div>
  )
}

export default ListingCard
