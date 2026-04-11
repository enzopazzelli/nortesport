'use client'

import { useState } from 'react'
import { Ruler } from 'lucide-react'
import Modal from '@/components/ui/Modal'

export default function SizeGuideLink({ className = '' }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          setOpen(true)
        }}
        className={`inline-flex items-center gap-1 text-accent hover:underline underline-offset-2 transition-colors ${className}`}
      >
        <Ruler size={12} />
        Gu&iacute;a de talles
      </button>

      <Modal isOpen={open} onClose={() => setOpen(false)} maxWidth="max-w-2xl">
        <div className="p-4 md:p-6">
          <h3 className="font-bold text-lg text-primary mb-4 pr-8">
            Gu&iacute;a de talles
          </h3>
          <img
            src="/guiadetalles.jpeg"
            alt="Gu&iacute;a de talles Norte Sport"
            className="w-full h-auto rounded-lg"
          />
          <p className="text-secondary text-xs mt-4 text-center">
            Si ten&eacute;s dudas, escrib&iacute;nos por WhatsApp y te ayudamos a elegir el talle correcto.
          </p>
        </div>
      </Modal>
    </>
  )
}
