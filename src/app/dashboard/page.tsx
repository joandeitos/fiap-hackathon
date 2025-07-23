'use client'

import React, { useState, useEffect } from 'react'
import { 
  Row, 
  Col, 
  Card, 
  Statistic, 
  Table, 
  Button, 
  Typography, 
  Space,
  Tag,
  Avatar,
  Progress,
  Tabs,
  List,
  Rate,
  Badge,
  Select,
  DatePicker,
  Spin,
  message
} from 'antd'
import { 
  DollarOutlined,
  ShopOutlined,
  DownloadOutlined,
  StarOutlined,
  RiseOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  UserOutlined,
  BarChartOutlined,
  BookOutlined
} from '@ant-design/icons'
import AppLayout from '@/components/Layout/AppLayout'
import { getUserSales, getProducts, Product } from '@/lib/api'

const { Title, Paragraph, Text } = Typography
const { TabPane } = Tabs
const { RangePicker } = DatePicker

interface Sale {
  id: string
  amount: number
  status: string
  payment_method: string
  transaction_id?: string
  product?: Product
  buyer_id: string
  seller_id: string
  created_at: string
  updated_at: string
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [userType] = useState<'seller' | 'buyer'>('seller') // Simular tipo de usuário
  const [loading, setLoading] = useState(false)
  const [salesLoading, setSalesLoading] = useState(false)
  const [productsLoading, setProductsLoading] = useState(false)
  
