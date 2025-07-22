'use client'

import React from 'react'
import { Row, Col, Card, Button, Typography, Space, Statistic, Avatar } from 'antd'
import { 
  ShopOutlined, 
  UserOutlined, 
  DollarOutlined, 
  StarOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  BookOutlined,
  TeamOutlined
} from '@ant-design/icons'
import Link from 'next/link'
import AppLayout from '@/components/Layout/AppLayout'

const { Title, Paragraph } = Typography

export default function HomePage() {
  const features = [
    {
      icon: <BookOutlined className="text-4xl text-blue-600" />,
      title: 'Materiais de Qualidade',
      description: 'Recursos educacionais criados por professores experientes e validados pela comunidade.'
    },
    {
      icon: <DollarOutlined className="text-4xl text-green-600" />,
      title: 'Monetize seu Conhecimento',
      description: 'Transforme sua experiência em renda vendendo seus materiais didáticos.'
    },
    {
      icon: <TeamOutlined className="text-4xl text-purple-600" />,
      title: 'Comunidade Ativa',
      description: 'Conecte-se com outros educadores e compartilhe experiências.'
    }
  ]

  const stats = [
    { title: 'Professores Ativos', value: 1250, suffix: '+' },
    { title: 'Materiais Disponíveis', value: 3400, suffix: '+' },
    { title: 'Downloads Realizados', value: 15600, suffix: '+' },
    { title: 'Avaliação Média', value: 4.8, suffix: '/5' }
  ]

  const testimonials = [
    {
      name: 'Maria Silva',
      role: 'Professora de Matemática',
      content: 'Encontrei materiais incríveis que transformaram minhas aulas. Recomendo!',
      avatar: 'M'
    },
    {
      name: 'João Santos',
      role: 'Professor de História',
      content: 'Consegui monetizar meu conhecimento vendendo meus planos de aula.',
      avatar: 'J'
    },
    {
      name: 'Ana Costa',
      role: 'Professora de Português',
      content: 'A qualidade dos materiais é excepcional. Vale cada centavo!',
      avatar: 'A'
    }
  ]

  return (
    <AppLayout>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="max-w-6xl mx-auto px-4">
          <Row justify="center" align="middle">
            <Col xs={24} lg={16} className="text-center">
              <Title level={1} className="text-white mb-6">
                Transforme a Educação com Materiais de Qualidade
              </Title>
              <Paragraph className="text-xl text-white/90 mb-8">
                Descubra, compre e venda recursos educacionais criados por professores para professores. 
                Uma plataforma que conecta educadores e potencializa o aprendizado.
              </Paragraph>
              <Space size="large" wrap>
                <Link href="/produtos">
                  <Button type="primary" size="large" icon={<ShopOutlined />}>
                    Explorar Materiais
                  </Button>
                </Link>
                <Button size="large" ghost icon={<UserOutlined />}>
                  Começar a Vender
                </Button>
              </Space>
            </Col>
          </Row>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <Row gutter={[32, 32]} justify="center">
            {stats.map((stat, index) => (
              <Col xs={12} sm={6} key={index}>
                <Card className="text-center border-0 shadow-sm">
                  <Statistic
                    title={stat.title}
                    value={stat.value}
                    suffix={stat.suffix}
                    valueStyle={{ color: '#1890ff', fontSize: '2rem', fontWeight: 'bold' }}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <Title level={2}>Por que escolher o EduMarketplace?</Title>
            <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nossa plataforma foi desenvolvida pensando nas necessidades reais dos educadores brasileiros.
            </Paragraph>
          </div>
          
          <Row gutter={[32, 32]}>
            {features.map((feature, index) => (
              <Col xs={24} md={8} key={index}>
                <Card className="h-full text-center product-card">
                  <div className="mb-4">{feature.icon}</div>
                  <Title level={4}>{feature.title}</Title>
                  <Paragraph className="text-gray-600">
                    {feature.description}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* How it Works */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <Title level={2}>Como Funciona</Title>
            <Paragraph className="text-lg text-gray-600">
              Processo simples e seguro para professores e compradores
            </Paragraph>
          </div>

          <Row gutter={[32, 32]} align="middle">
            <Col xs={24} lg={12}>
              <div className="space-y-8">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                    1
                  </div>
                  <div>
                    <Title level={4} className="mb-2 text-center">Cadastre-se Gratuitamente</Title>
                    <Paragraph className="text-gray-600 text-center max-w-sm mx-auto">
                      Crie sua conta em menos de 2 minutos e acesse nossa plataforma.
                    </Paragraph>
                  </div>
                </div>

                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                    2
                  </div>
                  <div>
                    <Title level={4} className="mb-2 text-center">Explore ou Publique</Title>
                    <Paragraph className="text-gray-600 text-center max-w-sm mx-auto">
                      Navegue por milhares de materiais ou publique seus próprios recursos.
                    </Paragraph>
                  </div>
                </div>

                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                    3
                  </div>
                  <div>
                    <Title level={4} className="mb-2 text-center">Compre com Segurança</Title>
                    <Paragraph className="text-gray-600 text-center max-w-sm mx-auto">
                      Pagamento protegido e download imediato após a compra.
                    </Paragraph>
                  </div>
                </div>
              </div>
            </Col>

            <Col xs={24} lg={12}>
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-0">
                <div className="text-center p-8">
                  <CheckCircleOutlined className="text-6xl text-green-600 mb-4" />
                  <Title level={3}>Pronto para Começar?</Title>
                  <Paragraph className="text-gray-600 mb-6">
                    Junte-se a milhares de educadores que já transformaram suas aulas.
                  </Paragraph>
                  <Link href="/produtos">
                    <Button type="primary" size="large" icon={<ArrowRightOutlined />}>
                      Explorar Agora
                    </Button>
                  </Link>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <Title level={2}>O que dizem nossos usuários</Title>
            <Paragraph className="text-lg text-gray-600">
              Depoimentos reais de professores que usam nossa plataforma
            </Paragraph>
          </div>

          <Row gutter={[32, 32]}>
            {testimonials.map((testimonial, index) => (
              <Col xs={24} md={8} key={index}>
                <Card className="h-full">
                  <div className="flex items-center mb-4">
                    <Avatar size={48} className="bg-blue-600 mr-3">
                      {testimonial.avatar}
                    </Avatar>
                    <div>
                      <Title level={5} className="mb-0">{testimonial.name}</Title>
                      <Paragraph className="text-gray-500 mb-0 text-sm">
                        {testimonial.role}
                      </Paragraph>
                    </div>
                  </div>
                  <Paragraph className="text-gray-600 italic">
                    &quot;{testimonial.content}&quot;
                  </Paragraph>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <StarOutlined key={i} />
                    ))}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </AppLayout>
  )
}

