import React, { useEffect, useState } from 'react'
import Title from './Title'
import { useSelector } from 'react-redux'
import ListingCard from './ListingCard'
import Loading from '../pages/Loading'

const LatestListing = () => {
  const { listings } = useSelector(state => state.listing)
  const [isLoading, setIsLoading] = useState(true)

  // ✅ stop loading when listings are available
  useEffect(() => {
    if (listings && listings.length >= 0) {
      setIsLoading(false)
    }
  }, [listings])

  return (
    <div className="mt-20 mb-8">
      <Title
        title="Latest Listings"
        description="Browse recently listed secondhand items from students on your campus."
      />

      <div className="flex flex-col gap-6 px-6">
        {/* ✅ Loading */}
        {isLoading && (
          <div className="flex justify-center py-10">
            <Loading />
          </div>
        )}

        {/* ✅ No listings */}
        {!isLoading && listings.length === 0 && (
          <div className="text-center text-slate-500 py-10">
            No listings available
          </div>
        )}

        {/* ✅ Listings */}
        {!isLoading &&
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 px-6 md:px-16 lg:px-24 xl:px-32">
            {listings.slice(0, 8).map((listing, index) => (
              <ListingCard listing={listing} key={index} />
            ))}
          </div>
        }
      </div>
    </div>
  )
}

export default LatestListing
