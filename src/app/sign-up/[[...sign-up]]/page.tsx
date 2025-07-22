'use client'

import { SignUp } from '@clerk/nextjs'
import { Card, Typography, Row, Col } from 'antd'
import { 
  BookOutlined, 
  DollarOutlined, 
  UserOutlined,
  CheckCircleOutlined,
  StarOutlined,
  ShieldCheckOutlined
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
      description: 'Venda seus materiais e transforme sua experiência em renda extra'
    },
    {
      icon: <UserOutlined className="text-purple-600 text-xl" />,
      title: 'Comunidade de Educadores',
      description: 'Conecte-se com outros professores e compartilhe experiências'
    },
    {
      icon: <StarOutlined className="text-yellow-600 text-xl" />,
      title: 'Avaliações e Feedback',
      description: 'Receba feedback valioso e melhore continuamente seus materiais'
    },
    {
      icon: <ShieldCheckOutlined className="text-indigo-600 text-xl" />,
      title: 'Plataforma Segura',
      description: 'Transações protegidas e ambiente seguro para todos os usuários'
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
                Junte-se ao EduMarketplace
              </Title>
              
              <Paragraph className="text-lg text-gray-600 mb-8">
                Transforme sua paixão por ensinar em uma fonte de renda. 
                Conecte-se com milhares de educadores e alunos em todo o Brasil.
              </Paragraph>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center">
                      {benefit.icon}
                    </div>
                    <div>
                      <Title level={5} className="mb-1">
                        {benefit.title}
                      </Title>
                      <Paragraph className="text-gray-600 mb-0 text-sm">
                        {benefit.description}
                      </Paragraph>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircleOutlined className="text-blue-600" />
                  <Title level={5} className="mb-0 text-blue-800">
                    Cadastro 100% Gratuito
                  </Title>
                </div>
                <Paragraph className="text-blue-700 mb-0 text-sm">
                  Sem taxas de inscrição. Comece a vender hoje mesmo!
                </Paragraph>
              </div>
            </div>
          </Col>

          <Col xs={24} lg={12}>
            <div className="max-w-md mx-auto">
              <Card className="shadow-xl border-0 rounded-2xl overflow-hidden">
                <div className="text-center mb-6 p-6 pb-0">
                  <Title level={3} className="mb-2">
                    Criar Conta
                  </Title>
                  <Paragraph className="text-gray-600">
                    Preencha os dados abaixo para começar
                  </Paragraph>
                </div>

                <div className="px-6 pb-6">
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
                          'text-blue-600 hover:text-blue-700',
                        identityPreviewText: 'text-gray-600',
                        identityPreviewEditButton: 'text-blue-600 hover:text-blue-700',
                        formFieldLabel: 'text-gray-700 font-medium',
                        dividerLine: 'bg-gray-200',
                        dividerText: 'text-gray-500'
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

