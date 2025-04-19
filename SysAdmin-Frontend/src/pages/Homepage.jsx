import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
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
        <div className="w-screen h-screen bg-gray-900 flex items-center justify-center">
            <div className="w-full max-w-md bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-700">
                <div className="bg-blue-800 text-white text-center py-4">
                    <h2 className="text-2xl font-bold">System Admin Login</h2>
                </div>

                <form onSubmit={handleLogin} className="p-6 space-y-4">
                    {error && (
                        <div className="flex items-center bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded relative" role="alert">
                            <AlertTriangle className="mr-2 text-red-300" />
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
                            className="w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                            className="w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Login
                    </button>

                    <div className="text-center mt-4">
                        <a href="#" className="text-sm text-blue-400 hover:text-blue-300">Forgot Password?</a>
                    </div>
                </form>
            </div>
        </div>
    );
}