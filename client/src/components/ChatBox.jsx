import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loader2Icon, Send, X } from 'lucide-react';
import { clearChat } from '../app/features/chatSlice';
import { useAuthContext } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import axios from 'axios';
import { backendUrl } from '../configs/axios';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const ChatBox = () => {
    const { token, user } = useAuthContext();
    const { socket } = useSocket();
    const { listing, isOpen, chatId } = useSelector((state) => state.chat);
    const dispatch = useDispatch();

    const [chat, setChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef(null);

    const initChat = async () => {
        try {
            setIsLoading(true);
            const { data } = await axios.post(
                `${backendUrl}/api/chat/init`, 
                { listingId: listing?.id, sellerId: listing?.ownerId, chatId }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            setChat(data);
            setMessages(data?.messages || []);
            setIsLoading(false);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to load chat data");
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && (listing || chatId)) {
            initChat();
        } else {
            setChat(null);
            setMessages([]);
            setNewMessage("");
            setIsLoading(true);
        }
    }, [isOpen, listing, chatId]);

    // Socket message incoming
    useEffect(() => {
        if (!socket) return;
        const messageHandler = (message) => {
            if (chat && message.chatId === chat.id) {
                setMessages((prev) => [...prev, message]);
            }
        };
        socket.on("receive-message", messageHandler);
        return () => socket.off("receive-message", messageHandler);
    }, [socket, chat]);

    // Auto scroll bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || isSending || !chat) return;
        
        const msgText = newMessage.trim();
        const receiverId = chat.chatUserId === user.id ? chat.ownerUserId : chat.chatUserId;

        // Optimistic rendering
        const optimisticMsg = {
            id: Date.now().toString(),
            chatId: chat.id,
            sender_id: user.id,
            message: msgText,
            createdAt: new Date().toISOString()
        };
        setMessages((prev) => [...prev, optimisticMsg]);
        setNewMessage("");

        socket?.emit("send-message", {
            chatId: chat.id,
            senderId: user.id,
            receiverId,
            message: msgText
        });
    };

    if (!isOpen) return null;

    const otherUser = chat?.chatUserId === user?.id ? chat?.ownerUser : chat?.chatUser;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[500px] h-screen sm:h-[650px] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="bg-indigo-600 text-white p-4 flex items-center justify-between">
                    <div className="flex-1 min-w-0 pr-4">
                        <h3 className="font-bold text-lg leading-tight truncate">{chat?.listing?.title || listing?.title || "Item Listing"}</h3>
                        <p className="text-sm text-indigo-100 mt-0.5 truncate">
                            {isLoading ? "Loading chat..." : `Chatting with ${chat?.chatUserId === user?.id ? "seller" : "buyer"} (${otherUser?.name || "Unknown"})`}
                        </p>
                    </div>
                    <button 
                        onClick={() => dispatch(clearChat())} 
                        className="p-1.5 hover:bg-white/20 rounded-full transition-colors flex-shrink-0"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Messages Panel */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full text-indigo-300">
                            <Loader2Icon className="size-8 animate-spin mb-2" />
                            <span className="text-sm font-medium">Connecting...</span>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full opacity-60">
                            <p className="text-gray-500 font-medium">No messages yet</p>
                            <p className="text-sm text-gray-400 mt-1">Start the conversation!</p>
                        </div>
                    ) : (
                        messages.map((message) => (
                            <div key={message.id} className={`flex ${message.sender_id === user.id ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm ${message.sender_id === user.id ? "bg-indigo-600 text-white rounded-tr-sm" : "bg-white border border-gray-100 text-gray-800 rounded-tl-sm"}`}>
                                    <p className="text-sm break-words whitespace-pre-wrap leading-relaxed">{message.message}</p>
                                    <p className={`text-[10px] mt-1 text-right ${message.sender_id === user.id ? "text-indigo-200" : "text-gray-400"}`}>
                                        {format(new Date(message.createdAt), "h:mm a")}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Panel */}
                <div className="p-4 bg-white border-t border-gray-100">
                    {chat?.listing?.status !== "pending" && chat?.listing?.status !== "active" && chat?.listing?.status !== undefined ? (
                        <div className="text-center py-2">
                            <span className="inline-block bg-gray-100 text-gray-500 font-medium text-xs px-3 py-1.5 rounded-md">Listing is {chat?.listing?.status}</span>
                        </div>
                    ) : (
                        <form onSubmit={handleSendMessage} className="flex flex-col gap-2">
                            <div className="flex items-end gap-3">
                                <input 
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..." 
                                    className="flex-1 border bg-slate-50 border-gray-200 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all" 
                                />
                                <button 
                                    disabled={!newMessage.trim() || isSending} 
                                    type="submit" 
                                    className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white p-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md flex-shrink-0"
                                >
                                    {isSending ? <Loader2Icon className="size-5 animate-spin" /> : <Send className="size-5 -ml-0.5" />}
                                </button>
                            </div>
                        </form>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ChatBox;
