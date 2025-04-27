import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const success = await login(email, password);
            if (success) {
                navigate('/');
            } else {
                setError('Invalid email or password');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // These inline styles will ensure the component looks good even if Tailwind isn't properly loaded
    const styles = {
        container: "flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100",
        formCard: "w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden mx-4",
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
        createAccountLink: "text-indigo-600 font-medium hover:text-indigo-800"
    };

    return (
        <div className={styles.container} style={{background: 'linear-gradient(to bottom right, #EBF4FF, #EBE7FF)'}}>
            <div className="w-full max-w-md px-6 py-8">
                <div className={styles.formCard} style={{boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'}}>
                    <div className={styles.header} style={{background: '#4F46E5', color: 'white'}}>
                        <h2 className={styles.heading} style={{fontSize: '1.875rem', fontWeight: 'bold', textAlign: 'center'}}>Welcome Back</h2>
                        <p className={styles.subheading} style={{color: '#C7D2FE', textAlign: 'center', marginTop: '0.5rem', fontSize: '0.875rem'}}>Sign in to your rider account</p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.formBody} style={{padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                        {error && (
                            <div className={styles.errorMessage} style={{background: '#FEF2F2', color: '#DC2626', padding: '0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem'}}>
                                {error}
                            </div>
                        )}

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
                                    background: isLoading ? '#818CF8' : '#4F46E5',
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
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-blue-600 hover:underline">
                                Sign up here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;