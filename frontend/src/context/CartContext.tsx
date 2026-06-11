
import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';


// Estructura de un plato del menú
interface MenuItem {
  id: number;
  name: string;
  price: string | number;
  description: string;
  category: string;
  image?: string;
}

// Estructura de un plato dentro del carrito (con cantidad y notas)
export interface CartItem extends MenuItem {
  quantity: number;
  notasCustom?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: MenuItem, notas?: string) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: MenuItem, notas?: string) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1, notasCustom: notas || i.notasCustom } : i
        );
      }
      return [...prev, { ...item, quantity: 1, notasCustom: notas || '' }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart debe usarse dentro de CartProvider');
  return context;
};