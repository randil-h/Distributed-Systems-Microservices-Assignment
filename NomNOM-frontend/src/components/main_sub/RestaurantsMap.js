import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Star } from 'lucide-react';
import { ExternalLink } from 'lucide-react';

const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

const RestaurantsMap = ({ userLocation, restaurants, loading, error, expanded, onToggleExpansion }) => {
  const mapContainerRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);

  // Initialize map once we have the user's location
  useEffect(() => {
    if (userLocation && !mapInstance && mapContainerRef.current) {
      const mapStyle = 'mapbox://styles/mapbox/light-v11';

      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: mapStyle,
        center: userLocation,
        zoom: 14,
        pitch: 0,
        bearing: 0,
        antialias: true
      });

      map.addControl(new mapboxgl.NavigationControl({
        showCompass: false,
        visualizePitch: false,
        showZoom: false,
      }), 'bottom-right');

      map.on('load', () => {
        map.addSource('user-location', {
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

        map.addLayer({
          'id': 'user-location-point',
          'type': 'circle',
          'source': 'user-location',
          'paint': {
            'circle-radius': 8,
            'circle-color': '#007AFF',
            'circle-opacity': 0.9,
            'circle-stroke-width': 2,
            'circle-stroke-color': 'white'
          }
        });

        map.addLayer({
          'id': 'user-location-pulse',
          'type': 'circle',
          'source': 'user-location',
          'paint': {
            'circle-radius': ['interpolate', ['linear'], ['get', 'pulse'], 0, 8, 1, 25],
            'circle-opacity': ['interpolate', ['linear'], ['get', 'pulse'], 0, 0.9, 1, 0],
            'circle-color': '#007AFF'
          }
        });

        let start;
        function animatePulse(timestamp) {
          if (!start) start = timestamp;
          const progress = (timestamp - start) % 1500 / 1500;

          const userSource = map.getSource('user-location');
          if (userSource) {
            const data = userSource._data;
            if (data && data.features && data.features[0]) {
              data.features[0].properties = { pulse: progress };
              userSource.setData(data);
            }
          }

          requestAnimationFrame(animatePulse);
        }
        requestAnimationFrame(animatePulse);
      });

      setMapInstance(map);
    }
  }, [userLocation, mapInstance]);

  // Update markers when restaurants are fetched
  useEffect(() => {
    if (mapInstance && restaurants.length > 0) {
      const existingMarkers = document.querySelectorAll('.restaurant-marker');
      existingMarkers.forEach(marker => marker.remove());

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
          .addTo(mapInstance);
      });
    }
  }, [mapInstance, restaurants]);

  return (
    <div className=" w-full ">
      <div
        className="w-screen h-full py-72 overflow-hidden relative cursor-pointer"
        onClick={onToggleExpansion}
        ref={mapContainerRef}
      >
        {loading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-lg text-gray-600">Finding restaurants near you...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
            <div className="text-center p-4">
              <p className="text-red-500 text-lg">{error}</p>
            </div>
          </div>
        )}

        <div className="absolute bottom-4 right-4 bg-white rounded-full p-2 shadow-md z-10">
          <ExternalLink className="w-5 h-5 text-gray-700" />
        </div>
      </div>
    </div>
  );
};

export default RestaurantsMap;
