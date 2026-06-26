import { ArrowLeftIcon, FilterIcon, PackageOpenIcon } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import ListingCard from "../components/ListingCard";
import FilterSidebar from "../components/FilterSidebar";

const MarketPlace = () => {
    const [searchParams] = useSearchParams();
    const search = searchParams.get("search");
    const navigate = useNavigate();
    const [showFilterPhone, setShowFilterPhone] = useState(false);
    const [filters, setFilters] = useState({
        categories: [],
        conditions: [],
        maxPrice: "",
    });

    const { listings } = useSelector((state) => state.listing);

    const filteredListings = listings.filter((listing) => {
        // Category filter
        if (filters.categories && filters.categories.length > 0) {
            if (!filters.categories.includes(listing.category)) return false;
        }

        // Price filter
        if (filters.maxPrice !== "" && filters.maxPrice !== undefined && listing.price > Number(filters.maxPrice)) return false;

        // Condition filter
        if (filters.conditions && filters.conditions.length > 0) {
            if (!filters.conditions.includes(listing.condition)) return false;
        }

        // Keyword search
        if (search) {
            const q = search.trim().toLowerCase();
            const matchesTitle = listing.title?.toLowerCase().includes(q);
            const matchesDesc = listing.description?.toLowerCase().includes(q);
            const matchesCat = listing.category?.toLowerCase().includes(q);
            const matchesCampus = listing.owner?.campus?.toLowerCase().includes(q);
            if (!matchesTitle && !matchesDesc && !matchesCat && !matchesCampus) return false;
        }

        return true;
    });

    return (
        <div style={{ padding: '0 28px', minHeight: '100vh', background: 'var(--surface-0)', maxWidth: 1100, margin: '0 auto' }}>
            {/* Top Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0' }}>
                <button
                    onClick={() => { navigate("/"); window.scrollTo(0, 0); }}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        color: 'var(--text-secondary)', background: 'none', border: 'none',
                        cursor: 'pointer', fontSize: 13, fontWeight: 500,
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--orange)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                    <ArrowLeftIcon className="size-4" />
                    Back to Home
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {search && (
                        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                            Results for{' '}
                            <span style={{ fontWeight: 600, color: 'var(--orange)' }}>"{search}"</span>
                        </span>
                    )}
                    <button
                        onClick={() => setShowFilterPhone(true)}
                        className="sm:!hidden"
                        style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            background: 'var(--surface-2)', border: '0.5px solid var(--border-strong)',
                            borderRadius: 8, padding: '7px 12px', fontSize: 13,
                            color: 'var(--text-secondary)', cursor: 'pointer',
                        }}
                    >
                        <FilterIcon className="size-4" style={{ color: 'var(--orange)' }} />
                        Filters
                    </button>
                </div>
            </div>

            {/* Content */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, paddingBottom: 48 }}>
                <FilterSidebar
                    setFilters={setFilters}
                    filters={filters}
                    setShowFilterPhone={setShowFilterPhone}
                    showFilterPhone={showFilterPhone}
                />

                {/* Listings Grid */}
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{filteredListings.length}</span>
                            {' '}{filteredListings.length !== 1 ? 'items' : 'item'} found
                        </p>
                    </div>

                    {filteredListings.length === 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', textAlign: 'center' }}>
                            <PackageOpenIcon style={{ width: 56, height: 56, color: 'var(--text-muted)', marginBottom: 16, opacity: 0.4 }} />
                            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, fontFamily: "'Space Grotesk', sans-serif" }}>No items found</h3>
                            <p style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 280 }}>
                                Try adjusting your filters or search term to find what you're looking for.
                            </p>
                        </div>
                    ) : (
                        <div className="ut-grid">
                            {[...filteredListings]
                                .sort((a, b) => (a.featured ? -1 : b.featured ? 1 : 0))
                                .map((listing, index) => (
                                    <ListingCard listing={listing} key={index} />
                                ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MarketPlace;
