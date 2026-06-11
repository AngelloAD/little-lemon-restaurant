
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Menu from './pages/Menu';
import Login from './pages/Login'; 
import Register from './pages/Register';
import Reservations from './pages/Reservations';
import Orders from './pages/Orders';
import AdminMenu from './pages/AdminMenu';
import AdminOrders from './pages/AdminOrders';
import AdminReservations from './pages/AdminReservations';
import AdminUsers from './pages/AdminUsers';
// 🚀 NUEVA IMPORTACIÓN: El dashboard de estadísticas financieras
import AdminDashboard from './pages/AdminDashboard';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Ruta de Inicio y Menú Público */}
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                
                {/* Rutas de Autenticación */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Rutas Privadas / Protegidas del Cliente */}
                <Route 
                  path="/reservations" 
                  element={
                    <ProtectedRoute>
                      <Reservations />
                    </ProtectedRoute>
                  } 
                />
                
                <Route
                  path="/ordenes"
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  }
                />

                {/* Panel de Control exclusivo del Administrador (CRUD Menú) */}
                <Route
                  path="/admin/menu"
                  element={
                    <ProtectedRoute>
                      <AdminMenu />
                    </ProtectedRoute>
                  }
                />

                {/* Monitor de control de comandas de la cocina */}
                <Route
                  path="/admin/ordenes"
                  element={
                    <ProtectedRoute>
                      <AdminOrders />
                    </ProtectedRoute>
                  }
                />

                {/* Libro de asignación y agenda general de reservas */}
                <Route
                  path="/admin/reservas"
                  element={
                    <ProtectedRoute>
                      <AdminReservations />
                    </ProtectedRoute>
                  }
                />

                {/* Panel de gestión de usuarios y roles */}
                <Route
                  path="/admin/usuarios"
                  element={
                    <ProtectedRoute>
                      <AdminUsers />
                    </ProtectedRoute>
                  }
                />

                {/* 🚀 NUEVA RUTA PROTEGIDA: Dashboard analítico de rendimiento y finanzas */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
