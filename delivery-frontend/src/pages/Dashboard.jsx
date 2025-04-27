import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';  // Import mapboxgl

mapboxgl.accessToken = 'pk.eyJ1IjoiYmltaWR1IiwiYSI6ImNtOGlmejI3ZzBjbmgyanBtMHZwdWlzZWcifQ.oR1p3_F9f9mqEaIxpklDOg';

const Dashboard = () => {
    const userName = localStorage.getItem('userName');
    const mapContainerRef = useRef(null);
    const [lng, setLng] = useState(0);
    const [lat, setLat] = useState(0);
    const [zoom, setZoom] = useState(14);

    const location = useLocation(); // To track the current route for active state

    useEffect(() => {
        if (!mapContainerRef.current) return;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newLng = position.coords.longitude;
                    const newLat = position.coords.latitude;

                    console.log("Retrieved coordinates:", newLat, newLng);

                    setLng(newLng);
                    setLat(newLat);

                    // Create the map only after getting location
                    const map = new mapboxgl.Map({
                        container: mapContainerRef.current,
                        style: 'mapbox://styles/mapbox/streets-v11',
                        center: [newLng, newLat], // ✅ Start centered at user's location
                        zoom: zoom, // Already set to 14
                    });

                    // Add marker at the user's location
                    new mapboxgl.Marker()
                        .setLngLat([newLng, newLat])
                        .addTo(map);

                    // Add controls
                    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

                    // Cleanup
                    return () => map.remove();
                },
                (error) => {
                    console.error('Error getting location:', error);
                }
            );
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <Navbar />

            <div className="dashboard-container flex">
                {/* Sidebar */}
                <div className="w-64 h-full bg-white border-r shadow-md p-6 flex flex-col space-y-6">
                    <h2 className="text-2xl font-semibold text-indigo-600">Menu</h2>
                    <nav className="flex flex-col space-y-4">
                        <Link
                            to="/dashboard"
                            className={`${
                                location.pathname === '/dashboard' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
                            } hover:bg-indigo-100 hover:text-indigo-600 p-3 rounded-lg transition-all`}
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/order-history"
                            className={`${
                                location.pathname === '/order-history' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
                            } hover:bg-indigo-100 hover:text-indigo-600 p-3 rounded-lg transition-all`}
                        >
                            Order History
                        </Link>
                        <Link
                            to="/profile"
                            className={`${
                                location.pathname === '/profile' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
                            } hover:bg-indigo-100 hover:text-indigo-600 p-3 rounded-lg transition-all`}
                        >
                            Profile
                        </Link>
                    </nav>
                </div>


                {/* Main Content */}
                <div className="content flex-1 flex flex-col items-center p-8">
                    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl text-center">
                        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
                            {userName ? `Welcome, ${userName}!` : "Welcome!"}
                        </h1>
                        <p className="text-gray-500 text-lg">
                            Manage your profile, view orders, and more from the sidebar.
                        </p>
                    </div>

                    {/* Map Section */}
                    <div className="bg-white rounded-2xl shadow-lg p-4 mt-8 w-full max-w-4xl">
                        <h2 className="text-2xl font-semibold mb-4 text-center text-indigo-600">Your Current Location</h2>
                        <div
                            ref={mapContainerRef}
                            className="w-full rounded-lg"
                            style={{ height: '500px' }} // 🔥 Added style here
                        />
                    </div>

                </div>

            </div>

        </div>
    );
};

export default Dashboard;
