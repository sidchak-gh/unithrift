import React, { useState, useRef, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';

/* ─── OTP Input Row ──────────────────────────────────────────────────────────── */
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
        if (text) { onChange(text.padEnd(6, '').slice(0, 6)); inputs.current[Math.min(text.length, 5)]?.focus(); }
        e.preventDefault();
    };

    return (
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 24 }} onPaste={handlePaste}>
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
                    id={`otp-box-${idx}`}
                    autoComplete="one-time-code"
                />
            ))}
        </div>
    );
};

/* ─── Register Page ──────────────────────────────────────────────────────────── */
const Register = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const [cooldown, setCooldown] = useState(0);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', campus: '' });
    const [emailError, setEmailError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const allowedDomains = (import.meta.env.VITE_ALLOWED_EMAIL_DOMAINS || '')
        .split(',').map(d => d.trim().toLowerCase()).filter(Boolean);

    const { sendOtp, verifyOtp, resendOtp } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (cooldown <= 0) return;
        const t = setTimeout(() => setCooldown(c => c - 1), 1000);
        return () => clearTimeout(t);
    }, [cooldown]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const validateEmailDomain = (email) => {
        if (!allowedDomains.length) return true;
        const domain = email.split('@')[1]?.toLowerCase();
        return domain && allowedDomains.includes(domain);
    };

    const handleEmailBlur = () => {
        if (formData.email && !validateEmailDomain(formData.email)) {
            setEmailError(`Only ${allowedDomains.join(', ')} emails are allowed`);
        } else {
            setEmailError('');
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        if (!validateEmailDomain(formData.email)) {
            setEmailError(`Only ${allowedDomains.join(', ')} emails are allowed`);
            return;
        }
        setLoading(true);
        try {
            await sendOtp(formData.name, formData.email, formData.password, formData.campus);
            setStep(2);
            setCooldown(60);
            toast.info('Check your inbox — we sent a 6-digit code!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        if (otp.length < 6) { toast.error('Please enter the full 6-digit code'); return; }
        setLoading(true);
        try {
            await verifyOtp(formData.email, otp);
            toast.success('🎉 Email verified! Welcome to UniThrift!');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Verification failed');
            setOtp('');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (cooldown > 0) return;
        try {
            await resendOtp(formData.email);
            setCooldown(60);
            setOtp('');
            toast.success('New OTP sent!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to resend OTP');
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
                    {step === 1 ? (
                        <>
                            <h2 style={{
                                fontFamily: "'Space Grotesk', sans-serif",
                                fontSize: 22, fontWeight: 700,
                                color: 'var(--text-primary)', marginBottom: 4,
                            }}>Create Account</h2>
                            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                                Use your college or Gmail email to get started
                            </p>
                        </>
                    ) : (
                        <>
                            <h2 style={{
                                fontFamily: "'Space Grotesk', sans-serif",
                                fontSize: 22, fontWeight: 700,
                                color: 'var(--text-primary)', marginBottom: 4,
                            }}>Verify Your Email</h2>
                            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                                Enter the 6-digit code sent to{' '}
                                <span style={{ color: 'var(--orange)', fontWeight: 600 }}>{formData.email}</span>
                            </p>
                        </>
                    )}
                </div>

                {step === 1 ? (
                    /* ── Step 1: Registration Form ── */
                    <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                            <label style={labelStyle}>Full Name</label>
                            <input
                                name="name" type="text" required
                                placeholder="e.g. Rahul Sharma"
                                value={formData.name}
                                onChange={handleChange}
                                style={inputStyle}
                                onFocus={e => e.target.style.borderColor = 'var(--orange)'}
                                onBlur={e => e.target.style.borderColor = 'var(--border-strong)'}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Campus / College</label>
                            <input
                                name="campus" type="text"
                                placeholder="e.g. Graphic Era Hill University"
                                value={formData.campus}
                                onChange={handleChange}
                                style={inputStyle}
                                onFocus={e => e.target.style.borderColor = 'var(--orange)'}
                                onBlur={e => e.target.style.borderColor = 'var(--border-strong)'}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Email</label>
                            <input
                                name="email" type="email" required
                                placeholder="you@gehu.ac.in or you@gmail.com"
                                value={formData.email}
                                onChange={handleChange}
                                style={{ ...inputStyle, borderColor: emailError ? '#ef4444' : 'var(--border-strong)' }}
                                onFocus={e => e.target.style.borderColor = emailError ? '#ef4444' : 'var(--orange)'}
                                onBlur={handleEmailBlur}
                            />
                            {emailError && (
                                <p style={{ color: '#ef4444', fontSize: 12, marginTop: 5, fontWeight: 500 }}>
                                    ⚠️ {emailError}
                                </p>
                            )}
                        </div>
                        <div>
                            <label style={labelStyle}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    placeholder="Min. 6 characters"
                                    value={formData.password}
                                    onChange={handleChange}
                                    style={{ ...inputStyle, paddingRight: 40 }}
                                    onFocus={e => e.target.style.borderColor = 'var(--orange)'}
                                    onBlur={e => e.target.style.borderColor = 'var(--border-strong)'}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: 12,
                                        top: '50%',
                                        transform: 'translateY(-25%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: 0,
                                        color: 'var(--text-muted)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                    tabIndex={-1}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="ut-nav-pill primary"
                            disabled={loading}
                            style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 14, borderRadius: 10, marginTop: 4, opacity: loading ? 0.7 : 1 }}
                        >
                            {loading ? 'Sending code…' : 'Send Verification Code →'}
                        </button>
                    </form>
                ) : (
                    /* ── Step 2: OTP Verification ── */
                    <form onSubmit={handleOtpSubmit}>
                        <OtpInput value={otp} onChange={setOtp} />
                        <button
                            type="submit"
                            className="ut-nav-pill primary"
                            disabled={loading || otp.length < 6}
                            style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 14, borderRadius: 10, opacity: (loading || otp.length < 6) ? 0.7 : 1 }}
                        >
                            {loading ? 'Verifying…' : 'Verify & Create Account'}
                        </button>
                        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--text-muted)' }}>
                            Didn't get it?{' '}
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
                        <div style={{ textAlign: 'center', marginTop: 12 }}>
                            <button
                                type="button"
                                onClick={() => { setStep(1); setOtp(''); }}
                                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 13 }}
                            >
                                ← Change email
                            </button>
                        </div>
                    </form>
                )}

                <div style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: 'var(--orange)', fontWeight: 600, textDecoration: 'none' }}>
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
