import React, { useState, useRef, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

/* ─── 6-Box OTP Input ──────────────────────────────────────────────────────── */
const OtpInput = ({ value, onChange }) => {
    const inputs = useRef([]);
    const digits = value.split('');

    const handleKey = (e, idx) => {
        if (e.key === 'Backspace') {
            if (digits[idx]) {
                const next = [...digits];
                next[idx] = '';
                onChange(next.join(''));
            } else if (idx > 0) {
                inputs.current[idx - 1]?.focus();
            }
            return;
        }
        if (e.key === 'ArrowLeft' && idx > 0) { inputs.current[idx - 1]?.focus(); return; }
        if (e.key === 'ArrowRight' && idx < 5) { inputs.current[idx + 1]?.focus(); return; }
    };

    const handleChange = (e, idx) => {
        const char = e.target.value.replace(/\D/g, '').slice(-1);
        if (!char) return;
        const next = [...digits.concat(Array(6).fill(''))].slice(0, 6);
        next[idx] = char;
        onChange(next.join('').slice(0, 6));
        if (idx < 5) setTimeout(() => inputs.current[idx + 1]?.focus(), 10);
    };

    const handlePaste = (e) => {
        const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (text) {
            onChange(text.padEnd(6, '').slice(0, 6));
            inputs.current[Math.min(text.length, 5)]?.focus();
        }
        e.preventDefault();
    };

    return (
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 20 }} onPaste={handlePaste}>
            {Array.from({ length: 6 }).map((_, idx) => (
                <input
                    key={idx}
                    ref={el => inputs.current[idx] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digits[idx] || ''}
                    onChange={e => handleChange(e, idx)}
                    onKeyDown={e => handleKey(e, idx)}
                    onFocus={e => { e.target.select(); e.target.style.borderColor = 'var(--orange)'; }}
                    onBlur={e => e.target.style.borderColor = digits[idx] ? 'var(--orange)' : 'var(--border-strong)'}
                    style={{
                        width: 48, height: 54,
                        border: '0.5px solid var(--border-strong)',
                        borderRadius: 8,
                        fontSize: 22, fontWeight: 700, textAlign: 'center',
                        color: 'var(--text-primary)',
                        background: 'var(--surface-1)',
                        outline: 'none', caretColor: 'transparent',
                        transition: 'border-color 0.12s',
                        fontFamily: "'Inter', sans-serif",
                    }}
                    id={`reset-otp-box-${idx}`}
                    autoComplete="one-time-code"
                />
            ))}
        </div>
    );
};

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1 = Enter Email, 2 = Enter OTP & New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    const { forgotPassword, resetPassword } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (cooldown <= 0) return;
        const t = setTimeout(() => setCooldown(c => c - 1), 1000);
        return () => clearTimeout(t);
    }, [cooldown]);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await forgotPassword(email.trim());
            toast.success("Verification code sent to your email!");
            setStep(2);
            setCooldown(60);
        } catch (error) {
            console.error("Forgot password error:", error);
            const msg = error.response?.data?.message || error.message || "Failed to send reset code";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (cooldown > 0) return;
        try {
            await forgotPassword(email.trim());
            setCooldown(60);
            setOtp('');
            toast.success("New verification code sent!");
        } catch (error) {
            console.error("Resend error:", error);
            const msg = error.response?.data?.message || error.message || "Failed to resend code";
            toast.error(msg);
        }
    };

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        if (otp.length < 6) {
            toast.error("Please enter the full 6-digit OTP");
            return;
        }
        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            await resetPassword(email.trim(), otp.trim(), newPassword);
            toast.success("Password reset successful! Please log in.");
            navigate("/login");
        } catch (error) {
            console.error("Reset error:", error);
            const msg = error.response?.data?.message || error.message || "Reset password failed";
            toast.error(msg);
        } finally {
            setLoading(false);
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
        boxSizing: 'border-box',
    };

    const labelStyle = {
        fontSize: 12, fontWeight: 600,
        color: 'var(--text-primary)',
        textTransform: 'uppercase', letterSpacing: '0.08em',
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
                    }}>
                        {step === 1 ? 'Forgot Password' : 'Reset Password'}
                    </h2>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                        {step === 1
                            ? 'Enter your registered email to receive a reset code.'
                            : <>Enter the 6-digit code sent to <span style={{ color: 'var(--orange)', fontWeight: 600 }}>{email}</span> and your new password.</>
                        }
                    </p>
                </div>

                {step === 1 ? (
                    /* ── Step 1: Send OTP ── */
                    <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                            <label style={labelStyle}>Your Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@gehu.ac.in or you@gmail.com"
                                style={inputStyle}
                                onFocus={e => e.target.style.borderColor = 'var(--orange)'}
                                onBlur={e => e.target.style.borderColor = 'var(--border-strong)'}
                            />
                        </div>
                        <button
                            type="submit"
                            className="ut-nav-pill primary"
                            disabled={loading}
                            style={{
                                width: '100%', justifyContent: 'center', padding: '12px',
                                fontSize: 14, borderRadius: 10, marginTop: 4,
                                opacity: loading ? 0.7 : 1,
                            }}
                        >
                            {loading ? 'Sending code…' : 'Send Reset Code →'}
                        </button>
                    </form>
                ) : (
                    /* ── Step 2: OTP + New Password ── */
                    <form onSubmit={handleResetSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                            <label style={{ ...labelStyle, display: 'block', textAlign: 'center', marginBottom: 10 }}>
                                6-Digit Code
                            </label>
                            <OtpInput value={otp} onChange={setOtp} />
                        </div>

                        <div>
                            <label style={labelStyle}>New Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    placeholder="Min. 6 characters"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    style={{ ...inputStyle, paddingRight: 40 }}
                                    onFocus={e => e.target.style.borderColor = 'var(--orange)'}
                                    onBlur={e => e.target.style.borderColor = 'var(--border-strong)'}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute', right: 12, top: '50%',
                                        transform: 'translateY(-25%)',
                                        background: 'none', border: 'none',
                                        cursor: 'pointer', padding: 0,
                                        color: 'var(--text-muted)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label style={labelStyle}>Confirm New Password</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                placeholder="Re-enter new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                style={inputStyle}
                                onFocus={e => e.target.style.borderColor = 'var(--orange)'}
                                onBlur={e => e.target.style.borderColor = 'var(--border-strong)'}
                            />
                        </div>

                        <button
                            type="submit"
                            className="ut-nav-pill primary"
                            disabled={loading || otp.length < 6}
                            style={{
                                width: '100%', justifyContent: 'center', padding: '12px',
                                fontSize: 14, borderRadius: 10, marginTop: 4,
                                opacity: (loading || otp.length < 6) ? 0.7 : 1,
                            }}
                        >
                            {loading ? 'Updating…' : 'Set New Password'}
                        </button>

                        <div style={{ textAlign: 'center', marginTop: 8, fontSize: 13, color: 'var(--text-muted)' }}>
                            Didn't get the code?{' '}
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={cooldown > 0}
                                style={{
                                    background: 'none', border: 'none',
                                    color: 'var(--orange)', fontWeight: 600,
                                    cursor: cooldown > 0 ? 'not-allowed' : 'pointer',
                                    opacity: cooldown > 0 ? 0.5 : 1,
                                    fontSize: 13, padding: 0,
                                }}
                            >
                                {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
                            </button>
                        </div>
                    </form>
                )}

                <div style={{ marginTop: 24, textAlign: 'center' }}>
                    <Link
                        to="/login"
                        style={{
                            color: 'var(--text-muted)',
                            fontSize: 13,
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            fontWeight: 500,
                        }}
                    >
                        <ArrowLeft size={14} /> Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;

