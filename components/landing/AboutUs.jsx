'use client'

import { useRef, useEffect, useState } from 'react'
import { stats } from '@/lib/config'

export default function AboutUs() {
  const sectionRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="nosotras" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Left — image placeholder */}
          <div
            className="rounded-xl aspect-square w-full max-w-lg mx-auto md:mx-0"
            style={{ background: 'linear-gradient(135deg, #1A2535, #2B3A52)' }}
          />

          {/* Right — content */}
          <div>
            <p className="uppercase tracking-[3px] text-accent font-semibold text-sm mb-3">
              NOSOTRAS
            </p>
            <h2 className="font-bold text-3xl md:text-4xl text-dark mb-5">
              Somos Norte Sport
            </h2>
            <p className="text-secondary leading-relaxed mb-8">
              Nacimos en Santiago del Estero con una idea simple: que cada mujer pueda entrenar
              con ropa c&oacute;moda, linda y accesible. Desde hace m&aacute;s de 3 a&ntilde;os
              acompa&ntilde;amos a cientos de clientas en todo el pa&iacute;s, ofreci&eacute;ndoles
              prendas de calidad con dise&ntilde;os que se renuevan cada temporada. Somos 100%
              online, vendemos por WhatsApp, Instagram y nuestra web, y nos encanta asesorarte
              para que encuentres el talle y el look perfecto.
            </p>

            {/* Stats */}
            <div
              ref={sectionRef}
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className={`text-center md:text-left transition-all duration-700 ${
                    visible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${idx * 150}ms` }}
                >
                  <p className="font-black text-primary text-3xl">{stat.numero}</p>
                  <p className="text-secondary text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
