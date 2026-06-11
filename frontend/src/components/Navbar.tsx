
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { cartCount } = useCart();
  
  // 🚀 ESTADO CLAVE: Controla si el menú desplegable móvil está abierto o cerrado
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleLogout = async (): Promise<void> => {
    setIsOpen(false);
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        {/* Fila Superior: Logo y Botón de Hamburguesa */}
        <div className="flex items-center justify-between">
          {/* Logo del restaurante */}
          <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
            <span className="text-2xl font-display font-semibold text-lemon-green">
              🍋 Little Lemon
            </span>
          </Link>

          {/* 🍔 BOTÓN DE HAMBURGUESA: Solo visible en móviles (hidden en pantallas md o superiores) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-lemon-dark hover:text-lemon-green focus:outline-none cursor-pointer text-2xl"
            aria-label="Toggle menu"
          >
            {isOpen ? '✕' : '☰'}
          </button>

          {/* 💻 MENÚ HORIZONTAL (Escritorio): Se oculta en móviles (hidden) y se activa en md:flex */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-lemon-dark hover:text-lemon-green font-medium transition-colors">
              Inicio
            </Link>
            <Link to="/menu" className="text-lemon-dark hover:text-lemon-green font-medium transition-colors">
              Menú
            </Link>

            {user ? (
              <>
                <Link to="/reservations" className="text-lemon-dark hover:text-lemon-green font-medium transition-colors">
                  Reservas
                </Link>
                <Link to="/ordenes" className="text-lemon-dark hover:text-lemon-green font-medium transition-colors flex items-center gap-1">
                  Órdenes 
                  {cartCount > 0 && (
                    <span className="bg-lemon-yellow text-lemon-dark text-xs px-2 py-0.5 rounded-full font-bold">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* Enlaces exclusivos de Administrador en Escritorio */}
                {user.rol === 'Administrador' || (user as any).rol === 'Administrador' ? (
                  <>
                    <Link to="/admin/menu" className="text-amber-600 hover:text-amber-700 font-bold transition-colors">
                      ⚙️ Menu
                    </Link>
                    <Link to="/admin/ordenes" className="text-blue-600 hover:text-blue-700 font-bold transition-colors">
                      🍳 Cocina
                    </Link>
                    <Link to="/admin/reservas" className="text-purple-600 hover:text-purple-700 font-bold transition-colors">
                      📅 Reservas
                    </Link>
                    <Link to="/admin/usuarios" className="text-teal-600 hover:text-teal-700 font-bold transition-colors">
                      👥 Usuarios
                    </Link>
                    <Link to="/admin/dashboard" className="text-rose-600 hover:text-rose-700 font-bold transition-colors">
                      📊 Estadísticas
                    </Link>
                  </>
                ) : null}

                <div className="flex items-center gap-3 ml-2">
                  <span className="text-sm text-gray-500">Hola, {user.nombre}</span>
                  <button onClick={handleLogout} className="btn-secondary text-sm px-4 py-2 cursor-pointer">
                    Salir
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-lemon-dark hover:text-lemon-green font-medium transition-colors">
                  Iniciar sesión
                </Link>
                <Link to="/register" className="btn-primary text-sm px-4 py-2 cursor-pointer">
                  Registrarse
                </Link>
              </div>
            )}
          </nav>
        </div>

        {/* 📱 MENÚ DESPLEGABLE VERTICAL (Móvil): Solo se muestra si isOpen es true y la pantalla es pequeña */}
        {isOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t border-gray-100 flex flex-col gap-4">
            <Link to="/" onClick={() => setIsOpen(false)} className="text-lemon-dark hover:text-lemon-green font-medium transition-colors py-1">
              Inicio
            </Link>
            <Link to="/menu" onClick={() => setIsOpen(false)} className="text-lemon-dark hover:text-lemon-green font-medium transition-colors py-1">
              Menú
            </Link>

            {user ? (
              <>
                <Link to="/reservations" onClick={() => setIsOpen(false)} className="text-lemon-dark hover:text-lemon-green font-medium transition-colors py-1">
                  Reservas
                </Link>
                <Link to="/ordenes" onClick={() => setIsOpen(false)} className="text-lemon-dark hover:text-lemon-green font-medium transition-colors py-1 flex items-center gap-1">
                  Órdenes 
                  {cartCount > 0 && (
                    <span className="bg-lemon-yellow text-lemon-dark text-xs px-2 py-0.5 rounded-full font-bold">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* Enlaces exclusivos de Administrador en Móvil */}
                {user.rol === 'Administrador' || (user as any).rol === 'Administrador' ? (
                  <div className="flex flex-col gap-3 pt-2 border-t border-gray-50 pl-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Panel Admin</p>
                    <Link to="/admin/menu" onClick={() => setIsOpen(false)} className="text-amber-600 hover:text-amber-700 font-bold transition-colors">
                      ⚙️ Menu
                    </Link>
                    <Link to="/admin/ordenes" onClick={() => setIsOpen(false)} className="text-blue-600 hover:text-blue-700 font-bold transition-colors">
                      🍳 Cocina
                    </Link>
                    <Link to="/admin/reservas" onClick={() => setIsOpen(false)} className="text-purple-600 hover:text-purple-700 font-bold transition-colors">
                      📅 Reservas
                    </Link>
                    <Link to="/admin/usuarios" onClick={() => setIsOpen(false)} className="text-teal-600 hover:text-teal-700 font-bold transition-colors">
                      👥 Usuarios
                    </Link>
                    <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className="text-rose-600 hover:text-rose-700 font-bold transition-colors">
                      📊 Estadísticas
                    </Link>
                  </div>
                ) : null}

                <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500 font-medium">Hola, {user.nombre}</span>
                  <button onClick={handleLogout} className="w-full btn-secondary text-sm py-2 cursor-pointer text-center">
                    Salir
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-3 pt-2 border-t border-gray-100">
                <Link to="/login" onClick={() => setIsOpen(false)} className="text-lemon-dark hover:text-lemon-green font-medium transition-colors text-center py-2 border border-gray-200 rounded-lg">
                  Iniciar sesión
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="btn-primary text-sm py-2 cursor-pointer text-center">
                  Registrarse
                </Link>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;