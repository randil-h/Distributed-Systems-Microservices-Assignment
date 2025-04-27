import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { register } from '../services/authService';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await register(email, password, name);
        if (success) {
            navigate('/login');
        } else {
            alert('Registration Failed');
        }
    };

    const styles = {
        container: "flex justify-center items-center h-screen bg-gradient-to-br from-blue-100 to-purple-100",
        formCard: "w-full border max-w-md bg-white rounded-2xl shadow-xl overflow-hidden mx-4",
        header: "px-8 pt-6 pb-6 bg-indigo-600 text-white",
        heading: "text-3xl font-bold text-center",
        subheading: "text-indigo-100 text-center mt-2 text-sm",
        formBody: "px-8 py-6 space-y-6",
        errorMessage: "bg-red-50 text-red-600 p-3 rounded-lg text-sm",
        formGroup: "space-y-2",
        formLabel: "block text-sm font-medium text-gray-700",
        formInput: "w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200",
        linkRow: "flex justify-between items-center",
        link: "text-sm text-indigo-600 hover:text-indigo-800",
        submitButton: "w-full py-3 px-4 rounded-lg text-white font-medium bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 transition duration-200",
        disabledButton: "w-full py-3 px-4 rounded-lg text-white font-medium bg-indigo-400 cursor-not-allowed",
        footer: "px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-center",
        footerText: "text-sm text-gray-600",
        createAccountLink: "text-indigo-600 font-medium hover:text-indigo-800",
        imageContainer: "w-1/2 bg-cover bg-center relative",
        image: "w-full h-full object-cover filter brightness-75 saturate-75",
    };

    return (
        <div className={styles.container}>
            {/* Left Half - Form */}
            <div className="w-1/2 flex justify-center items-center ">
                <div className="w-3/4 overflow-hidden rounded-2xl shadow-lg">
                    <div className={styles.formCard} style={{boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'}}>
                        <div className={styles.header} style={{background: 'black', color: 'white'}}>
                            <h2 className={styles.heading} style={{fontSize: '1.875rem', fontWeight: 'bold', textAlign: 'center'}}>Register Now!!</h2>
                            <p className={styles.subheading} style={{color: '#C7D2FE', textAlign: 'center', marginTop: '0.5rem', fontSize: '0.875rem'}}>Sign up to your rider account</p>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.formBody} style={{padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                            {error && (
                                <div className={styles.errorMessage} style={{background: '#FEF2F2', color: '#DC2626', padding: '0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem'}}>
                                    {error}
                                </div>
                            )}

                            <div className={styles.formGroup} style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                                <label htmlFor="email" className={styles.formLabel} style={{fontSize: '0.875rem', fontWeight: '500', color: '#374151'}}>
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Full Name"
                                    className={styles.formInput}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        borderRadius: '0.375rem',
                                        border: '1px solid #D1D5DB',
                                        transition: 'all 0.2s'
                                    }}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup} style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                                <label htmlFor="email" className={styles.formLabel} style={{fontSize: '0.875rem', fontWeight: '500', color: '#374151'}}>
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    className={styles.formInput}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        borderRadius: '0.375rem',
                                        border: '1px solid #D1D5DB',
                                        transition: 'all 0.2s'
                                    }}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup} style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                                <div className={styles.linkRow} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <label htmlFor="password" className={styles.formLabel} style={{fontSize: '0.875rem', fontWeight: '500', color: '#374151'}}>
                                        Password
                                    </label>
                                    <a href="#" className={styles.link} style={{fontSize: '0.875rem', color: '#4F46E5'}}>
                                        Forgot password?
                                    </a>
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className={styles.formInput}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        borderRadius: '0.375rem',
                                        border: '1px solid #D1D5DB',
                                        transition: 'all 0.2s'
                                    }}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={isLoading ? styles.disabledButton : styles.submitButton}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        borderRadius: '0.375rem',
                                        fontWeight: '500',
                                        color: 'white',
                                        background: isLoading ? 'grey' : 'black',
                                        cursor: isLoading ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.2s',
                                        marginTop: '0.5rem'
                                    }}
                                >
                                    {isLoading ? 'Signing in...' : 'Sign In'}
                                </button>
                            </div>
                        </form>

                        <div className={styles.footer} style={{padding: '1rem 2rem', background: '#F9FAFB', borderTop: '1px solid #F3F4F6', display: 'flex', justifyContent: 'center'}}>
                            <p className={styles.footerText} style={{fontSize: '0.875rem', color: '#4B5563'}}>
                                Already have an account?{' '}
                                <Link to="/login" className="text-blue-600 hover:underline">
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right half - Image */}
            <div className={`w-1/2 relative ${styles.imageContainer}`} style={{ backgroundImage: 'url(foodimgs.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>

                {/* Overlay to dim the image */}
                <div className="absolute inset-0 bg-black opacity-40"></div>

                {/* Centered Text */}
                <div className="absolute inset-0 flex justify-center items-center">
                    <h2 className="text-white text-4xl font-bold text-center px-4">
                        Welcome to Our Platform
                    </h2>
                </div>
            </div>

        </div>
    );
};

export default Register;
