import React from 'react'
import { useNavigate } from 'react-router-dom'
import { BadgeCheck, MapPin } from 'lucide-react';

// Emoji fallback per category
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

// Determine if a listing is "new" (listed within 3 days)
const isNewListing = (createdAt) => {
    if (!createdAt) return false
    const diffMs = Date.now() - new Date(createdAt).getTime()
    return diffMs < 1000 * 60 * 60 * 24 * 3
}

const ListingCard = ({ listing }) => {
    const navigate = useNavigate()
    const currency = import.meta.env.VITE_CURRENCY || '₹'
    const hasImage = listing.images && listing.images.length > 0
    const emoji = CATEGORY_EMOJI[listing.category?.toLowerCase()] || '📦'
    const isNew = isNewListing(listing.createdAt)
    const sellerInitials = listing.owner?.name
        ? listing.owner.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
        : 'UT'

    const handleClick = () => {
        navigate(`/listing/${listing.id}`)
        window.scrollTo(0, 0)
    }

    return (
        <div className="ut-card" onClick={handleClick}>
            {/* Image area */}
            <div className="ut-card-img">
                {hasImage ? (
                    <img src={listing.images[0]} alt={listing.title} />
                ) : (
                    <span style={{ zIndex: 1 }}>{emoji}</span>
                )}

                {/* Badge: featured = AI verified, otherwise New if recent */}
                {listing.featured ? (
                    <div className="ut-badge-ai">✦ AI verified</div>
                ) : isNew ? (
                    <div className="ut-badge-new">New</div>
                ) : null}
            </div>

            {/* Body */}
            <div className="ut-card-body">
                <div className="ut-card-meta">
                    <span className="ut-cat-tag">{listing.category}</span>
                    {listing.featured && (
                        <BadgeCheck size={13} style={{ color: 'var(--orange)', flexShrink: 0 }} />
                    )}
                </div>

                <div className="ut-card-title">{listing.title}</div>

                <div className="ut-card-footer">
                    <div>
                        <span className="ut-price">
                            {currency}{listing.price?.toLocaleString()}
                        </span>
                        <span className="ut-price-cond">
                            · {listing.condition?.replace('_', ' ')}
                        </span>
                    </div>
                    <div className="ut-seller">
                        <div className="ut-seller-dot">{sellerInitials}</div>
                        <span>{listing.owner?.campus ? listing.owner.campus.split(' ')[0] : ''}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListingCard
