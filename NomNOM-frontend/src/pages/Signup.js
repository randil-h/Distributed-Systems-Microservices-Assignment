import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api/auth";
import NavBar from "../components/utility_components/Navbar";
import { GiCookie } from "react-icons/gi";
import SignupBackgroundImage from "../media/food/pexels-rajesh-tp-749235-1633525.jpg";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("customer");
    const [error, setError] = useState("");
    const [agree, setAgree] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password, role);
            navigate("/login");
        } catch (err) {
            setError("Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex overflow-hidden">
            <NavBar />
            {/* Left Side - Signup Form */}
            <div className="w-1/2 flex justify-center items-center px-8">
                <div className="w-full ">
                    <div className="flex flex-col items-center w-full">
                        <GiCookie className="size-14 mb-6 text-nomnom" />
                        <h2 className="text-5xl text-center mb-4">Join Us Now!</h2>
                        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                        <form onSubmit={handleSignup} className="w-full flex flex-col items-center">
                            <div className="mb-6 w-full flex justify-center"> {/* Added flex justify-center */}
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-2/3  p-3 pl-4 text-xl bg-white border-b-2 border-light_hover focus:outline-none placeholder:text-lg placeholder:text-neutral-600"
                                />
                            </div>
                            <div className="mb-6 w-full flex justify-center"> {/* Added flex justify-center */}
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-2/3  p-3 pl-4 text-xl bg-white border-b-2 border-light_hover focus:outline-none placeholder:text-lg placeholder:text-neutral-600"
                                />
                            </div>
                            <div className="mb-6 w-full flex justify-center"> {/* Added flex justify-center */}
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-2/3  p-3 pl-4 text-xl bg-white border-b-2 border-light_hover focus:outline-none placeholder:text-lg placeholder:text-neutral-600"
                                />
                            </div>
                            <div className="mb-6 w-full flex justify-center"> {/* Added flex justify-center */}
                              <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-2/3  p-3 pl-4 text-xl bg-white border-b-2 border-light_hover focus:outline-none"
                              >
                                <option value="customer">Customer</option>
                                <option value="restaurant-admin">Restaurant Admin</option>
                                <option value="restaurant-admin">Restaurant Staff</option>
                                <option value="system-admin">System Admin</option>
                                <option value="delivery-personnel">Delivery Personnel</option>
                              </select>
                            </div>
                          {/* Terms & Conditions */}
                            <div className="mb-6 w-full max-w-[400px] text-center">
                <span className="text-sm text-gray-600">
                  By signing up, you agree to our{" "}
                    <Link to="/terms" className="text-blue-600 hover:underline">
                    Terms & Privacy Policy
                  </Link>.
                </span>
                            </div>
                            <div className="flex justify-center w-full">
                                <button
                                    type="submit"
                                    className="w-48 py-3 bg-nomnom text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    Sign Up
                                </button>
                            </div>
                            <p className="mt-4 text-sm text-center text-gray-600">
                                Already have an account?{" "}
                                <Link to="/login" className="text-blue-600 hover:underline">
                                    Login here
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
                    src={SignupBackgroundImage}
                    alt="Signup background"
                    className="w-full h-full object-cover"
                />
                {/* Title & Description */}
                <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-6">
                    <h2 className="text-5xl  mb-4">Delicious Meals, Delivered to You!</h2>
                    <p className="text-xl max-w-lg">
                        Sign up now and explore a variety of restaurants offering mouth-watering dishes, all available at your fingertips.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
