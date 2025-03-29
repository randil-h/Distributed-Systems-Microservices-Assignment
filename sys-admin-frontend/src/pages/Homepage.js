import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Lock, User, AlertTriangle } from 'lucide-react';

export default function SystemAdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Basic validation
        if (!username || !password) {
            setError('Please enter both username and password');
            return;
        }

        // Reset error
        setError('');

        if (username === 'randil' && password === '6969') {
            console.log('Login successful');
            // Redirect to the dashboard screen
            navigate('/dashboard');
            return;
        } else {
            setError('Invalid username or password');
        }

        // Here you would typically add your authentication logic
        console.log('Login attempt', { username, password });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
            <div className="w-full max-w-md bg-white shadow-md rounded-lg overflow-hidden">
                <div className="bg-blue-600 text-white text-center py-4">
                    <h2 className="text-2xl font-bold">System Admin Login</h2>
                </div>
                <form onSubmit={handleLogin} className="p-6 space-y-6">
                    {error && (
                        <div className="flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <AlertTriangle className="mr-2 text-red-500" />
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="text-gray-400" />
                        </div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Login
                    </button>

                    <div className="text-center">
                        <a href="#" className="text-sm text-blue-600 hover:underline">Forgot Password?</a>
                    </div>
                </form>
            </div>
        </div>
    );
}