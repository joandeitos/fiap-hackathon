'use client'

import { SignIn } from '@clerk/nextjs'
import { Card, Typography } from 'antd'

const { Title, Paragraph } = Typography

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
            <span className="text-white font-bold text-2xl">E</span>
          </div>
          <Title level={2} className="mb-2">
            Bem-vindo de volta!
          </Title>
          <Paragraph className="text-gray-600">
            Entre na sua conta para acessar o EduMarketplace
          </Paragraph>
        </div>

        <Card className="shadow-xl border-0 rounded-2xl overflow-hidden">
          <div className="p-6">
            <SignIn 
              appearance={{
                elements: {
                  formButtonPrimary: 
                    'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm normal-case',
                  card: 'shadow-none',
                  headerTitle: 'hidden',
                  headerSubtitle: 'hidden',
                  socialButtonsBlockButton: 
                    'border-gray-200 hover:bg-gray-50 text-gray-700',
                  formFieldInput: 
                    'border-gray-200 focus:border-blue-500 focus:ring-blue-500',
                  footerActionLink: 
                    'text-blue-600 hover:text-blue-700'
                }
              }}
            />
          </div>
        </Card>

        <div className="text-center mt-6">
          <Paragraph className="text-sm text-gray-500">
            Ao entrar, você concorda com nossos{' '}
            <a href="/terms" className="text-blue-600 hover:text-blue-700">
              Termos de Uso
            </a>{' '}
            e{' '}
            <a href="/privacy" className="text-blue-600 hover:text-blue-700">
              Política de Privacidade
            </a>
          </Paragraph>
        </div>
      </div>
    </div>
  )
}

