import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, MinusCircle, PlusCircle, ShoppingBag, CheckCircle, MapPin } from 'lucide-react';
import Navbar from '../components/utility_components/Navbar';
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { getToken } from "../api/auth";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set mapbox token
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const CartPage = () => {
  const { cartState, dispatch } = useCart();
  const navigate = useNavigate();
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lng: -74.0060, lat: 40.7128 }); // Default to NYC

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // Use user's current location if available
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  // Initialize map when the modal is shown
  useEffect(() => {
    if (showLocationModal && mapContainerRef.current) {
      // Initialize map only if it doesn't exist
      if (!mapRef.current) {
        mapRef.current = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [mapCenter.lng, mapCenter.lat],
          zoom: 13
        });

        // Add navigation controls
        mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Add click handler to the map
        mapRef.current.on('click', (e) => {
          const { lng, lat } = e.lngLat;

          // Update delivery location
          setDeliveryLocation({ lng, lat });

          // Remove existing marker if it exists
          if (markerRef.current) {
            markerRef.current.remove();
          }

          // Create new marker
          markerRef.current = new mapboxgl.Marker({ color: '#FF385C' })
            .setLngLat([lng, lat])
            .addTo(mapRef.current);
        });
      } else {
        // If map already exists, just update the center
        mapRef.current.setCenter([mapCenter.lng, mapCenter.lat]);

        // If there's a delivery location, add a marker
        if (deliveryLocation && !markerRef.current) {
          markerRef.current = new mapboxgl.Marker({ color: '#FF385C' })
            .setLngLat([deliveryLocation.lng, deliveryLocation.lat])
            .addTo(mapRef.current);
        }
      }
    }

    // Cleanup
    return () => {
      if (mapRef.current && !showLocationModal) {
        // We don't remove the map here to prevent re-initialization when modal reopens
        // Just keep the reference
      }
    };
  }, [showLocationModal, mapCenter]);

  // Update map if delivery location changes
  useEffect(() => {
    if (mapRef.current && deliveryLocation) {
      // Remove existing marker if it exists
      if (markerRef.current) {
        markerRef.current.remove();
      }

      // Create new marker
      markerRef.current = new mapboxgl.Marker({ color: '#FF385C' })
        .setLngLat([deliveryLocation.lng, deliveryLocation.lat])
        .addTo(mapRef.current);
    }
  }, [deliveryLocation]);

  const handleRemove = (id, restaurantId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { _id: id, restaurantId } });
  };

  const handleClearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const handleQuantityChange = (id, restaurantId, change) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { id, restaurantId, change }
    });
  };

  const handleLocationSelection = () => {
    setShowLocationModal(true);
  };

  const confirmLocation = () => {
    setShowLocationModal(false);
  };

  const subtotal = cartState.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const tax = subtotal * 0.18; // 18% tax
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + tax + shipping;

  const handleCheckout = async () => {
    try {
      // Check if delivery location is set
      if (!deliveryLocation) {
        return alert("Please select a delivery location first.");
      }

      const token = getToken();
      if (!token) {
        alert("Please log in before checking out.");
        return navigate("/login");
      }

      // Group items by restaurantId
      const groupedItems = cartState.items.reduce((acc, item) => {
        if (!acc[item.restaurantId]) {
          acc[item.restaurantId] = [];
        }
        acc[item.restaurantId].push({
          id: item._id,
          price: item.price,
          quantity: item.quantity
        });
        return acc;
      }, {});

      // Prepare the order payload with calculated totalAmount, VAT, shipping fee, and location for each restaurant
      const orders = Object.keys(groupedItems).map(restaurantId => {
        const menuItems = groupedItems[restaurantId];
        let totalAmount = 0;

        // Calculate totalAmount for this restaurant's order
        menuItems.forEach(item => {
          totalAmount += item.price * item.quantity;
        });

        // Calculate VAT (18%) and shipping fee (10)
        const taxAmount = totalAmount * 0.18;
        const shippingFee = totalAmount > 100 ? 0 : 10;

        totalAmount = totalAmount + taxAmount + shippingFee;

        return {
          restaurantId,
          menuItems,
          totalAmount,
          tax: taxAmount,
          shipping: shippingFee,
          deliveryLocation // Add the location coordinates
        };
      });

      console.log("Final order payload with location:", { orders });

      const response = await axios.post(
          `${process.env.REACT_APP_RESTAURANT_ORDER_API_URL}/orders/checkout`,
          { orders },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
      );

      const createdOrders = response.data.orders;

      const paymentAmount = createdOrders.reduce((sum, order) => sum + order.totalAmount, 0);

      console.log("All orders placed successfully!");
      dispatch({ type: "CLEAR_CART" });
      setOrderSuccess(true);

      navigate("/payment", {
        state: {
          orders: createdOrders,
          amount: paymentAmount * 303, //convert to LKR
        }
      });
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Checkout failed. Try again.");
    }
  };

  // Group items by restaurantId
  const groupedCartItems = cartState.items.reduce((acc, item) => {
    if (!acc[item.restaurantId]) {
      acc[item.restaurantId] = [];
    }
    acc[item.restaurantId].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Location Selection Modal with Mapbox */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-xl font-semibold mb-4">Select Delivery Location</h3>
            <div className="mb-4">
              <div
                ref={mapContainerRef}
                className="w-full h-96 rounded-lg overflow-hidden"
              />
            </div>
            <p className="text-gray-600 mb-4">
              {deliveryLocation ?
                `Selected location: ${deliveryLocation.lat.toFixed(6)}, ${deliveryLocation.lng.toFixed(6)}` :
                "Click on the map to select a delivery location"}
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowLocationModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmLocation}
                disabled={!deliveryLocation}
                className={`px-6 py-2 rounded-full ${deliveryLocation ? 'bg-nomnom text-white' : 'bg-gray-300 text-gray-500'}`}
              >
                Confirm Location
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success notification overlay */}
      {orderSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4 transform transition-all animate-fade-in">
            <div className="flex flex-col items-center">
              <div className="bg-green-100 p-3 rounded-full mb-4">
                <CheckCircle size={48} className="text-green-500" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">Order Placed!</h3>
              <p className="text-gray-600 text-center mb-6">
                Your order has been successfully placed. You'll be redirected to the payment page in a moment.
              </p>
              <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                <div className="bg-green-500 h-1 rounded-full animate-progress-bar"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 pb-12 pt-36 w-full">
        {cartState.items.length === 0 && !orderSuccess ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <ShoppingBag className="mx-auto mb-6 text-gray-400" size={80} />
            <p className="text-2xl text-gray-600">Your cart is empty</p>
            <div className="pt-8">
              <Link to="/" className="mt-16 px-8 py-3 bg-nomnom text-light_hover text-lg rounded-full hover:bg-nomnom/90 transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col xl:flex-row gap-8">
            {/* Cart Items */}
            <div className="xl:w-3/4">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="hidden md:grid grid-cols-12 gap-4 p-5 border-b text-base font-medium text-gray-500">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-center">Total</div>
                </div>

                {Object.keys(groupedCartItems).map((restaurantId) => (
                  <div key={restaurantId} className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">Restaurant {restaurantId}</h3>
                    <ul>
                      {groupedCartItems[restaurantId].map((item) => (
                        <li key={item._id} className="border-b last:border-b-0">
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-5 items-center">
                            {/* Product Info */}
                            <div className="col-span-1 md:col-span-6 flex items-center space-x-5">
                              <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center">
                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="max-h-full max-w-full object-contain"
                                  />
                                ) : (
                                  <ShoppingBag size={28} className="text-gray-400" />
                                )}
                              </div>
                              <div>
                                <h3 className="text-lg font-medium text-gray-800">{item.name}</h3>
                                {item.variant && <p className="text-base text-gray-500">{item.variant}</p>}
                                <button
                                  onClick={() => handleRemove(item._id, item.restaurantId)}
                                  className="mt-2 text-base text-red-500 hover:text-red-700 flex items-center gap-1"
                                >
                                  <Trash2 size={16} />
                                  Remove
                                </button>
                              </div>
                            </div>

                            {/* Price */}
                            <div className="col-span-1 md:col-span-2 text-center">
                              <p className="text-lg text-gray-800">${item.price.toFixed(2)}</p>
                            </div>

                            {/* Quantity */}
                            <div className="col-span-1 md:col-span-2 flex items-center justify-center">
                              <div className="flex items-center space-x-3">
                                <button
                                  onClick={() => handleQuantityChange(item._id, item.restaurantId, -1)}
                                  disabled={item.quantity <= 1}
                                  className="text-gray-500 hover:text-blue-600 disabled:opacity-50"
                                >
                                  <MinusCircle size={24} />
                                </button>
                                <span className="w-10 text-center text-lg font-medium">{item.quantity}</span>
                                <button
                                  onClick={() => handleQuantityChange(item._id, item.restaurantId, 1)}
                                  className="text-gray-500 hover:text-blue-600"
                                >
                                  <PlusCircle size={24} />
                                </button>
                              </div>
                            </div>

                            {/* Total */}
                            <div className="col-span-1 md:col-span-2 text-right md:text-center font-medium text-lg">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                <div className="p-5 bg-gray-50 flex justify-between items-center">
                  <button
                    onClick={handleClearCart}
                    className="text-base text-gray-600 hover:text-red-600 transition-colors flex items-center gap-2"
                  >
                    <Trash2 size={18} />
                    Clear Cart
                  </button>

                  <Link to="/" className="text-base text-blue-600 hover:text-blue-800 transition-colors">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="xl:w-1/4">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                <div className="space-y-4 text-base">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">VAT (18%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Delivery Location Section */}
                <div className="mt-6 border-t pt-4">
                  <h3 className="font-medium text-gray-700 mb-2">Delivery Location</h3>

                  {deliveryLocation ? (
                    <div className="bg-gray-50 p-3 rounded-lg flex items-start gap-3">
                      <MapPin size={20} className="text-nomnom mt-1" />
                      <div>
                        <p className="text-sm">Location selected</p>
                        <p className="text-xs text-gray-500">
                          Lat: {deliveryLocation.lat.toFixed(6)}, Lng: {deliveryLocation.lng.toFixed(6)}
                        </p>
                        <button
                          onClick={handleLocationSelection}
                          className="text-xs text-blue-500 mt-1"
                        >
                          Change location
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={handleLocationSelection}
                      className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 flex items-center justify-center gap-2"
                    >
                      <MapPin size={18} />
                      Select location
                    </button>
                  )}
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={!deliveryLocation}
                  className={`mt-8 w-full py-3 rounded-full ${
                    deliveryLocation
                      ? 'bg-nomnom text-white hover:bg-nomnom/90'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  } transition-colors`}
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
