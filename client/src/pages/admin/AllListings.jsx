import AdminTitle from '../../components/admin/AdminTitle';
import { useEffect, useState } from 'react';
import { Loader2Icon, XIcon } from 'lucide-react';
import ListingDetailsModal from '../../components/admin/ListingDetailsModal';
import { useAuthContext } from '../../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { backendUrl } from '../../configs/axios';
import { useDispatch } from 'react-redux';
import { getAllPublicListing } from '../../app/features/listingSlice';

/* ── Reject Reason Modal ─────────────────────────────────────────────────────── */
const RejectReasonModal = ({ listing, onConfirm, onCancel }) => {
    const [reason, setReason] = useState('');
    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
        }}>
            <div style={{
                background: '#fff', borderRadius: '16px', padding: '28px',
                width: '100%', maxWidth: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '16px', color: '#1e293b', margin: 0 }}>
                        Reject Listing
                    </h3>
                    <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                        <XIcon size={18} />
                    </button>
                </div>
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
                    Rejecting <strong>"{listing.title}"</strong>. Please provide a reason — it will be shown to the seller.
                </p>
                <textarea
                    autoFocus
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    placeholder="e.g. This item does not comply with campus marketplace guidelines..."
                    rows={3}
                    style={{
                        width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0',
                        borderRadius: '10px', fontSize: '13px', resize: 'vertical',
                        outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', color: '#1e293b',
                    }}
                    onFocus={e => e.target.style.borderColor = '#6366f1'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
                <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                    <button
                        onClick={onCancel}
                        style={{
                            flex: 1, padding: '10px', border: '1.5px solid #e2e8f0',
                            borderRadius: '8px', background: '#fff', fontSize: '13px',
                            fontWeight: 600, cursor: 'pointer', color: '#64748b',
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(reason.trim() || 'Rejected by admin')}
                        style={{
                            flex: 1, padding: '10px', border: 'none', borderRadius: '8px',
                            background: '#ef4444', color: '#fff', fontSize: '13px',
                            fontWeight: 700, cursor: 'pointer',
                        }}
                    >
                        Confirm Reject
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ── AI Badge with tooltip ───────────────────────────────────────────────────── */
const AiBadge = ({ reason }) => {
    const [show, setShow] = useState(false);
    return (
        <span
            style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            <span className='ml-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-violet-100 text-violet-700 cursor-default select-none'>
                ✦ AI
            </span>
            {show && reason && (
                <span style={{
                    position: 'absolute',
                    bottom: '120%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#1e1b4b',
                    color: '#fff',
                    fontSize: '11px',
                    padding: '6px 10px',
                    borderRadius: '7px',
                    whiteSpace: 'nowrap',
                    maxWidth: '220px',
                    whiteSpace: 'normal',
                    lineHeight: '1.4',
                    zIndex: 50,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                    pointerEvents: 'none',
                }}>
                    <span style={{ color: '#a78bfa', fontWeight: 700 }}>Gemini:</span> {reason}
                    <span style={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        border: '5px solid transparent',
                        borderTopColor: '#1e1b4b',
                    }} />
                </span>
            )}
        </span>
    );
};

/* ── Status pill ─────────────────────────────────────────────────────────────── */
const StatusPill = ({ listing }) => {
    const colorMap = {
        active: 'bg-green-100 text-green-700',
        pending: 'bg-yellow-100 text-yellow-700',
        rejected: 'bg-red-100 text-red-700',
        sold: 'bg-blue-100 text-blue-700',
    };
    const color = colorMap[listing.status] || 'bg-gray-100 text-gray-600';

    return (
        <span className='flex items-center gap-0.5'>
            <span className={`px-2 py-1 text-xs rounded-full font-medium ${color}`}>
                {listing.status}
            </span>
            {listing.aiApproved === true && <AiBadge reason={listing.aiReason} />}
            {listing.aiApproved === false && (
                <span className='ml-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-600 cursor-default select-none'>
                    ✦ AI
                </span>
            )}
        </span>
    );
};

/* ── Main Component ──────────────────────────────────────────────────────────── */
const AllListings = () => {
    const { token } = useAuthContext();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [listings, setListings] = useState([]);
    const [showModal, setShowModal] = useState(null);
    const [rejectTarget, setRejectTarget] = useState(null); // listing pending rejection

    const fetchAllListings = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/all-listings`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setListings(data.listings);
            setLoading(false);
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
            console.log(error);
        }
    };

    const changeListingStatus = async (status, listing, reason) => {
        try {
            toast.loading('Changing status...');
            const { data } = await axios.put(
                `${backendUrl}/api/admin/change-status/${listing.id}`,
                { status, reason },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            await fetchAllListings();
            dispatch(getAllPublicListing());
            toast.dismiss();
            toast.success(data.message);
        } catch (error) {
            toast.dismiss();
            toast.error(error?.response?.data?.message || error.message);
            console.log(error);
        }
    };

    // Called when admin confirms rejection with a reason
    const handleRejectConfirm = async (reason) => {
        const listing = rejectTarget;
        setRejectTarget(null);
        await changeListingStatus('rejected', listing, reason);
    };

    useEffect(() => { fetchAllListings(); }, []);

    return loading ? (
        <div className='flex items-center justify-center h-full'>
            <Loader2Icon className='animate-spin text-indigo-600 size-7' />
        </div>
    ) : (
        <div>
            <AdminTitle text1='Manage' text2=' Listings' />

            {/* Legend */}
            <div className='mt-4 flex items-center gap-2 text-xs text-gray-500'>
                <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded bg-violet-100 text-violet-700 font-bold'>✦ AI</span>
                <span>= Auto-moderated by Gemini AI. Hover to see the reason.</span>
            </div>

            <div className='mt-4 overflow-x-auto bg-white border border-gray-200 w-full max-w-5xl rounded-xl'>
                <table className='w-full text-sm text-left text-gray-700'>
                    <thead className='text-xs uppercase border-b border-gray-200'>
                        <tr>
                            <th className='pl-4 py-3'>#</th>
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
                            <tr
                                onClick={() => setShowModal(listing)}
                                key={index}
                                className='border-t border-gray-200 hover:bg-indigo-50/50 cursor-pointer'
                            >
                                <td className='pl-4 py-3'>{index + 1}.</td>
                                <td className='px-4 py-3'>{listing.title}</td>
                                <td className='px-4 py-3 capitalize'>{listing.category}</td>
                                <td className='px-4 py-3 capitalize'>{listing.condition?.replace('_', ' ')}</td>
                                <td className='px-4 py-3'>{listing.price}</td>
                                <td className='px-4 py-3'>
                                    <StatusPill listing={listing} />
                                </td>
                                <td className='px-4 py-3'>
                                    <div onClick={(e) => e.stopPropagation()} className='flex gap-2'>
                                        {listing.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => changeListingStatus('active', listing)}
                                                    className='text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded'
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => setRejectTarget(listing)}
                                                    className='text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded'
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        {listing.status === 'active' && (
                                            <button
                                                onClick={() => setRejectTarget(listing)}
                                                className='text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded'
                                            >
                                                Revoke
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <ListingDetailsModal listing={showModal} onClose={() => setShowModal(null)} />
            )}

            {rejectTarget && (
                <RejectReasonModal
                    listing={rejectTarget}
                    onConfirm={handleRejectConfirm}
                    onCancel={() => setRejectTarget(null)}
                />
            )}
        </div>
    );
};

export default AllListings;
