import React, { useState } from "react";
import { SlidersHorizontalIcon, XIcon } from "lucide-react";

const CATEGORIES = ["electronics", "books", "furniture", "clothing", "appliances", "vehicles", "sports", "other"];
const CONDITIONS = [
    { value: "new", label: "New" },
    { value: "like_new", label: "Like New" },
    { value: "good", label: "Good" },
    { value: "fair", label: "Fair" },
    { value: "poor", label: "Poor" },
];

const FilterSidebar = ({ filters, setFilters, showFilterPhone, setShowFilterPhone }) => {

    const toggleCategory = (cat) => {
        const current = filters.categories || [];
        if (current.includes(cat)) {
            setFilters({ ...filters, categories: current.filter(c => c !== cat) });
        } else {
            setFilters({ ...filters, categories: [...current, cat] });
        }
    };

    const toggleCondition = (cond) => {
        const current = filters.conditions || [];
        if (current.includes(cond)) {
            setFilters({ ...filters, conditions: current.filter(c => c !== cond) });
        } else {
            setFilters({ ...filters, conditions: [...current, cond] });
        }
    };

    const clearAll = () => {
        setFilters({ categories: [], conditions: [], maxPrice: "" });
    };

    const sidebarContent = (
        <div className="w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2 font-semibold text-gray-800">
                    <SlidersHorizontalIcon className="size-4 text-indigo-600" />
                    Filters
                </div>
                <button
                    onClick={clearAll}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium transition"
                >
                    Clear all
                </button>
            </div>

            {/* Max Price */}
            <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Max Price</h4>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">₹0</span>
                    <input
                        type="range"
                        min={0}
                        max={100000}
                        step={500}
                        value={filters.maxPrice || 100000}
                        onChange={e => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                        className="flex-1 accent-indigo-600"
                    />
                    <span className="text-sm text-gray-500 whitespace-nowrap">
                        ₹{(filters.maxPrice || 100000).toLocaleString()}
                    </span>
                </div>
                <input
                    type="number"
                    placeholder="Enter max price"
                    value={filters.maxPrice || ""}
                    onChange={e => setFilters({ ...filters, maxPrice: Number(e.target.value) || 100000 })}
                    className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
            </div>

            {/* Categories */}
            <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Category</h4>
                <div className="flex flex-col gap-2">
                    {CATEGORIES.map(cat => (
                        <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={(filters.categories || []).includes(cat)}
                                onChange={() => toggleCategory(cat)}
                                className="accent-indigo-600 size-4 rounded"
                            />
                            <span className="text-sm capitalize text-gray-600 group-hover:text-indigo-700 transition">{cat}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Condition */}
            <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Condition</h4>
                <div className="flex flex-col gap-2">
                    {CONDITIONS.map(cond => (
                        <label key={cond.value} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={(filters.conditions || []).includes(cond.value)}
                                onChange={() => toggleCondition(cond.value)}
                                className="accent-indigo-600 size-4 rounded"
                            />
                            <span className="text-sm text-gray-600 group-hover:text-indigo-700 transition">{cond.label}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop sidebar */}
            <div className="hidden sm:block sticky top-24 w-56 shrink-0 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm self-start">
                {sidebarContent}
            </div>

            {/* Mobile drawer */}
            {showFilterPhone && (
                <div className="sm:hidden fixed inset-0 z-50 flex">
                    <div className="fixed inset-0 bg-black/40" onClick={() => setShowFilterPhone(false)} />
                    <div className="relative ml-auto w-72 bg-white h-full overflow-y-auto p-6 shadow-xl">
                        <button
                            onClick={() => setShowFilterPhone(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                        >
                            <XIcon className="size-5" />
                        </button>
                        {sidebarContent}
                        <button
                            onClick={() => setShowFilterPhone(false)}
                            className="w-full mt-4 bg-indigo-600 text-white py-2.5 rounded-lg font-medium text-sm"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default FilterSidebar;
