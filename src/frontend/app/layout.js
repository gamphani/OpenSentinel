import './globals.css'

export const metadata = {
  title: 'OpenSentinel | Sovereign Node',
  description: 'Federated Health Mesh',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-cdc-light">{children}</body>
    </html>
  )
}