import AdminTitle from '../../components/admin/AdminTitle';
import { useEffect, useState } from 'react';
import { Loader2Icon} from 'lucide-react';
import ListingDetailsModal from '../../components/admin/ListingDetailsModal';
import { useAuthContext } from '../../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { backendUrl } from '../../configs/axios';
import { useDispatch } from 'react-redux';
import { getAllPublicListing } from '../../app/features/listingSlice';

const AllListings = () => {
    const {token} = useAuthContext();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [listings, setListings] = useState([]);
    const [showModal, setShowModal] = useState(null);

    const fetchAllListings = async () => {
        try {
            const {data} = await axios.get(`${backendUrl}/api/admin/all-listings`, {headers: {Authorization: `Bearer ${token}`}})
            setListings(data.listings);
            setLoading(false);
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
            console.log(error);
        }
    };

    const changeListingStatus = async (status, listing) => {
        try {
            toast.loading('Changing status...');
            const {data} = await axios.put(`${backendUrl}/api/admin/change-status/${listing.id}`, {status}, {headers: {Authorization: `Bearer ${token}`}})
            
            await fetchAllListings();
            dispatch(getAllPublicListing()); // Refresh marketplace immediately
            toast.dismiss();
            toast.success(data.message);
            
        } catch (error) {
            toast.dismissAll();
            toast.error(error?.response?.data?.message || error.message);
            console.log(error);
        }
    };

    useEffect(() => {
        fetchAllListings();
    }, []);

    return loading ? (
        <div className='flex items-center justify-center h-full'>
            <Loader2Icon className='animate-spin text-indigo-600 size-7' />
        </div>
    ) : (
        <div>
            <AdminTitle text1='Manage' text2=' Listings' />

            <div className='mt-10 overflow-x-auto bg-white border border-gray-200 w-full max-w-5xl rounded-xl'>
                <table className='w-full text-sm text-left  text-gray-700  '>
                    <thead className='text-xs uppercase border-b border-gray-200'>
                        <tr>
                            <th className='pl-4 py-3'> # </th>
                            <th className='px-4 py-3'>Title</th>
                            <th className='px-4 py-3'>Category</th>
                            <th className='px-4 py-3'>Condition</th>
                            <th className='px-4 py-3'>Price</th>
                            <th className='px-4 py-3'>Status</th>
                            <th className='px-4 py-3'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listings.map((listing, index) => (
                            <tr onClick={() => setShowModal(listing)} key={index} className='border-t border-gray-200 hover:bg-indigo-50/50 cursor-pointer'>
                                <td className='pl-4 py-3'>{index + 1}.</td>
                                <td className='px-4 py-3'>{listing.title}</td>
                                <td className='px-4 py-3 capitalize'>{listing.category}</td>
                                <td className='px-4 py-3 capitalize'>{listing.condition?.replace("_", " ")}</td>
                                <td className='px-4 py-3'>{listing.price}</td>
                                <td className='px-4 py-3'>
                                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${listing.status === 'active' ? 'bg-green-100 text-green-700' : listing.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                        {listing.status}
                                    </span>
                                </td>
                                <td className='px-4 py-3'>
                                    <div onClick={(e) => e.stopPropagation()} className='flex gap-2'>
                                        {listing.status === 'pending' && (
                                           <>
                                             <button onClick={() => changeListingStatus('active', listing)} className='text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded'>Approve</button>
                                             <button onClick={() => changeListingStatus('rejected', listing)} className='text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded'>Reject</button>
                                           </>
                                        )}
                                        {listing.status === 'active' && (
                                            <button onClick={() => changeListingStatus('rejected', listing)} className='text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded'>Revoke</button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showModal && <ListingDetailsModal listing={showModal} onClose={() => setShowModal(null)} />}
        </div>
    );
};

export default AllListings;
