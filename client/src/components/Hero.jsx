import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

// Category background colors for emoji fallback cards
const CATEGORY_BG = {
    electronics: '#eef3ff',
    books: '#f0faf0',
    furniture: '#fdf5ec',
    clothing: '#fef0f0',
    appliances: '#f5f0ff',
    vehicles: '#e8f5e9',
    sports: '#fff8e1',
    other: '#f5f5f5',
}

const CATEGORY_EMOJI = {
    electronics: '💻',
    books: '📚',
    furniture: '🪑',
    clothing: '👕',
    appliances: '🔌',
    vehicles: '🚲',
    sports: '⚽',
    other: '📦',
}

const Hero = () => {
    const [input, setInput] = React.useState('')
    const navigate = useNavigate()
    const { listings } = useSelector(state => state.listing)

    // Use first 4 real listings as mini-cards; fall back to empty if not loaded yet
    const miniCards = listings.slice(0, 4)

    const onSubmitHandler = (e) => {
        e.preventDefault()
        navigate(`/marketplace?search=${input}`)
    }

    return (
        <div style={{ background: 'var(--surface-0)' }}>
            <div className="ut-hero">
                {/* Left: copy + search */}
                <div>
                    <div className="ut-hero-label">🎓 Campus Marketplace</div>
                    <h1 className="ut-hero-title">
                        Your campus,<br />your stuff,<br />your prices.
                    </h1>
                    <p className="ut-hero-sub">
                        Buy and sell used textbooks, hostel essentials, and electronics directly from fellow students.
                    </p>

                    <form onSubmit={onSubmitHandler}>
                        <div className="ut-search-wrap">
                            <input
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder="Search listings — MacBook, DSA book, chair…"
                            />
                            <button type="submit">
                                <i className="ti ti-search" aria-hidden="true" />
                                Search
                            </button>
                        </div>
                    </form>

                    {/* Category quick-links */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 16 }}>
                        {['Electronics', 'Books', 'Furniture', 'Clothing', 'Vehicles', 'Other'].map(cat => (
                            <button
                                key={cat}
                                onClick={() => navigate(`/marketplace?search=${cat}`)}
                                className="ut-cat"
                                style={{ fontSize: 12, padding: '5px 12px' }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right: real listing mini-cards */}
                {miniCards.length > 0 && (
                    <div className="ut-hero-right">
                        {miniCards.map((listing, i) => {
                            const cat = listing.category?.toLowerCase()
                            const bg = CATEGORY_BG[cat] || '#f5f5f5'
                            const emoji = CATEGORY_EMOJI[cat] || '📦'
                            const currency = import.meta.env.VITE_CURRENCY || '₹'

                            return (
                                <div
                                    key={listing.id || i}
                                    className="ut-mini-card"
                                    onClick={() => { navigate(`/listing/${listing.id}`); window.scrollTo(0, 0) }}
                                >
                                    <div className="ut-mini-card-img" style={{ background: bg, position: 'relative', overflow: 'hidden' }}>
                                        {listing.images?.[0]
                                            ? <img src={listing.images[0]} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
                                            : emoji
                                        }
                                    </div>
                                    <div className="ut-mini-card-body">
                                        <div className="ut-mini-card-tag">{listing.category}</div>
                                        <div className="ut-mini-card-name">{listing.title}</div>
                                        <div className="ut-mini-card-price">
                                            {currency}{listing.price?.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Hero
