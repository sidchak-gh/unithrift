import React, { useState, useRef, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

/* ─── Inline styles ──────────────────────────────────────────────────────────── */
const styles = {
    page: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%)',
        padding: '24px 16px',
    },
    card: {
        background: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(79,70,229,0.12)',
        width: '100%',
        maxWidth: '440px',
        overflow: 'hidden',
    },
    cardHeader: {
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        padding: '28px 32px 24px',
        textAlign: 'center',
    },
    logo: {
        color: '#fff',
        fontSize: '22px',
        fontWeight: '800',
        margin: '0 0 4px',
        letterSpacing: '-0.5px',
    },
    logoSub: {
        color: 'rgba(255,255,255,0.75)',
        fontSize: '12px',
        margin: 0,
    },
    cardBody: {
        padding: '32px',
    },
    title: {
        fontSize: '22px',
        fontWeight: '700',
        color: '#1e293b',
        margin: '0 0 6px',
    },
    subtitle: {
        fontSize: '14px',
        color: '#64748b',
        margin: '0 0 28px',
        lineHeight: '1.5',
    },
    fieldGroup: {
        marginBottom: '18px',
    },
    label: {
        display: 'block',
        fontSize: '13px',
        fontWeight: '600',
        color: '#374151',
        marginBottom: '6px',
    },
    input: {
        width: '100%',
        padding: '11px 14px',
        border: '1.5px solid #e2e8f0',
        borderRadius: '10px',
        fontSize: '15px',
        color: '#1e293b',
        background: '#f8fafc',
        outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxSizing: 'border-box',
    },
    submitBtn: {
        width: '100%',
        padding: '13px',
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        fontSize: '15px',
        fontWeight: '700',
        cursor: 'pointer',
        marginTop: '8px',
        transition: 'opacity 0.2s, transform 0.1s',
        letterSpacing: '0.2px',
    },
    footer: {
        textAlign: 'center',
        fontSize: '13.5px',
        color: '#64748b',
        marginTop: '20px',
    },
    link: {
        color: '#4f46e5',
        fontWeight: '600',
        textDecoration: 'none',
    },
    // OTP step specific
    otpRow: {
        display: 'flex',
        gap: '10px',
        justifyContent: 'center',
        marginBottom: '24px',
    },
    otpBox: {
        width: '52px',
        height: '58px',
        border: '2px solid #e2e8f0',
        borderRadius: '12px',
        fontSize: '24px',
        fontWeight: '700',
        textAlign: 'center',
        color: '#4f46e5',
        background: '#f8fafc',
        outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        caretColor: 'transparent',
    },
    emailBadge: {
        display: 'inline-block',
        background: '#eef2ff',
        color: '#4f46e5',
        borderRadius: '999px',
        padding: '4px 14px',
        fontSize: '13px',
        fontWeight: '600',
        marginBottom: '20px',
    },
    resendRow: {
        textAlign: 'center',
        marginTop: '16px',
        fontSize: '13.5px',
        color: '#64748b',
    },
    resendBtn: {
        background: 'none',
        border: 'none',
        color: '#4f46e5',
        fontWeight: '600',
        cursor: 'pointer',
        padding: '0',
        fontSize: '13.5px',
    },
    stepIndicator: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        marginBottom: '24px',
    },
    stepDot: (active) => ({
        width: '8px',
        height: '8px',
        borderRadius: '999px',
        background: active ? '#4f46e5' : '#e2e8f0',
        transition: 'background 0.3s',
    }),
    stepLine: {
        width: '32px',
        height: '2px',
        background: '#e2e8f0',
    },
};

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
        <div style={styles.otpRow} onPaste={handlePaste}>
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
                    onFocus={e => e.target.select()}
                    style={{
                        ...styles.otpBox,
                        borderColor: digits[idx] ? '#4f46e5' : '#e2e8f0',
                        boxShadow: digits[idx] ? '0 0 0 3px rgba(79,70,229,0.12)' : 'none',
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
    const [step, setStep] = useState(1); // 1 = form, 2 = OTP
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const [cooldown, setCooldown] = useState(0);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', campus: '' });

    const { sendOtp, verifyOtp, resendOtp } = useAuthContext();
    const navigate = useNavigate();

    // Cooldown timer for resend
    useEffect(() => {
        if (cooldown <= 0) return;
        const t = setTimeout(() => setCooldown(c => c - 1), 1000);
        return () => clearTimeout(t);
    }, [cooldown]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const focusStyle = {
        borderColor: '#4f46e5',
        boxShadow: '0 0 0 3px rgba(79,70,229,0.12)',
        background: '#fff',
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
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

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                {/* Header */}
                <div style={styles.cardHeader}>
                    <h1 style={styles.logo}>UniThrift</h1>
                    <p style={styles.logoSub}>Campus Marketplace</p>
                </div>

                <div style={styles.cardBody}>
                    {/* Step indicator */}
                    <div style={styles.stepIndicator}>
                        <div style={styles.stepDot(true)} />
                        <div style={styles.stepLine} />
                        <div style={styles.stepDot(step === 2)} />
                    </div>

                    {step === 1 ? (
                        /* ── Step 1: Registration Form ── */
                        <>
                            <h2 style={styles.title}>Create Account</h2>
                            <p style={styles.subtitle}>We'll send a verification code to your email</p>

                            <form onSubmit={handleRegisterSubmit}>
                                <div style={styles.fieldGroup}>
                                    <label style={styles.label}>Full Name</label>
                                    <input
                                        name="name"
                                        type="text"
                                        required
                                        placeholder="Jane Smith"
                                        value={formData.name}
                                        onChange={handleChange}
                                        style={styles.input}
                                        onFocus={e => Object.assign(e.target.style, focusStyle)}
                                        onBlur={e => Object.assign(e.target.style, { borderColor: '#e2e8f0', boxShadow: 'none', background: '#f8fafc' })}
                                    />
                                </div>
                                <div style={styles.fieldGroup}>
                                    <label style={styles.label}>Campus / College</label>
                                    <input
                                        name="campus"
                                        type="text"
                                        placeholder="e.g. Stanford University"
                                        value={formData.campus}
                                        onChange={handleChange}
                                        style={styles.input}
                                        onFocus={e => Object.assign(e.target.style, focusStyle)}
                                        onBlur={e => Object.assign(e.target.style, { borderColor: '#e2e8f0', boxShadow: 'none', background: '#f8fafc' })}
                                    />
                                </div>
                                <div style={styles.fieldGroup}>
                                    <label style={styles.label}>Email</label>
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="you@university.edu"
                                        value={formData.email}
                                        onChange={handleChange}
                                        style={styles.input}
                                        onFocus={e => Object.assign(e.target.style, focusStyle)}
                                        onBlur={e => Object.assign(e.target.style, { borderColor: '#e2e8f0', boxShadow: 'none', background: '#f8fafc' })}
                                    />
                                </div>
                                <div style={styles.fieldGroup}>
                                    <label style={styles.label}>Password</label>
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        placeholder="Min. 6 characters"
                                        value={formData.password}
                                        onChange={handleChange}
                                        style={styles.input}
                                        onFocus={e => Object.assign(e.target.style, focusStyle)}
                                        onBlur={e => Object.assign(e.target.style, { borderColor: '#e2e8f0', boxShadow: 'none', background: '#f8fafc' })}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
                                    disabled={loading}
                                    onMouseEnter={e => e.target.style.opacity = '0.9'}
                                    onMouseLeave={e => e.target.style.opacity = loading ? '0.7' : '1'}
                                >
                                    {loading ? 'Sending code…' : 'Send Verification Code →'}
                                </button>
                            </form>

                            <div style={styles.footer}>
                                Already have an account?{' '}
                                <Link to="/login" style={styles.link}>Log in</Link>
                            </div>
                        </>
                    ) : (
                        /* ── Step 2: OTP Verification ── */
                        <>
                            <h2 style={styles.title}>Verify Your Email</h2>
                            <p style={styles.subtitle}>Enter the 6-digit code we sent to</p>
                            <div style={{ textAlign: 'center' }}>
                                <span style={styles.emailBadge}>{formData.email}</span>
                            </div>

                            <form onSubmit={handleOtpSubmit}>
                                <OtpInput value={otp} onChange={setOtp} />

                                <button
                                    type="submit"
                                    style={{ ...styles.submitBtn, opacity: loading || otp.length < 6 ? 0.7 : 1 }}
                                    disabled={loading || otp.length < 6}
                                >
                                    {loading ? 'Verifying…' : 'Verify & Create Account'}
                                </button>
                            </form>

                            <div style={styles.resendRow}>
                                Didn't get it?{' '}
                                <button
                                    onClick={handleResend}
                                    style={{ ...styles.resendBtn, opacity: cooldown > 0 ? 0.5 : 1, cursor: cooldown > 0 ? 'not-allowed' : 'pointer' }}
                                    disabled={cooldown > 0}
                                >
                                    {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
                                </button>
                            </div>

                            <div style={{ ...styles.footer, marginTop: '12px' }}>
                                <button
                                    onClick={() => { setStep(1); setOtp(''); }}
                                    style={{ ...styles.resendBtn, color: '#64748b', fontWeight: '500' }}
                                >
                                    ← Change email
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Register;
