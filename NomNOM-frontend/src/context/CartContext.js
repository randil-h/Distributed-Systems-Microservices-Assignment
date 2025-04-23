import React, { createContext, useContext, useReducer } from 'react';

// Create the Cart Context
const CartContext = createContext();

// Initial state for the cart, including items as an array of objects with restaurantId
const initialState = {
  items: [],
};

// Reducer function to manage cart state
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      // Check if item already exists in the cart (considering restaurantId)
      const existingItem = state.items.find(item => item._id === action.payload._id && item.restaurantId === action.payload.restaurantId);
      if (existingItem) {
        // If item exists from the same restaurant, update its quantity
        return {
          ...state,
          items: state.items.map(item =>
            item._id === action.payload._id && item.restaurantId === action.payload.restaurantId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      // If item doesn't exist, add it to the cart with quantity 1 and restaurantId
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };

    case 'REMOVE_ITEM':
      // Remove the item from the cart by matching both item ID and restaurantId
      return {
        ...state,
        items: state.items.filter(item => !(item._id === action.payload._id && item.restaurantId === action.payload.restaurantId)),
      };

    case 'CLEAR_CART':
      // Clear the cart state
      return initialState;

    case 'UPDATE_QUANTITY':
      // Update the quantity of an item in the cart by matching both item ID and restaurantId
      return {
        ...state,
        items: state.items.map(item => {
          if (item._id === action.payload.id && item.restaurantId === action.payload.restaurantId) {
            const newQuantity = item.quantity + action.payload.change;
            // Ensure quantity does not go below 1
            return { ...item, quantity: Math.max(1, newQuantity) };
          }
          return item;
        }),
      };

    default:
      return state;
  }
}

// CartProvider component to wrap the application
export const CartProvider = ({ children }) => {
  const [cartState, dispatch] = useReducer(cartReducer, initialState);

  return (
    <CartContext.Provider value={{ cartState, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => useContext(CartContext);

// Action to add item to the cart
export const addItemToCart = (dispatch, item) => {
  dispatch({ type: 'ADD_ITEM', payload: item });
};

// Action to remove item from the cart
export const removeItemFromCart = (dispatch, itemId, restaurantId) => {
  dispatch({ type: 'REMOVE_ITEM', payload: { _id: itemId, restaurantId } });
};

// Action to update item quantity in the cart
export const updateItemQuantity = (dispatch, itemId, restaurantId, change) => {
  dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, restaurantId, change } });
};
