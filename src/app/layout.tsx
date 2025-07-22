import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { ClerkProvider } from '@clerk/nextjs'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EduMarketplace - Transformando Educação',
  description: 'Plataforma que conecta professores para compartilhar, vender e comprar materiais educacionais de qualidade.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="pt-BR">
        <body className={inter.className}>
          <AntdRegistry>
            {children}
          </AntdRegistry>
        </body>
      </html>
    </ClerkProvider>
  )
}

