import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { backendUrl } from '../configs/axios';

const AuthContext = createContext();

export const useAuthContext = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.get(`${backendUrl}/api/auth/me`, config);
            setUser(data);
        } catch (error) {
            console.error('Auth verification failed', error);
            setUser(null);
            setToken(null);
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, [token]);

    const login = async (email, password) => {
        const { data } = await axios.post(`${backendUrl}/api/auth/login`, { email, password });
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data);
        return data;
    };

    const register = async (name, email, password, campus) => {
        const { data } = await axios.post(`${backendUrl}/api/auth/register`, { name, email, password, campus });
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        login,
        register,
        logout,
        loading,
        isSignedIn: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
