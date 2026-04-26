import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Sólo permitimos proxy de hosts conocidos para no abrir un proxy abierto
const ALLOWED_HOST_SUFFIXES = [
  'googleusercontent.com',
  'drive.google.com',
  'lh3.google.com',
]

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const target = searchParams.get('url')

  if (!target) {
    return new NextResponse('Missing url param', { status: 400 })
  }

  let parsed
  try {
    parsed = new URL(target)
  } catch {
    return new NextResponse('Invalid url', { status: 400 })
  }

  if (!ALLOWED_HOST_SUFFIXES.some((h) => parsed.hostname.endsWith(h))) {
    return new NextResponse('Host not allowed', { status: 403 })
  }

  try {
    const res = await fetch(target, { redirect: 'follow' })
    if (!res.ok) {
      return new NextResponse(`Upstream ${res.status}`, { status: res.status })
    }
    const buffer = await res.arrayBuffer()
    const contentType = res.headers.get('content-type') || 'image/jpeg'

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    })
  } catch (err) {
    return new NextResponse('Fetch failed: ' + String(err), { status: 502 })
  }
}
