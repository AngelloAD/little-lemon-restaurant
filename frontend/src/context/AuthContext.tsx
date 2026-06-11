import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import API from '../services/api';

// 1. Adaptamos la interfaz al modelo de tu base de datos
interface User {
  id: number;
  nombre: string;
  rol: 'Invitado' | 'Administrador';
}

interface AuthResponse {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (nombre: string, password: string) => Promise<AuthResponse>;
  // 🚀 CORRECCIÓN: Agregado el parámetro email en la definición de tipos de la interfaz
  register: (nombre: string, email: string, rol: string, password: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? (JSON.parse(stored) as User) : null;
  });

  const [loading, setLoading] = useState<boolean>(false);

  // Login adaptado de forma flexible al JSON real de NestJS
  const login = async (nombre: string, password: string): Promise<AuthResponse> => {
    setLoading(true);
    try {
      // Tu endpoint de NestJS: auth/login
      const res = await API.post('auth/login', { nombre, password });

      // 🕵️ TRUCO DE DEPURACIÓN: Esto imprimirá en la consola F12 de tu navegador 
      // la forma exacta en que NestJS envía los datos.
      console.log('--- RESPUESTA REAL DE NESTJS ---', res.data);

      let token = '';

      // Evaluamos el formato del JSON que devolvió tu servidor de Node
      if (typeof res.data === 'string') {
        token = res.data;
      } else if (res.data && typeof res.data === 'object') {
        // Busca cualquier propiedad común de tokens (token, access_token, accessToken)
        token = res.data.token || res.data.access_token || res.data.accessToken;
      }

      // Si después de buscar no encontramos el string largo, lanzamos el error
      if (!token || typeof token !== 'string') {
        throw new Error(`Estructura inesperada. Revisa la consola F12 para ver qué envió el backend.`);
      }

      // Separamos las 3 partes del JWT por sus puntos (.) y limpiamos caracteres web
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));

      // Mapeamos los datos reales del payload de tu NestJS
      const userData: User = {
        id: payload.sub,
        nombre: payload.nombre,
        rol: payload.rol
      };

      // Almacenamos en el navegador de manera permanente
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (err: any) {
      console.error('Error al procesar el login en Frontend:', err);
      return {
        success: false,
        error: err.response?.data?.message || err.message || 'Error al iniciar sesión.',
      };
    } finally {
      setLoading(false);
    }
  };

  // 🚀 CORRECCIÓN: Una única función register unificada que incluye el campo email
  const register = async (nombre: string, email: string, rol: string, password: string): Promise<AuthResponse> => {
    setLoading(true);
    try {
      // Enviamos el objeto completo incluyendo el email hacia tu NestJS
      await API.post('usuarios', { nombre, email, rol, password });

      // Después de registrar, hacemos login automático usando el flujo de tu backend
      return await login(nombre, password);
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.message || 'Error al registrar usuario.',
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
}