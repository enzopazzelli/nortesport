'use client'

import { temporadaActual, negocio, stats } from '@/lib/config'

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative w-full min-h-[60vh] md:min-h-[85vh] flex items-center overflow-hidden"
    >
      {/* Background image with gradient fallback */}
      <img
        src="/hero/hero-bg.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(26,37,53,0.3) 0%, rgba(43,58,82,0.2) 100%)',
        }}
      />

      {/* Overlay gradient left to transparent right */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to right, rgba(26,37,53,0.85) 0%, rgba(26,37,53,0.4) 50%, transparent 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-[600px]">
          {/* Badge pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent text-white text-sm backdrop-blur-sm mb-6">
            <span>&#128293; Temporada {temporadaActual.nombre}</span>
          </div>

          {/* Heading */}
          <h1 className="font-black text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.05] text-white mb-6">
            Ropa deportiva
            <br />
            con <span className="text-accent">actitud</span>
          </h1>

          {/* Subtitle */}
          <p className="text-white/80 text-lg md:text-xl leading-relaxed mb-8 max-w-[520px]">
            Calzas, remeras, shorts y tops para entrenar, salir o vivir
            cómoda. Nuevos colores cada temporada.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 mb-12">
            <a
              href="#productos"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-accent text-white font-semibold rounded-lg hover:scale-[1.03] transition-transform duration-200"
            >
              Ver Colección
            </a>
            <a
              href={negocio.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3.5 border border-white text-white font-semibold rounded-lg bg-transparent hover:bg-white/10 transition-colors duration-200"
            >
              Ver en Instagram
            </a>
          </div>

          {/* Stats row - hidden on mobile */}
          <div className="hidden md:flex items-center gap-10">
            {stats.slice(0, 3).map((stat, i) => (
              <div key={i} className="flex flex-col">
                <span className="font-black text-white text-3xl">
                  {stat.numero}
                </span>
                <span className="text-white/60 uppercase tracking-wider text-xs mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
