import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setChat } from "../app/features/chatSlice";
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
    Sparkles,
} from "lucide-react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import axios from "axios";
import { backendUrl } from "../configs/axios";
import ListingCard from "../components/ListingCard";

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type={interactive ? "button" : "span"}
                    onClick={interactive ? () => onChange(star) : undefined}
                    onMouseEnter={interactive ? () => setHover(star) : undefined}
                    onMouseLeave={interactive ? () => setHover(0) : undefined}
                    style={{ cursor: interactive ? 'pointer' : 'default', background: 'none', border: 'none', padding: 0 }}
                    disabled={!interactive}
                >
                    <StarIcon
                        style={{
                            width: 18, height: 18, transition: 'color 0.1s',
                            color: (hover || value) >= star ? '#FBBF24' : '#D1D5DB',
                            fill: (hover || value) >= star ? '#FBBF24' : 'none',
                        }}
                    />
                </button>
            ))}
        </div>
    );
};

// Shared card style
const card = {
    background: 'var(--surface-2)',
    border: '0.5px solid var(--border)',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 16,
};
const cardHeader = {
    padding: '14px 18px',
    borderBottom: '0.5px solid var(--border)',
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 600,
    fontSize: 14,
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
};

const ListingDetails = () => {
    const { user, token } = useAuthContext();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currency = import.meta.env.VITE_CURRENCY || "₹";

    const [listing, setListing] = useState(null);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [current, setCurrent] = useState(0);

    // Rating state
    const [ratingData, setRatingData] = useState({ ratings: [], averageRating: 0, totalRatings: 0 });
    const [myRating, setMyRating] = useState(0);
    const [myReview, setMyReview] = useState("");
    const [submittingRating, setSubmittingRating] = useState(false);

    // Recommendations state
    const [recommendations, setRecommendations] = useState([]);
    const [loadingRecs, setLoadingRecs] = useState(false);

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

    // Fetch TF-IDF recommendations whenever the listing changes
    useEffect(() => {
        if (!listingId) return;
        const fetchRecs = async () => {
            setLoadingRecs(true);
            try {
                const { data } = await axios.get(`${backendUrl}/api/listing/recommendations/${listingId}`);
                setRecommendations(data);
            } catch (e) {
                console.error("Recommendations fetch failed", e);
            } finally {
                setLoadingRecs(false);
            }
        };
        fetchRecs();
    }, [listingId]);

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
            <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--surface-0)' }}>
                <Loader2Icon style={{ width: 28, height: 28, animation: 'spin 1s linear infinite', color: 'var(--orange)' }} />
            </div>
        );
    }

    const sellerInitials = listing.owner?.name
        ? listing.owner.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
        : 'UT';

    return (
        <div style={{ minHeight: '100vh', padding: '0 28px', maxWidth: 1000, margin: '0 auto', background: 'var(--surface-0)', paddingBottom: 64 }}>
            <button
                onClick={() => navigate(-1)}
                style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    color: 'var(--text-secondary)', background: 'none', border: 'none',
                    cursor: 'pointer', fontSize: 13, padding: '20px 0',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--orange)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
                <ArrowLeftIcon className="size-4" /> Back to Listings
            </button>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>
                {/* Left: images + details */}
                <div style={{ flex: 1, minWidth: 280 }}>

                    {/* Title + Price Card */}
                    <div style={card}>
                        <div style={{ padding: '18px 20px' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                                <span className="ut-cat-tag">{listing.category}</span>
                                <span style={{
                                    fontSize: 10, fontWeight: 600, padding: '2px 8px',
                                    background: 'var(--surface-1)', borderRadius: 999,
                                    color: 'var(--text-secondary)', textTransform: 'capitalize',
                                }}>
                                    {CONDITION_LABELS[listing.condition] || listing.condition}
                                </span>
                                {listing.featured && (
                                    <span className="ut-badge-ai" style={{ position: 'static' }}>✦ AI verified</span>
                                )}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                                    {listing.title}
                                </h2>
                                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 700, color: 'var(--orange)' }}>
                                    {currency}{listing.price?.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Image Slider */}
                    {images.length > 0 && (
                        <div style={{ ...card, overflow: 'hidden' }}>
                            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
                                <div
                                    style={{ display: 'flex', height: '100%', transition: 'transform 0.3s ease-in-out', transform: `translateX(-${current * 100}%)` }}
                                >
                                    {images.map((img, idx) => (
                                        <img key={idx} src={img} alt="Listing" style={{ width: '100%', height: '100%', objectFit: 'cover', flexShrink: 0 }} />
                                    ))}
                                </div>
                                {images.length > 1 && (
                                    <>
                                        <button onClick={prevSlide} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(250,250,248,0.9)', border: 'none', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                            <ChevronLeftIcon style={{ width: 18, height: 18, color: 'var(--text-primary)' }} />
                                        </button>
                                        <button onClick={nextSlide} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(250,250,248,0.9)', border: 'none', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                            <ChevronRightIcon style={{ width: 18, height: 18, color: 'var(--text-primary)' }} />
                                        </button>
                                        <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
                                            {images.map((_, idx) => (
                                                <button key={idx} onClick={() => setCurrent(idx)} style={{
                                                    width: 8, height: 8, borderRadius: '50%', border: 'none', cursor: 'pointer',
                                                    background: current === idx ? 'var(--orange)' : 'rgba(255,255,255,0.6)',
                                                    transform: current === idx ? 'scale(1.2)' : 'scale(1)',
                                                    transition: 'all 0.2s',
                                                }} />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    <div style={card}>
                        <div style={cardHeader}>Description</div>
                        <div style={{ padding: '14px 18px', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                            {listing.description || "No description provided."}
                        </div>
                    </div>

                    {/* Item Details */}
                    <div style={card}>
                        <div style={cardHeader}>Item Details</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, padding: 14 }}>
                            {[
                                { label: 'Category', value: listing.category, capitalize: true },
                                { label: 'Condition', value: CONDITION_LABELS[listing.condition] || listing.condition },
                                { label: 'Campus', value: listing.owner?.campus || 'Undisclosed', icon: <MapPin style={{ width: 11, height: 11 }} /> },
                                { label: 'Listed', value: new Date(listing.createdAt).toLocaleDateString(), icon: <Calendar style={{ width: 11, height: 11 }} /> },
                            ].map(({ label, value, icon, capitalize }) => (
                                <div key={label} style={{ padding: '10px 14px', background: 'var(--surface-1)', borderRadius: 10 }}>
                                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
                                        {icon}{label}
                                    </p>
                                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', textTransform: capitalize ? 'capitalize' : 'none' }}>
                                        {value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Seller Ratings */}
                    <div style={card}>
                        <div style={cardHeader}>
                            <span>Seller Ratings</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <StarRating value={Math.round(ratingData.averageRating)} />
                                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                                    {ratingData.averageRating > 0 ? ratingData.averageRating.toFixed(1) : "—"}
                                </span>
                                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>({ratingData.totalRatings} review{ratingData.totalRatings !== 1 ? "s" : ""})</span>
                            </div>
                        </div>

                        <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                            {ratingData.ratings.length === 0 ? (
                                <p style={{ fontSize: 13, color: 'var(--text-muted)', padding: 16, textAlign: 'center' }}>No reviews yet for this seller.</p>
                            ) : (
                                ratingData.ratings.slice(0, 5).map((r) => (
                                    <div key={r.id} style={{ padding: '12px 18px', display: 'flex', gap: 12, borderBottom: '0.5px solid var(--border)' }}>
                                        <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--surface-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', flexShrink: 0, border: '0.5px solid var(--border)' }}>
                                            {r.reviewer?.name?.charAt(0).toUpperCase() || "U"}
                                        </div>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{r.reviewer?.name}</span>
                                                <StarRating value={r.rating} />
                                            </div>
                                            {r.review && <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{r.review}</p>}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Rate seller form */}
                        {user && user.id !== listing.ownerId && (
                            <div style={{ padding: '14px 18px', borderTop: '0.5px solid var(--border)', background: 'var(--surface-1)' }}>
                                <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 10 }}>Rate this seller</p>
                                <form onSubmit={submitRating} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    <StarRating value={myRating} onChange={setMyRating} interactive />
                                    <textarea
                                        value={myReview}
                                        onChange={(e) => setMyReview(e.target.value)}
                                        placeholder="Share your experience (optional)..."
                                        rows={2}
                                        style={{
                                            width: '100%', border: '0.5px solid var(--border-strong)',
                                            borderRadius: 8, padding: '8px 12px',
                                            fontSize: 13, color: 'var(--text-primary)',
                                            background: 'var(--surface-2)', resize: 'none', outline: 'none',
                                        }}
                                    />
                                    <button
                                        type="submit"
                                        disabled={submittingRating || myRating === 0}
                                        className="ut-nav-pill primary"
                                        style={{ alignSelf: 'flex-start', opacity: (submittingRating || myRating === 0) ? 0.5 : 1 }}
                                    >
                                        {submittingRating ? "Submitting..." : "Submit Review"}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: seller info + actions */}
                <div style={{
                    ...card,
                    minWidth: 280, maxWidth: 320, flexShrink: 0,
                    position: 'sticky', top: 80, alignSelf: 'flex-start',
                    marginBottom: 0,
                }}>
                    <div style={{ padding: '16px 18px', borderBottom: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <UserCircleIcon style={{ width: 16, height: 16, color: 'var(--orange)' }} />
                        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>Seller Profile</span>
                    </div>

                    <div style={{ padding: 18 }}>
                        {/* Seller info */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: 'var(--surface-1)', borderRadius: 10, marginBottom: 14 }}>
                            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#F8F7F4', flexShrink: 0, overflow: 'hidden' }}>
                                {listing.owner?.image ? (
                                    <img src={listing.owner.image} alt="seller" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : sellerInitials}
                            </div>
                            <div>
                                <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', fontFamily: "'Space Grotesk', sans-serif" }}>{listing.owner?.name}</p>
                                {listing.owner?.campus && (
                                    <p style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
                                        <MapPin style={{ width: 11, height: 11 }} /> {listing.owner.campus}
                                    </p>
                                )}
                                {ratingData.totalRatings > 0 && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                                        <StarIcon style={{ width: 12, height: 12, fill: '#FBBF24', color: '#FBBF24' }} />
                                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{ratingData.averageRating.toFixed(1)}</span>
                                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>({ratingData.totalRatings})</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Wishlist button */}
                        <button
                            onClick={toggleWishlist}
                            style={{
                                width: '100%', padding: '11px', borderRadius: 10,
                                border: isWishlisted ? '0.5px solid var(--orange)' : '0.5px solid var(--border-strong)',
                                background: isWishlisted ? '#fdf0e0' : 'transparent',
                                color: isWishlisted ? 'var(--orange)' : 'var(--text-secondary)',
                                fontSize: 13, fontWeight: 600, cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                transition: 'all 0.12s', marginBottom: 10,
                            }}
                        >
                            <Heart style={{ width: 16, height: 16, fill: isWishlisted ? 'var(--orange)' : 'none' }} />
                            {isWishlisted ? "Saved to Wishlist" : "Save to Wishlist"}
                        </button>

                        {/* Message button */}
                        {user && user.id !== listing.ownerId && (
                            <button
                                onClick={() => { dispatch(setChat({ listing: listing })); }}
                                className="ut-nav-pill primary"
                                style={{ width: '100%', justifyContent: 'center', padding: '11px', borderRadius: 10, fontSize: 13 }}
                            >
                                <i className="ti ti-message-circle" />
                                Message Seller
                            </button>
                        )}

                        {/* Listed date */}
                        <div style={{ marginTop: 14, paddingTop: 12, borderTop: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-muted)' }}>
                            <Package style={{ width: 12, height: 12 }} />
                            Listed on {new Date(listing.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Recommendations */}
            <div style={{ marginTop: 48 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                    <Sparkles style={{ width: 18, height: 18, color: 'var(--orange)' }} />
                    <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>
                        You Might Also Like
                    </h3>
                    <span style={{ fontSize: 10, background: '#fdf0e0', color: 'var(--orange)', padding: '2px 8px', borderRadius: 999, fontWeight: 600 }}>
                        AI Powered
                    </span>
                </div>

                {loadingRecs ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
                        <Loader2Icon style={{ width: 24, height: 24, animation: 'spin 1s linear infinite', color: 'var(--text-muted)' }} />
                    </div>
                ) : recommendations.length === 0 ? (
                    <div style={{ ...card, padding: '32px', textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
                        No similar listings found right now.
                    </div>
                ) : (
                    <div className="ut-grid">
                        {recommendations.map((rec) => (
                            <ListingCard key={rec.id} listing={rec} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListingDetails;
