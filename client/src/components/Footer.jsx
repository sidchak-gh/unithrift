import React from 'react'

import { Github, Mail, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {


    return (
        <>
            <hr className='border-t border-gray-200 mt-8' />
            <footer className="px-6 md:px-16 lg:px-24 xl:px-32 w-full text-sm text-slate-500 bg-white pt-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-14">

                    {/* Brand */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <Link to="/">
                            <span className='text-2xl font-bold text-indigo-600'>Uni<span className="text-gray-800">Thrift</span></span>
                        </Link>
                        <p className="text-sm leading-7 mt-4 max-w-xs">
                            UniThrift is a college-only marketplace for buying and selling second-hand items safely within your campus community.
                        </p>
                        <div className="flex gap-3 mt-4">
                            <a href="mailto:support@unithrift.com" className="p-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-indigo-500 hover:bg-indigo-600 hover:text-white transition" title="Email">
                                <Mail size={18} />
                            </a>
                            <a href="#" className="p-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition" title="GitHub">
                                <Github size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="flex flex-col">
                        <h2 className="font-semibold mb-5 text-gray-800">Quick Links</h2>
                        <div className="flex flex-col space-y-2.5">
                            <Link to="/" className="hover:text-indigo-600 transition">Home</Link>
                            <Link to="/marketplace" className="hover:text-indigo-600 transition">Marketplace</Link>
                            <Link to="/my-listings" className="hover:text-indigo-600 transition">My Listings</Link>
                            <Link to="/wishlist" className="hover:text-indigo-600 transition">Wishlist</Link>
                            <Link to="/create-listing" className="hover:text-indigo-600 transition">Sell an Item</Link>
                        </div>
                    </div>


                </div>

                <p className="py-5 text-center border-t mt-8 border-slate-200 text-xs text-gray-400">
                    © {new Date().getFullYear()} UniThrift — Built for students, by students.
                </p>
            </footer>
        </>
    )
}

export default Footer
