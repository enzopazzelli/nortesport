import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  const url = process.env.APPS_SCRIPT_URL
  const token = process.env.APPS_SCRIPT_TOKEN

  if (!url || !token) {
    return NextResponse.json(
      { ok: false, error: 'sync_not_configured' },
      { status: 503 }
    )
  }

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 })
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, token }),
      redirect: 'follow',
      cache: 'no-store',
    })
    const text = await res.text()
    let data
    try {
      data = JSON.parse(text)
    } catch {
      data = { ok: false, error: 'bad_response', raw: text.slice(0, 500) }
    }
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 502 }
    )
  }
}
