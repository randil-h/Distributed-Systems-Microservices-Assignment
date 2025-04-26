import { StarIcon, ClockIcon, TruckIcon } from '@heroicons/react/24/solid';
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PopularNow() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${process.env.REACT_APP_RESTAURANT_API_URL}/restaurants`); // Ensure your auth token is sent if needed
        setRestaurants(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch restaurants", err);
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  // Skeleton loader component
  const SkeletonCard = () => (
    <div className="relative bg-white rounded-3xl overflow-hidden w-72 h-96 flex-shrink-0">
      {/* Skeleton background */}
      <div className="absolute inset-0 w-full h-full bg-gray-200 animate-pulse"></div>

      {/* Skeleton content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="h-10 bg-gray-300 rounded-lg w-3/4 mb-4 animate-pulse"></div>

        <div className="flex items-center mb-4">
          <div className="h-5 w-5 bg-gray-300 rounded-full mr-2 animate-pulse"></div>
          <div className="h-4 w-12 bg-gray-300 rounded animate-pulse"></div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-4 w-4 bg-gray-300 rounded-full mr-2 animate-pulse"></div>
            <div className="h-4 w-16 bg-gray-300 rounded animate-pulse"></div>
          </div>

          <div className="flex items-center">
            <div className="h-4 w-4 bg-gray-300 rounded-full mr-2 animate-pulse"></div>
            <div className="h-4 w-20 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="text-black bg-nomnom rounded-t-3xl top-28 w-screen flex flex-col content-center justify-center align-middle py-16 items-center">
      <div className="text-xl text-start text-light_hover/50 px-12 w-full mb-2">
        Explore the quickest delivery options
      </div>
      <div className="text-6xl text-start text-light_hover px-12 w-full mb-12">
        Fastest Near You
      </div>

      {/* Scrollable cards container */}
      <div className="w-full px-12 overflow-x-auto pb-4 no-scrollbar">
        <div className="flex space-x-4 min-w-max">
          {loading ? (
            // Show skeleton loaders while loading
            Array(8).fill().map((_, index) => (
              <SkeletonCard key={index} />
            ))
          ) : (
            // Show actual restaurant cards when loaded
            restaurants.map((restaurant) => (
              <Link
                to={`/restaurant/${restaurant._id}`} // Navigate to the Restaurant page
                key={restaurant._id}
                className="relative bg-white rounded-3xl overflow-hidden w-72 h-96 flex-shrink-0"
              >
                {/* Image background */}
                <div
                  className="absolute inset-0 w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${restaurant.coverImage || "/default-image.jpg"})` }}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 text-light_hover">
                  <h3 className="text-start text-4xl mb-2">{restaurant.name}</h3>

                  <div className="flex items-center mb-2">
                    <StarIcon className="h-5 w-5 text-yellow-500 mr-1" />
                    <span className="font-medium">{restaurant.rating || "4.5"}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <TruckIcon className="h-4 w-4 mr-1" />
                      <span>{restaurant.deliveryFee || "$2.99"}</span>
                    </div>

                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      <span>{restaurant.deliveryTime || "20-30 min"}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
