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
        maxPrice: 100000,
    });

    const { listings } = useSelector((state) => state.listing);

    const filteredListings = listings.filter((listing) => {
        // Category filter
        if (filters.categories && filters.categories.length > 0) {
            if (!filters.categories.includes(listing.category)) return false;
        }

        // Price filter
        if (filters.maxPrice && listing.price > filters.maxPrice) return false;

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
        <div className="px-6 md:px-16 lg:px-24 xl:px-32 min-h-screen bg-slate-50">
            {/* Top Bar */}
            <div className="flex items-center justify-between py-5 text-slate-500">
                <button
                    onClick={() => { navigate("/"); scrollTo(0, 0); }}
                    className="flex items-center gap-2 hover:text-indigo-600 transition text-sm"
                >
                    <ArrowLeftIcon className="size-4" />
                    Back to Home
                </button>

                <div className="flex items-center gap-3">
                    {search && (
                        <span className="text-sm text-gray-700">
                            Results for <span className="font-semibold text-indigo-600">"{search}"</span>
                        </span>
                    )}
                    <button
                        onClick={() => setShowFilterPhone(true)}
                        className="flex items-center gap-2 sm:hidden bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm shadow-sm"
                    >
                        <FilterIcon className="size-4 text-indigo-600" />
                        Filters
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="relative flex items-start gap-6 pb-12">
                <FilterSidebar
                    setFilters={setFilters}
                    filters={filters}
                    setShowFilterPhone={setShowFilterPhone}
                    showFilterPhone={showFilterPhone}
                />

                {/* Listings Grid */}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm text-gray-500">
                            <span className="font-semibold text-gray-800">{filteredListings.length}</span> item{filteredListings.length !== 1 ? "s" : ""} found
                        </p>
                    </div>

                    {filteredListings.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <PackageOpenIcon className="size-16 text-gray-300 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No items found</h3>
                            <p className="text-gray-500 text-sm max-w-xs">
                                Try adjusting your filters or search term to find what you're looking for.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                            {filteredListings
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
