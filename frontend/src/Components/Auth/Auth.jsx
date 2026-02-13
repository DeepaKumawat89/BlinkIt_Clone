import React, { useState } from 'react';
import './Auth.css';

const Auth = ({ onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        let newErrors = {};

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (!isLogin) {
            // Name validation (Registration only)
            if (!formData.name) {
                newErrors.name = "Full name is required";
            } else if (formData.name.trim().length < 2) {
                newErrors.name = "Name is too short";
            }

            // Phone validation (Registration only)
            const phoneRegex = /^[0-9]{10}$/;
            if (!formData.phone) {
                newErrors.phone = "Phone number is required";
            } else if (!phoneRegex.test(formData.phone)) {
                newErrors.phone = "Please enter a valid 10-digit phone number";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear specific error when user starts typing
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (!validateForm()) return;

        const endpoint = isLogin ? '/api/users/login' : '/api/users/register';
        const url = `http://localhost:8081${endpoint}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            let data;
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            if (response.ok) {
                setMessage({ type: 'success', text: isLogin ? 'Login Successful!' : 'Registration Successful! Please login.' });

                // Reset form on success
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    phone: ''
                });

                if (!isLogin) {
                    // Delay switching to login so user can read the success message
                    setTimeout(() => {
                        setIsLogin(true);
                        setMessage({ type: '', text: '' });
                    }, 3000);
                }
                if (isLogin && onLoginSuccess) {
                    onLoginSuccess(data);
                }
                console.log('Success:', data);
            } else {
                const errorMsg = typeof data === 'string' ? data : (data.message || 'Something went wrong!');
                setMessage({ type: 'error', text: errorMsg });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Server error. Please try again later.' });
            console.error('Error:', error);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>{isLogin ? 'Login to Blinkit' : 'Create Account'}</h2>
                    <p style={{ color: '#888', fontSize: '0.9rem' }}>
                        {isLogin ? 'Welcome back! Enter your details' : 'Join us for effortless grocery shopping'}
                    </p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your name"
                                className={errors.name ? 'input-error' : ''}
                                value={formData.name}
                                onChange={handleChange}
                            />
                            {errors.name && <span className="error-text">{errors.name}</span>}
                        </div>
                    )}

                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="name@company.com"
                            className={errors.email ? 'input-error' : ''}
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>

                    {!isLogin && (
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Enter 10-digit number"
                                className={errors.phone ? 'input-error' : ''}
                                value={formData.phone}
                                onChange={handleChange}
                            />
                            {errors.phone && <span className="error-text">{errors.phone}</span>}
                        </div>
                    )}

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            className={errors.password ? 'input-error' : ''}
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {errors.password && <span className="error-text">{errors.password}</span>}
                    </div>

                    {message.text && (
                        <div className={message.type === 'success' ? 'success-msg' : 'error-msg'}>
                            {message.text}
                        </div>
                    )}

                    <button type="submit" className="auth-btn">
                        {isLogin ? 'Login' : 'Sign Up'}
                    </button>
                </form>

                <div className="auth-toggle">
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}
                    <span onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? 'Sign Up' : 'Login'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Auth;
