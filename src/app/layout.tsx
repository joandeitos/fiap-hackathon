import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { ConfigProvider } from 'antd'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EduMarketplace - Marketplace Educacional',
  description: 'Plataforma para professores venderem e comprarem materiais educacionais de qualidade',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#1890ff',
                colorSuccess: '#52c41a',
                colorWarning: '#faad14',
                colorError: '#ff4d4f',
                borderRadius: 8,
                fontFamily: inter.style.fontFamily,
              },
            }}
          >
            {children}
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  )
}

