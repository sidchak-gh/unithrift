import { Outlet, Link } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";
import { useState } from "react";
import { useEffect } from "react";
import { ArrowRightIcon, Loader2Icon } from "lucide-react";
import { useAuthContext } from "../../context/AuthContext";
import axios from "axios";
import { backendUrl } from "../../configs/axios";
import toast from "react-hot-toast";

const Layout = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const {user, token} = useAuthContext();

    const fetchIsAdmin = async () => {
        try {
            const {data} = await axios.get(`${backendUrl}/api/admin/isAdmin`, {headers: {Authorization: `Bearer ${token}`}});
            setIsAdmin(data.isAdmin);
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
            console.log(error);
        }finally{
            setIsLoading(false)
        }
    };

    useEffect(() => {
        if(user){
            fetchIsAdmin();
        }
    }, [user]);

    if(!user){
        return (
            <div className="flex flex-col items-center justify-center h-screen text-center ">
                <h2 className="text-2xl font-semibold mb-4">Please log in to view this page</h2>
                <Link to="/login" className="inline-flex items-center px-6 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-all duration-200">
                    Go to Login <ArrowRightIcon className="ml-2 size-4" />
                </Link>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2Icon className="size-7 text-indigo-500 animate-spin" />
            </div>
        );
    }

    return isAdmin ? (
        <>
            <AdminNavbar />
            <div className="flex">
                <AdminSidebar />
                <div className="flex-1 px-4 py-10 md:px-10 h-[calc(100vh-64px)] bg-slate-50 overflow-y-auto">
                    <Outlet />
                </div>
            </div>
        </>
    ) : (
        <div className="flex flex-col items-center justify-center h-screen text-center ">
            <h2 className="text-2xl font-semibold mb-4">You don't have access to this page</h2>
            <Link to="/" className="inline-flex items-center px-6 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-all duration-200">
                Go to Home <ArrowRightIcon className="ml-2 size-4" />
            </Link>
        </div>
    );
};

export default Layout;
