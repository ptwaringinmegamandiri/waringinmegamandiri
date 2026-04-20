import { useState } from 'react';

export default function EmailButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href="mailto:info@waringinmegamandiri.co.id"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 cursor-pointer group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Hubungi Kami via Email"
    >
      {/* Tooltip */}
      <div
        className={`bg-[#0A0E14] border border-sky-400/40 text-white text-sm font-body font-semibold px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 ${
          hovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
        }`}
      >
        Hubungi Kami
      </div>

      {/* Button */}
      <div
        className="w-14 h-14 flex items-center justify-center bg-[#1a2a4a] hover:bg-sky-600 rounded-full transition-all duration-300 border border-sky-400/40"
        style={{
          boxShadow: hovered
            ? '0 0 25px rgba(56,189,248,0.55), 0 0 50px rgba(56,189,248,0.25)'
            : '0 0 15px rgba(56,189,248,0.25)',
        }}
      >
        <i className="ri-mail-send-line text-2xl text-sky-300" />
      </div>
    </a>
  );
}
