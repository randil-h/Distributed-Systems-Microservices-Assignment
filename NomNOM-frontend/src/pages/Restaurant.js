import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/utility_components/Navbar";
import { GiCook } from "react-icons/gi";
import { FaFacebook, FaInstagram, FaGlobe, FaMapMarkerAlt, FaClock, FaUtensils, FaPhoneAlt } from "react-icons/fa";
import { useCart } from '../context/CartContext';

const Restaurant = () => {
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [notification, setNotification] = useState(null);
  const [itemQuantities, setItemQuantities] = useState({});

  const { dispatch } = useCart();

  const handleQuantityChange = (itemId, change) => {
    setItemQuantities(prev => {
      const currentQty = prev[itemId] || 1;
      const newQty = Math.max(1, currentQty + change);
      return { ...prev, [itemId]: newQty };
    });
  };

  const getItemQuantity = (itemId) => {
    return itemQuantities[itemId] || 1;
  };

  const handleAddToCart = (item) => {
    const quantity = getItemQuantity(item._id);

    // Add item to cart with quantity
    for (let i = 0; i < quantity; i++) {
      dispatch({ type: 'ADD_ITEM', payload: item });
    }

    // Reset quantity for this item
    setItemQuantities(prev => ({ ...prev, [item._id]: 1 }));

    // Show notification
    setNotification({
      item,
      quantity,
      visible: true,
    });

    // Hide notification after 3 seconds
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, visible: false }));

      // Remove from state completely after animation completes
      setTimeout(() => {
        setNotification(null);
      }, 500); // match this with the transition duration
    }, 3000);
  };

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_RESTAURANT_API_URL}/restaurants/${restaurantId}`);
        const data = await res.json();
        setRestaurant(data);
      } catch (err) {
        console.error("Error fetching restaurant:", err);
      }
    };

    const fetchMenuItems = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.REACT_APP_RESTAURANT_API_URL}/menu-items/restaurant/${restaurantId}`);
        const data = await res.json();
        setMenuItems(data);
      } catch (err) {
        console.error("Error fetching menu items:", err);
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) {
      fetchRestaurantData();
      fetchMenuItems();
    }
  }, [restaurantId]);

  const getCategories = () => {
    const categories = menuItems.map(item => item.category);
    return ["All", ...new Set(categories)];
  };

  const filteredMenuItems = activeCategory === "All"
    ? menuItems
    : menuItems.filter(item => item.category === activeCategory);

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-nomnom border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-nomnom font-medium">Loading restaurant details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <NavBar />

      {/* Hero Section */}
      <div className="relative w-full h-[30rem] overflow-hidden pt-32">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${restaurant.coverImage})` }}
        ></div>

        {/* Dark overlay */}
        <div className="absolute w-full inset-0 bg-black opacity-80"></div>

        {/* Subtle pattern overlay */}
        <div className="absolute w-full inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNjY2MiPjwvcmVjdD4KPC9zdmc+')]"></div>

        <div className="absolute inset-0 flex items-center w-full">
          <div className="container mx-auto px-6 pt-16 w-full">
            <div className="text-white flex flex-col md:flex-row items-start md:items-center justify-between w-full">
              <div className="flex-1">
                <h1 className="text-6xl mb-4 text-white">{restaurant.name}</h1>

                <div className="flex items-center mb-6">
                  <FaUtensils className="mr-2" />
                  <span className="text-xl font-light">{restaurant.restaurantCategory} • {restaurant.cuisineType}</span>
                </div>

                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white">
                    <FaMapMarkerAlt className="mr-2" />
                    <span className="text-sm">{restaurant.address}</span>
                  </div>
                  <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white">
                    <FaClock className="mr-2" />
                    <span className="text-sm">{restaurant.operatingHours}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <a href="#menu" className="px-6 py-3 bg-white text-nomnom font-medium rounded-full hover:bg-gray-100 transition-colors">
                    View Menu
                  </a>
                  <a href={`tel:${restaurant.phone || '123-456-7890'}`} className="px-6 py-3 bg-nomnom text-white font-medium rounded-full hover:bg-nomnom/90 transition-colors flex items-center">
                    <FaPhoneAlt className="mr-2" />
                    Contact
                  </a>
                </div>
              </div>

              <div className="mb-6 align-middle flex flex-col">
                <img
                  src={restaurant.logo || "https://via.placeholder.com/150"}
                  alt={`${restaurant.name} logo`}
                  className="size-36 rounded-full self-end object-cover ring-4 ring-white"
                />
                <div className="flex gap-4 mt-8">
                  {restaurant.facebook && (
                    <a
                      href={restaurant.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      <FaFacebook/>
                    </a>
                  )}
                  {restaurant.instagram && (
                    <a
                      href={restaurant.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      <FaInstagram/>
                    </a>
                  )}
                  {restaurant.website && (
                    <a
                      href={restaurant.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      <FaGlobe/>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Menu Section */}
        <div id="menu" className="scroll-mt-16">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Our Menu</h2>

            {/* Category Filter */}
            <div className="overflow-x-auto pb-2">
              <div className="flex gap-2">
                {getCategories().map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                      activeCategory === category
                        ? "bg-nomnom text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    } transition-colors`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col animate-pulse"
                >
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-5 flex-grow">
                    <div className="flex justify-between">
                      <div className="h-6 bg-gray-200 rounded w-2/3 mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-full mt-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mt-2"></div>
                    <div className="flex mt-4 gap-1">
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                    </div>
                    <div className="h-10 bg-gray-200 rounded w-full mt-8"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredMenuItems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
              <GiCook className="mx-auto text-4xl text-gray-400 mb-4"/>
              <p className="text-gray-500">No menu items available in this category.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMenuItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.image || "https://via.placeholder.com/300"}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-nomnom shadow-sm">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-nomnom transition-colors">
                        {item.name}
                      </h3>
                      <span className="text-xs uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">{item.description}</p>
                    <div className="mt-4 flex flex-wrap gap-1">
                      {item.dietaryRestrictions?.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-green-50 text-green-600 text-xs font-medium px-2 py-1 rounded-full border border-green-100"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Quantity selector and Add to Cart button */}
                    <div className="mt-auto pt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 font-medium">Quantity:</span>
                        <div className="flex items-center  rounded-full overflow-hidden">
                          <button
                            onClick={() => handleQuantityChange(item._id, -1)}
                            className="px-3 size-8 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors"
                          >
                            -
                          </button>
                          <span className="px-4 py-1 text-center min-w-8">{getItemQuantity(item._id)}</span>
                          <button
                            onClick={() => handleQuantityChange(item._id, 1)}
                            className="px-3 size-8 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => handleAddToCart(item)}
                        className="w-full px-4 py-2 bg-nomnom text-light_hover rounded-full hover:bg-nomnom/90 transition-colors flex items-center justify-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="9" cy="21" r="1"></circle>
                          <circle cx="20" cy="21" r="1"></circle>
                          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 max-w-sm w-full bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-500 transform ${
            notification.visible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          } flex items-center z-50`}
        >
          <div className="w-2 self-stretch bg-nomnom"></div>
          <div className="flex-1 flex p-4">
            <div className="h-12 w-12 rounded overflow-hidden mr-4 bg-gray-100 flex-shrink-0">
              <img
                src={notification.item.image || "https://via.placeholder.com/50"}
                alt={notification.item.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <p className="font-medium text-gray-800">{notification.item.name}</p>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-medium">Added</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {notification.quantity > 1 ? (
                  <>
                    {notification.quantity} × ${notification.item.price.toFixed(2)} = ${(notification.quantity * notification.item.price).toFixed(2)}
                  </>
                ) : (
                  <>Added to your cart - ${notification.item.price.toFixed(2)}</>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="p-2 text-gray-400 hover:text-gray-600 mr-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default Restaurant;
