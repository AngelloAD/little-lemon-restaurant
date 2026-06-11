
import React, { useState, useEffect } from 'react';
import API from '../services/api';

// 1. Estructura exacta de los datos estadísticos devueltos por NestJS
interface DashboardStats {
  ingresosTotales: number;
  totalOrdenes: number;
  totalReservas: number;
  ordenesPendientes: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // 2. Consulta al endpoint analítico que creamos: GET /ordenes/dashboard
  const fetchDashboardStats = () => {
    API.get<DashboardStats>('ordenes/dashboard')
      .then((res) => setStats(res.data))
      .catch((err) => {
        console.error('Error al cargar analíticas:', err);
        setError('No tienes permisos de Administrador para ver las estadísticas de ventas.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40">
        <div className="w-12 h-12 border-4 border-lemon-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="font-display text-5xl text-lemon-green font-semibold text-center mb-2">
        📊 Rendimiento de Little Lemon
      </h1>
      <p className="text-center text-gray-500 mb-12">
        Balance financiero, volumen de ventas y control operativo del restaurante
      </p>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center card max-w-xl mx-auto">
          ❌ {error}
        </div>
      ) : (
        <div className="space-y-10">
          {/* Fila de Tarjetas Indicadoras (Métricas Principales) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Tarjeta 1: Ingresos de Caja */}
            <div className="card p-6 border-l-4 border-lemon-green flex flex-col justify-between">
              <div>
                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Caja Acumulada</span>
                <h3 className="text-3xl font-black text-lemon-dark mt-2">
                  ${stats?.ingresosTotales.toFixed(2)}
                </h3>
              </div>
              <p className="text-xs text-lemon-green font-medium mt-4">💰 Dinero bruto en restaurante</p>
            </div>

            {/* Tarjeta 2: Total de Pedidos */}
            <div className="card p-6 border-l-4 border-blue-500 flex flex-col justify-between">
              <div>
                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Órdenes Totales</span>
                <h3 className="text-3xl font-black text-gray-800 mt-2">
                  {stats?.totalOrdenes}
                </h3>
              </div>
              <p className="text-xs text-blue-500 font-medium mt-4">🍽️ Comandas procesadas</p>
            </div>

            {/* Tarjeta 3: Agenda de Mesas */}
            <div className="card p-6 border-l-4 border-purple-500 flex flex-col justify-between">
              <div>
                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Reservas Libros</span>
                <h3 className="text-3xl font-black text-gray-800 mt-2">
                  {stats?.totalReservas}
                </h3>
              </div>
              <p className="text-xs text-purple-500 font-medium mt-4">📅 Mesas agendadas en total</p>
            </div>

            {/* Tarjeta 4: Cola de Cocina */}
            <div className="card p-6 border-l-4 border-amber-500 flex flex-col justify-between">
              <div>
                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">En Cola Cocina</span>
                <h3 className="text-3xl font-black text-amber-600 mt-2">
                  {stats?.ordenesPendientes}
                </h3>
              </div>
              <p className="text-xs text-amber-500 font-medium mt-4">👨‍🍳 Platos esperando preparación</p>
            </div>

          </div>

          {/* Sección Informativa Extra de Negocio */}
          <div className="card p-8 bg-gray-50/50 border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold text-lemon-dark mb-4">Análisis de Operaciones</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Los ingresos acumulados reflejan la sumatoria en tiempo real de todos los productos y menús facturados a los clientes desde la plataforma web, excluyendo de la caja los pedidos marcados con estatus de <span className="text-red-500 font-bold">Cancelado</span>.
              </p>
              <button 
                onClick={fetchDashboardStats}
                className="btn-secondary text-xs px-4 py-2 font-bold cursor-pointer"
              >
                🔄 Recargar Métricas
              </button>
            </div>
            
            <div className="flex flex-col justify-center space-y-4">
              <div className="bg-white p-4 rounded-xl shadow-xs border border-gray-100 flex items-center justify-between">
                <span className="text-sm text-gray-500 font-medium">Eficiencia en Cocina</span>
                <span className="font-bold text-lemon-green text-sm">
                  {stats && stats.totalOrdenes > 0 
                    ? `${(((stats.totalOrdenes - stats.ordenesPendientes) / stats.totalOrdenes) * 100).toFixed(0)}% Despachado`
                    : '100%'}
                </span>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-xs border border-gray-100 flex items-center justify-between">
                <span className="text-sm text-gray-500 font-medium">Estado del Comedor</span>
                <span className="font-bold text-purple-600 text-sm">Activo</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;