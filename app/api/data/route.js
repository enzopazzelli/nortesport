import { NextResponse } from 'next/server'
import { getProductos, getTestimonios, getLookbook, getConfig } from '@/lib/sheets'

export const revalidate = 300 // 5 minutes

export async function GET() {
  const [productos, testimonios, lookbook, config] = await Promise.all([
    getProductos(),
    getTestimonios(),
    getLookbook(),
    getConfig(),
  ])

  return NextResponse.json({ productos, testimonios, lookbook, config })
}
