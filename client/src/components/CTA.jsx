import React from 'react'
import { useNavigate } from 'react-router-dom'

const CTA = () => {
    const navigate = useNavigate();
    return (
        <div className="mx-4 md:mx-16 lg:mx-24 xl:mx-32 my-16">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-700 px-8 md:px-16 py-14 text-center shadow-2xl">
                {/* Decorative blobs */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl pointer-events-none" />

                <div className="relative z-10">
                    <span className="inline-block bg-white/20 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-4 tracking-wide uppercase">
                        🎓 Campus Exclusive
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
                        Turn your unused stuff <br />
                        <span className="text-indigo-200">into someone else's treasure</span>
                    </h2>
                    <p className="text-indigo-100 max-w-lg mx-auto text-sm md:text-base mb-8">
                        Join thousands of students buying and selling secondhand items on their campus.
                        Save money, reduce waste, and help your community thrive.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <button
                            onClick={() => { navigate('/marketplace'); scrollTo(0, 0); }}
                            className="bg-white text-indigo-700 font-semibold px-8 py-3 rounded-xl hover:bg-indigo-50 transition shadow-md text-sm"
                        >
                            Browse Listings
                        </button>
                        <button
                            onClick={() => { navigate('/create-listing'); scrollTo(0, 0); }}
                            className="bg-indigo-500/40 hover:bg-indigo-500/60 border border-white/30 text-white font-semibold px-8 py-3 rounded-xl transition text-sm"
                        >
                            Sell an Item
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CTA
