import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Menu, X, MapPin, Star, Clock, ExternalLink, ChevronDown } from 'lucide-react';
import Footer from './Footer.js';
import { GiFruitBowl, GiCookie, GiShoppingCart } from "react-icons/gi";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import RestaurantMap from './main_sub/RestaurantsMap';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Replace with your actual Mapbox access token
const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

export default function MainContent() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapExpanded, setMapExpanded] = useState(false);
  const expandedMapRef = useRef(null);

  const listItems = [
    "Register or Login",
    "Find Restaurants",
    "Track Your Order",
    "View Your Shopping Cart"
  ];

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleMapExpansion = () => {
    setMapExpanded(!mapExpanded);
  };

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([longitude, latitude]);
        },
        (error) => {
          console.error("Error getting user location:", error);
          setUserLocation([-74.006, 40.7128]);
          setError("Could not access your location. Showing default area.");
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setUserLocation([-74.006, 40.7128]);
      setError("Your browser doesn't support geolocation. Showing default area.");
    }
  }, []);

  // Fetch nearby restaurants using Mapbox Places API
  useEffect(() => {
    if (userLocation) {
      setLoading(true);
      const [longitude, latitude] = userLocation;

      fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/restaurant.json?proximity=${longitude},${latitude}&limit=10&access_token=${MAPBOX_ACCESS_TOKEN}`)
        .then(response => response.json())
        .then(data => {
          if (data.features && data.features.length > 0) {
            const nearbyRestaurants = data.features.map(feature => ({
              id: feature.id,
              name: feature.text,
              description: feature.properties.category || "Restaurant",
              address: feature.place_name,
              coordinates: feature.center,
              rating: (Math.random() * 2 + 3).toFixed(1)
            }));
            setRestaurants(nearbyRestaurants);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching restaurants:", err);
          setError("Could not load nearby restaurants");
          setLoading(false);
        });
    }
  }, [userLocation]);

  // Handle expanded map
  useEffect(() => {
    if (mapExpanded && !expandedMapRef.current && userLocation) {
      const expandedMap = new mapboxgl.Map({
        container: 'expanded-map',
        style: 'mapbox://styles/mapbox/light-v11',
        center: userLocation,
        zoom: 14,
        pitch: 0,
        bearing: 0,
        antialias: true
      });

      expandedMap.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

      expandedMap.on('load', () => {
        expandedMap.addSource('user-location-expanded', {
          'type': 'geojson',
          'data': {
            'type': 'FeatureCollection',
            'features': [{
              'type': 'Feature',
              'geometry': {
                'type': 'Point',
                'coordinates': userLocation
              }
            }]
          }
        });

        expandedMap.addLayer({
          'id': 'user-location-point-expanded',
          'type': 'circle',
          'source': 'user-location-expanded',
          'paint': {
            'circle-radius': 8,
            'circle-color': '#007AFF',
            'circle-opacity': 0.9,
            'circle-stroke-width': 2,
            'circle-stroke-color': 'white'
          }
        });

        restaurants.forEach(restaurant => {
          const markerEl = document.createElement('div');
          markerEl.className = 'restaurant-marker';
          markerEl.style.width = '32px';
          markerEl.style.height = '32px';
          markerEl.style.backgroundImage = 'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="%23FF3B30" stroke="%23ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>\')';
          markerEl.style.backgroundSize = 'cover';
          markerEl.style.cursor = 'pointer';

          const popupContent = document.createElement('div');
          popupContent.className = 'restaurant-popup';
          popupContent.innerHTML = `
            <h3 style="font-weight:600;margin:0 0 5px;font-size:16px;">${restaurant.name}</h3>
            <p style="margin:0 0 8px;color:#666;">${restaurant.description}</p>
            <div style="display:flex;align-items:center;margin-bottom:5px;">
              <span style="color:#FF9500;margin-right:5px;">★</span>
              <span>${restaurant.rating}</span>
            </div>
            <p style="margin:0;font-size:12px;color:#888;">${restaurant.address}</p>
          `;

          const popup = new mapboxgl.Popup({
            offset: [0, -20],
            closeButton: false,
            maxWidth: '300px',
            className: 'clean-popup'
          }).setDOMContent(popupContent);

          new mapboxgl.Marker(markerEl)
            .setLngLat(restaurant.coordinates)
            .setPopup(popup)
            .addTo(expandedMap);
        });
      });

      expandedMapRef.current = expandedMap;
    }

    return () => {
      if (expandedMapRef.current && !mapExpanded) {
        expandedMapRef.current.remove();
        expandedMapRef.current = null;
      }
    };
  }, [mapExpanded, userLocation, restaurants]);

  return (
    <motion.div>
      <div className="h-screen w-full flex flex-col overflow-hidden bg-white">
        {/* Main content section */}
        <div
          className={`flex-1 m-2 h-full grid grid-cols-1 md:grid-cols-9 text-light text-3xl font-medium transition-all duration-300`}
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
                  <span className="text-4xl font-semibold flex ">
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
                      className="nav-item w-full md:w-auto text-center text-2xl"
                      onClick={toggleMenu}
                    >
                      <div
                        className="pl-12 md:pl-4 rounded-full transition-all duration-300 hover:underline hover:underline-offset-8"
                      >
                        {item}
                      </div>
                    </button>
                  ))}

                  <button
                    className="absolute top-4 right-4 md:hidden text-white"
                  >
                    <GiShoppingCart className="size-8"/>
                  </button>
                </div>
              </nav>
            </header>

            {/* Main Content Area */}
            <div className="flex flex-col flex-1">
              {/* Spacer to push list to bottom */}
              <div className="flex-1"/>

              <div className="px-8 mb-48 text-center">
                <p className="text-5xl text-accent2">What Do You Want Now ?</p>
                <div className="relative w-full mt-6">
                  <input
                    type="text"
                    placeholder="Search for items to order..."
                    className="w-full p-2 pl-4 pr-12 bg-accent border-b-2 border-light_hover focus:outline-none placeholder:text-xl placeholder:text-neutral-600"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-neutral-600 hover:text-black transition-colors"
                  >
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>


              {/* Fixed List - Always 4 items */}
              <div className="px-8 pb-8">
                <div className="text-2xl text-light">
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
            {/* Popular Picks Section */}
            <Link
              to={'/employees'}
              className="h-40 w-full transition-all duration-300 bg-light_hover hover:bg-light_hover/80 text-dark flex items-center justify-center"
            >
              <div className="text-xl">{"Popular Picks"}</div>
            </Link>

            {/* Restaurants Section */}
            <div
              className="h-40 w-full transition-all duration-300 bg-light hover:bg-light/80 text-dark flex items-center justify-center">
              <div className="text-xl">{"Find Restaurants"}</div>
            </div>
          </div>

          {/* Desktop Columns */}
          <Link
            className="hidden md:block border-l-2 border-white col-span-2 h-full w-full transition-all duration-300 bg-light_hover hover:bg-light_hover/80 text-accent"
            to={'/employees'}
          >
            <div className="text-start text-5xl font-semibold px-10 pt-8 mb-6">{"Popular Picks"}</div>
          </Link>

          {/* Restaurant Map Section */}
          <div
            className="hidden md:block border-l-2 border-white col-span-2 h-full w-full transition-all duration-300 bg-light hover:bg-light/80 text-accent overflow-hidden"
          >
            <div className="text-start text-5xl px-10 pt-8 mb-6 text-accent">{"Find Restaurants"}</div>


            {/* Use the new RestaurantMap component */}
            <RestaurantMap
              userLocation={userLocation}
              restaurants={restaurants}
              loading={loading}
              error={error}
              expanded={mapExpanded}
              onToggleExpansion={toggleMapExpansion}
            />
          </div>
        </div>

        {/* Expanded Map Modal */}
        <AnimatePresence>
          {mapExpanded && (
            <motion.div
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMapExpansion}
            >
              <motion.div
                className="bg-white rounded-lg w-full max-w-4xl overflow-hidden"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
              >
                <div className="p-4 border-b flex justify-between items-center">
                  <h2 className="text-2xl font-semibold">Restaurants Near You</h2>
                  <button onClick={toggleMapExpansion} className="p-2 hover:bg-gray-100 rounded-full">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div id="expanded-map" className="w-full h-96"></div>

                <div className="p-4 bg-gray-50">
                  <h3 className="text-lg font-medium mb-3">Nearby Options</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-40 overflow-y-auto">
                    {restaurants.map(restaurant => (
                      <div
                        key={restaurant.id}
                        className="p-3 bg-white rounded border border-gray-100 hover:border-blue-200 cursor-pointer transition-colors"
                        onClick={() => {
                          if (expandedMapRef.current) {
                            expandedMapRef.current.flyTo({
                              center: restaurant.coordinates,
                              zoom: 16,
                              duration: 1000
                            });
                          }
                        }}
                      >
                        <div className="flex justify-between">
                          <h4 className="font-medium">{restaurant.name}</h4>
                          <div className="flex items-center text-yellow-600">
                            <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{restaurant.rating}</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 truncate">{restaurant.address}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CSS for custom styling */}
        <style jsx>{`
          .clean-popup .mapboxgl-popup-content {
            padding: 15px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
          .mapboxgl-popup-tip {
            display: none;
          }
          .restaurant-marker {
            transition: transform 0.2s ease;
          }
          .restaurant-marker:hover {
            transform: scale(1.1);
          }
        `}</style>
      </div>
    </motion.div>
  );
}
