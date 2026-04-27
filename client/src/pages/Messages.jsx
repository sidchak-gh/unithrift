import React, { useEffect, useMemo, useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { backendUrl } from '../configs/axios';
import axios from 'axios';
import { Search, MessageCircle, Loader2Icon } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setChat } from '../app/features/chatSlice';
import { format, isToday, isYesterday, parseISO } from 'date-fns';

const Messages = () => {
    const { user, token } = useAuthContext();
    const dispatch = useDispatch();
    
    // State
    const [chats, setChats] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loadingChats, setLoadingChats] = useState(true);

    const formatTime = (dateString) => {
        if (!dateString) return;
        const date = parseISO(dateString);
        if (isToday(date)) return "Today " + format(date, "HH:mm");
        if (isYesterday(date)) return "Yesterday " + format(date, "HH:mm");
        return format(date, "MMM d");
    };

    // Fetch Chats
    useEffect(() => {
        const fetchChats = async () => {
            try {
                const { data } = await axios.get(`${backendUrl}/api/chat`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setChats(data);
            } catch (error) {
                console.error("Error fetching chats", error);
            } finally {
                setLoadingChats(false);
            }
        };
        if (token) fetchChats();
    }, [token]);

    const filteredChats = useMemo(() => {
        const query = searchQuery.toLowerCase();
        return chats.filter((chat) => {
            const chatUser = chat.chatUserId === user?.id ? chat?.ownerUser : chat?.chatUser;
            return (
                chat.listing?.title?.toLowerCase().includes(query) ||
                chatUser?.name?.toLowerCase().includes(query)
            );
        });
    }, [chats, searchQuery, user]);

    const handleOpenChat = (chat) => {
        dispatch(setChat({ listing: chat.listing, chatId: chat.id }));
    };

    if (loadingChats) {
        return (
            <div className="h-screen flex justify-center items-center">
                <Loader2Icon className="size-7 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="mx-auto w-full min-h-[calc(100vh-80px)] px-6 md:px-16 lg:px-24 xl:px-32 bg-slate-50">
            <div className="py-10 max-w-4xl mx-auto">
                {/* Header  */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Messages</h1>
                    <p className="text-gray-600">Chat with buyers and sellers</p>
                </div>

                {/* Search Bar */}
                <div className="relative mb-8">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all text-sm"
                    />
                </div>

                {/* Chat List */}
                {filteredChats.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-20 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-5 border border-gray-100">
                            <MessageCircle className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-800 mb-2">
                            {searchQuery ? "No chats found" : "No messages yet"}
                        </h3>
                        <p className="text-gray-500 text-sm max-w-xs mx-auto text-balance">
                            {searchQuery
                                ? "Try a different search term"
                                : "Start a conversation by viewing a listing and clicking 'Message Seller'."}
                        </p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100 overflow-hidden">
                        {filteredChats.map((chat) => {
                            const chatUser = chat.chatUserId === user?.id ? chat.ownerUser : chat.chatUser;
                            return (
                                <button
                                    onClick={() => handleOpenChat(chat)}
                                    key={chat.id}
                                    className="w-full p-5 hover:bg-slate-50 transition-colors text-left flex items-start space-x-4 focus:outline-none focus:bg-slate-50 group"
                                >
                                    <div className="flex-shrink-0">
                                        {chatUser?.image ? (
                                            <img
                                                src={chatUser.image}
                                                alt={chatUser?.name}
                                                className="w-12 h-12 md:w-14 md:h-14 rounded-xl object-cover shadow-sm bg-gray-50"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-lg shadow-sm">
                                                {chatUser?.name?.charAt(0).toUpperCase() || "U"}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 py-1">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <h3 className="font-bold text-gray-800 truncate text-sm">
                                                {chat.listing?.title || "Item Listing"}
                                            </h3>
                                            <span className="text-[11px] text-gray-400 font-medium flex-shrink-0 ml-3 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                                                {formatTime(chat.updatedAt)}
                                            </span>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-700 truncate mb-1 border-l-2 border-indigo-400 pl-2">
                                            {chatUser?.name}
                                        </p>
                                        <p className={`text-sm truncate pl-2 ${!chat.isLastMessageRead && chat.lastMessageSenderId !== user?.id ? "text-indigo-600 font-bold" : "text-gray-500"}`}>
                                            {chat.lastMessage || "Click to view messages"}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;
