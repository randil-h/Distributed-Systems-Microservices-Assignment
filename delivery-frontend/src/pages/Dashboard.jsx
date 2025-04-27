import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import axios from "axios";
import Sidebar from "../components/Sidebar.jsx";  // Import Sidebar component

mapboxgl.accessToken = 'pk.eyJ1IjoiYmltaWR1IiwiYSI6ImNtOGlmejI3ZzBjbmgyanBtMHZwdWlzZWcifQ.oR1p3_F9f9mqEaIxpklDOg';

const Dashboard = () => {
    const userName = localStorage.getItem('userName');
    const mapContainerRef = useRef(null);
    const [lng, setLng] = useState(0);
    const [lat, setLat] = useState(0);
    const [zoom, setZoom] = useState(14);
    const [deliveryDetails, setDeliveryDetails] = useState(null);

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
                        center: [newLng, newLat], // Start centered at user's location
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

        const fetchDeliveryDetails = async () => {
            try {
                const userId = localStorage.getItem('id');  // Assuming userId is saved in localStorage
                console.log(userId);
                const response = await axios.get(`http://localhost:5003/api/delivery/driver/${userId}`);
                setDeliveryDetails(response.data);  // Store the response in state
            } catch (error) {
                console.error("Error fetching delivery details:", error);
            }
        };

        fetchDeliveryDetails();

    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <Sidebar className="fixed top-0 left-0 h-full w-64" /> {/* Sidebar is fixed */}

            {/* Main Content */}
            <div className="content flex-1 flex flex-col items-center p-8 ml-64"> {/* Added ml-64 to create space for the fixed sidebar */}
                <Navbar />

                <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl text-center">
                    <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
                        {userName ? `Welcome, ${userName}!` : "Welcome!"}
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Manage your profile, view orders, and more from the sidebar.
                    </p>
                </div>

                {/* Delivery Details Card */}

                {deliveryDetails ? (
                    <div className="bg-white rounded-2xl shadow-2xl border-2 border-indigo-300 p-6 mt-8 w-full max-w-4xl mx-auto transition hover:shadow-3xl">
                        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">Delivery Details</h2>
                        <div className="space-y-4 text-lg text-gray-700">
                            <p><strong>Order ID:</strong> {deliveryDetails.orderId}</p>
                            <p><strong>Status:</strong> {deliveryDetails.status}</p>
                            <p><strong>Customer Address:</strong> {deliveryDetails.customerAddress}</p>
                        </div>

                        {/* Buttons Section */}
                        <div className="mt-8 flex justify-center space-x-4">
                            <button className="bg-green-500 text-white py-2 px-6 rounded-xl shadow-md hover:bg-green-600 transition duration-300">
                                Accept
                            </button>
                            <button className="bg-red-500 text-white py-2 px-6 rounded-xl shadow-md hover:bg-red-600 transition duration-300">
                                Decline
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-2xl border-2 border-gray-200 p-6 mt-8 w-full max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-6 text-indigo-600">No Available Deliveries</h2>
                        <p className="text-gray-500 text-lg">Currently, there are no deliveries assigned to you. Please check back later.</p>
                    </div>
                )}



                {/* Map Section */}
                <div className="bg-white rounded-2xl shadow-lg p-4 mt-8 w-full max-w-4xl">
                    <h2 className="text-2xl font-semibold mb-4 text-center text-indigo-600">Your Current Location</h2>
                    <div
                        ref={mapContainerRef}
                        className="w-full rounded-lg"
                        style={{ height: '500px' }}
                    />
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
