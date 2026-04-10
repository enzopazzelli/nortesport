import { NextResponse } from 'next/server'
import { getProductos, getTestimonios, getLookbook, getFAQs, getConfig } from '@/lib/sheets'

export const revalidate = 300 // 5 minutes

export async function GET() {
  const [productos, testimonios, lookbook, faqs, config] = await Promise.all([
    getProductos(),
    getTestimonios(),
    getLookbook(),
    getFAQs(),
    getConfig(),
  ])

  return NextResponse.json({ productos, testimonios, lookbook, faqs, config })
}
