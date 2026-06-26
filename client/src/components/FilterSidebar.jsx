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
        <div style={{ width: '100%' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>
                    <SlidersHorizontalIcon size={15} style={{ color: 'var(--orange)' }} />
                    Filters
                </div>
                <button
                    onClick={clearAll}
                    style={{ fontSize: 12, color: 'var(--orange)', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    Clear all
                </button>
            </div>

            {/* Max Price */}
            <div style={{ marginBottom: 20 }}>
                <h4 style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Max Price</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>₹0</span>
                    <input
                        type="range"
                        min={0}
                        max={100000}
                        step={500}
                        value={filters.maxPrice === "" ? 100000 : filters.maxPrice}
                        onChange={e => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                        style={{ flex: 1, accentColor: 'var(--orange)' }}
                    />
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        {filters.maxPrice === "" || filters.maxPrice >= 100000
                            ? "Any price"
                            : `₹${Number(filters.maxPrice).toLocaleString()}`}
                    </span>
                </div>
                <input
                    type="number"
                    placeholder="Enter max price"
                    value={filters.maxPrice}
                    onChange={e => setFilters({ ...filters, maxPrice: e.target.value === "" ? "" : Number(e.target.value) })}
                    style={{
                        marginTop: 8, width: '100%',
                        border: '0.5px solid var(--border-strong)',
                        borderRadius: 8, padding: '8px 12px',
                        fontSize: 13, color: 'var(--text-primary)',
                        background: 'var(--surface-2)', outline: 'none',
                    }}
                />
            </div>

            {/* Categories */}
            <div style={{ marginBottom: 20 }}>
                <h4 style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Category</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {CATEGORIES.map(cat => (
                        <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={(filters.categories || []).includes(cat)}
                                onChange={() => toggleCategory(cat)}
                                style={{ accentColor: 'var(--orange)', width: 14, height: 14 }}
                            />
                            <span style={{ fontSize: 13, textTransform: 'capitalize', color: 'var(--text-secondary)' }}>{cat}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Condition */}
            <div style={{ marginBottom: 16 }}>
                <h4 style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Condition</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {CONDITIONS.map(cond => (
                        <label key={cond.value} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={(filters.conditions || []).includes(cond.value)}
                                onChange={() => toggleCondition(cond.value)}
                                style={{ accentColor: 'var(--orange)', width: 14, height: 14 }}
                            />
                            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{cond.label}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop sidebar */}
            <div className="hidden sm:block sticky top-24 w-64 shrink-0 self-start" style={{
                background: 'var(--surface-2)',
                border: '0.5px solid var(--border-strong)',
                borderRadius: 14,
                padding: 20,
            }}>
                {sidebarContent}
            </div>

            {/* Mobile drawer */}
            {showFilterPhone && (
                <div className="sm:hidden fixed inset-0 z-50 flex">
                    <div className="fixed inset-0 bg-black/40" onClick={() => setShowFilterPhone(false)} />
                    <div className="relative ml-auto w-72 h-full overflow-y-auto p-6" style={{ background: 'var(--surface-2)', boxShadow: '0 0 40px rgba(0,0,0,0.15)' }}>
                        <button
                            onClick={() => setShowFilterPhone(false)}
                            style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                        >
                            <XIcon className="size-5" />
                        </button>
                        {sidebarContent}
                        <button
                            onClick={() => setShowFilterPhone(false)}
                            className="ut-cta-btn"
                            style={{ width: '100%', marginTop: 16, justifyContent: 'center' }}
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
