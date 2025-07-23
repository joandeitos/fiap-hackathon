'use client'

import { useState } from 'react'
import { 
  Typography, 
  Card, 
  Row, 
  Col, 
  Avatar, 
  Button, 
  Tabs, 
  List, 
  Tag, 
  Rate,
  Statistic,
  Progress,
  Badge
} from 'antd'
import { 
  UserOutlined,
  EditOutlined,
  BookOutlined,
  ShoppingOutlined,
  TrophyOutlined,
  StarOutlined,
  DownloadOutlined,
  DollarOutlined
} from '@ant-design/icons'
import Link from 'next/link'
import AppLayout from '@/components/Layout/AppLayout'
import { useUser } from '@clerk/nextjs'

const { Title, Paragraph } = Typography
const { TabPane } = Tabs

export default function ProfilePage() {
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState('overview')

  // Dados mock do perfil
  const profileStats = {
    materiaisPublicados: 12,
    totalVendas: 45,
    avaliacaoMedia: 4.8,
    totalDownloads: 1250,
    receitaTotal: 2850.50,
    seguidores: 89
  }

  const recentMaterials = [
    {
      id: 1,
      title: 'Plano de Aula: Frações Divertidas',
      category: 'Matemática',
      price: 15.90,
      downloads: 23,
      rating: 4.9,
      status: 'Publicado'
    },
    {
      id: 2,
      title: 'Atividades de Interpretação de Texto',
      category: 'Português',
      price: 22.50,
      downloads: 18,
      rating: 4.7,
      status: 'Publicado'
    },
    {
      id: 3,
      title: 'Experimentos de Química Básica',
      category: 'Ciências',
      price: 18.00,
      downloads: 0,
      rating: 0,
      status: 'Rascunho'
    }
  ]

  const recentPurchases = [
    {
      id: 1,
      title: 'Jogos Matemáticos para Ensino Fundamental',
      author: 'Prof. Maria Silva',
      price: 25.00,
      date: '2025-01-20',
      rating: 5
    },
    {
      id: 2,
      title: 'Planos de Aula - História do Brasil',
      author: 'Prof. João Santos',
      price: 30.00,
      date: '2025-01-18',
      rating: 4
    }
  ]

  const achievements = [
    {
      title: 'Primeiro Material',
      description: 'Publicou seu primeiro material na plataforma',
      icon: <BookOutlined className="text-blue-600" />,
      earned: true
    },
    {
      title: 'Vendedor Popular',
      description: 'Alcançou 50 vendas',
      icon: <TrophyOutlined className="text-gold" />,
      earned: false,
      progress: 90
    },
    {
      title: 'Avaliação 5 Estrelas',
      description: 'Mantém avaliação média acima de 4.5',
      icon: <StarOutlined className="text-yellow-500" />,
      earned: true
    }
  ]

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header do Perfil */}
          <Card className="mb-8 shadow-lg">
            <Row gutter={[24, 24]} align="middle">
              <Col xs={24} sm={8} md={6} className="text-center">
                <Avatar 
                  size={120} 
                  src={user?.imageUrl}
                  icon={<UserOutlined />}
                  className="mb-4"
                />
                <div>
                  <Title level={4} className="mb-1">
                    {user?.firstName} {user?.lastName}
                  </Title>
                  <Paragraph className="text-gray-600 mb-2">
                    Professor(a) de Matemática
                  </Paragraph>
                  <Badge count={profileStats.seguidores} showZero color="blue">
                    <span className="text-sm text-gray-500">Seguidores</span>
                  </Badge>
                </div>
              </Col>
              
              <Col xs={24} sm={16} md={18}>
                <Row gutter={[16, 16]}>
                  <Col xs={12} sm={8}>
                    <Statistic
                      title="Materiais Publicados"
                      value={profileStats.materiaisPublicados}
                      prefix={<BookOutlined />}
                    />
                  </Col>
                  <Col xs={12} sm={8}>
                    <Statistic
                      title="Total de Vendas"
                      value={profileStats.totalVendas}
                      prefix={<ShoppingOutlined />}
                    />
                  </Col>
                  <Col xs={12} sm={8}>
                    <Statistic
                      title="Avaliação Média"
                      value={profileStats.avaliacaoMedia}
                      precision={1}
                      prefix={<StarOutlined />}
                      suffix="/ 5.0"
                    />
                  </Col>
                  <Col xs={12} sm={8}>
                    <Statistic
                      title="Downloads"
                      value={profileStats.totalDownloads}
                      prefix={<DownloadOutlined />}
                    />
                  </Col>
                  <Col xs={12} sm={8}>
                    <Statistic
                      title="Receita Total"
                      value={profileStats.receitaTotal}
                      precision={2}
                      prefix="R$"
                    />
                  </Col>
                  <Col xs={12} sm={8}>
                    <Link href="/profile/edit">
                      <Button type="primary" icon={<EditOutlined />} block>
                        Editar Perfil
                      </Button>
                    </Link>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>

          {/* Tabs de Conteúdo */}
          <Card className="shadow-lg">
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane tab="Visão Geral" key="overview">
                <Row gutter={[24, 24]}>
                  <Col xs={24} lg={12}>
                    <Title level={4} className="mb-4">Meus Materiais Recentes</Title>
                    <List
                      dataSource={recentMaterials}
                      renderItem={(item) => (
                        <List.Item>
                          <List.Item.Meta
                            title={
                              <div className="flex justify-between items-start">
                                <span>{item.title}</span>
                                <Tag color={item.status === 'Publicado' ? 'green' : 'orange'}>
                                  {item.status}
                                </Tag>
                              </div>
                            }
                            description={
                              <div>
                                <div className="flex justify-between items-center mb-2">
                                  <Tag color="blue">{item.category}</Tag>
                                  <span className="font-medium">R$ {item.price.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm text-gray-500">
                                  <span>{item.downloads} downloads</span>
                                  {item.rating > 0 && (
                                    <div className="flex items-center">
                                      <Rate disabled defaultValue={item.rating} size="small" />
                                      <span className="ml-1">({item.rating})</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            }
                          />
                        </List.Item>
                      )}
                    />
                    <div className="text-center mt-4">
                      <Link href="/dashboard/produtos">
                        <Button type="link">Ver todos os materiais</Button>
                      </Link>
                    </div>
                  </Col>

                  <Col xs={24} lg={12}>
                    <Title level={4} className="mb-4">Conquistas</Title>
                    <div className="space-y-4">
                      {achievements.map((achievement, index) => (
                        <Card key={index} size="small" className={achievement.earned ? 'border-green-200 bg-green-50' : 'border-gray-200'}>
                          <div className="flex items-center space-x-3">
                            <div className={`text-2xl ${achievement.earned ? '' : 'opacity-50'}`}>
                              {achievement.icon}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{achievement.title}</div>
                              <div className="text-sm text-gray-600">{achievement.description}</div>
                              {!achievement.earned && achievement.progress && (
                                <Progress 
                                  percent={achievement.progress} 
                                  size="small" 
                                  className="mt-2"
                                />
                              )}
                            </div>
                            {achievement.earned && (
                              <Tag color="green">Conquistado</Tag>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </Col>
                </Row>
              </TabPane>

              <TabPane tab="Compras" key="purchases">
                <Title level={4} className="mb-4">Histórico de Compras</Title>
                <List
                  dataSource={recentPurchases}
                  renderItem={(item) => (
                    <List.Item
                      actions={[
                        <Button 
                          key="download" 
                          type="link" 
                          icon={<DownloadOutlined />}
                          onClick={() => {
                            message.success('Download iniciado!')
                          }}
                        >
                          Download
                        </Button>,
                        <Link key="view" href={`/produtos/${item.id}`}>
                          <Button type="link">Ver Detalhes</Button>
                        </Link>
                      ]}
                    >
                      <List.Item.Meta
                        title={item.title}
                        description={
                          <div>
                            <div className="mb-2">por {item.author}</div>
                            <div className="flex justify-between items-center">
                              <span className="font-medium">R$ {item.price.toFixed(2)}</span>
                              <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-500">{item.date}</span>
                                <Rate disabled defaultValue={item.rating} size="small" />
                              </div>
                            </div>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
                <div className="text-center mt-4">
                  <Link href="/compras">
                    <Button type="link">Ver todas as compras</Button>
                  </Link>
                </div>
              </TabPane>

              <TabPane tab="Vendas" key="sales">
                <Title level={4} className="mb-4">Resumo de Vendas</Title>
                <Row gutter={[16, 16]} className="mb-6">
                  <Col xs={24} sm={8}>
                    <Card>
                      <Statistic
                        title="Vendas Este Mês"
                        value={12}
                        prefix={<DollarOutlined />}
                        valueStyle={{ color: '#3f8600' }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Card>
                      <Statistic
                        title="Receita Este Mês"
                        value={450.80}
                        precision={2}
                        prefix="R$"
                        valueStyle={{ color: '#3f8600' }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Card>
                      <Statistic
                        title="Material Mais Vendido"
                        value="Frações Divertidas"
                        valueStyle={{ fontSize: '16px' }}
                      />
                    </Card>
                  </Col>
                </Row>
                <div className="text-center">
                  <Link href="/vendas">
                    <Button type="primary">Ver Relatório Completo</Button>
                  </Link>
                </div>
              </TabPane>
            </Tabs>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}

