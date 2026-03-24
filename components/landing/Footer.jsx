import Link from 'next/link'
import { Instagram, MessageCircle, Phone, MapPin, Clock, Settings } from 'lucide-react'
import { negocio, navLinks, categorias } from '@/lib/config'

export default function Footer() {
  return (
    <footer className="bg-primary-dark text-white border-t-[3px] border-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Col 1 — Marca */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-bold text-xl">{negocio.nombre}</span>
            </div>
            <p className="text-gray-400 text-sm mb-5">{negocio.slogan}</p>
            <div className="flex items-center gap-3">
              <a
                href={negocio.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href={`https://wa.me/${negocio.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Col 2 — Navegación */}
          <div>
            <h3 className="uppercase tracking-wide text-gray-400 text-sm font-semibold mb-4">
              Navegaci&oacute;n
            </h3>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Categorías */}
          <div>
            <h3 className="uppercase tracking-wide text-gray-400 text-sm font-semibold mb-4">
              Categor&iacute;as
            </h3>
            <ul className="space-y-2.5">
              {categorias.map((cat) => (
                <li key={cat}>
                  <a
                    href="#productos"
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {cat}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contacto */}
          <div>
            <h3 className="uppercase tracking-wide text-gray-400 text-sm font-semibold mb-4">
              Contacto
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`https://wa.me/${negocio.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-gray-300 hover:text-white transition-colors text-sm"
                >
                  <Phone size={16} className="flex-shrink-0" />
                  {negocio.whatsappDisplay}
                </a>
              </li>
              <li>
                <a
                  href={negocio.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-gray-300 hover:text-white transition-colors text-sm"
                >
                  <Instagram size={16} className="flex-shrink-0" />
                  {negocio.instagram}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-gray-300 text-sm">
                <Clock size={16} className="flex-shrink-0" />
                {negocio.horarios}
              </li>
              <li className="flex items-center gap-2.5 text-gray-300 text-sm">
                <MapPin size={16} className="flex-shrink-0" />
                {negocio.ubicacion}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-400">
          <p>&copy; 2026 {negocio.nombre} &middot; {negocio.ubicacion}</p>
          <div className="flex items-center gap-3">
            <p>Hecho con &#x1f4aa; en Santiago del Estero</p>
            <Link
              href="/admin"
              className="text-gray-600 hover:text-gray-400 transition-colors"
              title="Admin"
            >
              <Settings size={14} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
