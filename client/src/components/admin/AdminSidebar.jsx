import { NavLink } from 'react-router-dom'
import { BanknoteIcon, CheckIcon, LayoutDashboardIcon, ListIcon, Settings2Icon, WalletIcon } from 'lucide-react';

import { useAuthContext } from '../../context/AuthContext';

const AdminSidebar = () => {

   const {user} = useAuthContext();

    const adminNavlinks = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboardIcon },
        { name: 'Manage Listings', path: '/admin/list-listings', icon: ListIcon },
    ];

    return (
        <div className='h-[calc(100vh-64px)] md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-gray-200 text-sm'>
            <div className='size-9 md:size-12 rounded-full mx-auto bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 border border-indigo-200'>
                {user?.name?.charAt(0).toUpperCase()}
            </div>
            <p className='mt-2 text-base max-md:hidden'>{user?.name}</p>
            <div className='w-full'>
                {adminNavlinks.map((link, index) => (
                    <NavLink key={index} to={link.path} end className={({ isActive }) => `relative flex items-center max-md:justify-center gap-2 w-full py-2.5 min-md:pl-10 first:mt-6 text-gray-600 ${isActive && 'bg-indigo-500/10 text-indigo-600 group'}`}>
                        {({ isActive }) => (
                            <>
                                <link.icon className="w-5 h-5" />
                                <p className="max-md:hidden">{link.name}</p>
                                <span className={`w-1.5 h-10 rounded-l right-0 absolute ${isActive && 'bg-indigo-500'}`} />
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </div>
    )
}

export default AdminSidebar