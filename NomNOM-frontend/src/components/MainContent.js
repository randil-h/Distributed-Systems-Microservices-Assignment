import React, { useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import Footer from './Footer.js';
import { GiFruitBowl, GiCookie } from "react-icons/gi";
import { Link } from "react-router-dom";
import { motion } from "motion/react"

export default function MainContent() {
  const [menuOpen, setMenuOpen] = useState(false);

  const listItems = [
    "Register or Login",
    "Find Restaurants",
    "Create a new Logbook",
    "Create a new Logbook"
  ];

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <motion.div>
      <div className="h-screen w-full flex flex-col overflow-hidden bg-white">
        {/* Main content section */}
        <div
          className={`flex-1 m-2 h-full  grid grid-cols-1 md:grid-cols-9 text-light text-3xl font-medium transition-all duration-300`}
        >
          {/* Left Content */}
          <div className="md:col-span-5 px-6 text-start flex flex-col h-full bg-accent relative">
            {/* Mobile Menu Toggle */}
            <div className="md:hidden absolute top-4 right-4 z-50">
              <button onClick={toggleMenu} className="text-white">
                {menuOpen ? <X className="size-8"/> : <Menu className="size-8"/>}
              </button>
            </div>

            {/* Navbar */}
            <header className="w-full flex-shrink-0">
              <nav
                className="text-xl mx-auto flex w-full items-center justify-between p-8 gap-4 bg-transparent"
              >
                <button className="-m-1.5 flex flex-row items-center gap-2">
                  <GiCookie className="size-8 "/>
                  <span className="text-3xl font-semibold flex ">
                  NomNOM.
                </span>
                </button>

                <div
                  className={`
                  ${menuOpen ? "fixed inset-0 z-40 flex" : "hidden"} 
                  md:flex flex-col md:flex-row gap-4 md:w-auto 
                  bg-accent md:bg-transparent 
                  items-center justify-center md:items-start
                `}
                >
                  {/* Close button for mobile */}
                  <button
                    onClick={toggleMenu}
                    className="absolute top-4 right-4 md:hidden text-white"
                  >
                    <X className="size-8"/>
                  </button>

                  {['Home', 'Settings', 'Login', 'Register'].map((item) => (
                    <button
                      key={item}
                      className="nav-item w-full md:w-auto text-center"
                      onClick={toggleMenu}
                    >
                      <div
                        className="pl-12 md:pl-4 rounded-full transition-all duration-300 hover:underline hover:underline-offset-8"
                      >
                        {item}
                      </div>
                    </button>
                  ))}
                </div>
              </nav>
            </header>

            {/* Main Content Area */}
            <div className="flex flex-col flex-1">
              {/* Spacer to push list to bottom */}
              <div className="flex-1"/>

              {/* Fixed List - Always 4 items */}
              <div className="px-8 pb-8">
                <div className="text-xl font-mono text-light">{"{ Quicklinks }"}</div>
                <div className="text-3xl text-light">
                  {listItems.map((item, index) => (
                    <div
                      key={index}
                      className={`flex flex-row align-middle justify-between items-center py-4 hover:text-light_hover transition-all duration-150 ${
                        index !== listItems.length - 1 ? 'border-b border-black' : ''
                      }`}
                    >
                      <div className="px-2">{item}</div>
                      <div className="flex flex-row text-lg font-normal px-2 items-center">
                        <ArrowRight className="ml-2"/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Specific Columns */}
          <div className="grid grid-cols-2 h-full gap-0.5 mt-0.5 md:hidden">
            {/* Employees Section */}
            <Link
              to={'/employees'}
              className="h-40 w-full transition-all duration-300 bg-light_hover hover:bg-light_hover/80 text-dark flex items-center justify-center"
            >
              <div className="text-xl">{"Employees"}</div>
            </Link>

            {/* Crops Section */}
            <div
              className="h-40 w-full transition-all duration-300 bg-light hover:bg-light/80 text-dark flex items-center justify-center">
              <div className="text-xl">{"Crops"}</div>
            </div>
          </div>

          {/* Desktop Columns */}
          <Link
            className="hidden md:block border-l-2 border-white col-span-2 h-full w-full transition-all duration-300 bg-light_hover hover:bg-light_hover/80 text-dark"
            to={'/employees'}
          >
            <div className="text-start text-xl px-10 pt-8 mb-6">{"Popular Picks"}</div>
          </Link>

          {/* Actions Section */}
          <Link to={'/crops'}
            className="hidden md:block border-l-2 border-white col-span-2 h-full w-full transition-all duration-300 bg-light hover:bg-light/80 text-dark">
            <div className="text-start text-xl px-10 pt-8 mb-6">{"Find Restaurants"}</div>
          </Link>
        </div>

        {/* Footer
        <Footer/>*/}
      </div>
    </motion.div>
  );
}
