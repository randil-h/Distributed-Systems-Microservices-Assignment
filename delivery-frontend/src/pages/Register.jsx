import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // no need to import Link here
import { register } from '../services/authService';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
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

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl mb-4 text-center">Rider Register</h2>
                <input
                    type="name"
                    placeholder="Enter Full Name"
                    className="w-full p-2 mb-4 border rounded"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 mb-4 border rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 mb-4 border rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="bg-green-500 text-white w-full py-2 rounded hover:bg-green-600"
                >
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;
