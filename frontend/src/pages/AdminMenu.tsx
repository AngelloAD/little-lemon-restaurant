import React, { useState, useEffect } from 'react';
import API from '../services/api';

type CategoryKey = 'starters' | 'mains' | 'desserts' | 'drinks';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  description: string;
  category: CategoryKey | string;
  image?: string;
}

const AdminMenu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    category: 'mains',
    image: '' // Restaurado en el estado inicial
  });

  const fetchAdminMenu = () => {
    API.get<MenuItem[]>('menu')
      .then((res) => setMenuItems(res.data))
      .catch((err) => console.error('Error al cargar tabla administrativa:', err));
  };

  useEffect(() => {
    fetchAdminMenu();
  }, []);

  const startEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      price: item.price.toString(),
      description: item.description,
      category: item.category,
      image: item.image || '' // Mapeado en la edición
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: '', price: '', description: '', category: 'mains', image: '' });
  };

  const handleDelete = async (id: number, name: string): Promise<void> => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar "${name}" del menú de forma permanente?`)) return;
    
    try {
      await API.delete(`menu/${id}`);
      setSuccess(true);
      setMenuItems((prev) => prev.filter((item) => item.id !== id));
      
      if (editingId === id) {
        cancelEdit();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al intentar eliminar el platillo.');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');

    const payload = {
      name: form.name,
      price: Number(form.price),
      description: form.description,
      category: form.category,
      image: form.image || null // Enviado correctamente a Prisma
    };

    try {
      if (editingId) {
        await API.patch(`menu/${editingId}`, payload);
        setSuccess(true);
        setEditingId(null);
      } else {
        await API.post('menu', payload);
        setSuccess(true);
      }
      
      setForm({ name: '', price: '', description: '', category: 'mains', image: '' });
      fetchAdminMenu();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al procesar la operación en el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      {/* Formulario de Carga y Edición */}
      <div className="card p-8 border-t-4 border-lemon-green">
        <h1 className="font-display text-4xl text-lemon-green font-semibold mb-2">
          {editingId ? '📝 Editar Platillo' : '⚙️ Panel de Administración'}
        </h1>
        <p className="text-gray-500 mb-6">
          {editingId ? `Modificando el registro con ID único de base de datos: ${editingId}` : 'Agregar nuevo platillo al menú oficial'}
        </p>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            ✅ ¡Operación realizada con éxito en la base de datos!
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Platillo</label>
            <input
              type="text"
              className="input-field"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio ($)</label>
              <input
                type="number"
                step="0.01"
                className="input-field"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select
                className="input-field p-3 bg-white border border-gray-300 rounded-lg"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="starters">Entradas</option>
                <option value="mains">Platos principales</option>
                <option value="desserts">Postres</option>
                <option value="drinks">Bebidas</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              className="input-field h-24 p-3"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>

          {/* 🚀 CAMPO RESTAURADO: Entrada para la URL de la imagen del platillo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL de la Imagen (Opcional)</label>
            <input
              type="text"
              placeholder="https://enlace-de-la-imagen.com"
              className="input-field"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-grow btn-secondary py-3 font-bold cursor-pointer disabled:opacity-60"
            >
              {loading ? 'Procesando servidor...' : editingId ? 'Guardar Cambios' : 'Publicar Platillo'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-100 cursor-pointer transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Tabla de Control de Platillos Vigentes */}
      <div className="card p-8">
        <h2 className="text-2xl font-semibold text-lemon-dark mb-4">Platillos vigentes en el sistema</h2>
        {menuItems.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No hay platos registrados en la base de datos.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 text-sm">
                  <th className="py-3 font-medium">Nombre</th>
                  <th className="py-3 font-medium">Categoría</th>
                  <th className="py-3 font-medium">Precio</th>
                  <th className="py-3 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {menuItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 font-semibold text-lemon-dark">{item.name}</td>
                    <td className="py-4 text-gray-500 capitalize">{item.category}</td>
                    <td className="py-4 font-medium text-lemon-green">${Number(item.price).toFixed(2)}</td>
                    <td className="py-4 text-right space-x-4">
                      <button
                        onClick={() => startEdit(item)}
                        className="text-amber-600 hover:text-amber-700 font-bold cursor-pointer transition-colors"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.name)}
                        className="text-red-500 hover:text-red-700 font-bold cursor-pointer transition-colors"
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMenu;

