import {UserCircleIcon} from '@heroicons/react/24/solid';
import {Link, useNavigate} from "react-router-dom";
import React, {useState, useEffect, useRef} from "react";
import {Bars3Icon, XMarkIcon} from '@heroicons/react/24/solid';
import {GiCookie} from "react-icons/gi";
import Icon from '../../media/icons/cookie.png';

export default function OrderBanner() {
  const [showPopover, setShowPopover] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true); // For initial data fetch
  const [showResults, setShowResults] = useState(false);
  const searchContainerRef = useRef(null);
  const navigate = useNavigate();

  // Fetch all menu items from all restaurants
  useEffect(() => {
    const fetchAllMenuItems = async () => {
      setIsInitialLoading(true);
      try {
        // First fetch all restaurants to get their IDs
        const restaurantsResponse = await fetch(`${process.env.REACT_APP_RESTAURANT_API_URL}/restaurants`);
        if (!restaurantsResponse.ok) {
          throw new Error('Failed to fetch restaurants');
        }

        const restaurants = await restaurantsResponse.json();

        // Fetch menu items for each restaurant
        const fetchedItems = [];
        await Promise.all(
          restaurants.map(async (restaurant) => {
            try {
              const menuResponse = await fetch(
                `${process.env.REACT_APP_RESTAURANT_API_URL}/menu-items/restaurant/${restaurant._id}`
              );

              if (menuResponse.ok) {
                const items = await menuResponse.json();
                // Add restaurant info to each menu item
                const itemsWithRestaurant = items.map(item => ({
                  ...item,
                  restaurantName: restaurant.name
                }));
                fetchedItems.push(...itemsWithRestaurant);
              }
            } catch (err) {
              console.error(`Error fetching menu items for restaurant ${restaurant._id}:`, err);
            }
          })
        );

        setMenuItems(fetchedItems);
      } catch (error) {
        console.error("Failed to fetch menu items:", error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchAllMenuItems();
  }, []);

  // Handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    setShowResults(true);

    // Add small delay to show loading animation
    setTimeout(() => {
      // Filter menu items based on search term
      const results = menuItems.filter(item =>
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(value.toLowerCase()))
      );

      setSearchResults(results);
      setIsLoading(false);
    }, 300);
  };

  // Handle clicking on a search result
  const handleResultClick = (restaurantId) => {
    navigate(`/restaurant/${restaurantId}`);
    setSearchTerm("");
    setSearchResults([]);
    setShowResults(false);
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Handle input focus - show results if we have a search term
  const handleInputFocus = () => {
    if (searchTerm.trim() !== "") {
      setShowResults(true);
    }
  };

  return (
    <div
      className="text-black top-28 flex flex-col content-center justify-center align-middle pt-48 pb-24 w-full items-center">
      <img src={Icon} className="size-20 mb-8" alt={'rf'}/>
      <div className="text-7xl">
        What are you looking for <span className="text-lime-400">?</span>
      </div>
      <div className="text-2xl text-neutral-400 pt-6">
        Search for your favourite restaurants, dishes and even groceries. Get exclusive discounts for selected
        restaurants.
      </div>
      <div ref={searchContainerRef} className="relative w-2/5 mt-16">
        <input
          type="text"
          placeholder="Search for items to order..."
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={handleInputFocus}
          className="w-full p-2 pl-4 pr-12 text-2xl bg-white border-b-2 border-light_hover focus:outline-none placeholder:text-xl placeholder:text-neutral-600"
        />
        {isLoading && (
          <div className="absolute right-4 top-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Search Results Dropdown with Loading State */}
        {showResults && (
          <div className="absolute no-scrollbar z-50 mt-2 w-full bg-neutral-300/60 backdrop-blur-lg rounded-3xl shadow-lg max-h-96 overflow-y-auto">
            {isLoading || isInitialLoading ? (
              <div className="flex flex-col items-center justify-center p-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-2"></div>
                <p className="text-gray-700">Searching menu items...</p>
              </div>
            ) : searchResults.length > 0 ? (
              searchResults.map((item) => (
                <div
                  key={item._id}
                  className="px-4 py-3 border-b border-gray-300/30 hover:bg-gray-200 cursor-pointer transition-colors"
                  onClick={() => handleResultClick(item.restaurantId)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-700">{item.restaurantName}</div>
                    </div>
                    <div className="text-gray-700 font-medium">${item.price.toFixed(2)}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-700">
                No items found matching "{searchTerm}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
