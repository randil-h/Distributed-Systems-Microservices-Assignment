import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/utility_components/Navbar";
import { GiCook } from "react-icons/gi";
import { FaFacebook, FaInstagram, FaGlobe, FaMapMarkerAlt, FaClock, FaUtensils, FaPhoneAlt } from "react-icons/fa";

const Restaurant = () => {
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

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
      try {
        const res = await fetch(`${process.env.REACT_APP_RESTAURANT_API_URL}/menu-items/restaurant/${restaurantId}`);
        const data = await res.json();
        setMenuItems(data);
      } catch (err) {
        console.error("Error fetching menu items:", err);
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

  // Get first menu item image for background if available
  const backgroundImage = menuItems.length > 0 && menuItems[0].image
    ? menuItems[0].image
    : "https://via.placeholder.com/1920x1080";

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <NavBar />

      {/* Updated Hero Section with Menu Image Background */}
      <div className="relative w-full h-[30rem]   overflow-hidden pt-32">
        {/* Background Image from First Menu Item */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${restaurant.coverImage})` }}
        ></div>

        {/* Dark overlay for better text visibility */}
        <div className="absolute w-full inset-0 bg-black opacity-80"></div>

        {/* Optional: Subtle pattern overlay */}
        <div className="absolute w-full inset-0  opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNjY2MiPjwvcmVjdD4KPC9zdmc+')]"></div>

        <div className="absolute inset-0 flex  items-center w-full">
          <div className="container mx-auto px-6 pt-16 w-full"> {/* Adjusted pt-16 for better vertical alignment */}
            <div className=" text-white flex flex-col md:flex-row items-start md:items-center justify-between  w-full">
              <div className="flex-1">
                <h1 className="text-6xl  mb-4 text-white">{restaurant.name}</h1>

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
                  <a href="#menu" className="px-6 py-3 bg-white text-nomnom font-medium rounded-lg hover:bg-gray-100 transition-colors">
                    View Menu
                  </a>
                  <a href={`tel:${restaurant.phone || '123-456-7890'}`} className="px-6 py-3 bg-nomnom text-white font-medium rounded-lg hover:bg-nomnom/90 transition-colors flex items-center">
                    <FaPhoneAlt className="mr-2" />
                    Contact
                  </a>
                </div>


              </div>


              <div className=" mb-6  align-middle flex flex-col">
                <img
                  src={restaurant.logo || "https://via.placeholder.com/150"}
                  alt={`${restaurant.name} logo`}
                  className="size-36  rounded-full self-end object-cover  ring-4 ring-white"
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

          {filteredMenuItems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
              <GiCook className="mx-auto text-4xl text-gray-400 mb-4"/>
              <p className="text-gray-500">No menu items available in this category.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMenuItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
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
                  <div className="p-5">
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Restaurant;
