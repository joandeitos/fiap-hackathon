'use client'

import { SignIn } from '@clerk/nextjs'
import { Card, Typography, Row, Col } from 'antd'
import { 
  BookOutlined, 
  DollarOutlined, 
  UserOutlined,
  CheckCircleOutlined 
} from '@ant-design/icons'

const { Title, Paragraph } = Typography

export default function SignInPage() {
  const benefits = [
    {
      icon: <BookOutlined className="text-blue-600 text-xl" />,
      title: 'Acesso Completo',
      description: 'Explore milhares de materiais educacionais de qualidade'
    },
    {
      icon: <DollarOutlined className="text-green-600 text-xl" />,
      title: 'Venda seus Materiais',
      description: 'Monetize seu conhecimento e experiência'
    },
    {
      icon: <UserOutlined className="text-purple-600 text-xl" />,
      title: 'Comunidade',
      description: 'Conecte-se com outros educadores'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <Row gutter={[32, 32]} align="middle" className="min-h-screen">
          <Col xs={24} lg={12}>
            <div className="text-center lg:text-left">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto lg:mx-0 mb-6">
                <span className="text-white font-bold text-2xl">E</span>
              </div>
              
              <Title level={1} className="mb-4">
                Bem-vindo de volta!
              </Title>
              
              <Paragraph className="text-lg text-gray-600 mb-8">
                Entre na sua conta e continue transformando a educação. 
                Acesse seus materiais, vendas e muito mais.
              </Paragraph>

              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg shadow-md flex items-center justify-center">
                      {benefit.icon}
                    </div>
                    <div>
                      <Title level={4} className="mb-1">
                        {benefit.title}
                      </Title>
                      <Paragraph className="text-gray-600 mb-0">
                        {benefit.description}
                      </Paragraph>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Col>

          <Col xs={24} lg={12}>
            <div className="max-w-md mx-auto">
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
                          'text-blue-600 hover:text-blue-700',
                        identityPreviewText: 'text-gray-600',
                        identityPreviewEditButton: 'text-blue-600 hover:text-blue-700'
                      },
                      layout: {
                        socialButtonsPlacement: 'bottom',
                        socialButtonsVariant: 'blockButton'
                      }
                    }}
                  />
                </div>
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )
}

