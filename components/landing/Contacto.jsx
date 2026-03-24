'use client'

import { useState } from 'react'
import { Phone, Instagram, Clock, Truck, MessageCircle } from 'lucide-react'
import { negocio, waLink } from '@/lib/config'

const consultaOptions = ['Productos', 'Talles', 'Env\u00edos', 'Pagos', 'Otro']

export default function Contacto() {
  const [form, setForm] = useState({
    nombre: '',
    whatsapp: '',
    asunto: '',
    consulta: '',
  })

  const updateField = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const message = `\ud83d\udce9 *Nueva consulta \u2014 Norte Sport*\n\n\ud83d\udc64 Nombre: ${form.nombre || 'No indicado'}\n\ud83d\udcf1 WhatsApp: ${form.whatsapp || 'No indicado'}\n\ud83d\udccc Asunto: ${form.asunto || 'No especificado'}\n\n\ud83d\udcdd Consulta:\n${form.consulta || 'Sin mensaje'}`
    window.open(waLink(message), '_blank')
  }

  const contactCards = [
    {
      icon: Phone,
      title: negocio.whatsappDisplay,
      subtitle: 'Respondemos en menos de 1 hora',
      href: `https://wa.me/${negocio.whatsapp}`,
    },
    {
      icon: Instagram,
      title: negocio.instagram,
      subtitle: 'Seguinos para ver las novedades',
      href: negocio.instagramUrl,
    },
    {
      icon: Clock,
      title: negocio.horarios,
      subtitle: null,
      href: null,
    },
    {
      icon: Truck,
      title: 'Env\u00edos a todo el pa\u00eds',
      subtitle: null,
      href: null,
    },
  ]

  return (
    <section id="contacto" className="py-16 md:py-24 bg-[#F7F8FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-bold text-3xl md:text-4xl text-dark mb-3">
            &iquest;Quer&eacute;s saber m&aacute;s?
          </h2>
          <p className="text-secondary">
            Escribinos y te respondemos en minutos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          {/* Left — contact info cards */}
          <div className="space-y-4">
            {contactCards.map((card, idx) => {
              const Icon = card.icon
              const content = (
                <div className="bg-white border border-border rounded-xl p-4 hover:shadow-md transition-shadow flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-dark">{card.title}</p>
                    {card.subtitle && (
                      <p className="text-secondary text-sm mt-0.5">{card.subtitle}</p>
                    )}
                  </div>
                </div>
              )

              if (card.href) {
                return (
                  <a
                    key={idx}
                    href={card.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    {content}
                  </a>
                )
              }

              return <div key={idx}>{content}</div>
            })}
          </div>

          {/* Right — form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark mb-1">Nombre</label>
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => updateField('nombre', e.target.value)}
                placeholder="Tu nombre"
                className="w-full bg-[#F7F8FA] border border-border rounded-lg p-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-1">WhatsApp</label>
              <input
                type="tel"
                value={form.whatsapp}
                onChange={(e) => updateField('whatsapp', e.target.value)}
                placeholder="Tu n\u00famero de WhatsApp"
                className="w-full bg-[#F7F8FA] border border-border rounded-lg p-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-1">
                &iquest;Sobre qu&eacute; quer&eacute;s consultar?
              </label>
              <select
                value={form.asunto}
                onChange={(e) => updateField('asunto', e.target.value)}
                className="w-full bg-[#F7F8FA] border border-border rounded-lg p-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
              >
                <option value="">Seleccion&aacute; una opci&oacute;n</option>
                {consultaOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-1">Consulta</label>
              <textarea
                value={form.consulta}
                onChange={(e) => updateField('consulta', e.target.value)}
                placeholder="Escrib&iacute; tu consulta..."
                rows={4}
                className="w-full bg-[#F7F8FA] border border-border rounded-lg p-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-whatsapp text-white font-semibold py-3 rounded-lg hover:bg-whatsapp/90 transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle size={18} />
              Enviar por WhatsApp
            </button>

            <p className="text-secondary text-xs text-center">
              Te respondemos en menos de 1 hora durante horario comercial
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
