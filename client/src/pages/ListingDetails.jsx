import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    ArrowLeftIcon,
    Calendar,
    ChevronLeftIcon,
    ChevronRightIcon,
    Heart,
    Loader2Icon,
    MapPin,
    StarIcon,
    UserCircleIcon,
    Package,
} from "lucide-react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import axios from "axios";
import { backendUrl } from "../configs/axios";

const CONDITION_LABELS = {
    new: "New",
    like_new: "Like New",
    good: "Good",
    fair: "Fair",
    poor: "Poor",
};

const StarRating = ({ value, onChange, interactive = false }) => {
    const [hover, setHover] = useState(0);
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type={interactive ? "button" : "span"}
                    onClick={interactive ? () => onChange(star) : undefined}
                    onMouseEnter={interactive ? () => setHover(star) : undefined}
                    onMouseLeave={interactive ? () => setHover(0) : undefined}
                    className={interactive ? "cursor-pointer" : "cursor-default"}
                    disabled={!interactive}
                >
                    <StarIcon
                        className={`size-5 transition-colors ${
                            (hover || value) >= star
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                        }`}
                    />
                </button>
            ))}
        </div>
    );
};

const ListingDetails = () => {
    const { user, token } = useAuthContext();
    const navigate = useNavigate();
    const currency = import.meta.env.VITE_CURRENCY || "₹";

    const [listing, setListing] = useState(null);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [current, setCurrent] = useState(0);

    // Rating state
    const [ratingData, setRatingData] = useState({ ratings: [], averageRating: 0, totalRatings: 0 });
    const [myRating, setMyRating] = useState(0);
    const [myReview, setMyReview] = useState("");
    const [submittingRating, setSubmittingRating] = useState(false);

    const { listingId } = useParams();
    const { listings } = useSelector((state) => state.listing);

    const images = listing?.images || [];

    const prevSlide = () => setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    const nextSlide = () => setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));

    const fetchSellerRatings = async (sellerId) => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/rating/${sellerId}`);
            setRatingData(data);
        } catch {}
    };

    useEffect(() => {
        const found = listings.find((l) => l.id === listingId);
        if (found) {
            setListing(found);
            fetchSellerRatings(found.ownerId);
        }
    }, [listingId, listings]);

    const toggleWishlist = async () => {
        try {
            if (!user) return navigate("/login");
            const { data } = await axios.post(
                `${backendUrl}/api/wishlist/toggle`,
                { listingId: listing.id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setIsWishlisted(data.isWishlisted);
            toast.success(data.message);
        } catch {
            toast.error("Failed to update wishlist");
        }
    };



    const submitRating = async (e) => {
        e.preventDefault();
        if (!user) return navigate("/login");
        if (myRating === 0) return toast.error("Please select a star rating");
        try {
            setSubmittingRating(true);
            await axios.post(
                `${backendUrl}/api/rating`,
                { sellerId: listing.ownerId, rating: myRating, review: myReview },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Rating submitted!");
            setMyRating(0);
            setMyReview("");
            fetchSellerRatings(listing.ownerId);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to submit rating");
        } finally {
            setSubmittingRating(false);
        }
    };

    if (!listing) {
        return (
            <div className="h-screen flex justify-center items-center">
                <Loader2Icon className="size-7 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="mx-auto min-h-screen px-6 md:px-16 lg:px-24 xl:px-32 pb-16 bg-slate-50">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 py-5 text-sm transition"
            >
                <ArrowLeftIcon className="size-4" /> Back to Listings
            </button>

            <div className="flex items-start max-md:flex-col gap-8">
                {/* Left: images + details */}
                <div className="flex-1 max-md:w-full space-y-5">

                    {/* Title + Price Card */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs bg-indigo-100 text-indigo-600 border border-indigo-200 px-2.5 py-0.5 rounded-full font-medium capitalize">
                                        {listing.category}
                                    </span>
                                    <span className="text-xs bg-gray-100 text-gray-600 border border-gray-200 px-2.5 py-0.5 rounded-full font-medium">
                                        {CONDITION_LABELS[listing.condition] || listing.condition}
                                    </span>
                                    {listing.featured && (
                                        <span className="text-xs bg-gradient-to-r from-pink-500 to-purple-500 text-white px-2.5 py-0.5 rounded-full font-medium">
                                            Featured
                                        </span>
                                    )}
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">{listing.title}</h2>
                            </div>
                            <div className="text-right">
                                <h3 className="text-3xl font-bold text-indigo-600">
                                    {currency}{listing.price?.toLocaleString()}
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* Image Slider */}
                    {images.length > 0 && (
                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                            <div className="relative w-full aspect-video overflow-hidden">
                                <div
                                    className="flex h-full transition-transform duration-300 ease-in-out"
                                    style={{ transform: `translateX(-${current * 100}%)` }}
                                >
                                    {images.map((img, idx) => (
                                        <img key={idx} src={img} alt="Listing" className="w-full h-full object-cover shrink-0" />
                                    ))}
                                </div>
                                {images.length > 1 && (
                                    <>
                                        <button onClick={prevSlide} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition">
                                            <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
                                        </button>
                                        <button onClick={nextSlide} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition">
                                            <ChevronRightIcon className="w-5 h-5 text-gray-700" />
                                        </button>
                                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                                            {images.map((_, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setCurrent(idx)}
                                                    className={`w-2.5 h-2.5 rounded-full transition ${current === idx ? "bg-indigo-600 scale-110" : "bg-gray-300"}`}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                        <div className="p-4 border-b border-gray-100">
                            <h4 className="font-semibold text-gray-800">Description</h4>
                        </div>
                        <div className="p-4 text-sm text-gray-600 leading-relaxed">
                            {listing.description || "No description provided."}
                        </div>
                    </div>

                    {/* Item Details */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                        <div className="p-4 border-b border-gray-100">
                            <h4 className="font-semibold text-gray-800">Item Details</h4>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 text-sm">
                            <div className="p-3 bg-gray-50 rounded-xl">
                                <p className="text-gray-400 text-xs mb-1">Category</p>
                                <p className="font-semibold capitalize text-gray-700">{listing.category}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl">
                                <p className="text-gray-400 text-xs mb-1">Condition</p>
                                <p className="font-semibold capitalize text-gray-700">{CONDITION_LABELS[listing.condition] || listing.condition}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl">
                                <p className="text-gray-400 text-xs mb-1 flex items-center gap-1"><MapPin className="size-3" /> Campus</p>
                                <p className="font-semibold capitalize text-gray-700 truncate">{listing.owner?.campus || "Undisclosed"}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl">
                                <p className="text-gray-400 text-xs mb-1 flex items-center gap-1"><Calendar className="size-3" /> Listed</p>
                                <p className="font-semibold text-gray-700">{new Date(listing.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Seller Ratings Section */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                            <h4 className="font-semibold text-gray-800">Seller Ratings</h4>
                            <div className="flex items-center gap-2">
                                <StarRating value={Math.round(ratingData.averageRating)} />
                                <span className="text-sm font-semibold text-gray-700">
                                    {ratingData.averageRating > 0 ? ratingData.averageRating.toFixed(1) : "—"}
                                </span>
                                <span className="text-xs text-gray-400">({ratingData.totalRatings} review{ratingData.totalRatings !== 1 ? "s" : ""})</span>
                            </div>
                        </div>

                        {/* Recent reviews */}
                        <div className="divide-y divide-gray-100 max-h-56 overflow-y-auto">
                            {ratingData.ratings.length === 0 ? (
                                <p className="text-sm text-gray-400 p-4 text-center">No reviews yet for this seller.</p>
                            ) : (
                                ratingData.ratings.slice(0, 5).map((r) => (
                                    <div key={r.id} className="p-4 flex gap-3">
                                        <div className="size-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs shrink-0">
                                            {r.reviewer?.name?.charAt(0).toUpperCase() || "U"}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-medium text-gray-700">{r.reviewer?.name}</span>
                                                <StarRating value={r.rating} />
                                            </div>
                                            {r.review && <p className="text-xs text-gray-500">{r.review}</p>}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Rate this seller form */}
                        {user && user.id !== listing.ownerId && (
                            <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                                <p className="text-sm font-medium text-gray-700 mb-3">Rate this seller</p>
                                <form onSubmit={submitRating} className="space-y-3">
                                    <StarRating value={myRating} onChange={setMyRating} interactive />
                                    <textarea
                                        value={myReview}
                                        onChange={(e) => setMyReview(e.target.value)}
                                        placeholder="Share your experience (optional)..."
                                        rows={2}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                    />
                                    <button
                                        type="submit"
                                        disabled={submittingRating || myRating === 0}
                                        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-sm px-5 py-2 rounded-lg font-medium transition"
                                    >
                                        {submittingRating ? "Submitting..." : "Submit Review"}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: seller info + actions */}
                <div className="bg-white min-w-full md:min-w-[340px] md:max-w-[340px] rounded-2xl border border-gray-200 p-6 shadow-sm max-md:mb-10 self-start sticky top-24">
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <UserCircleIcon className="size-5 text-indigo-500" /> Seller Profile
                    </h4>

                    <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
                        <div className="size-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg shrink-0">
                            {listing.owner?.image ? (
                                <img src={listing.owner.image} alt="seller" className="size-12 rounded-full object-cover" />
                            ) : (
                                listing.owner?.name?.charAt(0).toUpperCase() || "S"
                            )}
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800">{listing.owner?.name}</p>
                            {listing.owner?.campus && (
                                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                    <MapPin className="size-3" /> {listing.owner.campus}
                                </p>
                            )}
                            {ratingData.totalRatings > 0 && (
                                <div className="flex items-center gap-1.5 mt-1">
                                    <StarIcon className="size-3.5 fill-yellow-400 text-yellow-400" />
                                    <span className="text-xs font-semibold text-gray-700">{ratingData.averageRating.toFixed(1)}</span>
                                    <span className="text-xs text-gray-400">({ratingData.totalRatings})</span>
                                </div>
                            )}
                        </div>
                    </div>


                    <button
                        onClick={toggleWishlist}
                        className={`w-full py-3 rounded-xl border-2 transition text-sm font-semibold flex items-center justify-center gap-2 ${
                            isWishlisted
                                ? "border-pink-500 text-pink-600 bg-pink-50"
                                : "border-gray-200 text-gray-600 hover:border-pink-300 hover:text-pink-500"
                        }`}
                    >
                        <Heart className={`size-5 ${isWishlisted ? "fill-pink-600" : ""}`} />
                        {isWishlisted ? "Saved to Wishlist" : "Save to Wishlist"}
                    </button>

                    <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400 space-y-1">
                        <p className="flex items-center gap-1.5">
                            <Package className="size-3.5" />
                            Listed on {new Date(listing.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListingDetails;
