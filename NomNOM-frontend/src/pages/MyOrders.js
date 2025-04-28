import React, { useState, useEffect } from "react";
import NavBar from "../components/utility_components/Navbar";
import { useNavigate } from "react-router-dom";

// Status order for progress tracking
const STATUS_ORDER = ["pending", "confirmed", "completed", "preparing", "delivered"];

const OrderStatusProgress = ({ status }) => {
  const currentIndex = STATUS_ORDER.indexOf(status);

  // Don't show progress for cancelled orders
  if (status === "cancelled") {
    return (
      <div className="my-4">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div className="ml-3">
            <span className="font-medium text-red-500">Order Cancelled</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-6">
      <div className="relative">
        {/* Background Line */}
        <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200"></div>

        {/* Progress Line */}
        <div
          className="absolute top-4 left-0 h-1 bg-nomnom transition-all duration-300"
          style={{ width: `${currentIndex === 0 ? 0 : (currentIndex / (STATUS_ORDER.length - 1)) * 100}%` }}
        ></div>

        {/* Status Circles */}
        <div className="relative flex justify-between">
          {STATUS_ORDER.map((stepStatus, index) => (
            <div key={stepStatus} className="text-center">
              <div className={`
                w-8 h-8 rounded-full mx-auto flex items-center justify-center relative z-10
                ${index <= currentIndex ? 'bg-nomnom text-white' : 'bg-gray-200 text-gray-500'}
                transition-colors duration-300
              `}>
                {index < currentIndex ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-xs">{index + 1}</span>
                )}
              </div>
              <div className="mt-2 text-xs font-medium text-gray-600">
                {stepStatus.charAt(0).toUpperCase() + stepStatus.slice(1)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const OrderStatusBadge = ({ status }) => {
  let badgeClass = "px-3 py-1 text-xs font-medium rounded-full ";

  switch (status) {
    case "pending":
      badgeClass += "bg-yellow-100 text-yellow-800";
      break;
    case "confirmed":
      badgeClass += "bg-blue-100 text-blue-800";
      break;
    case "preparing":
      badgeClass += "bg-purple-100 text-purple-800";
      break;
    case "delivered":
      badgeClass += "bg-green-100 text-green-800";
      break;
    case "cancelled":
      badgeClass += "bg-red-100 text-red-800";
      break;
    default:
      badgeClass += "bg-gray-100 text-gray-800";
  }

  return <span className={badgeClass}>{status}</span>;
};

const OrderItem = ({ item, menuItems }) => {
  const menuItem = menuItems.find(mi => mi._id === item.menuItemId);
  return (
    <div className="flex justify-between py-2 border-b last:border-b-0">
      <div className="font-medium">
        {menuItem ? menuItem.name : "Unknown Item"}
      </div>
      <div className="flex items-center">
        <span className="text-gray-700 mr-4">${menuItem ? menuItem.price.toFixed(2) : "0.00"}</span>
        <span className="bg-gray-100 px-2 py-1 rounded text-gray-700">x{item.quantity}</span>
      </div>
    </div>
  );
};

const OrderCard = ({ order, menuItems }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 mb-4 transition-all hover:shadow-2xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Order #{order._id.substring(order._id.length - 6)}</h3>
        <OrderStatusBadge status={order.status} />
      </div>

      <OrderStatusProgress status={order.status} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">Order Date</p>
          <p className="font-medium">{formatDate(order.createdAt)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Amount</p>
          <p className="font-medium">${order.totalAmount.toFixed(2)}</p>
        </div>
      </div>

      <div className="border-t pt-4">
        <p className="text-sm text-gray-600 mb-2">Items</p>
        <div className="space-y-1">
          {order.items.map((item) => (
            <OrderItem
              key={item._id}
              item={item}
              menuItems={menuItems.filter(mi => mi.restaurantId === order.restaurantId)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login", { state: { from: "/my-orders" } });
        return;
      }

      try {
        const response = await fetch("http://localhost:6967/api/orders", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            navigate("/login", { state: { from: "/my-orders" } });
            return;
          }
          throw new Error(`Error fetching orders: ${response.statusText}`);
        }

        const data = await response.json();
        setOrders(data);

        // Get unique restaurant IDs from orders
        const restaurantIds = [...new Set(data.map(order => order.restaurantId))];

        // Fetch menu items for each restaurant
        await Promise.all(
          restaurantIds.map(async (restaurantId) => {
            try {
              const menuResponse = await fetch(
                `${process.env.REACT_APP_RESTAURANT_API_URL}/menu-items/restaurant/${restaurantId}`
              );

              if (!menuResponse.ok) {
                throw new Error(`Error fetching menu items: ${menuResponse.statusText}`);
              }

              const menuData = await menuResponse.json();
              setMenuItems(prevItems => [...prevItems, ...menuData]);
            } catch (menuErr) {
              console.error(`Failed to fetch menu items for restaurant ${restaurantId}:`, menuErr);
            }
          })
        );
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  return (
    <div className="min-h-screen flex overflow-hidden bg-gray-50">
      <NavBar />

      <div className="flex-1 overflow-auto p-6 pt-24">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
            <p className="text-gray-600 mt-2">Track and manage your orders</p>
          </header>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
              {error}
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No orders yet</h3>
              <p className="text-gray-600">Your order history will appear here once you make a purchase.</p>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      onClick={() => navigate("/menu")}>
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  menuItems={menuItems}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
