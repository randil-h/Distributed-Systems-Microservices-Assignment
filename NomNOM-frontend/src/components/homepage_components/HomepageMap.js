import { UserCircleIcon } from '@heroicons/react/24/solid';
import { Link } from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import {GiCookie} from "react-icons/gi";
import RestaurantMap from "./RestaurantsMap";
import mapboxgl from "mapbox-gl";
import { motion, AnimatePresence } from "motion/react";
import {Star, X} from "lucide-react";
const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

export default function HomepageMap() {
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
        style: 'mapbox://styles/mapbox/standard',
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
      <div
        className="text-black  flex flex-col content-center justify-center align-middle   w-full h-fit  items-center">
        <RestaurantMap
          userLocation={userLocation}
          restaurants={restaurants}
          loading={loading}
          error={error}
          expanded={mapExpanded}
          onToggleExpansion={toggleMapExpansion}
        />
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
    </motion.div>

  );
}
