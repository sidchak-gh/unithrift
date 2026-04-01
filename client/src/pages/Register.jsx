import React, { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        campus: ''
    });
    const { register } = useAuthContext();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData.name, formData.email, formData.password, formData.campus);
            toast.success("Registration successful!");
            navigate("/");
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[70vh] bg-slate-50">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-slate-200 mt-10 mb-10">
                <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">Create Account</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Full Name</label>
                        <input 
                            name="name"
                            type="text" 
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Campus / College</label>
                        <input 
                            name="campus"
                            type="text" 
                            placeholder="e.g. Stanford University"
                            value={formData.campus}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Email</label>
                        <input 
                            name="email"
                            type="email" 
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Password</label>
                        <input 
                            name="password"
                            type="password" 
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <button 
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Sign up
                    </button>
                </form>
                <div className="mt-4 text-center text-sm text-slate-600">
                    Already have an account? <Link to="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">Log in</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
