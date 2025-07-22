'use client'

import { SignUp } from '@clerk/nextjs'
import { Card, Typography, Row, Col } from 'antd'
import { 
  BookOutlined, 
  DollarOutlined, 
  UserOutlined,
  CheckCircleOutlined 
} from '@ant-design/icons'

const { Title, Paragraph } = Typography

export default function SignUpPage() {
  const benefits = [
    {
      icon: <BookOutlined className="text-blue-600 text-xl" />,
      title: 'Acesso a Milhares de Materiais',
      description: 'Explore recursos educacionais de qualidade criados por professores experientes'
    },
    {
      icon: <DollarOutlined className="text-green-600 text-xl" />,
      title: 'Monetize seu Conhecimento',
      description: 'Venda seus materiais didáticos e transforme sua experiência em renda'
    },
    {
      icon: <UserOutlined className="text-purple-600 text-xl" />,
      title: 'Comunidade de Educadores',
      description: 'Conecte-se com outros professores e compartilhe experiências'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <Row gutter={[32, 32]} align="middle" className="min-h-screen">
          {/* Coluna da Esquerda - Benefícios */}
          <Col xs={24} lg={12}>
            <div className="text-center lg:text-left">
              <div className="flex justify-center lg:justify-start mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">E</span>
                </div>
              </div>
              
              <Title level={1} className="mb-4">
                Junte-se ao EduMarketplace
              </Title>
              <Paragraph className="text-lg text-gray-600 mb-8">
                Transforme a educação brasileira. Conecte-se com milhares de professores e potencialize seu ensino.
              </Paragraph>

              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center">
                      {benefit.icon}
                    </div>
                    <div>
                      <Title level={5} className="mb-1">
                        {benefit.title}
                      </Title>
                      <Paragraph className="text-gray-600 mb-0">
                        {benefit.description}
                      </Paragraph>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2 text-green-700">
                  <CheckCircleOutlined />
                  <span className="font-medium">Cadastro 100% gratuito</span>
                </div>
                <Paragraph className="text-green-600 text-sm mb-0 mt-1">
                  Sem taxas de inscrição. Comece a usar imediatamente.
                </Paragraph>
              </div>
            </div>
          </Col>

          {/* Coluna da Direita - Formulário */}
          <Col xs={24} lg={12}>
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <Card className="shadow-xl border-0 rounded-2xl overflow-hidden">
                  <div className="p-6">
                    <div className="text-center mb-6">
                      <Title level={3} className="mb-2">
                        Criar Conta
                      </Title>
                      <Paragraph className="text-gray-600">
                        Preencha os dados abaixo para começar
                      </Paragraph>
                    </div>

                    <SignUp 
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
                    Ao criar uma conta, você concorda com nossos{' '}
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
          </Col>
        </Row>
      </div>
    </div>
  )
}

