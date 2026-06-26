import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import ListingCard from './ListingCard'
import Loading from '../pages/Loading'

const CATEGORIES = [
    { key: 'all', label: 'All', icon: 'ti-layout-grid' },
    { key: 'electronics', label: 'Electronics', icon: 'ti-device-laptop' },
    { key: 'books', label: 'Books', icon: 'ti-book' },
    { key: 'furniture', label: 'Furniture', icon: 'ti-armchair' },
    { key: 'clothing', label: 'Clothing', icon: 'ti-shirt' },
    { key: 'vehicles', label: 'Vehicles', icon: 'ti-bicycle' },
    { key: 'other', label: 'Other', icon: 'ti-dots' },
]

const LatestListing = () => {
    const { listings } = useSelector(state => state.listing)
    const [isLoading, setIsLoading] = useState(true)
    const [activeCategory, setActiveCategory] = useState('all')
    const navigate = useNavigate()

    useEffect(() => {
        if (listings && listings.length >= 0) {
            setIsLoading(false)
        }
    }, [listings])

    const filtered = activeCategory === 'all'
        ? listings
        : listings.filter(l => l.category?.toLowerCase() === activeCategory)

    const totalListings = listings.length
    const uniqueCampuses = new Set(listings.map(l => l.owner?.campus).filter(Boolean)).size
    const totalValue = listings.reduce((sum, l) => sum + (l.price || 0), 0)
    const formatValue = (v) => {
        if (v >= 100000) return `${(v / 100000).toFixed(1)}L+`
        if (v >= 1000) return `${(v / 1000).toFixed(0)}k+`
        return v.toLocaleString()
    }

    return (
        <div style={{ background: 'var(--surface-0)' }}>

            {/* Category Strip */}
            <div className="ut-strip">
                <div className="ut-strip-inner">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.key}
                            className={`ut-cat ${activeCategory === cat.key ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat.key)}
                        >
                            <i className={`ti ${cat.icon}`} aria-hidden="true" />
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Section */}
            <div className="ut-section">
                {/* Stats Bar */}
                <div className="ut-stat-bar">
                    <div className="ut-stat">
                        <div className="ut-stat-num">
                            {totalListings > 999
                                ? <>{(totalListings / 1000).toFixed(1)}<span>k</span></>
                                : totalListings}
                        </div>
                        <div className="ut-stat-label">Active listings</div>
                    </div>
                    <div className="ut-stat">
                        <div className="ut-stat-num">{uniqueCampuses || <span>—</span>}</div>
                        <div className="ut-stat-label">Campuses active</div>
                    </div>
                    <div className="ut-stat">
                        <div className="ut-stat-num">
                            {totalValue > 0 ? <>₹<span>{formatValue(totalValue)}</span></> : <span>—</span>}
                        </div>
                        <div className="ut-stat-label">Total value listed</div>
                    </div>
                </div>

                {/* Section Header */}
                <div className="ut-section-head">
                    <div className="ut-section-title">
                        {activeCategory === 'all' ? 'Recent listings' : `${CATEGORIES.find(c => c.key === activeCategory)?.label}`}
                    </div>
                    <span className="ut-see-all" onClick={() => navigate('/marketplace')}>
                        View all →
                    </span>
                </div>

                {/* Loading */}
                {isLoading && (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
                        <Loading />
                    </div>
                )}

                {/* No listings */}
                {!isLoading && filtered.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0', fontSize: 14 }}>
                        No listings available
                    </div>
                )}

                {/* Grid */}
                {!isLoading && filtered.length > 0 && (
                    <div className="ut-grid">
                        {filtered
                            .sort((a, b) => (a.featured ? -1 : b.featured ? 1 : 0))
                            .slice(0, 6)
                            .map((listing, index) => (
                                <ListingCard listing={listing} key={index} />
                            ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default LatestListing
