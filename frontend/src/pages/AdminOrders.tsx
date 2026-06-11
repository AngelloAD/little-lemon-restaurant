
import React, { useState, useEffect } from 'react';
import API from '../services/api';

// 1. Estructura exacta de la orden devuelta por tu backend con el cliente incluido
interface OrderItem {
  id: number;
  platillo: string;
  notas: string;
  estado: 'Pendiente' | 'En Cocina' | 'Entregado' | 'Cancelado' | string;
  createdAt: string;
  cliente: {
    id: number;
    nombre: string;
    rol: string;
  };
}

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // 2. Consulta global a tu endpoint: GET /ordenes
  const fetchAllOrders = () => {
    API.get<OrderItem[]>('ordenes')
      .then((res) => setOrders(res.data))
      .catch((err) => console.error('Error al cargar comandas:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  // 3. Modificar el estado de la comanda en vivo: PATCH /ordenes/:id
  const handleUpdateStatus = async (id: number, nextStatus: string) => {
    setError('');
    try {
      await API.patch(`ordenes/${id}`, { estado: nextStatus });
      // Actualizamos el estado local de inmediato para refrescar la interfaz
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, estado: nextStatus } : o))
      );
    } catch (err: any) {
      setError(err.response?.data?.message || 'No tienes permisos para modificar estados.');
    }
  };

  // Helper para asignar colores dinámicos según el estado de la comanda en Tailwind v4
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Pendiente':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'En Cocina':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'Entregado':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'Cancelado':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="font-display text-5xl text-lemon-green font-semibold text-center mb-2">
        🍳 Monitor de Cocina
      </h1>
      <p className="text-center text-gray-500 mb-10">
        Control de comandas y despacho en tiempo real para Little Lemon
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm text-center">
          ❌ {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-lemon-green border-t-transparent rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-400 py-20 text-lg">No hay comandas registradas en el sistema.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order: OrderItem) => (
            <div key={order.id} className="card p-6 flex flex-col justify-between border-t-4 border-lemon-yellow">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-mono text-gray-400">ID Orden: #{order.id}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase ${getStatusBadgeClass(order.estado)}`}>
                    {order.estado}
                  </span>
                </div>

                <h3 className="font-black text-xl text-lemon-dark mb-1">🍽️ {order.platillo}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  📝 <span className="italic">{order.notas || 'Sin notas especiales'}</span>
                </p>

                <div className="border-t border-gray-100 pt-3 text-xs text-gray-500 space-y-1 mb-6">
                  <p>👤 <span className="font-bold text-lemon-dark">Cliente:</span> {order.cliente?.nombre || 'Anónimo'}</p>
                  <p>⏰ <span className="font-bold text-lemon-dark">Pedido el:</span> {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>

              {/* Botonera de control de flujos de la cocina */}
              <div className="grid grid-cols-2 gap-2">
                {order.estado === 'Pendiente' && (
                  <button
                    onClick={() => handleUpdateStatus(order.id, 'En Cocina')}
                    className="w-full col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 rounded-lg cursor-pointer transition-colors"
                  >
                    👨‍🍳 Preparar Plato
                  </button>
                )}
                {order.estado === 'En Cocina' && (
                  <button
                    onClick={() => handleUpdateStatus(order.id, 'Entregado')}
                    className="w-full col-span-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs py-2 rounded-lg cursor-pointer transition-colors"
                  >
                    🚀 Despachar a Mesa
                  </button>
                )}
                {order.estado !== 'Entregado' && order.estado !== 'Cancelado' && (
                  <button
                    onClick={() => handleUpdateStatus(order.id, 'Cancelado')}
                    className="w-full col-span-2 bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-700 font-medium text-xs py-1.5 rounded-lg cursor-pointer transition-colors mt-1"
                  >
                    Cancelar Pedido
                  </button>
                )}
                {(order.estado === 'Entregado' || order.estado === 'Cancelado') && (
                  <p className="col-span-2 text-center text-xs text-gray-400 italic py-2">
                    Comanda archivada
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;