import React, { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuthContext();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            toast.success("Successfully logged in!");
            navigate("/");
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[70vh] bg-slate-50">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-slate-200">
                <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">Welcome Back</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Email</label>
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Password</label>
                        <input 
                            type="password" 
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <button 
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Log in
                    </button>
                </form>
                <div className="mt-4 text-center text-sm text-slate-600">
                    Don't have an account? <Link to="/register" className="text-indigo-600 hover:text-indigo-500 font-medium">Sign up</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
