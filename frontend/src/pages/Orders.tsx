import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import type { CartItem } from '../context/CartContext';

import API from '../services/api';

const Orders: React.FC = () => {
  const { cart, cartTotal, removeFromCart, clearCart } = useCart();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setSubmitting(true);
    setSuccess(false);

    try {
      // Enviamos cada plato del carrito como una orden individual a NestJS
      for (const item of cart) {
        await API.post('ordenes', {
          platillo: `${item.name} (x${item.quantity})`,
          notas: item.notasCustom || 'Pedido desde la web'
        });
      }
      setSuccess(true);
      clearCart(); // Vaciamos el carrito tras el éxito
    } catch (err) {
      alert('Error al procesar el pedido.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-display text-5xl text-lemon-green font-semibold text-center mb-10">
        Tu Carrito de Compras
      </h1>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-center">
          ✅ ¡Pedido enviado a la cocina con éxito! Tu orden está en preparación.
        </div>
      )}

      {cart.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg mb-4">Tu carrito está vacío.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de productos en el carrito */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item: CartItem) => (
              <div key={item.id} className="card p-5 flex items-center justify-between border-l-4 border-lemon-green">
                <div>
                  <h3 className="font-bold text-lg text-lemon-dark">{item.name}</h3>
                  <p className="text-lemon-green font-semibold text-sm">
                    ${Number(item.price).toFixed(2)} x {item.quantity}
                  </p>
                  <p className="text-xs text-gray-400 italic mt-1">Notas: {item.notasCustom}</p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 text-xs font-medium cursor-pointer"
                >
                  Quitar
                </button>
              </div>
            ))}
          </div>

          {/* Resumen del Pedido */}
          <div className="card p-6 h-fit bg-gray-50 border border-gray-100">
            <h2 className="text-xl font-bold text-lemon-dark mb-4">Resumen</h2>
            <div className="flex justify-between items-center border-t border-gray-200 pt-4 mb-6">
              <span className="font-medium text-gray-600">Total a pagar:</span>
              <span className="text-2xl font-black text-lemon-green">${cartTotal.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={submitting}
              className="w-full btn-primary py-3 font-bold cursor-pointer disabled:opacity-60"
            >
              {submitting ? 'Procesando cocina...' : 'Confirmar Pedido'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
