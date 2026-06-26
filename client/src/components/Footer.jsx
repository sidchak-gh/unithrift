import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Github, LogOut, ArrowRight, PlusCircle } from 'lucide-react'
import { useAuthContext } from '../context/AuthContext'

const Footer = () => {
    const { user, logout } = useAuthContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
        window.scrollTo(0, 0);
    };

    return (
        <div style={{ 
            background: 'var(--surface-2)', 
            borderTop: '0.5px solid var(--border-strong)', 
            marginTop: 64, 
            padding: '48px 0 32px' 
        }}>
            <footer style={{
                maxWidth: 1100,
                margin: '0 auto',
                padding: '0 28px',
                fontSize: 13,
                color: 'var(--text-secondary)',
            }}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-10" style={{ paddingBottom: 32, borderBottom: '0.5px solid var(--border)' }}>
                    
                    {/* Brand Section */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <div className="ut-logo" style={{ fontSize: 20 }}>
                                Uni<span>Thrift</span>
                            </div>
                        </Link>
                        <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)', maxWidth: 300, margin: 0 }}>
                            UniThrift is a verified campus-only marketplace for Graphic Era students to buy and sell textbooks, lab coats, and hostel essentials.
                        </p>
                        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                            <a
                                href="mailto:support@unithrift.com"
                                title="Email Support"
                                style={{
                                    padding: 8, borderRadius: '50%',
                                    border: '0.5px solid var(--border-strong)',
                                    color: 'var(--text-muted)', display: 'flex',
                                    transition: 'all 0.15s', textDecoration: 'none',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'var(--orange)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--orange)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
                            >
                                <Mail size={15} />
                            </a>
                            <a
                                href="#"
                                title="GitHub Repository"
                                style={{
                                    padding: 8, borderRadius: '50%',
                                    border: '0.5px solid var(--border-strong)',
                                    color: 'var(--text-muted)', display: 'flex',
                                    transition: 'all 0.15s', textDecoration: 'none',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'var(--navy)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--navy)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
                            >
                                <Github size={15} />
                            </a>
                        </div>
                    </div>

                    {/* Explore Column */}
                    <div>
                        <h4 style={{ 
                            fontFamily: "'Space Grotesk', sans-serif", 
                            fontWeight: 600, 
                            fontSize: 12, 
                            color: 'var(--text-primary)', 
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            marginBottom: 16 
                        }}>
                            Explore
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <Link
                                to="/"
                                onClick={() => window.scrollTo(0, 0)}
                                style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.12s', display: 'flex', alignItems: 'center', gap: 4 }}
                                onMouseEnter={e => e.currentTarget.style.color = 'var(--orange)'}
                                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                            >
                                Home
                            </Link>
                            <Link
                                to="/marketplace"
                                onClick={() => window.scrollTo(0, 0)}
                                style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.12s', display: 'flex', alignItems: 'center', gap: 4 }}
                                onMouseEnter={e => e.currentTarget.style.color = 'var(--orange)'}
                                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                            >
                                Marketplace
                            </Link>
                            {user && (
                                <>
                                    <Link
                                        to="/messages"
                                        onClick={() => window.scrollTo(0, 0)}
                                        style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.12s' }}
                                        onMouseEnter={e => e.currentTarget.style.color = 'var(--orange)'}
                                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                                    >
                                        Chats & Messages
                                    </Link>
                                    <Link
                                        to="/wishlist"
                                        onClick={() => window.scrollTo(0, 0)}
                                        style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.12s' }}
                                        onMouseEnter={e => e.currentTarget.style.color = 'var(--orange)'}
                                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                                    >
                                        My Wishlist
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Account / Portal Column */}
                    <div>
                        <h4 style={{ 
                            fontFamily: "'Space Grotesk', sans-serif", 
                            fontWeight: 600, 
                            fontSize: 12, 
                            color: 'var(--text-primary)', 
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            marginBottom: 16 
                        }}>
                            {user ? "Student Portal" : "Join the Community"}
                        </h4>
                        
                        {user ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <div style={{ marginBottom: 6 }}>
                                    <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Logged in as</span>
                                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>{user.name}</span>
                                    {user.campus && (
                                        <span style={{ fontSize: 11, color: 'var(--orange)', display: 'block', marginTop: 1 }}>📍 {user.campus}</span>
                                    )}
                                </div>
                                <Link
                                    to="/my-listings"
                                    onClick={() => window.scrollTo(0, 0)}
                                    style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.12s' }}
                                    onMouseEnter={e => e.currentTarget.style.color = 'var(--orange)'}
                                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                                >
                                    My Listings
                                </Link>
                                <Link
                                    to="/create-listing"
                                    onClick={() => window.scrollTo(0, 0)}
                                    style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.12s', display: 'flex', alignItems: 'center', gap: 4 }}
                                    onMouseEnter={e => e.currentTarget.style.color = 'var(--orange)'}
                                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                                >
                                    <PlusCircle size={14} /> Sell an Item
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    style={{
                                        color: '#dc2626', background: 'none', border: 'none', padding: 0,
                                        fontSize: 13, cursor: 'pointer', textAlign: 'left', transition: 'opacity 0.12s',
                                        display: 'flex', alignItems: 'center', gap: 4, marginTop: 4
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.opacity = 0.8}
                                    onMouseLeave={e => e.currentTarget.style.opacity = 1}
                                >
                                    <LogOut size={14} /> Sign Out
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <p style={{ color: 'var(--text-muted)', lineHeight: 1.5, margin: '0 0 4px 0' }}>
                                    Sign in with your student account to buy, sell, or chat.
                                </p>
                                <Link
                                    to="/login"
                                    style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.12s', display: 'flex', alignItems: 'center', gap: 4 }}
                                    onMouseEnter={e => e.currentTarget.style.color = 'var(--orange)'}
                                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                                >
                                    Log In <ArrowRight size={14} />
                                </Link>
                                <Link
                                    to="/register"
                                    style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.12s', display: 'flex', alignItems: 'center', gap: 4 }}
                                    onMouseEnter={e => e.currentTarget.style.color = 'var(--orange)'}
                                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                                >
                                    Sign Up & Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Bottom */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 12,
                    paddingTop: 24,
                    marginTop: 24,
                    fontSize: 12,
                    color: 'var(--text-muted)',
                }} className="max-sm:flex-col max-sm:text-center">
                    <p style={{ margin: 0 }}>
                        © {new Date().getFullYear()} UniThrift · Exclusively built for campus communities.
                    </p>
                    <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                        Built with ❤️ for <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Graphic Era University</span>
                    </p>
                </div>
            </footer>
        </div>
    )
}

export default Footer