  // Data states
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalSales: 0,
    totalDownloads: 0,
    averageRating: 0,
    monthlyGrowth: 0
  })
  const [recentSales, setRecentSales] = useState<Sale[]>([])
  const [myProducts, setMyProducts] = useState<Product[]>([])

  // Simulated current user ID (in real app, get from auth context)
  const currentUserId = '550e8400-e29b-41d4-a716-446655440001'

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      await Promise.all([
        loadRecentSales(),
        loadMyProducts(),
        loadStats()
      ])
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      message.error('Erro ao carregar dados do dashboard')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      // Calculate stats from sales and products data
      const salesResponse = await getUserSales(currentUserId)
      const productsResponse = await getProducts({ author_id: currentUserId })
      
      let totalRevenue = 0
      let totalSales = 0
      let totalDownloads = 0
      
      if (salesResponse.success && salesResponse.data) {
        const sales = salesResponse.data
        totalSales = sales.length
        totalRevenue = sales.reduce((sum: number, sale: Sale) => sum + sale.amount, 0)
      }
      
      if (productsResponse.success && productsResponse.data) {
        const products = productsResponse.data.items || []
        totalDownloads = products.reduce((sum: number, product: Product) => sum + (product.download_count || 0), 0)
      }
      
      setStats({
        totalRevenue,
        totalSales,
        totalDownloads,
        averageRating: 4.7, // Would come from user profile
        monthlyGrowth: 12.5 // Calculate from historical data
      })
    } catch (error) {
      console.error('Error loading stats:', error)
      // Fallback to mock data
      setStats({
        totalRevenue: 2450.80,
        totalSales: 156,
        totalDownloads: 1240,
        averageRating: 4.7,
        monthlyGrowth: 12.5
      })
    }
  }

  const loadRecentSales = async () => {
    setSalesLoading(true)
    try {
      const response = await getUserSales(currentUserId)
      
      if (response.success && response.data) {
        setRecentSales(response.data.slice(0, 10)) // Get last 10 sales
      }
    } catch (error) {
      console.error('Error loading recent sales:', error)
      setRecentSales([])
    } finally {
      setSalesLoading(false)
    }
  }

  const loadMyProducts = async () => {
    setProductsLoading(true)
    try {
      const response = await getProducts({ author_id: currentUserId })
      
      if (response.success && response.data) {
        setMyProducts(response.data.items || [])
      }
    } catch (error) {
      console.error('Error loading products:', error)
      setMyProducts([])
    } finally {
      setProductsLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'green'
      case 'pending': return 'orange'
      case 'cancelled': return 'red'
      default: return 'default'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluída'
      case 'pending': return 'Pendente'
      case 'cancelled': return 'Cancelada'
      default: return status
    }
  }

  const salesColumns = [
    {
      title: 'Produto',
      dataIndex: 'product',
      key: 'product',
      render: (product: Product) => (
        <div>
          <Text strong>{product?.title || 'Produto não encontrado'}</Text>
        </div>
      )
    },
    {
      title: 'Valor',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <Text strong className="text-green-600">
          {formatPrice(amount)}
        </Text>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      )
    },
    {
      title: 'Data',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => formatDate(date)
    }
  ]

  const productsColumns = [
    {
      title: 'Produto',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, record: Product) => (
        <div>
          <Text strong>{title}</Text>
          <br />
          <Text className="text-sm text-gray-500">{record.category}</Text>
        </div>
      )
    },
    {
      title: 'Preço',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => formatPrice(price)
    },
    {
      title: 'Downloads',
      dataIndex: 'download_count',
      key: 'download_count',
      render: (count: number) => (
        <div className="flex items-center space-x-1">
          <DownloadOutlined />
          <Text>{count || 0}</Text>
        </div>
      )
    },
    {
      title: 'Avaliação',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number, record: Product) => (
        <div className="flex items-center space-x-1">
          <Rate disabled defaultValue={rating || 0} size="small" />
          <Text className="text-sm">({record.review_count || 0})</Text>
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'orange'}>
          {status === 'active' ? 'Ativo' : 'Inativo'}
        </Tag>
      )
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (record: Product) => (
        <Space>
          <Button 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => {
              window.open(`/produtos/${record.id}`, '_blank')
            }}
          />
          <Button 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => {
              message.info('Funcionalidade de edição em desenvolvimento')
            }}
          />
          <Button 
            size="small" 
            icon={<DeleteOutlined />} 
            danger
            onClick={() => {
              message.info('Funcionalidade de exclusão em desenvolvimento')
            }}
          />
        </Space>
      )
    }
  ]

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto py-8">
          <div className="text-center py-12">
            <Spin size="large" />
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Title level={2} className="mb-2">
                Dashboard
              </Title>
              <Paragraph className="text-gray-600">
                {userType === 'seller' 
                  ? 'Gerencie seus produtos e acompanhe suas vendas'
                  : 'Acompanhe suas compras e materiais favoritos'
                }
              </Paragraph>
            </div>
            <div className="flex items-center space-x-2">
              <Badge dot>
                <Avatar size="large" icon={<UserOutlined />} />
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <Row gutter={[24, 24]} className="mb-8">
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Receita Total"
                value={stats.totalRevenue}
                precision={2}
                valueStyle={{ color: '#3f8600' }}
                prefix={<DollarOutlined />}
                suffix="R$"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total de Vendas"
                value={stats.totalSales}
                valueStyle={{ color: '#1890ff' }}
                prefix={<ShopOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Downloads"
                value={stats.totalDownloads}
                valueStyle={{ color: '#722ed1' }}
                prefix={<DownloadOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Avaliação Média"
                value={stats.averageRating}
                precision={1}
                valueStyle={{ color: '#faad14' }}
                prefix={<StarOutlined />}
                suffix="/ 5"
              />
            </Card>
          </Col>
        </Row>

        {/* Main Content */}
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Visão Geral" key="overview">
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={16}>
                <Card 
                  title="Vendas Recentes" 
                  extra={
                    <Button 
                      type="link" 
                      icon={<BarChartOutlined />}
                      onClick={() => {
                        message.info('Relatório completo em desenvolvimento')
                      }}
                    >
                      Ver Relatório Completo
                    </Button>
                  }
                >
                  <Table
                    dataSource={recentSales}
                    columns={salesColumns}
                    loading={salesLoading}
                    pagination={false}
                    size="small"
                    rowKey="id"
                  />
                </Card>
              </Col>
              <Col xs={24} lg={8}>
                <Card title="Crescimento Mensal" className="mb-6">
                  <div className="text-center">
                    <Progress
                      type="circle"
                      percent={stats.monthlyGrowth}
                      format={(percent) => `+${percent}%`}
                      strokeColor="#52c41a"
                    />
                    <Paragraph className="mt-4 text-gray-600">
                      Comparado ao mês anterior
                    </Paragraph>
                  </div>
                </Card>
                
                <Card title="Produtos Mais Vendidos">
                  <List
                    dataSource={myProducts.slice(0, 5)}
                    renderItem={(product) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<BookOutlined className="text-blue-500" />}
                          title={<Text className="text-sm">{product.title}</Text>}
                          description={
                            <div className="flex justify-between">
                              <Text className="text-xs text-gray-500">
                                {product.download_count || 0} downloads
                              </Text>
                              <Text className="text-xs font-medium text-green-600">
                                {formatPrice(product.price)}
                              </Text>
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="Meus Produtos" key="products">
            <Card 
              title="Meus Produtos" 
              extra={
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => {
                    message.info('Funcionalidade de adicionar produto em desenvolvimento')
                  }}
                >
                  Novo Produto
                </Button>
              }
            >
              <Table
                dataSource={myProducts}
                columns={productsColumns}
                loading={productsLoading}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} de ${total} produtos`
                }}
              />
            </Card>
          </TabPane>

          <TabPane tab="Vendas" key="sales">
            <Card title="Histórico de Vendas">
              <div className="mb-4">
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} md={8}>
                    <Select
                      placeholder="Filtrar por status"
                      style={{ width: '100%' }}
                      allowClear
                    >
                      <Select.Option value="completed">Concluídas</Select.Option>
                      <Select.Option value="pending">Pendentes</Select.Option>
                      <Select.Option value="cancelled">Canceladas</Select.Option>
                    </Select>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <RangePicker style={{ width: '100%' }} />
                  </Col>
                </Row>
              </div>
              
              <Table
                dataSource={recentSales}
                columns={salesColumns}
                loading={salesLoading}
                rowKey="id"
                pagination={{
                  pageSize: 20,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} de ${total} vendas`
                }}
              />
            </Card>
          </TabPane>
        </Tabs>
      </div>
    </AppLayout>
  )
}

