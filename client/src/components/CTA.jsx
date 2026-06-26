import React from 'react'
import { useNavigate } from 'react-router-dom'

const CTA = () => {
    const navigate = useNavigate()
    return (
        <div style={{ padding: '0 28px 48px', maxWidth: 960, margin: '0 auto' }}>
            <div className="ut-footer-cta">
                <div>
                    <h3>Got something to sell?</h3>
                    <p>Post your room gear, lab coats, or textbooks in 60 seconds and sell directly on campus.</p>
                </div>
                <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
                    <button
                        className="ut-cta-btn"
                        onClick={() => { navigate('/create-listing'); window.scrollTo(0, 0) }}
                    >
                        <i className="ti ti-plus" aria-hidden="true" />
                        Post a listing
                    </button>
                    <button
                        className="ut-nav-pill"
                        style={{ color: '#9ca3af', borderColor: 'rgba(255,255,255,0.2)', whiteSpace: 'nowrap' }}
                        onClick={() => { navigate('/marketplace'); window.scrollTo(0, 0) }}
                    >
                        Browse listings
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CTA
