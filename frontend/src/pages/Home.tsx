
import React from 'react';
import { Link } from 'react-router-dom';

// 1. Definimos la estructura del objeto de características para el tipado estricto
interface Feature {
  icon: string;
  title: string;
  desc: string;
}

const Home: React.FC = () => {
  // 2. Extraemos el arreglo de características y lo tipamos explícitamente
  const features: Feature[] = [
    { icon: '🥗', title: 'Ingredientes frescos', desc: 'Trabajamos con proveedores locales cada día.' },
    { icon: '👨‍🍳', title: 'Chefs expertos', desc: 'Más de 20 años de experiencia en cocina mediterránea.' },
    { icon: '🌿', title: 'Opciones veganas', desc: 'Una sección completa para dietas vegetales.' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-lemon-green text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <h1 className="font-display text-6xl font-semibold text-lemon-yellow mb-2">
              Little Lemon
            </h1>
            <h2 className="font-display text-3xl mb-6 text-white">Chicago</h2>
            <p className="text-green-100 text-lg mb-8 max-w-md">
              Un pequeño restaurante mediterráneo familiar, enfocado en recetas
              tradicionales con un toque moderno.
            </p>
            <Link to="/reservations" className="btn-primary text-lg px-8 py-4 inline-block cursor-pointer">
              Reservar una mesa
            </Link>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="w-72 h-72 rounded-full bg-lemon-yellow flex items-center justify-center text-8xl shadow-2xl">
              🍋
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="font-display text-4xl text-center text-lemon-green font-semibold mb-12">
          ¿Por qué elegirnos?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f: Feature) => (
            <div key={f.title} className="card p-8 text-center">
              <div className="text-5xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold text-lemon-green mb-2">{f.title}</h3>
              <p className="text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-lemon-yellow py-16 text-center">
        <h2 className="font-display text-4xl font-semibold text-lemon-dark mb-4">
          ¿Listo para visitar?
        </h2>
        <p className="text-gray-700 mb-8">Reserva tu mesa en línea, rápido y fácil.</p>
        <Link to="/menu" className="btn-secondary text-lg px-8 py-4 inline-block cursor-pointer">
          Ver el menú
        </Link>
      </section>
    </div>
  );
};

export default Home;