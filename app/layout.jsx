import './globals.css'

export const metadata = {
  title: 'Norte Sport | Ropa deportiva femenina — Santiago del Estero',
  description:
    'Tienda online de ropa deportiva para mujeres. Calzas, remeras, shorts y tops. Nuevos colores cada temporada. Envíos a todo el país.',
  keywords: [
    'ropa deportiva femenina',
    'calzas deportivas',
    'remeras dry-fit',
    'shorts deportivos',
    'tops deportivos',
    'Santiago del Estero',
    'ropa gym mujer',
    'Norte Sport',
  ],
  authors: [{ name: 'Norte Sport' }],
  openGraph: {
    title: 'Norte Sport | Ropa deportiva femenina',
    description:
      'Tienda online de ropa deportiva para mujeres. Calzas, remeras, shorts y tops. Nuevos colores cada temporada.',
    type: 'website',
    locale: 'es_AR',
    siteName: 'Norte Sport',
  },
  icons: {
    icon: '/favicon.png',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: 'Norte Sport',
              description:
                'Tienda online de ropa deportiva femenina. Calzas, remeras, shorts y tops. Santiago del Estero, Argentina.',
              url: 'https://nortesport.com.ar',
              telephone: '+5493815550000',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Santiago del Estero',
                addressCountry: 'AR',
              },
              openingHoursSpecification: {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                opens: '08:00',
                closes: '22:00',
              },
              sameAs: ['https://www.instagram.com/nortesport.sde'],
            }),
          }}
        />
      </head>
      <body className="font-body text-dark antialiased">{children}</body>
    </html>
  )
}
