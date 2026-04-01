import { Link } from "react-router-dom"

const AdminNavbar = () => {
    return (
        <div className="flex items-center justify-between px-6 md:px-10 h-16 border-b border-gray-200 bg-white">
            <Link to="/" className="text-xl font-bold text-indigo-600">
                Uni<span className="text-gray-800">Thrift</span>
                <span className="ml-2 text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Admin</span>
            </Link>
        </div>
    )
}

export default AdminNavbar