import React, { useEffect, useState } from "react";
import { Loader2Icon, HeartCrack } from "lucide-react";
import axios from "axios";
import { backendUrl } from "../configs/axios";
import { useAuthContext } from "../context/AuthContext";
import ListingCard from "../components/ListingCard";
import toast from "react-hot-toast";

const Wishlist = () => {
    const { token } = useAuthContext();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchWishlist = async () => {
        try {

            const { data } = await axios.get(`${backendUrl}/api/wishlist`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setWishlist(data.listings || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load wishlist");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    if (loading) {
        return (
            <div className="h-screen flex justify-center items-center">
                <Loader2Icon className="size-7 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen py-10 px-6 md:px-16 lg:px-24">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 py-2 border-b border-gray-200">
                My Wishlist
            </h1>

            {wishlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                    <HeartCrack className="size-16 text-gray-300 mb-4" />
                    <h2 className="text-xl font-medium text-gray-500">
                        Your wishlist is empty
                    </h2>
                    <p className="text-gray-400 mt-2">
                        Browse the marketplace and save items you're interested in!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {wishlist.map((item) => (
                        <ListingCard key={item.id} listing={item} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
