
import React from 'react';
import type { CartItem } from '../types';
import CartItemComponent from './CartItem';

interface CartProps {
  items: CartItem[];
  onRemove: (itemId: number) => void;
  onUpdateQuantity: (itemId: number, newQuantity: number) => void;
  onClear: () => void;
}

const Cart: React.FC<CartProps> = ({ items, onRemove, onUpdateQuantity, onClear }) => {
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <h2 className="text-2xl font-bold mb-4 border-b pb-3">Your Order</h2>
      {items.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="mt-2">Your cart is empty.</p>
        </div>
      ) : (
        <>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {items.map((item) => (
              <CartItemComponent 
                key={item.id} 
                item={item} 
                onRemove={onRemove} 
                onUpdateQuantity={onUpdateQuantity}
              />
            ))}
          </div>
          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <button
              onClick={() => alert('Checkout is not implemented.')}
              className="w-full bg-green-500 text-white font-bold py-3 rounded-lg mt-4 hover:bg-green-600 transition-colors duration-300"
            >
              Checkout
            </button>
            <button
              onClick={onClear}
              className="w-full bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg mt-2 hover:bg-gray-300 transition-colors duration-300 text-sm"
            >
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
