import React from 'react'

const Title = ({ title, description }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24, textAlign: 'center' }}>
            <h3 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 22,
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-0.3px',
                marginBottom: 6,
            }}>
                {title}
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 480, lineHeight: 1.6 }}>
                {description}
            </p>
        </div>
    )
}

export default Title
