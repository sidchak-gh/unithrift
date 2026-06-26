import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import axios from 'axios';
import { backendUrl } from '../configs/axios';

const Navbar = () => {
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
    const [isAdmin, setIsAdmin] = useState(false);
    const { user, token, logout } = useAuthContext();
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const fetchIsAdmin = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/isAdmin`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsAdmin(data.isAdmin);
        } catch (error) {
            // Not an admin or request failed
        }
    };

    useEffect(() => {
        if (user && adminEmail && user.email === adminEmail) {
            fetchIsAdmin();
        }
    }, [user, adminEmail]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/");
        setMenuOpen(false);
        setProfileOpen(false);
    };

    const initials = user?.name ? user.name.slice(0, 2).toUpperCase() : 'U';

    return (
        <div>
            {/* Notice Tape */}
            <div className="ut-notice-tape">
                ✦ College-exclusive marketplace · Verified student listings only · Gemini AI moderated
            </div>

            {/* Nav */}
            <nav className="ut-nav">
                {/* Logo */}
                <div
                    className="ut-logo"
                    onClick={() => { navigate('/'); window.scrollTo(0, 0); }}
                >
                    Uni<span>Thrift</span>
                </div>

                {/* Desktop Links */}
                <div className="hidden sm:flex items-center gap-1">
                    <Link to="/" onClick={() => window.scrollTo(0, 0)} className="ut-nav-pill">
                        Home
                    </Link>
                    <Link to="/marketplace" onClick={() => window.scrollTo(0, 0)} className="ut-nav-pill">
                        Marketplace
                    </Link>
                    {user && (
                        <Link to="/messages" onClick={() => window.scrollTo(0, 0)} className="ut-nav-pill">
                            <i className="ti ti-message-circle" aria-hidden="true" />
                            Chats
                        </Link>
                    )}
                    {user && (
                        <Link to="/wishlist" onClick={() => window.scrollTo(0, 0)} className="ut-nav-pill">
                            <i className="ti ti-heart" aria-hidden="true" />
                            Wishlist
                        </Link>
                    )}
                </div>

                {/* Right Side */}
                {!user ? (
                    <div className="flex items-center gap-2">
                        <Link to="/login" className="ut-nav-pill max-sm:hidden">Log in</Link>
                        <Link to="/register" className="ut-nav-pill primary max-sm:hidden">
                            <i className="ti ti-user" aria-hidden="true" />
                            Sign up
                        </Link>
                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setMenuOpen(true)}
                            className="sm:hidden ut-nav-pill"
                            aria-label="Open menu"
                        >
                            <i className="ti ti-menu-2" aria-hidden="true" />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        {/* Sell button */}
                        <Link to="/create-listing" className="ut-nav-pill hidden sm:flex">
                            <i className="ti ti-plus" aria-hidden="true" />
                            Sell
                        </Link>

                        {/* Avatar + dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                style={{
                                    width: 36, height: 36, borderRadius: '50%',
                                    background: 'var(--navy)', color: '#F8F7F4',
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    fontWeight: 700, fontSize: 13,
                                    border: '2px solid var(--border-strong)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', transition: 'border-color 0.12s',
                                }}
                                aria-label="Profile menu"
                            >
                                {initials}
                            </button>

                            {profileOpen && (
                                <div style={{
                                    position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                                    width: 220, background: 'var(--surface-2)',
                                    border: '0.5px solid var(--border-strong)',
                                    borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                                    zIndex: 100, overflow: 'hidden',
                                }}>
                                    {/* User info */}
                                    <div style={{ padding: '14px 16px', borderBottom: '0.5px solid var(--border)' }}>
                                        <p style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)', marginBottom: 2, fontFamily: "'Space Grotesk', sans-serif" }}>
                                            {user.name}
                                        </p>
                                        <p style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {user.email}
                                        </p>
                                        {user.campus && (
                                            <p style={{ fontSize: 11, color: 'var(--orange)', marginTop: 2 }}>
                                                📍 {user.campus}
                                            </p>
                                        )}
                                    </div>

                                    {[
                                        { to: '/marketplace', icon: 'ti-layout-grid', label: 'Marketplace' },
                                        { to: '/messages', icon: 'ti-message-circle', label: 'Messages' },
                                        { to: '/my-listings', icon: 'ti-list', label: 'My Listings' },
                                        { to: '/wishlist', icon: 'ti-heart', label: 'Wishlist' },
                                        { to: '/create-listing', icon: 'ti-plus', label: 'Sell an Item' },
                                    ].map(({ to, icon, label }) => (
                                        <button
                                            key={to}
                                            onClick={() => { navigate(to); setProfileOpen(false); window.scrollTo(0, 0); }}
                                            style={{
                                                width: '100%', textAlign: 'left', padding: '9px 16px',
                                                fontSize: 13, color: 'var(--text-secondary)',
                                                background: 'none', border: 'none', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', gap: 8,
                                                transition: 'background 0.1s',
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-1)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                                        >
                                            <i className={`ti ${icon}`} style={{ fontSize: 14, color: 'var(--orange)' }} />
                                            {label}
                                        </button>
                                    ))}

                                    {isAdmin && (
                                        <button
                                            onClick={() => { navigate('/admin'); setProfileOpen(false); window.scrollTo(0, 0); }}
                                            style={{
                                                width: '100%', textAlign: 'left', padding: '9px 16px',
                                                fontSize: 13, color: 'var(--text-secondary)',
                                                background: 'none', border: 'none', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', gap: 8,
                                                transition: 'background 0.1s',
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-1)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                                        >
                                            <i className="ti ti-lock" style={{ fontSize: 14, color: 'var(--orange)' }} />
                                            Admin Panel
                                        </button>
                                    )}

                                    <div style={{ borderTop: '0.5px solid var(--border)', marginTop: 4 }}>
                                        <button
                                            onClick={handleLogout}
                                            style={{
                                                width: '100%', textAlign: 'left', padding: '9px 16px',
                                                fontSize: 13, color: '#dc2626',
                                                background: 'none', border: 'none', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', gap: 8,
                                                transition: 'background 0.1s',
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                                        >
                                            <i className="ti ti-logout" style={{ fontSize: 14, color: '#dc2626' }} />
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Mobile hamburger */}
                        <button onClick={() => setMenuOpen(true)} className="sm:hidden ut-nav-pill" aria-label="Open menu">
                            <i className="ti ti-menu-2" aria-hidden="true" />
                        </button>
                    </div>
                )}
            </nav>

            {/* Mobile Full-screen Menu */}
            <div
                className={`sm:hidden fixed inset-0 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} transition-opacity duration-200`}
                style={{ background: 'var(--surface-2)', zIndex: 200 }}
            >
                <div className="flex flex-col items-center justify-center h-full gap-6 p-6 relative">
                    <div className="ut-logo text-2xl mb-2">Uni<span>Thrift</span></div>

                    {[
                        { to: '/', label: 'Home' },
                        { to: '/marketplace', label: 'Marketplace' },
                        ...(user ? [
                            { to: '/messages', label: 'Messages' },
                            { to: '/my-listings', label: 'My Listings' },
                            { to: '/wishlist', label: 'Wishlist' },
                            { to: '/create-listing', label: 'Sell an Item' },
                        ] : []),
                    ].map(({ to, label }) => (
                        <Link
                            key={to}
                            to={to}
                            onClick={() => setMenuOpen(false)}
                            style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none' }}
                        >
                            {label}
                        </Link>
                    ))}

                    {!user ? (
                        <Link
                            to="/login"
                            onClick={() => setMenuOpen(false)}
                            className="ut-nav-pill primary"
                            style={{ fontSize: 15, padding: '10px 32px' }}
                        >
                            Log in
                        </Link>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="ut-nav-pill danger"
                            style={{ fontSize: 15, padding: '10px 32px' }}
                        >
                            Sign Out
                        </button>
                    )}

                    <button
                        onClick={() => setMenuOpen(false)}
                        style={{
                            position: 'absolute', top: 20, right: 20,
                            background: 'none', border: 'none', cursor: 'pointer',
                            fontSize: 24, color: 'var(--text-muted)',
                        }}
                        aria-label="Close menu"
                    >
                        <i className="ti ti-x" aria-hidden="true" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Navbar
