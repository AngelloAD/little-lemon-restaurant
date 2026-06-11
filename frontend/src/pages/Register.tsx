
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// 1. Definimos las llaves válidas de nuestro formulario adaptadas al backend
type FormKeys = 'nombre' | 'email' | 'password' | 'confirmPassword';

// 2. Estructura exacta de los datos del formulario
type FormState = Record<FormKeys, string>;

const Register: React.FC = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    nombre: '', email: '', password: '', confirmPassword: ''
  });
  
  // 3. Tipamos el estado de errores para soportar strings dinámicos
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validación con tipado estricto
  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {};
    if (form.nombre.length < 3) e.nombre = 'Mínimo 3 caracteres.';
    if (!form.email.includes('@')) e.email = 'Email inválido.';
    if (form.password.length < 8) e.password = 'Mínimo 8 caracteres.';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Las contraseñas no coinciden.';
    return e;
  };

  // Tipado del evento del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    setErrors({});
    
    // 🚀 CORRECCIÓN: Ahora incluimos form.email en los parámetros enviados al contexto
    const result = await register(form.nombre, form.email, 'Invitado', form.password);
    
    if (result.success) {
      navigate('/menu');
    } else {
      setErrors({ general: typeof result.error === 'string' ? result.error : 'Error al registrar.' });
    }
  };

  // Helper function para renderizar inputs dinámicos de forma tipada
  const field = (name: FormKeys, label: string, type: string = 'text', placeholder: string = ''): React.JSX.Element => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className={`input-field ${errors[name] ? 'border-red-400' : ''}`}
        value={form[name]}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [name]: e.target.value })}
        required
      />
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <h1 className="font-display text-4xl text-lemon-green font-semibold text-center mb-2">
            Crear cuenta
          </h1>
          <p className="text-center text-gray-500 mb-8">
            Únete a Little Lemon para hacer reservas
          </p>

          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {field('nombre', 'Nombre de usuario', 'text', 'ej. maria_garcia')}
            {field('email', 'Correo electrónico', 'email', 'tu@email.com')}
            {field('password', 'Contraseña', 'password', 'Mínimo 8 caracteres')}
            {field('confirmPassword', 'Confirmar contraseña', 'password', 'Repite tu contraseña')}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-60 cursor-pointer"
            >
              {loading ? 'Creando cuenta...' : 'Registrarse'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-lemon-green hover:underline font-medium">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;