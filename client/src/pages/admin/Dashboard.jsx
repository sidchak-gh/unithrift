import { BoxIcon, UserCheckIcon, ListIcon, Loader2Icon, UsersIcon } from 'lucide-react';
import AdminTitle from '../../components/admin/AdminTitle';
import { useState, useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { backendUrl } from '../../configs/axios';
import toast from 'react-hot-toast';
import axios from 'axios';

const Dashboard = () => {

    const {user, token} = useAuthContext();
    
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        users: 0,
        activeListings: 0,
        pendingListings: 0,
        soldListings: 0
    });

    const dashboardCards = [
        { title: 'Total Users', value: dashboardData.users || '0', icon: UsersIcon },
        { title: 'Active Listings', value: dashboardData.activeListings || '0', icon: ListIcon },
        { title: 'Pending Approval', value: dashboardData.pendingListings || '0', icon: UserCheckIcon },
        { title: 'Items Sold', value: dashboardData.soldListings || '0', icon: BoxIcon },
    ];

    const fetchDashboardData = async () => {
        try {
             const {data} = await axios.get(`${backendUrl}/api/admin/dashboard`, {headers: {Authorization: `Bearer ${token}`}});
             setDashboardData(data)
             setLoading(false);
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
            console.log(error);
        }
    };

    useEffect(() => {
        if(user){
            fetchDashboardData();
        }
    }, [user]);

    return loading ? (
        <div className='flex items-center justify-center h-full'>
            <Loader2Icon className='animate-spin text-indigo-600 size-7' />
        </div>
    ) : (
        <>
            <AdminTitle text1='Admin' text2='Dashboard' />

            <div className='relative flex flex-wrap gap-4 mt-6 text-gray-600'>
                <div className='flex flex-wrap gap-4 w-full'>
                    {dashboardCards.map((card, index) => (
                        <div key={index} className='flex items-center justify-between px-4 py-3 bg-white ring ring-gray-200 rounded-md max-w-50 w-full'>
                            <div>
                                <h1 className='text-sm'>{card.title}</h1>
                                <p className='text-xl font-medium mt-1'>{card.value}</p>
                            </div>
                            <card.icon />
                        </div>
                    ))}
                </div>
            </div>
            
        </>
    );
};

export default Dashboard;
