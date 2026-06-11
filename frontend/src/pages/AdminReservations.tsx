
import React, { useState, useEffect } from 'react';
import API from '../services/api';

// 1. Estructura exacta de la reserva devuelta por el backend con los datos expandidos del cliente
interface AdminReservationItem {
  id: number;
  date: string;
  time: string;
  number_of_people: number;
  special_requests: string;
  createdAt: string;
  cliente: {
    id: number;
    nombre: string;
    email: string;
  };
}

const AdminReservations: React.FC = () => {
  const [reservations, setReservations] = useState<AdminReservationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // 2. Consulta al endpoint exclusivo que creamos en NestJS: GET /reservas/admin
  const fetchAllReservations = () => {
    API.get<AdminReservationItem[]>('reservas/admin')
      .then((res) => setReservations(res.data))
      .catch((err) => {
        console.error('Error al cargar agenda global:', err);
        setError(err.response?.data?.message || 'Error al conectar con el servidor.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAllReservations();
  }, []);

  // 3. Cancelación forzada de mesas por el Administrador: DELETE /reservas/:id
  const handleCancelReservation = async (id: number, clientName: string) => {
    if (!window.confirm(`¿Estás seguro de que deseas cancelar la reserva a nombre de "${clientName}"?`)) return;

    try {
      await API.delete(`reservas/${id}`);
      // Actualizamos el estado local de inmediato para removerla de la pantalla
      setReservations((prev) => prev.filter((r) => r.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'No tienes permisos para realizar esta acción.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="font-display text-5xl text-lemon-green font-semibold text-center mb-2">
        📅 Agenda General de Reservas
      </h1>
      <p className="text-center text-gray-500 mb-10">
        Libro de asignación de mesas y control de comensales de Little Lemon
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
      ) : reservations.length === 0 ? (
        <div className="card p-12 text-center text-gray-400">
          <p className="text-lg">No hay mesas reservadas en el calendario actual.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-lemon-gray border-b border-gray-200 text-lemon-dark text-sm font-bold">
                  <th className="p-4">Fecha y Hora</th>
                  <th className="p-4">Cliente / Contacto</th>
                  <th className="p-4 text-center">Comensales</th>
                  <th className="p-4">Solicitudes especiales</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {reservations.map((res: AdminReservationItem) => (
                  <tr key={res.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Celda de Fecha y Hora */}
                    <td className="p-4 font-semibold text-lemon-dark whitespace-nowrap">
                      <div className="flex flex-col">
                        <span>📅 {res.date}</span>
                        <span className="text-xs font-mono text-lemon-green mt-0.5">⏰ {res.time.slice(0, 5)} hrs</span>
                      </div>
                    </td>

                    {/* Celda de Información del Cliente */}
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800">{res.cliente?.nombre || 'Anónimo'}</span>
                        <span className="text-xs text-gray-400 font-medium">{res.cliente?.email || 'Sin correo registrado'}</span>
                      </div>
                    </td>

                    {/* Celda de Cantidad de Personas */}
                    <td className="p-4 text-center font-black text-lemon-green text-base">
                      👥 {res.number_of_people}
                    </td>

                    {/* Celda de Solicitudes Especiales */}
                    <td className="p-4 text-gray-600 max-w-xs">
                      {res.special_requests ? (
                        <span className="italic bg-yellow-50 text-yellow-800 border border-yellow-100 px-2 py-1 rounded-md text-xs inline-block">
                          💬 {res.special_requests}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs italic">Ninguna</span>
                      )}
                    </td>

                    {/* Celda de Acciones */}
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleCancelReservation(res.id, res.cliente?.nombre || 'Anónimo')}
                        className="text-red-500 hover:text-red-700 font-bold text-xs bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                      >
                        Cancelar Mesa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReservations;