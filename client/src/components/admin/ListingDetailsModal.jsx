import { XIcon, BadgeInfoIcon, GlobeIcon, UserIcon, TagIcon, SparklesIcon, CalendarIcon } from "lucide-react";
import { useEffect } from "react";

const ListingDetailsModal = ({ listing, onClose }) => {
    
    const currency = import.meta.env.VITE_CURRENCY || "$";

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => (document.body.style.overflow = "auto");
    }, []);

    // Helper functions for formatting
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const formatEnumInfo = (text) => {
        if (!text) return "N/A";
        return text.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-[100] backdrop-blur flex items-center justify-center sm:p-4">
            <div className="bg-white sm:rounded-lg w-full max-w-2xl h-screen sm:h-[600px] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-400 text-white p-5 sm:rounded-t-lg flex items-center justify-between">
                    <div className="flex flex-col">
                        <h3 className="font-semibold text-xl">{listing.title}</h3>
                        <p className="text-sm text-indigo-100 flex items-center gap-1 mt-1">
                            {listing.owner?.campus ? `Listed in ${listing.owner.campus}` : 'UniThrift Marketplace'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors flex-shrink-0">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto space-y-6 text-gray-700">
                    {/* Image Carousel */}
                    {listing.images && listing.images.length > 0 ? (
                       <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 overflow-x-auto">
                           {listing.images.map((img, i) => (
                               <img key={i} src={img} alt={`${listing.title}-${i}`} className="h-40 w-full object-cover rounded-lg border border-gray-200" />
                           ))}
                       </div>
                    ) : (
                       <div className="h-40 w-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 italic">
                           No images available
                       </div>
                    )}

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 flex items-start gap-3">
                            <TagIcon className="text-indigo-500 w-5 h-5 mt-0.5" />
                            <div>
                               <p className="font-medium text-gray-500">Category</p>
                               <p className="text-gray-900 font-semibold">{formatEnumInfo(listing.category)}</p>
                            </div>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 flex items-start gap-3">
                            <SparklesIcon className="text-indigo-500 w-5 h-5 mt-0.5" />
                            <div>
                               <p className="font-medium text-gray-500">Condition</p>
                               <p className="text-gray-900 font-semibold">{formatEnumInfo(listing.condition)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2 text-gray-900">
                            <BadgeInfoIcon className="w-5 h-5 text-indigo-500" /> Description
                        </h4>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <p className="text-sm leading-relaxed text-gray-600 space-y-2 whitespace-pre-wrap">{listing.description}</p>
                        </div>
                    </div>

                    {/* Status / Tags */}
                    <div className="flex flex-wrap items-center gap-3">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
                           listing.status === "active" ? "bg-green-100 text-green-700 border border-green-200" 
                           : listing.status === "pending" ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                           : listing.status === "sold" ? "bg-blue-100 text-blue-700 border border-blue-200"
                           : "bg-gray-100 text-gray-700 border border-gray-200"
                        }`}>
                           Status: {formatEnumInfo(listing.status)}
                        </span>
                        
                        {listing.featured && (
                           <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 border border-indigo-200 px-4 py-1.5 rounded-full shadow-sm">
                               ★ Featured Listing
                           </span>
                        )}
                    </div>

                    {/* Owner Info */}
                    {listing.owner && (
                        <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
                            <h4 className="font-semibold mb-3 flex items-center gap-2 text-gray-900">
                                <UserIcon className="w-4 h-4 text-indigo-500" /> Seller Information
                            </h4>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {listing.owner.image ? (
                                        <img src={listing.owner.image} alt={listing.owner.name} className="size-10 rounded-full object-cover border-2 border-indigo-100" />
                                    ) : (
                                        <div className="size-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border-2 border-indigo-200">
                                            {listing.owner.name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-medium text-gray-900">{listing.owner.name}</p>
                                        <p className="text-sm text-gray-500">{listing.owner.email}</p>
                                        {listing.owner.campus && <p className="text-xs text-indigo-600 mt-0.5">{listing.owner.campus}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Price Section */}
                    <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <CalendarIcon className="w-4 h-4" /> Listed on {formatDate(listing.createdAt)}
                        </div>
                        <div className="text-right">
                           <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5">Asking Price</p>
                           <p className="text-2xl font-bold text-indigo-600">{currency}{listing.price?.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListingDetailsModal;
