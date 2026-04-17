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
      <body>{children}</body>
    </html>
  )
}