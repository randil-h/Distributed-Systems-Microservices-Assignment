import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, MinusCircle, PlusCircle, ShoppingBag } from 'lucide-react';
import Navbar from '../components/utility_components/Navbar';

const CartPage = () => {
  const { cartState, dispatch } = useCart();

  const handleRemove = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const handleClearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const handleQuantityChange = (id, change) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { id, change }
    });
  };

  const subtotal = cartState.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const tax = subtotal * 0.18; // 8% tax
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + tax + shipping;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 pb-12 pt-36 w-full">
        {cartState.items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <ShoppingBag className="mx-auto mb-6 text-gray-400" size={80} />
            <p className="text-2xl text-gray-600">Your cart is empty</p>
            <button className="mt-8 px-8 py-3 bg-blue-600 text-white text-lg rounded-md hover:bg-blue-700 transition-colors">
              Continue Shopping
            </button>
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

                <ul>
                  {cartState.items.map((item) => (
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
                              onClick={() => handleRemove(item._id)}
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
                              onClick={() => handleQuantityChange(item._id, -1)}
                              disabled={item.quantity <= 1}
                              className="text-gray-500 hover:text-blue-600 disabled:opacity-50"
                            >
                              <MinusCircle size={24} />
                            </button>
                            <span className="w-10 text-center text-lg font-medium">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item._id, 1)}
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
                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button className="w-full mt-8 py-4 bg-nomnom text-light_hover text-lg font-medium rounded-full hover:bg-nomnom/90 transition-colors">
                  Proceed to Checkout
                </button>

                <div className="mt-4 text-sm text-gray-500 text-center">
                  Secure checkout powered by Stripe
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
