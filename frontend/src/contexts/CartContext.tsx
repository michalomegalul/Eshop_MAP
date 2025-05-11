import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// Define the cart item type
export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

// Define the cart context type
interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

// Create the cart context with default values
const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  totalPrice: 0
});

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext);

// CartProvider component
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  
  // Calculate derived state
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // Load cart from localStorage when the component mounts
  useEffect(() => {
    const savedCart = localStorage.getItem('dieselpower-cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse saved cart:', error);
        localStorage.removeItem('dieselpower-cart');
      }
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('dieselpower-cart', JSON.stringify(items));
  }, [items]);

  // Add an item to the cart
  const addItem = (item: CartItem) => {
    setItems(prevItems => {
      // Check if item already exists in cart
      const existingItem = prevItems.find(i => i.product_id === item.product_id);
      
      if (existingItem) {
        // Update quantity of existing item
        return prevItems.map(i => 
          i.product_id === item.product_id 
            ? { ...i, quantity: i.quantity + item.quantity } 
            : i
        );
      } else {
        // Add new item to cart
        return [...prevItems, item];
      }
    });
  };

  // Remove an item from the cart
  const removeItem = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.product_id !== productId));
  };

  // Update the quantity of an item in the cart
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.product_id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  // Clear the cart
  const clearCart = () => {
    setItems([]);
  };

  // Provide the cart context to children components
  return (
    <CartContext.Provider value={{ 
      items, 
      addItem, 
      removeItem, 
      updateQuantity, 
      clearCart, 
      totalItems, 
      totalPrice 
    }}>
      {children}
    </CartContext.Provider>
  );
}
