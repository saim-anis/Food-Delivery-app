
import React from 'react';
import type { FoodItem } from '../types';

interface MenuItemProps {
  item: FoodItem;
  onAddToCart: (item: FoodItem) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, onAddToCart }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform duration-300 hover:scale-105">
      <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
        <p className="text-gray-600 mt-2 flex-grow">{item.description}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-lg font-semibold text-orange-600">${item.price.toFixed(2)}</span>
          <button
            onClick={() => onAddToCart(item)}
            className="bg-orange-500 text-white font-bold py-2 px-4 rounded-full hover:bg-orange-600 transition-colors duration-300 flex items-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
