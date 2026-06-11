
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-lemon-green text-white mt-16">
      {/* 🚀 CORRECCIÓN: Añadido 'text-center md:text-left' para centrar todo en celulares */}
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        <div>
          {/* Usamos font-display configurada en tu @theme */}
          <h3 className="font-display text-2xl font-semibold mb-2">🍋 Little Lemon</h3>
          <p className="text-green-200 text-sm">
            Restaurante mediterráneo en el corazón de la ciudad.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Horarios</h4>
          <p className="text-green-200 text-sm">Lun–Vie: 12:00 – 22:00</p>
          <p className="text-green-200 text-sm">Sáb–Dom: 11:00 – 23:00</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Contacto</h4>
          <p className="text-green-200 text-sm">info@littlelemon.com</p>
          <p className="text-green-200 text-sm">+57 300 000 0000</p>
        </div>
      </div>
      <div className="border-t border-green-700 text-center py-4 text-green-300 text-xs">
        © {new Date().getFullYear()} Little Lemon. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;