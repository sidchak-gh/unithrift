import React from 'react'
import { Link } from 'react-router-dom'
import { Mail, Github } from 'lucide-react'

const Footer = () => {
    return (
        <>
            <div className="ut-divider" />
            <footer style={{
                padding: '0 28px 0',
                maxWidth: 960,
                margin: '0 auto',
                paddingBottom: 32,
                fontSize: 13,
                color: 'var(--text-muted)',
            }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }} className="max-sm:grid-cols-1">

                    {/* Brand */}
                    <div>
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <div className="ut-logo" style={{ fontSize: 20 }}>
                                Uni<span>Thrift</span>
                            </div>
                        </Link>
                        <p style={{ marginTop: 12, lineHeight: 1.7, maxWidth: 280, fontSize: 13, color: 'var(--text-secondary)' }}>
                            UniThrift is a college-only marketplace for buying and selling second-hand items safely within your campus community.
                        </p>
                        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                            <a
                                href="mailto:support@unithrift.com"
                                title="Email"
                                style={{
                                    padding: 7, borderRadius: '50%',
                                    border: '0.5px solid var(--border-strong)',
                                    color: 'var(--text-muted)', display: 'flex',
                                    transition: 'all 0.12s', textDecoration: 'none',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'var(--orange)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--orange)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
                            >
                                <Mail size={16} />
                            </a>
                            <a
                                href="#"
                                title="GitHub"
                                style={{
                                    padding: 7, borderRadius: '50%',
                                    border: '0.5px solid var(--border-strong)',
                                    color: 'var(--text-muted)', display: 'flex',
                                    transition: 'all 0.12s', textDecoration: 'none',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'var(--navy)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--navy)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
                            >
                                <Github size={16} />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', marginBottom: 16 }}>
                            Quick Links
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {[
                                { to: '/', label: 'Home' },
                                { to: '/marketplace', label: 'Marketplace' },
                                { to: '/my-listings', label: 'My Listings' },
                                { to: '/wishlist', label: 'Wishlist' },
                                { to: '/create-listing', label: 'Sell an Item' },
                            ].map(({ to, label }) => (
                                <Link
                                    key={to}
                                    to={to}
                                    style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 13, transition: 'color 0.12s' }}
                                    onMouseEnter={e => e.currentTarget.style.color = 'var(--orange)'}
                                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <p style={{
                    paddingTop: 20, marginTop: 24,
                    borderTop: '0.5px solid var(--border)',
                    textAlign: 'center', fontSize: 12, color: 'var(--text-muted)',
                }}>
                    © {new Date().getFullYear()} UniThrift — Built for students, by students.
                </p>
            </footer>
        </>
    )
}

export default Footer
