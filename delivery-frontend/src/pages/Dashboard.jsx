import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import axios from "axios";
import Navbar from "../components/Navbar.jsx";
import {Sidebar} from "../components/Sidebar.jsx";

mapboxgl.accessToken = 'pk.eyJ1IjoiYmltaWR1IiwiYSI6ImNtOGlmejI3ZzBjbmgyanBtMHZwdWlzZWcifQ.oR1p3_F9f9mqEaIxpklDOg';

const Dashboard = () => {
    const userName = localStorage.getItem('userName');
    const mapContainerRef = useRef(null);
    const [lng, setLng] = useState(0);
    const [lat, setLat] = useState(0);
    const [zoom, setZoom] = useState(14);
    const [deliveryDetails, setDeliveryDetails] = useState(null);
    const [buttonStage, setButtonStage] = useState('accept');
    const pickupLocation = { lat: 6.9271, lng: 79.8612, name: "Burger House" }; // Example: Colombo
    const customerLocation = { lat: 7.2906, lng: 80.6337, name: "303, Geethani, Panadura" }; // Example: Kandy
    const mapRef = useRef(null); // store map instance
    const [currentStage, setCurrentStage] = useState('start'); // start → accepted → pickedUp


    const location = useLocation(); // To track the current route for active state

    useEffect(() => {
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

    useEffect(() => {
        if (!mapContainerRef.current) return;

        let map;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newLng = position.coords.longitude;
                    const newLat = position.coords.latitude;

                    console.log("Retrieved coordinates:", newLat, newLng);

                    setLng(newLng);
                    setLat(newLat);

                    // Create the map only after getting location
                    map = new mapboxgl.Map({
                        container: mapContainerRef.current,
                        style: 'mapbox://styles/mapbox/streets-v11',
                        center: [newLng, newLat], // Start centered at user's location
                        zoom: zoom,
                    });

                    // Add marker at the user's location
                    new mapboxgl.Marker()
                        .setLngLat([newLng, newLat])
                        .addTo(map);

                    // Add controls
                    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

                    mapRef.current = map;

                    // Call drawRoute AFTER map is set and user location is known
                    drawRoute({ lat: newLat, lng: newLng }, pickupLocation);

                    // Save interval for updating driver location
                    const intervalId = setInterval(() => {
                        navigator.geolocation.getCurrentPosition(
                            (position) => {
                                const updatedLat = position.coords.latitude;
                                const updatedLng = position.coords.longitude;
                                updateDriverLocation(updatedLat, updatedLng);
                            },
                            (error) => {
                                console.error('Error getting location for update:', error);
                            }
                        );
                    }, 20000); // 20 seconds

                    // Cleanup
                    return () => {
                        clearInterval(intervalId);
                        if (map) map.remove();
                    };
                },
                (error) => {
                    console.error('Error getting location:', error);
                }
            );
        }
    }, []);

    const updateDriverLocation = async (lat, lng) => {
        try {
            const userId = localStorage.getItem('id');
            await axios.put(`http://localhost:6969/api/user/update-location/${userId}`, {
                lat,
                lng
            });
            console.log("Updated driver location successfully");
        } catch (error) {
            console.error("Error updating driver location:", error);
        }
    };

    const handlePickup = async () => {
        try {
            const token = localStorage.getItem('token');

            await axios.patch(
                `http://localhost:6967/api/orders/${deliveryDetails.orderId}`,
                { status: "In Transit" },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Order status updated to In Transit");

            setDeliveryDetails(prev => ({
                ...prev,
                status: "In Transit"
            }));

            // Get current location and draw route to customer
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const currentLat = position.coords.latitude;
                    const currentLng = position.coords.longitude;

                    // Draw new route
                    drawRoute({ lat: currentLat, lng: currentLng }, customerLocation);

                    // Add red marker at customer destination
                    new mapboxgl.Marker({ color: 'red' })
                        .setLngLat([customerLocation.lng, customerLocation.lat])
                        .setPopup(new mapboxgl.Popup().setText(customerLocation.name))
                        .addTo(mapRef.current);
                },
                (error) => {
                    console.error("Error getting current position for route:", error);
                }
            );
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };



    const drawRoute = async (start, end) => {
        const query = await fetch(
            `https://api.mapbox.com/directions/v5/mapbox/driving/${start.lng},${start.lat};${end.lng},${end.lat}?geometries=geojson&access_token=${mapboxgl.accessToken}`
        );
        const data = await query.json();
        const route = data.routes[0].geometry.coordinates;

        const geojson = {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'LineString',
                coordinates: route,
            },
        };

        if (mapRef.current.getSource('route')) {
            mapRef.current.getSource('route').setData(geojson);
        } else {
            mapRef.current.addSource('route', {
                type: 'geojson',
                data: geojson,
            });

            mapRef.current.addLayer({
                id: 'route',
                type: 'line',
                source: 'route',
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round',
                },
                paint: {
                    'line-color': '#3b82f6',
                    'line-width': 6,
                },
            });
        }
    };


    return (
        <div className="min-h-screen bg-gray-100 flex">
            <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40">
                <Sidebar />
            </div>

            {/* Main Content */}
            <div className="content flex-1 flex flex-col items-center p-8 ml-64"> {/* Added ml-64 to create space for the fixed sidebar */}

                {/* Top Navbar */}
                <div className="fixed top-0 left-64 right-0 h-16 bg-white shadow z-30">
                    <Navbar />
                </div>



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
                            <p><strong>Pickup Location:</strong> {pickupLocation.name}</p>
                            <p><strong>Customer Address:</strong> {customerLocation.name}</p>

                            {/*<p><strong>Customer Address:</strong> {deliveryDetails.customerAddress}</p>*/}
                        </div>

                        {/* Buttons Section */}
                        {buttonStage === 'accept' ? (
                            <button
                                className="bg-green-500 text-white py-2 px-6 rounded-xl shadow-md hover:bg-green-600 transition duration-300"
                                onClick={() => {
                                    setButtonStage('pickup');
                                    drawRoute({ lat, lng }, pickupLocation); // show route to pickup location
                                }}
                            >
                                Accept
                            </button>
                        ) : (
                            <button
                                className="bg-blue-500 text-white py-2 px-6 rounded-xl shadow-md hover:bg-blue-600 transition duration-300"
                                onClick={() => {
                                    handlePickup();
                                    drawRoute(pickupLocation, customerLocation); // show route to customer address
                                }}
                            >
                                Pick Up
                            </button>
                        )}

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