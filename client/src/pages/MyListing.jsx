import React, { useEffect, useState } from "react";
import {
    CheckCircle, CheckCircleIcon, Clock, DollarSign, EditIcon, Eye,
    Package, Plus, Tag, TrashIcon, TrendingUp, XCircleIcon, BanIcon,
    ImageIcon, ChevronDown
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import StatCard from "../components/StatCard";
import { useAuthContext } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import axios from "axios";
import { getAllPublicListing, getAllUserListing } from "../app/features/listingSlice";
import { backendUrl } from "../configs/axios";

const CONDITION_LABELS = {
    new: "New",
    like_new: "Like New",
    good: "Good",
    fair: "Fair",
    poor: "Poor",
};

const MyListing = () => {
    const { userListings } = useSelector((state) => state.listing);
    const currency = import.meta.env.VITE_CURRENCY || "₹";
    const navigate = useNavigate();
    const { token } = useAuthContext();
    const dispatch = useDispatch();

    const totalValue = userListings.reduce((sum, l) => sum + (l.price || 0), 0);
    const activeListings = userListings.filter((l) => l.status === "active").length;
    const pendingListings = userListings.filter((l) => l.status === "pending").length;
    const soldListings = userListings.filter((l) => l.status === "sold").length;

    const getStatusInfo = (status) => {
        switch (status) {
            case "active":   return { icon: <CheckCircleIcon className="size-3.5" />, color: "text-green-600 bg-green-50 border-green-200" };
            case "pending":  return { icon: <Clock className="size-3.5" />, color: "text-amber-600 bg-amber-50 border-amber-200" };
            case "sold":     return { icon: <DollarSign className="size-3.5" />, color: "text-blue-600 bg-blue-50 border-blue-200" };
            case "rejected": return { icon: <XCircleIcon className="size-3.5" />, color: "text-red-600 bg-red-50 border-red-200" };
            case "ban":      return { icon: <BanIcon className="size-3.5" />, color: "text-red-600 bg-red-50 border-red-200" };
            default:         return { icon: <Clock className="size-3.5" />, color: "text-gray-600 bg-gray-50 border-gray-200" };
        }
    };

    const markSold = async (listingId) => {
        try {
            toast.loading("Marking as sold...");
            const { data } = await axios.put(
                `${backendUrl}/api/listing/mark-sold/${listingId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            dispatch(getAllUserListing({ token }));
            dispatch(getAllPublicListing());
            toast.dismiss();
            toast.success(data.message);
        } catch (error) {
            toast.dismiss();
            toast.error(error?.response?.data?.message || error.message);
        }
    };

    const deleteListing = async (listingId) => {
        const confirm = window.confirm("Are you sure you want to delete this listing?");
        if (!confirm) return;
        try {
            toast.loading("Deleting listing...");
            const { data } = await axios.delete(
                `${backendUrl}/api/listing/${listingId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            dispatch(getAllUserListing({ token }));
            dispatch(getAllPublicListing());
            toast.dismiss();
            toast.success(data.message);
        } catch (error) {
            toast.dismiss();
            toast.error(error?.response?.data?.message || error.message);
        }
    };

    return (
        <div className="px-6 md:px-16 lg:px-24 xl:px-32 pt-8 pb-16">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">My Listings</h1>
                    <p className="text-gray-500 mt-1 text-sm">Manage the items you're selling on UniThrift</p>
                </div>
                <button
                    onClick={() => navigate("/create-listing")}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center space-x-2 mt-4 md:mt-0 transition shadow-sm"
                >
                    <Plus className="size-4" />
                    <span>New Listing</span>
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard title="Total Listings" value={userListings.length} icon={<Eye className="size-6 text-indigo-600" />} color="indigo" />
                <StatCard title="Active" value={activeListings} icon={<CheckCircle className="size-6 text-green-600" />} color="green" />
                <StatCard title="Pending Review" value={pendingListings} icon={<Clock className="size-6 text-amber-600" />} color="yellow" />
                <StatCard title="Total Value" value={`${currency}${totalValue.toLocaleString()}`} icon={<DollarSign className="size-6 text-yellow-600" />} color="yellow" />
            </div>

            {/* Listings Grid */}
            {userListings.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-20 text-center shadow-sm">
                    <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8 text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No listings yet</h3>
                    <p className="text-gray-500 mb-6 text-sm">Start selling items you no longer need on your campus.</p>
                    <button
                        onClick={() => navigate("/create-listing")}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition"
                    >
                        Create First Listing
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userListings.map((listing) => {
                        const statusInfo = getStatusInfo(listing.status);
                        return (
                            <div
                                key={listing.id}
                                className="bg-white rounded-2xl border border-gray-200 hover:shadow-lg shadow-gray-100 transition-shadow overflow-hidden"
                            >
                                {/* Image */}
                                <div className="w-full h-44 bg-gray-100 relative overflow-hidden">
                                    {listing.images && listing.images.length > 0 ? (
                                        <img
                                            src={listing.images[0]}
                                            alt={listing.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full text-gray-300 flex-col gap-2">
                                            <ImageIcon className="size-8" />
                                            <span className="text-xs">No image</span>
                                        </div>
                                    )}
                                    {/* Status badge overlay */}
                                    <span className={`absolute top-2 right-2 flex items-center gap-1 border text-xs font-medium px-2.5 py-1 rounded-full ${statusInfo.color}`}>
                                        {statusInfo.icon}
                                        <span className="capitalize">{listing.status}</span>
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-base font-semibold text-gray-800 line-clamp-1 flex-1 mr-2">
                                            {listing.title}
                                        </h3>
                                        <span className="text-lg font-bold text-indigo-600 whitespace-nowrap">
                                            {currency}{listing.price?.toLocaleString()}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded-full capitalize">
                                            {listing.category}
                                        </span>
                                        <span className="text-xs bg-gray-50 text-gray-600 border border-gray-200 px-2 py-0.5 rounded-full">
                                            {CONDITION_LABELS[listing.condition] || listing.condition}
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                        {listing.status === "active" && (
                                            <button
                                                onClick={() => markSold(listing.id)}
                                                className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition"
                                            >
                                                <TrendingUp className="size-3.5" /> Mark Sold
                                            </button>
                                        )}
                                        {listing.status !== "active" && <span />}

                                        <div className="flex items-center gap-2">
                                            {listing.status !== "sold" && (
                                                <button
                                                    onClick={() => deleteListing(listing.id)}
                                                    className="p-2 border border-gray-200 rounded-lg hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition"
                                                    title="Delete listing"
                                                >
                                                    <TrashIcon className="size-4" />
                                                </button>
                                            )}
                                            {listing.status !== "sold" && (
                                                <button
                                                    onClick={() => navigate(`/edit-listing/${listing.id}`)}
                                                    className="p-2 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:text-indigo-500 hover:border-indigo-200 transition"
                                                    title="Edit listing"
                                                >
                                                    <EditIcon className="size-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyListing;
