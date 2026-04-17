export const metadata = {
  title: 'AMX UAV Monitoring',
  description: 'Flight report system for AMX UAV',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Tambahkan baris ini untuk memaksa CSS Leaflet jalan */}
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      </head>
      <body>{children}</body>
    </html>
  )
}