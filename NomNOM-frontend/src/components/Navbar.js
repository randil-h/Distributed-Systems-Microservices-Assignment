import { UserCircleIcon } from '@heroicons/react/24/solid';
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import {GiCookie} from "react-icons/gi";

export default function NavBar() {
    const [showPopover, setShowPopover] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="text-black fixed top-0 w-screen  flex content-center justify-center align-middle z-50 bg-transparent items-center">
            <div className="h-full w-full lg:w-1/2 bg-neutral-300  rounded-full my-6 bg-opacity-60 backdrop-blur-xl">
                <nav className="text-xl h-full mx-auto flex w-full items-center justify-between lg:px-3 py-2 gap-4 bg-transparent">
                    {/* Navbar logo */}
                  <div className="flex lg:flex-1">

                    <button className="-m-1.5 pl-2 flex flex-row items-center gap-2">

                      <span className="text-3xl font-bold flex ">
                  NomNOM.
                </span>
                    </button>
                  </div>

                  {/* Mobile menu button */}
                  <div className="lg:hidden">
                    <button onClick={() => setMenuOpen(!menuOpen)}
                            className="text-black p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                            {menuOpen ? <XMarkIcon className="block h-6 w-6" aria-hidden="true" /> : <Bars3Icon className="block h-6 w-6" aria-hidden="true" />}
                        </button>
                    </div>

                    {/* Navbar items */}
                    <div className={`lg:flex flex-row gap-4 ${menuOpen ? 'flex' : 'hidden'} flex-col lg:flex-row w-full lg:w-auto`}>
                        <Link to="/" className="nav-item">
                            <div className="h-full font-medium px-6 rounded-full transition-all duration-200 hover:underline hover:underline-offset-8">
                                Home
                            </div>
                        </Link>
                        <Link to="/" className="nav-item">
                            <div className="h-full font-medium px-6 rounded-full transition-all duration-200 hover:underline hover:underline-offset-8">
                                Explore
                            </div>
                        </Link>
                        <Link to="/" className="nav-item">
                            <div className="h-full font-medium px-6 rounded-full transition-all duration-200 hover:underline hover:underline-offset-8">
                                Your Cart
                            </div>
                        </Link>
                    </div>

                    {/* Contact Me button */}
                    <div className="hidden lg:flex flex-1 justify-end">
                        <Link to="/" className="nav-item">
                            <div className="h-full font-medium px-4 py-2 rounded-full bg-black  text-light transition-all duration-200 hover:underline hover:underline-offset-8">
                                Login <span className=" text-green-400">| </span>Register
                            </div>
                        </Link>
                    </div>
                </nav>
            </div>
        </header>
    );
}
