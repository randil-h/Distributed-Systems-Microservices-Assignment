import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, MinusCircle, PlusCircle, ShoppingBag, CheckCircle } from 'lucide-react';
import Navbar from '../components/utility_components/Navbar';
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { getToken } from "../api/auth";

const CartPage = () => {
  const { cartState, dispatch } = useCart();
  const navigate = useNavigate();
  const [orderSuccess, setOrderSuccess] = useState(false);

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

  const subtotal = cartState.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const tax = subtotal * 0.18; // 18% tax
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + tax + shipping;

  // Effect to redirect to payment page after successful order
  useEffect(() => {
    let redirectTimer;
    if (orderSuccess) {
      redirectTimer = setTimeout(() => {
        navigate("/payment");
      }, 3000); // Redirect after 3 seconds
    }
    return () => clearTimeout(redirectTimer);
  }, [orderSuccess, navigate]);

  const handleCheckout = async () => {
    try {
      const token = getToken();
      if (!token) {
        alert("Please log in before checking out.");
        return navigate("/login");
      }

      console.log("Token: ", token);
      console.log("API URL for checkout:", `${process.env.REACT_APP_RESTAURANT_ORDER_API_URL}/orders/checkout`);

      // Group items by restaurantId
      const groupedItems = cartState.items.reduce((acc, item) => {
        if (!acc[item.restaurantId]) {
          acc[item.restaurantId] = [];
        }
        acc[item.restaurantId].push({
          id: item._id,
          price: item.price, // Assuming price is available in the item object
          quantity: item.quantity
        });
        return acc;
      }, {});

      // Prepare the order payload with calculated totalAmount, VAT, and shipping fee for each restaurant
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
          totalAmount, // Include totalAmount in the payload
          tax: taxAmount, // Add VAT to the payload
          shipping: shippingFee // Add shipping fee to the payload
        };
      });

      console.log("Final order payload with total amount:", { orders });

      // Send the orders to the backend
      await axios.post(
        `${process.env.REACT_APP_RESTAURANT_ORDER_API_URL}/orders/checkout`,
        { orders },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log("All orders placed successfully!");
      dispatch({ type: "CLEAR_CART" });
      setOrderSuccess(true); // Trigger success notification instead of alert
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

                  <button className="text-base text-blue-600 hover:text-blue-800 transition-colors">
                    Continue Shopping
                  </button>
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

                <button
                  onClick={handleCheckout}
                  className="mt-8 w-full py-3 bg-nomnom text-white rounded-full hover:bg-nomnom/90 transition-colors"
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
