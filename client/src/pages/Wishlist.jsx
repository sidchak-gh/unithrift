import React, { useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";
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
            <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--surface-0)' }}>
                <Loader2Icon style={{ width: 28, height: 28, animation: 'spin 1s linear infinite', color: 'var(--orange)' }} />
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', padding: '32px 28px 48px', maxWidth: 960, margin: '0 auto', background: 'var(--surface-0)' }}>
            {/* Header */}
            <div style={{ marginBottom: 28 }}>
                <div style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 28, fontWeight: 700,
                    color: 'var(--text-primary)', letterSpacing: '-0.5px',
                    marginBottom: 6,
                }}>
                    My Wishlist
                </div>
                <div style={{ height: '0.5px', background: 'var(--border-strong)', marginTop: 16 }} />
            </div>

            {wishlist.length === 0 ? (
                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', minHeight: '40vh', textAlign: 'center',
                }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>🤍</div>
                    <h2 style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8,
                    }}>
                        Your wishlist is empty
                    </h2>
                    <p style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 280 }}>
                        Browse the marketplace and save items you're interested in!
                    </p>
                </div>
            ) : (
                <div className="ut-grid">
                    {wishlist.map((item) => (
                        <ListingCard key={item.id} listing={item} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
