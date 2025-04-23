import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const initialState = {
  items: [],
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => item._id === action.payload._id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item._id === action.payload._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item._id !== action.payload),
      };
    case 'CLEAR_CART':
      return initialState;
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item => {
          if (item._id === action.payload.id) {
            const newQuantity = item.quantity + action.payload.change;
            // Ensure quantity doesn't go below 1
            return { ...item, quantity: Math.max(1, newQuantity) };
          }
          return item;
        }),
      };
    default:
      return state;
  }
}

export const CartProvider = ({ children }) => {
  const [cartState, dispatch] = useReducer(cartReducer, initialState);
  return (
    <CartContext.Provider value={{ cartState, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
