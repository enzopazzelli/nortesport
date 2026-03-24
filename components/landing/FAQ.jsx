'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { faqs } from '@/lib/config'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  return (
    <section id="faq" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-bold text-3xl md:text-4xl text-dark mb-3">
            Preguntas frecuentes
          </h2>
          <p className="text-secondary">
            Resolv&eacute; tus dudas antes de comprar
          </p>
        </div>

        {/* Accordion */}
        <div className="max-w-[700px] mx-auto">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <div key={idx} className="border-b border-border">
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between py-4 text-left group"
                  aria-expanded={isOpen}
                >
                  <span className="font-medium text-dark pr-4">{faq.pregunta}</span>
                  <ChevronDown
                    size={20}
                    className={`text-secondary flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </button>
                <div
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{
                    maxHeight: isOpen ? '300px' : '0px',
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <p className="text-secondary pb-4 leading-relaxed">
                    {faq.respuesta}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
