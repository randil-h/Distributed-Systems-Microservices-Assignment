"use client"

import { useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"
import "mapbox-gl/dist/mapbox-gl.css"
import mapboxgl from "mapbox-gl"
import axios from "axios"
import { MapPin, Navigation, Clock, Package, User, CheckCircle, XCircle } from "lucide-react"
import {Sidebar} from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";

mapboxgl.accessToken = "pk.eyJ1IjoiYmltaWR1IiwiYSI6ImNtOGlmejI3ZzBjbmgyanBtMHZwdWlzZWcifQ.oR1p3_F9f9mqEaIxpklDOg"

const Dashboard = () => {
    const userName = localStorage.getItem("userName")
    const mapContainerRef = useRef(null)
    const [lng, setLng] = useState(0)
    const [lat, setLat] = useState(0)
    const [zoom, setZoom] = useState(14)
    const [deliveryDetails, setDeliveryDetails] = useState(null)
    const [buttonStage, setButtonStage] = useState("accept")
    const pickupLocation = {
        lat: 6.707059205690213,
        lng: 79.93765236876658,
        name: "Burger House",
        address: "345,Colombo",
    } // Example: Colombo,
    const customerLocation = {
        lat: 6.7034789745875525,
        lng: 79.95846630968443,
        address: "303, Geethani, Panadura",
        name: "Malcom",
    } // Example: Kandy,,
    const mapRef = useRef(null) // store map instance
    const [currentStage, setCurrentStage] = useState("start") // start → accepted → pickedUp
    const [activeTab, setActiveTab] = useState("current")

    const location = useLocation() // To track the current route for active state

    useEffect(() => {
        const fetchDeliveryDetails = async () => {
            try {
                const userId = localStorage.getItem("id") // Assuming userId is saved in localStorage
                console.log(userId)
                const response = await axios.get(`http://localhost:5003/api/delivery/driver/${userId}`)
                setDeliveryDetails(response.data) // Store the response in state
            } catch (error) {
                console.error("Error fetching delivery details:", error)
            }
        }

        fetchDeliveryDetails()
    }, [])

    useEffect(() => {
        if (!mapContainerRef.current) return

        let map

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newLng = position.coords.longitude;
                    const newLat = position.coords.latitude;

                    setLng(newLng);
                    setLat(newLat);

                    map = new mapboxgl.Map({
                        container: mapContainerRef.current,
                        style: "mapbox://styles/mapbox/dark-v10",
                        center: [newLng, newLat],
                        zoom: zoom,
                    });

                    mapRef.current = map;

                    map.addControl(new mapboxgl.NavigationControl(), "top-right");

                    new mapboxgl.Marker({ color: "#10b981" })
                        .setLngLat([newLng, newLat])
                        .addTo(map);

                    // Wait for map to finish loading before drawing route
                    map.on("load", () => {
                        drawRoute({ lat: newLat, lng: newLng }, pickupLocation);
                    });

                    const intervalId = setInterval(() => {
                        navigator.geolocation.getCurrentPosition(
                            (position) => {
                                const updatedLat = position.coords.latitude;
                                const updatedLng = position.coords.longitude;
                                updateDriverLocation(updatedLat, updatedLng);
                            },
                            (error) => {
                                console.error("Error getting location for update:", error);
                            }
                        );
                    }, 20000);

                    return () => {
                        clearInterval(intervalId);
                        if (map) map.remove();
                    };
                },
                (error) => {
                    console.error("Error getting location:", error);
                }
            );

        }
    }, [])

    const updateDriverLocation = async (lat, lng) => {
        try {
            const userId = localStorage.getItem("id")
            await axios.put(`http://localhost:6969/api/user/update-location/${userId}`, {
                lat,
                lng,
            })
            console.log("Updated driver location successfully")
        } catch (error) {
            console.error("Error updating driver location:", error)
        }
    }

    const handlePickup = async () => {
        try {
            const token = localStorage.getItem("token")

            await axios.patch(
                `http://localhost:6967/api/orders/${deliveryDetails.orderId}`,
                { status: "In Transit" },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            )

            console.log("Order status updated to In Transit")

            setDeliveryDetails((prev) => ({
                ...prev,
                status: "In Transit",
            }))

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const currentLat = position.coords.latitude
                    const currentLng = position.coords.longitude

                    // Update map route to customer location
                    drawRoute({ lat: currentLat, lng: currentLng }, customerLocation)

                    // Add red marker at customer location
                    new mapboxgl.Marker({ color: "#ef4444" })
                        .setLngLat([customerLocation.lng, customerLocation.lat])
                        .setPopup(new mapboxgl.Popup().setText(customerLocation.name))
                        .addTo(mapRef.current)
                },
                (error) => {
                    console.error("Error getting current position for route:", error)
                },
            )
        } catch (error) {
            console.error("Error updating order status:", error)
        }
    }

    const handleDecline = () => {
        // Implement decline functionality here
        console.log("Order declined")
        setDeliveryDetails(null)
    }

    const drawRoute = async (start, end) => {
        const query = await fetch(
            `https://api.mapbox.com/directions/v5/mapbox/driving/${start.lng},${start.lat};${end.lng},${end.lat}?geometries=geojson&access_token=${mapboxgl.accessToken}`,
        )
        const data = await query.json()
        const route = data.routes[0].geometry.coordinates

        const geojson = {
            type: "Feature",
            properties: {},
            geometry: {
                type: "LineString",
                coordinates: route,
            },
        }

        const map = mapRef.current

        if (!map) return

        if (!map.getSource("route")) {
            map.addSource("route", {
                type: "geojson",
                data: geojson,
            })

            map.addLayer({
                id: "route",
                type: "line",
                source: "route",
                layout: {
                    "line-join": "round",
                    "line-cap": "round",
                },
                paint: {
                    "line-color": "#10b981",
                    "line-width": 6,
                },
            })
        } else {
            map.getSource("route").setData(geojson)
        }
    }


    return (
        <div className="min-h-screen bg-gray-900 flex">
            <div className="fixed top-0 left-0 h-full w-64 bg-gray-800 shadow-lg z-40">
                <Sidebar />
            </div>

            {/* Main Content */}
            <div className="content flex-1 flex flex-col ml-64">
                {/* Top Navbar */}
                <div className="fixed top-0 left-64 right-0 h-16 bg-gray-800 shadow-md z-30">
                    <Navbar />
                </div>

                {/* Map Section - Full height */}
                <div className="w-full h-screen pt-16">
                    <div ref={mapContainerRef} className="w-full h-full" />
                </div>

                {/* Overlay for delivery details */}
                <div className="fixed bottom-0 left-64 right-0 bg-transparent z-20">
                    {/* Tabs */}
                    <div className="flex justify-center mb-2">
                        <div className="bg-gray-800 rounded-t-lg overflow-hidden flex">
                            <button
                                className={`px-6 py-2 text-sm font-medium ${activeTab === "current" ? "bg-black text-white" : "bg-gray-700 text-gray-300"}`}
                                onClick={() => setActiveTab("current")}
                            >
                                Current Delivery
                            </button>
                            <button
                                className={`px-6 py-2 text-sm font-medium ${activeTab === "earnings" ? "bg-black text-white" : "bg-gray-700 text-gray-300"}`}
                                onClick={() => setActiveTab("earnings")}
                            >
                                Earnings
                            </button>
                            <button
                                className={`px-6 py-2 text-sm font-medium ${activeTab === "stats" ? "bg-black text-white" : "bg-gray-700 text-gray-300"}`}
                                onClick={() => setActiveTab("stats")}
                            >
                                Stats
                            </button>
                        </div>
                    </div>

                    {activeTab === "current" && (
                        <div className="bg-gray-800 text-white rounded-t-lg shadow-lg p-6 max-w-4xl mx-auto">
                            {deliveryDetails ? (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-2xl font-bold text-green-400">New Delivery Request</h2>
                                        <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                      {deliveryDetails.status}
                    </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <div className="flex items-center space-x-2">
                                                <Package className="w-5 h-5 text-green-400" />
                                                <p>
                                                    <span className="text-gray-400">Order ID:</span> DEL {deliveryDetails.orderId}
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <MapPin className="w-5 h-5 text-green-400" />
                                                <p>
                                                    <span className="text-gray-400">Pickup:</span> {pickupLocation.name}
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Navigation className="w-5 h-5 text-green-400" />
                                                <p>
                                                    <span className="text-gray-400">Address:</span> {pickupLocation.address}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center space-x-2">
                                                <User className="w-5 h-5 text-green-400" />
                                                <p>
                                                    <span className="text-gray-400">Customer:</span> {customerLocation.name}
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <MapPin className="w-5 h-5 text-green-400" />
                                                <p>
                                                    <span className="text-gray-400">Delivery to:</span> {customerLocation.address}
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Clock className="w-5 h-5 text-green-400" />
                                                <p>
                                                    <span className="text-gray-400">Est. Time:</span> 25 mins
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-center space-x-4 mt-4">
                                        {buttonStage === "accept" ? (
                                            <>
                                                <button
                                                    className="bg-black text-white py-3 px-8 rounded-full shadow-md hover:bg-gray-900 transition duration-300 flex items-center space-x-2"
                                                    onClick={() => {
                                                        setButtonStage("pickup")
                                                        drawRoute({ lat, lng }, pickupLocation)
                                                    }}
                                                >
                                                    <CheckCircle className="w-5 h-5" />
                                                    <span>Accept Delivery</span>
                                                </button>
                                                <button
                                                    className="bg-gray-700 text-white py-3 px-8 rounded-full shadow-md hover:bg-gray-600 transition duration-300 flex items-center space-x-2"
                                                    onClick={handleDecline}
                                                >
                                                    <XCircle className="w-5 h-5" />
                                                    <span>Decline</span>
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                className="bg-black text-white py-3 px-8 rounded-full shadow-md hover:bg-gray-900 transition duration-300 flex items-center space-x-2"
                                                onClick={() => {
                                                    handlePickup()
                                                    drawRoute(pickupLocation, customerLocation)
                                                }}
                                            >
                                                <Package className="w-5 h-5" />
                                                <span>Confirm Pickup</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Package className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                                    <h2 className="text-2xl font-bold mb-2 text-gray-300">No Active Deliveries</h2>
                                    <p className="text-gray-400">
                                        You're currently not assigned to any deliveries. New requests will appear here.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "earnings" && (
                        <div className="bg-gray-800 text-white rounded-t-lg shadow-lg p-6 max-w-4xl mx-auto">
                            <h2 className="text-2xl font-bold mb-4 text-green-400">Your Earnings</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-gray-700 p-4 rounded-lg">
                                    <p className="text-gray-400">Today</p>
                                    <p className="text-2xl font-bold">$45.50</p>
                                </div>
                                <div className="bg-gray-700 p-4 rounded-lg">
                                    <p className="text-gray-400">This Week</p>
                                    <p className="text-2xl font-bold">$285.75</p>
                                </div>
                                <div className="bg-gray-700 p-4 rounded-lg">
                                    <p className="text-gray-400">This Month</p>
                                    <p className="text-2xl font-bold">$1,245.30</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "stats" && (
                        <div className="bg-gray-800 text-white rounded-t-lg shadow-lg p-6 max-w-4xl mx-auto">
                            <h2 className="text-2xl font-bold mb-4 text-green-400">Your Stats</h2>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="bg-gray-700 p-4 rounded-lg">
                                    <p className="text-gray-400">Deliveries</p>
                                    <p className="text-2xl font-bold">24</p>
                                </div>
                                <div className="bg-gray-700 p-4 rounded-lg">
                                    <p className="text-gray-400">Rating</p>
                                    <p className="text-2xl font-bold">4.8 ★</p>
                                </div>
                                <div className="bg-gray-700 p-4 rounded-lg">
                                    <p className="text-gray-400">Acceptance</p>
                                    <p className="text-2xl font-bold">92%</p>
                                </div>
                                <div className="bg-gray-700 p-4 rounded-lg">
                                    <p className="text-gray-400">Online Hours</p>
                                    <p className="text-2xl font-bold">18.5</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Dashboard
