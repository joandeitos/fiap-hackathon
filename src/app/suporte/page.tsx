'use client'

import { useState } from 'react'
import { 
  Typography, 
  Card, 
  Row, 
  Col, 
  Button,
  Input,
  Steps,
  List,
  Avatar,
  Tag,
  Space,
  Divider
} from 'antd'
import { 
  SearchOutlined,
  QuestionCircleOutlined,
  BookOutlined,
  MessageOutlined,
  PhoneOutlined,
  MailOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  FileTextOutlined,
  CustomerServiceOutlined,
  BulbOutlined
} from '@ant-design/icons'
import Link from 'next/link'
import AppLayout from '@/components/Layout/AppLayout'

const { Title, Paragraph } = Typography
const { Step } = Steps

export default function SuportePage() {
  const [searchTerm, setSearchTerm] = useState('')

  const supportOptions = [
    {
      icon: <QuestionCircleOutlined className="text-blue-600 text-3xl" />,
      title: 'Perguntas Frequentes',
      description: 'Encontre respostas rápidas para as dúvidas mais comuns',
      action: 'Ver FAQ',
      link: '/faq',
      color: 'blue'
    },
    {
      icon: <MessageOutlined className="text-green-600 text-3xl" />,
      title: 'Chat Online',
      description: 'Converse em tempo real com nossa equipe de suporte',
      action: 'Iniciar Chat',
      link: '/contato',
      color: 'green'
    },
    {
      icon: <MailOutlined className="text-purple-600 text-3xl" />,
      title: 'Email Suporte',
      description: 'Envie sua dúvida por email e receba resposta em até 24h',
      action: 'Enviar Email',
      link: '/contato',
      color: 'purple'
    },
    {
      icon: <PhoneOutlined className="text-orange-600 text-3xl" />,
      title: 'Telefone',
      description: 'Ligue para nossa central de atendimento',
      action: 'Ver Telefone',
      link: '/contato',
      color: 'orange'
    }
  ]

  const quickGuides = [
    {
      icon: <BookOutlined />,
      title: 'Como começar a vender',
      description: 'Guia completo para publicar seu primeiro material',
      time: '5 min',
      type: 'Guia'
    },
    {
      icon: <PlayCircleOutlined />,
      title: 'Como comprar materiais',
      description: 'Passo a passo para fazer sua primeira compra',
      time: '3 min',
      type: 'Vídeo'
    },
    {
      icon: <FileTextOutlined />,
      title: 'Configurar perfil',
      description: 'Personalize seu perfil e aumente suas vendas',
      time: '4 min',
      type: 'Tutorial'
    },
    {
      icon: <BulbOutlined />,
      title: 'Dicas de precificação',
      description: 'Como definir o preço ideal para seus materiais',
      time: '6 min',
      type: 'Dicas'
    }
  ]

  const recentUpdates = [
    {
      date: '22/01/2025',
      title: 'Nova funcionalidade: Avaliações detalhadas',
      description: 'Agora você pode deixar comentários mais detalhados nas avaliações',
      type: 'Novidade'
    },
    {
      date: '20/01/2025',
      title: 'Melhoria no sistema de busca',
      description: 'Busca mais rápida e resultados mais precisos',
      type: 'Melhoria'
    },
    {
      date: '18/01/2025',
      title: 'Correção: Upload de arquivos grandes',
      description: 'Resolvido problema com upload de arquivos acima de 30MB',
      type: 'Correção'
    }
  ]

  const supportSteps = [
    {
      title: 'Identifique o Problema',
      description: 'Descreva claramente qual dificuldade você está enfrentando'
    },
    {
      title: 'Consulte o FAQ',
      description: 'Verifique se sua dúvida já foi respondida em nossa base de conhecimento'
    },
    {
      title: 'Entre em Contato',
      description: 'Se não encontrar a resposta, use um de nossos canais de suporte'
    },
    {
      title: 'Receba Ajuda',
      description: 'Nossa equipe irá ajudá-lo a resolver o problema rapidamente'
    }
  ]

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <CustomerServiceOutlined className="text-6xl mb-6" />
            <Title level={1} className="text-white mb-4">
              Central de Suporte
            </Title>
            <Paragraph className="text-xl text-indigo-100 mb-8">
              Estamos aqui para ajudar você a aproveitar ao máximo o EduMarketplace
            </Paragraph>
            
            {/* Busca Rápida */}
            <div className="max-w-md mx-auto">
              <Input
                size="large"
                placeholder="Como podemos ajudar você hoje?"
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-lg"
                suffix={
                  <Button type="primary" className="border-0">
                    Buscar
                  </Button>
                }
              />
            </div>
          </div>
        </div>

        <div className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            {/* Opções de Suporte */}
            <div className="mb-16">
              <Title level={2} className="text-center mb-12">
                Como Podemos Ajudar?
              </Title>
              <Row gutter={[24, 24]}>
                {supportOptions.map((option, index) => (
                  <Col xs={24} sm={12} lg={6} key={index}>
                    <Card 
                      hoverable
                      className="text-center h-full"
                      actions={[
                        <Link key="action" href={option.link}>
                          <Button type="primary" block>
                            {option.action}
                          </Button>
                        </Link>
                      ]}
                    >
                      <div className="py-4">
                        {option.icon}
                        <Title level={4} className="mt-4 mb-2">
                          {option.title}
                        </Title>
                        <Paragraph className="text-gray-600">
                          {option.description}
                        </Paragraph>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>

            <Row gutter={[32, 32]}>
              {/* Guias Rápidos */}
              <Col xs={24} lg={12}>
                <Card title="Guias Rápidos" className="h-full">
                  <List
                    itemLayout="horizontal"
                    dataSource={quickGuides}
                    renderItem={(item) => (
                      <List.Item
                        actions={[
                          <Button type="link" key="view">
                            Ver Guia
                          </Button>
                        ]}
                      >
                        <List.Item.Meta
                          avatar={
                            <Avatar 
                              icon={item.icon} 
                              className="bg-blue-100 text-blue-600"
                            />
                          }
                          title={item.title}
                          description={
                            <div>
                              <div className="text-gray-600 mb-1">
                                {item.description}
                              </div>
                              <Space>
                                <Tag color="blue">{item.type}</Tag>
                                <span className="text-xs text-gray-500">
                                  <ClockCircleOutlined className="mr-1" />
                                  {item.time}
                                </span>
                              </Space>
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>

              {/* Atualizações Recentes */}
              <Col xs={24} lg={12}>
                <Card title="Atualizações Recentes" className="h-full">
                  <List
                    itemLayout="vertical"
                    size="small"
                    dataSource={recentUpdates}
                    renderItem={(item) => (
                      <List.Item>
                        <div className="flex justify-between items-start mb-2">
                          <Title level={5} className="mb-1">
                            {item.title}
                          </Title>
                          <Tag 
                            color={
                              item.type === 'Novidade' ? 'green' :
                              item.type === 'Melhoria' ? 'blue' : 'orange'
                            }
                            size="small"
                          >
                            {item.type}
                          </Tag>
                        </div>
                        <Paragraph className="text-gray-600 text-sm mb-1">
                          {item.description}
                        </Paragraph>
                        <div className="text-xs text-gray-500">
                          {item.date}
                        </div>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>

            {/* Como Funciona o Suporte */}
            <div className="mt-16">
              <Title level={2} className="text-center mb-12">
                Como Funciona Nosso Suporte
              </Title>
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
                <Steps
                  current={-1}
                  direction="horizontal"
                  responsive={false}
                  className="mb-8"
                >
                  {supportSteps.map((step, index) => (
                    <Step
                      key={index}
                      title={step.title}
                      description={step.description}
                      icon={<CheckCircleOutlined />}
                    />
                  ))}
                </Steps>
              </Card>
            </div>

            {/* Estatísticas de Suporte */}
            <div className="mt-16">
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={8}>
                  <Card className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      &lt; 2h
                    </div>
                    <div className="text-gray-600">
                      Tempo médio de resposta
                    </div>
                  </Card>
                </Col>
                <Col xs={24} sm={8}>
                  <Card className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      98%
                    </div>
                    <div className="text-gray-600">
                      Taxa de satisfação
                    </div>
                  </Card>
                </Col>
                <Col xs={24} sm={8}>
                  <Card className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      24/7
                    </div>
                    <div className="text-gray-600">
                      Disponibilidade FAQ
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Title level={2} className="mb-6">
              Precisa de Ajuda Personalizada?
            </Title>
            <Paragraph className="text-lg text-gray-600 mb-8">
              Nossa equipe especializada está pronta para oferecer suporte personalizado 
              para suas necessidades específicas.
            </Paragraph>
            <Space size="large">
              <Link href="/contato">
                <Button type="primary" size="large" icon={<MessageOutlined />}>
                  Falar com Especialista
                </Button>
              </Link>
              <Button size="large" icon={<PhoneOutlined />}>
                Agendar Ligação
              </Button>
            </Space>
          </div>
        </div>

        {/* Recursos Adicionais */}
        <div className="py-16 bg-gray-100">
          <div className="max-w-6xl mx-auto px-4">
            <Title level={2} className="text-center mb-12">
              Recursos Adicionais
            </Title>
            <Row gutter={[24, 24]}>
              <Col xs={24} md={8}>
                <Card className="text-center h-full">
                  <BookOutlined className="text-4xl text-blue-600 mb-4" />
                  <Title level={4}>Base de Conhecimento</Title>
                  <Paragraph className="text-gray-600 mb-4">
                    Artigos detalhados sobre todas as funcionalidades da plataforma
                  </Paragraph>
                  <Button type="primary" ghost>
                    Explorar Artigos
                  </Button>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card className="text-center h-full">
                  <PlayCircleOutlined className="text-4xl text-green-600 mb-4" />
                  <Title level={4}>Vídeo Tutoriais</Title>
                  <Paragraph className="text-gray-600 mb-4">
                    Aprenda visualmente com nossos tutoriais em vídeo
                  </Paragraph>
                  <Button type="primary" ghost>
                    Assistir Vídeos
                  </Button>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card className="text-center h-full">
                  <CustomerServiceOutlined className="text-4xl text-purple-600 mb-4" />
                  <Title level={4}>Comunidade</Title>
                  <Paragraph className="text-gray-600 mb-4">
                    Conecte-se com outros educadores e compartilhe experiências
                  </Paragraph>
                  <Button type="primary" ghost>
                    Participar
                  </Button>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

