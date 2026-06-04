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
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#000000' }}>{children}</body>
    </html>
  )
}