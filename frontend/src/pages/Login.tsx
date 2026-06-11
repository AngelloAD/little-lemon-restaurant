
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// 1. Definimos la estructura esperada para el estado de la ruta de redirección
interface LocationState {
  from?: {
    pathname: string;
  };
}

const Login: React.FC = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // 2. Casteamos de forma segura el estado de la localización para leer la ruta previa
  const state = location.state as LocationState;
  const from = state?.from?.pathname || '/menu';

  // CORRECCIÓN: Cambiado 'username' por 'nombre' para acoplarse con tu backend
  const [form, setForm] = useState({ nombre: '', password: '' });
  const [error, setError] = useState<string>('');

  // 3. Tipamos el evento del formulario como un FormEvent de HTML
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    
    // Enviamos 'form.nombre' tal como lo configuramos en el AuthContext adaptado
    const result = await login(form.nombre, form.password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      // Si el error es un objeto complejo del backend, nos aseguramos de renderizar un texto
      setError(typeof result.error === 'string' ? result.error : 'Error al iniciar sesión.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <h1 className="font-display text-4xl text-lemon-green font-semibold text-center mb-2">
            Iniciar sesión
          </h1>
          <p className="text-center text-gray-500 mb-8">
            Bienvenido de vuelta a Little Lemon
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Usuario
              </label>
              <input
                type="text"
                placeholder="Tu nombre de usuario"
                className="input-field"
                value={form.nombre}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setForm({ ...form, nombre: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="Tu contraseña"
                className="input-field"
                value={form.password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setForm({ ...form, password: e.target.value })
                }
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? 'Ingresando...' : 'Iniciar sesión'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-lemon-green hover:underline font-medium">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;