import { Fragment, useState } from 'react';
import { Link } from "react-router-dom";
import {
    Bars3Icon,
    XMarkIcon,
    UserCircleIcon
} from '@heroicons/react/24/outline';
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon, UserCircleIcon as UserCircleIconSolid } from '@heroicons/react/20/solid';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="bg-gray-900 bg-opacity-70 backdrop-blur text-emerald-100 sticky top-0 w-screen z-50 shadow-md">
            <nav
                className="text-lg h-full mx-auto flex max-w-7xl items-center relative justify-between p-6 lg:px-8 py-2 gap-4">
                {/* Navbar content */}
                <div className="flex lg:flex-1">
                    <Link to="/" className="-m-1.5 p-1.5">
                    <span className="text-2xl font-bold flex flex-row">NomNOM. Admin <span
                        className="font-light text-base">&trade;</span></span>
                    </Link>
                </div>
                {/*<Link to="/" className="nav-item">*/}
                {/*    <div*/}
                {/*        className="h-full font-medium px-6 rounded-full transition-all duration-200 hover:bg-emerald-800">Home*/}
                {/*    </div>*/}
                {/*</Link>*/}
                <div
                    className="hidden lg:flex lg:flex-1 lg:justify-end gap-4 font-medium content-center items-center align-middle">
                    {/*<button type="button"*/}
                    {/*        className="px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-full text-white bg-emerald-800 transition-all duration-200 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600">Register*/}
                    {/*</button>*/}
                    {/*<button type="button"*/}
                    {/*        className="px-3 py-1 border border-emerald-600 text-sm leading-4 font-medium rounded-full text-white transition-all duration-200 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600">Log*/}
                    {/*    In*/}
                    {/*</button>*/}
                    <UserCircleIcon className="w-6 h-6"/>
                </div>
            </nav>
        </header>
    );
}