import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { BoxIcon, GripIcon, ListIcon, MenuIcon, MessageCircleMoreIcon, UserLockIcon, XIcon, LogOutIcon, HeartIcon } from 'lucide-react';
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

    return (
        <nav className='h-20'>
            <div className='fixed left-0 top-0 right-0 z-50 flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-200 bg-white/95 backdrop-blur-sm transition-all shadow-sm'>

                {/* Logo */}
                <span
                    onClick={() => { navigate('/'); window.scrollTo(0, 0); }}
                    className='text-2xl font-bold text-indigo-600 cursor-pointer tracking-tight'
                >
                    Uni<span className='text-gray-800'>Thrift</span>
                </span>

                {/* Desktop Nav */}
                <div className='hidden sm:flex items-center gap-6 md:gap-8 text-sm font-medium text-gray-600'>
                    <Link to="/" onClick={() => window.scrollTo(0, 0)} className='hover:text-indigo-600 transition'>Home</Link>
                    <Link to="/marketplace" onClick={() => window.scrollTo(0, 0)} className='hover:text-indigo-600 transition'>Marketplace</Link>
                    {user && <Link to="/messages" onClick={() => window.scrollTo(0, 0)} className='hover:text-indigo-600 transition'>Messages</Link>}
                    {user && <Link to="/my-listings" onClick={() => window.scrollTo(0, 0)} className='hover:text-indigo-600 transition'>My Listings</Link>}
                </div>

                {/* Right side */}
                {!user ? (
                    <div className='flex items-center gap-3'>
                        <Link to="/login" className='max-sm:hidden text-sm font-medium text-gray-600 hover:text-indigo-600 transition'>Log in</Link>
                        <Link to="/register" className='max-sm:hidden cursor-pointer px-5 py-2 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-full text-sm font-medium'>Sign up</Link>
                        <MenuIcon onClick={() => setMenuOpen(true)} className='sm:hidden cursor-pointer size-6 text-gray-700' />
                    </div>
                ) : (
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setProfileOpen(!profileOpen)}
                            className="cursor-pointer size-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-indigo-200 hover:border-indigo-400 transition text-sm"
                        >
                            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </button>

                        {profileOpen && (
                            <div className="absolute right-0 mt-3 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="font-semibold text-gray-800 text-sm truncate">{user.name}</p>
                                    <p className="text-gray-400 text-xs truncate">{user.email}</p>
                                    {user.campus && <p className="text-indigo-500 text-xs mt-0.5 truncate">📍 {user.campus}</p>}
                                </div>

                                <button onClick={() => { navigate('/marketplace'); setProfileOpen(false); window.scrollTo(0, 0); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-2 transition">
                                    <GripIcon size={15} className="text-blue-500" /> Marketplace
                                </button>
                                <button onClick={() => { navigate('/messages'); setProfileOpen(false); window.scrollTo(0, 0); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-2 transition">
                                    <MessageCircleMoreIcon size={15} className="text-indigo-500" /> Messages
                                </button>
                                <button onClick={() => { navigate('/my-listings'); setProfileOpen(false); window.scrollTo(0, 0); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-2 transition">
                                    <ListIcon size={15} className="text-purple-500" /> My Listings
                                </button>
                                <button onClick={() => { navigate('/wishlist'); setProfileOpen(false); window.scrollTo(0, 0); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-2 transition">
                                    <HeartIcon size={15} className="text-pink-500" /> Wishlist
                                </button>
                                {isAdmin && (
                                    <button onClick={() => { navigate('/admin'); setProfileOpen(false); window.scrollTo(0, 0); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-2 transition">
                                        <UserLockIcon size={15} className="text-cyan-500" /> Admin Panel
                                    </button>
                                )}

                                <div className="border-t border-gray-100 mt-1 pt-1">
                                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition">
                                        <LogOutIcon size={15} className="text-red-400" /> Sign out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Mobile Menu */}
            <div className={`sm:hidden fixed inset-0 ${menuOpen ? 'w-full' : 'w-0'} overflow-hidden bg-white z-[200] text-sm transition-all duration-300`}>
                <div className='flex flex-col items-center justify-center h-full text-lg font-semibold gap-7 p-6'>
                    <span className='text-2xl font-bold text-indigo-600 mb-4'>UniThrift</span>
                    <Link to="/" onClick={() => setMenuOpen(false)} className='hover:text-indigo-600 transition'>Home</Link>
                    <Link to="/marketplace" onClick={() => setMenuOpen(false)} className='hover:text-indigo-600 transition'>Marketplace</Link>
                    {user && <Link to="/messages" onClick={() => setMenuOpen(false)} className='hover:text-indigo-600 transition'>Messages</Link>}
                    {user && <Link to="/my-listings" onClick={() => setMenuOpen(false)} className='hover:text-indigo-600 transition'>My Listings</Link>}
                    {user && <Link to="/wishlist" onClick={() => setMenuOpen(false)} className='hover:text-indigo-600 transition'>Wishlist</Link>}
                    {!user ? (
                        <Link to="/login" onClick={() => setMenuOpen(false)} className='px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-base font-medium transition'>Log in</Link>
                    ) : (
                        <button onClick={handleLogout} className='px-8 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full font-medium transition'>Sign Out</button>
                    )}
                    <XIcon onClick={() => setMenuOpen(false)} className='absolute size-7 right-5 top-5 text-gray-500 hover:text-gray-700 cursor-pointer' />
                </div>
            </div>
        </nav>
    )
}

export default Navbar
