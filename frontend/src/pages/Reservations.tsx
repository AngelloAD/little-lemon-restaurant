import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

// Estructura de los datos del formulario de envío
interface ReservationForm {
  date: string;
  time: string;
  number_of_people: number;
  special_requests: string;
}

// Estructura de una reserva devuelta por el Backend
interface ReservationItem {
  id: number;
  date: string;
  time: string;
  number_of_people: number;
  special_requests?: string;
  clienteId?: number; // Ajustado al campo que creamos en tu Prisma schema
}

const Reservations: React.FC = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<ReservationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState<ReservationForm>({
    date: '',
    time: '',
    number_of_people: 2,
    special_requests: '',
  });

  const fetchReservations = (): void => {
    // 🚀 CORRECCIÓN 1: Cambiado de 'reservations/' a 'reservas'
    API.get<ReservationItem[]>('reservas')
      .then((res) => setReservations(res.data))
      .catch((err) => console.error('Error al obtener reservas:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);
    try {
      // 🚀 CORRECCIÓN 2: Cambiado de 'reservations/' a 'reservas'
      await API.post('reservas', form);
      setSuccess(true);
      setForm({ date: '', time: '', number_of_people: 2, special_requests: '' });
      fetchReservations();
    } catch (err) {
      alert('Error al crear la reserva. Intenta nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (!window.confirm('¿Cancelar esta reserva?')) return;
    try {
      // 🚀 CORRECCIÓN 3: Cambiado de 'reservations/' a 'reservas'
      await API.delete(`reservas/${id}`);
      setReservations((prev) => prev.filter((r: ReservationItem) => r.id !== id));
    } catch {
      alert('Error al cancelar.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-display text-5xl text-lemon-green font-semibold text-center mb-10">
        Mis Reservas
      </h1>

      {/* Formulario */}
      <div className="card p-8 mb-10">
        <h2 className="text-2xl font-semibold text-lemon-dark mb-6">Nueva reserva</h2>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            ✅ ¡Reserva creada con éxito!
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <input
              type="date"
              min={today}
              className="input-field"
              value={form.date}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setForm({ ...form, date: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
            <input
              type="time"
              className="input-field"
              value={form.time}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setForm({ ...form, time: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de personas
            </label>
            <input
              type="number"
              min={1}
              max={20}
              className="input-field"
              value={form.number_of_people}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setForm({ ...form, number_of_people: Number(e.target.value) })
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Solicitudes especiales
            </label>
            <input
              type="text"
              placeholder="Alergias, celebraciones, etc."
              className="input-field"
              value={form.special_requests}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setForm({ ...form, special_requests: e.target.value })
              }
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-primary disabled:opacity-60 cursor-pointer"
            >
              {submitting ? 'Reservando...' : 'Confirmar reserva'}
            </button>
          </div>
        </form>
      </div>

      {/* Lista de reservas */}
      <h2 className="text-2xl font-semibold text-lemon-dark mb-4">
        Tus reservas actuales
      </h2>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-lemon-green border-t-transparent rounded-full animate-spin" />
        </div>
      ) : reservations.length === 0 ? (
        <p className="text-gray-400 text-center py-10">No tienes reservas todavía.</p>
      ) : (
        <div className="space-y-4">
          {reservations.map((r: ReservationItem) => (
            <div
              key={r.id}
              className="card p-5 flex items-center justify-between"
            >
              <div>
                <p className="font-semibold text-lemon-dark">
                  📅 {r.date} — {r.time.slice(0, 5)}
                </p>
                <p className="text-gray-500 text-sm">
                  👥 {r.number_of_people} persona(s)
                  {r.special_requests && ` · ${r.special_requests}`}
                </p>
              </div>
              <button
                onClick={() => handleDelete(r.id)}
                className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reservations;