import React from 'react'
import { useNavigate } from 'react-router-dom'
import { SearchIcon, ShieldCheckIcon, TagIcon, UsersIcon } from 'lucide-react'

const Hero = () => {
    const [input, setInput] = React.useState('')
    const navigate = useNavigate();

    const onSubmitHandler = (e) => {
        e.preventDefault();
        navigate(`/marketplace?search=${input}`);
    }



    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
            {/* Background decorative blobs */}
            <div className="absolute -top-20 -right-32 w-96 h-96 bg-indigo-200 rounded-full opacity-30 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-20 w-72 h-72 bg-purple-200 rounded-full opacity-30 blur-3xl pointer-events-none" />

            <div className="relative px-4 md:px-16 lg:px-24 xl:px-40 pt-28 pb-20 flex flex-col items-center text-center text-gray-800">

                {/* Badge */}
                <div className="flex items-center gap-2 bg-indigo-100 text-indigo-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 border border-indigo-200">
                    <ShieldCheckIcon className="size-3.5" />
                    Trusted campus marketplace
                </div>

                {/* Headline */}
                <h1 className="text-5xl md:text-7xl font-bold max-w-3xl leading-tight md:leading-tight mb-4">
                    Buy &amp; Sell
                    <span className="relative mx-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Campus
                    </span>
                    Finds
                </h1>

                <p className="max-w-xl text-base md:text-lg text-gray-500 my-6 leading-relaxed">
                    UniThrift is the exclusive secondhand marketplace for college students.
                    Score great deals on textbooks, electronics, furniture and more — all within your campus community.
                </p>

                {/* Search Box */}
                <form onSubmit={onSubmitHandler} className="w-full flex justify-center mb-10">
                    <div className="flex items-center w-full max-w-lg border border-gray-300 rounded-xl shadow-md bg-white overflow-hidden focus-within:ring-2 focus-within:ring-indigo-400 transition">
                        <SearchIcon className="ml-4 text-gray-400 size-5 shrink-0" />
                        <input
                            onChange={e => setInput(e.target.value)}
                            value={input}
                            type="text"
                            placeholder="Search for textbooks, laptops, furniture..."
                            className="pl-3 pr-2 py-3.5 flex-1 outline-none text-sm text-gray-700 bg-transparent"
                        />
                        <button
                            type="submit"
                            className="m-1.5 bg-indigo-600 hover:bg-indigo-700 transition text-white px-6 py-2.5 rounded-lg text-sm font-semibold"
                        >
                            Search
                        </button>
                    </div>
                </form>

                {/* Quick category chips */}
                <div className="flex flex-wrap justify-center gap-2 mb-10 text-sm">
                    {['Electronics', 'Books', 'Furniture', 'Clothing', 'Appliances', 'Sports'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => navigate(`/marketplace?search=${cat}`)}
                            className="px-4 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 text-gray-600 transition text-xs font-medium shadow-sm"
                        >
                            {cat}
                        </button>
                    ))}
                </div>


            </div>
        </div>
    )
}

export default Hero
