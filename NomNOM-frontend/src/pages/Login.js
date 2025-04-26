import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/auth";
import NavBar from "../components/utility_components/Navbar";
import { GiCookie } from "react-icons/gi";
import LoginBackgroundImage from "../media/food/pexels-valeriya-1833349.jpg";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate("/resops-dashboard");
        } catch (err) {
            setError("Invalid credentials. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex overflow-hidden">
            <NavBar />
            {/* Left Side - Login Form */}
            <div className="w-1/2 flex justify-center items-center px-8">
                <div className="w-full ">
                    <div className="flex flex-col items-center w-full">
                        <GiCookie className="size-14 mb-6 text-nomnom" />
                        <h2 className="text-5xl  text-center mb-4">Welcome Back!</h2>
                        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                        <form onSubmit={handleLogin} className="w-full flex flex-col items-center">
                            <div className="mb-6 w-full flex justify-center "> {/* Added flex justify-center */}
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-2/3  p-3 pl-4 text-xl bg-white border-b-2 border-light_hover focus:outline-none placeholder:text-lg placeholder:text-neutral-600"
                                />
                            </div>
                            <div className="mb-4 w-full flex justify-center"> {/* Added flex justify-center */}
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-2/3  p-3 pl-4 text-xl bg-white border-b-2 border-light_hover focus:outline-none placeholder:text-lg placeholder:text-neutral-600"
                                />
                            </div>
                            <div className="mb-6 w-full text-center">
                                <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="flex justify-center w-full">
                                <button
                                    type="submit"
                                    className="w-48 py-3 bg-nomnom text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    Login
                                </button>
                            </div>
                            <p className="mt-4 text-sm text-center text-gray-600">
                                Don't have an account?{" "}
                                <Link to="/signup" className="text-blue-600 hover:underline">
                                    Sign up here
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>

            {/* Right Side - Background Image with Text Overlay */}
            <div className="w-1/2 relative h-screen">
                {/* Overlay */}
                <div className="absolute inset-0 bg-black opacity-50"></div>
                {/* Background Image */}
                <img
                    src={LoginBackgroundImage}
                    alt="Login background"
                    className="w-full h-full object-cover"
                />
                {/* Title & Description */}
                <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-6">
                    <h2 className="text-5xl  mb-4">Your Favorite Meals, Just a Click Away!</h2>
                    <p className="text-xl max-w-lg">
                        Discover delicious dishes from top-rated restaurants and get them delivered to your doorstep in no time.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
