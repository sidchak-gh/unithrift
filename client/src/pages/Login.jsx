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

    const inputStyle = {
        display: 'block', width: '100%', marginTop: 6,
        padding: '10px 14px',
        border: '0.5px solid var(--border-strong)',
        borderRadius: 8, fontSize: 14,
        color: 'var(--text-primary)',
        background: 'var(--surface-1)',
        outline: 'none', fontFamily: "'Inter', sans-serif",
        transition: 'border-color 0.12s',
    };

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            minHeight: '70vh', background: 'var(--surface-0)',
        }}>
            <div style={{
                background: 'var(--surface-2)',
                border: '0.5px solid var(--border-strong)',
                borderRadius: 16, padding: 36,
                width: '100%', maxWidth: 420,
                boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            }}>
                {/* Header */}
                <div style={{ marginBottom: 28 }}>
                    <div className="ut-logo" style={{ fontSize: 20, marginBottom: 6 }}>
                        Uni<span>Thrift</span>
                    </div>
                    <h2 style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: 22, fontWeight: 700,
                        color: 'var(--text-primary)', marginBottom: 4,
                    }}>Welcome back</h2>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                        Sign in to your campus marketplace account
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            Email
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@university.edu"
                            style={inputStyle}
                            onFocus={e => e.target.style.borderColor = 'var(--orange)'}
                            onBlur={e => e.target.style.borderColor = 'var(--border-strong)'}
                        />
                    </div>
                    <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            style={inputStyle}
                            onFocus={e => e.target.style.borderColor = 'var(--orange)'}
                            onBlur={e => e.target.style.borderColor = 'var(--border-strong)'}
                        />
                    </div>
                    <button
                        type="submit"
                        className="ut-nav-pill primary"
                        style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 14, borderRadius: 10, marginTop: 4 }}
                    >
                        Log in
                    </button>
                </form>

                <div style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color: 'var(--orange)', fontWeight: 600, textDecoration: 'none' }}>
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
