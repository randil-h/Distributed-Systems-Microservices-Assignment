import React, {useEffect, useState, useCallback} from "react";
import { ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import axios from "axios";

export default function Dashboard({ restaurant, orders: initialOrders, loading }) {
  const [orders, setOrders] = useState(initialOrders || []);
  const [users, setUsers] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);

  // Group orders by status
  const pendingOrders = orders?.filter(order => order.status === 'pending') || [];
  const completedOrders = orders?.filter(order => order.status === 'completed') || [];
  const cancelledOrders = orders?.filter(order => order.status === 'cancelled') || [];

  useEffect(() => {
    setOrders(initialOrders || []);
  }, [initialOrders]);

  useEffect(() => {
    if (orders && orders.length > 0) {
      const fetchUserAndMenuItemDetails = async () => {
        try {
          const userIds = [...new Set(orders.map(order => order.userId))];
          const menuItemIds = [...new Set(orders.flatMap(order => order.items.map(item => item.menuItemId)))];
          const restaurantId = localStorage.getItem('restaurantId');

          // Commented out for now as per the updated code
          // // Fetch user details
          // const userRes = await axios.get(
          //   `${process.env.REACT_APP_API_URL}/auth`,
          //   {
          //     params: { ids: userIds.join(",") },
          //     headers: {
          //       Authorization: `Bearer ${localStorage.getItem('token')}`
          //     }
          //   }
          // );

          // Fetch menu item details
          const menuItemRes = await axios.get(
            `${process.env.REACT_APP_RESTAURANT_API_URL}/menu-items/restaurant/${restaurantId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            }
          );
          console.log("menu items", menuItemRes);

          // setUsers(userRes.data || []);
          setMenuItems(menuItemRes.data || []);
          console.log("menu items", menuItemRes.data);
        } catch (error) {
          console.error("Failed to fetch user or menu item details:", error);
          // Set empty arrays on error to avoid undefined issues
          setUsers([]);
          setMenuItems([]);
        }
      };

      fetchUserAndMenuItemDetails();
    }
  }, [orders]);

  const updateOrderStatus = useCallback(async (orderId, newStatus) => {
    setIsUpdating(true);
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_RESTAURANT_OPS_API_URL}/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.status === 200) {
        // Update local state to reflect the change
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
      alert("Failed to update order status. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const getUserName = (userId) => {
    if (!users || !Array.isArray(users)) return "Unknown user";
    const user = users.find(u => u && u._id === userId);
    return user ? user.name : "Unknown user";
  };

  if (loading || isUpdating) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-nomnom"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-50 text-red-500 px-6 py-4 rounded-lg shadow-sm">
          No restaurant data available
        </div>
      </div>
    );
  }

  return (
    <div className="text-gray-800 flex flex-col w-full bg-gray-50 min-h-screen">
      {/* Restaurant Header */}
      <div className="py-6 px-8 bg-white shadow-sm border-b border-gray-100 w-full">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{restaurant.name}</h1>
            <p className="text-gray-500 mt-1">Dashboard Overview</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-nomnom/10 text-nomnom px-4 py-1.5 rounded-full text-sm font-medium">
              {restaurant.cuisineType}
            </span>
            <span className="bg-gray-100 px-4 py-1.5 rounded-full text-sm font-medium">
              {orders?.length || 0} total orders
            </span>
          </div>
        </div>
      </div>

      {/* Orders Dashboard */}
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row flex-1 p-4 gap-6">
        {/* Pending Orders */}
        <div className="w-full md:w-1/3 flex flex-col">
          <div className="flex items-center gap-2 mb-4 px-1">
            <ClockIcon className="h-5 w-5 text-amber-500" />
            <h2 className="text-lg font-semibold text-gray-900">Pending ({pendingOrders.length})</h2>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 pb-6">
            {pendingOrders.length > 0 ? (
              pendingOrders.map(order => (
                <OrderCard
                  key={order._id}
                  order={order}
                  status="pending"
                  users={users}
                  menuItems={menuItems}
                  onStatusChange={updateOrderStatus}
                />
              ))
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
                <p className="text-gray-500">No pending orders</p>
              </div>
            )}
          </div>
        </div>

        {/* Completed Orders */}
        <div className="w-full md:w-1/3 flex flex-col">
          <div className="flex items-center gap-2 mb-4 px-1">
            <CheckCircleIcon className="h-5 w-5 text-emerald-500" />
            <h2 className="text-lg font-semibold text-gray-900">Completed ({completedOrders.length})</h2>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 pb-6">
            {completedOrders.length > 0 ? (
              completedOrders.map(order => (
                <OrderCard
                  key={order._id}
                  order={order}
                  status="completed"
                  users={users}
                  menuItems={menuItems}
                  onStatusChange={updateOrderStatus}
                />
              ))
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
                <p className="text-gray-500">No completed orders</p>
              </div>
            )}
          </div>
        </div>

        {/* Cancelled Orders */}
        <div className="w-full md:w-1/3 flex flex-col">
          <div className="flex items-center gap-2 mb-4 px-1">
            <XCircleIcon className="h-5 w-5 text-rose-500" />
            <h2 className="text-lg font-semibold text-gray-900">Cancelled ({cancelledOrders.length})</h2>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 pb-6 mx-2">
            {cancelledOrders.length > 0 ? (
              cancelledOrders.map(order => (
                <OrderCard
                  key={order._id}
                  order={order}
                  status="cancelled"
                  users={users}
                  menuItems={menuItems}
                  onStatusChange={updateOrderStatus}
                />
              ))
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
                <p className="text-gray-500">No cancelled orders</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Order Card Component
const OrderCard = ({ order, status, users, menuItems, onStatusChange }) => {
  const statusConfig = {
    pending: {
      bg: 'bg-white',
      border: 'border-amber-100',
      badge: 'bg-amber-50 text-amber-700 border border-amber-200',
      icon: <ClockIcon className="h-4 w-4 text-amber-500" />
    },
    completed: {
      bg: 'bg-white',
      border: 'border-emerald-100',
      badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      icon: <CheckCircleIcon className="h-4 w-4 text-emerald-500" />
    },
    cancelled: {
      bg: 'bg-white',
      border: 'border-rose-100',
      badge: 'bg-rose-50 text-rose-700 border border-rose-200',
      icon: <XCircleIcon className="h-4 w-4 text-rose-500" />
    }
  };

  const config = statusConfig[status];

  const formatTime = (dateString) => {
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Safely check for users array and find user
  const user = (users && Array.isArray(users))
    ? users.find(u => u && u._id === order.userId)
    : null;

  // Safe check for items
  const items = order.items.map(item => {
    const menuItem = (menuItems && Array.isArray(menuItems))
      ? menuItems.find(m => m && m._id === item.menuItemId)
      : null;
    return {
      ...item,
      menuItem
    };
  });

  // Determine which status actions to show based on current status
  const renderStatusActions = () => {
    switch(status) {
      case 'pending':
        return (
          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={() => onStatusChange(order._id, 'completed')}
              className="px-3 py-1.5 text-xs font-medium rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
            >
              Complete
            </button>
            <button
              onClick={() => onStatusChange(order._id, 'cancelled')}
              className="px-3 py-1.5 text-xs font-medium rounded-md bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        );
      case 'completed':
        return (
          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={() => onStatusChange(order._id, 'pending')}
              className="px-3 py-1.5 text-xs font-medium rounded-md bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
            >
              Mark as Pending
            </button>
          </div>
        );
      case 'cancelled':
        return (
          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={() => onStatusChange(order._id, 'pending')}
              className="px-3 py-1.5 text-xs font-medium rounded-md bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
            >
              Reopen
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`p-4 rounded-3xl shadow-lg ${config.bg} hover:shadow-xl transition-shadow duration-200 px-4`}>
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="font-medium text-gray-900">Order #{order._id.substring(order._id.length - 6)}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.badge} flex items-center gap-1`}>
              {config.icon}
              {status}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
          </p>
        </div>
        <div className="text-right">
          <p className="font-medium text-gray-900">${order.totalAmount?.toFixed(2) || '0.00'}</p>
          <p className="text-xs text-gray-500">{order.items?.length || 0} items</p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        {/* Customer Info */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-xs text-gray-500 font-medium">
              {user && user.name ? user.name.charAt(0) : '?'}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{user && user.name ? user.name : 'Guest'}</p>
            <p className="text-xs text-gray-500">{user && user.email ? user.email : 'No email provided'}</p>
          </div>
        </div>

        {/* Item Details */}
        <div className="mt-2 space-y-1">
          {items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm text-gray-700">
              <span>
                {item.menuItem && item.menuItem.name ? item.menuItem.name : `Menu Item #${item.menuItemId}`} × {item.quantity}
              </span>
              <span>
                ${item.menuItem && item.menuItem.price ? (item.menuItem.price * item.quantity).toFixed(2) : '0.00'}
              </span>
            </div>
          ))}
        </div>

        {/* Status Change Buttons */}
        {renderStatusActions()}
      </div>
    </div>
  );
};
