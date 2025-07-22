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
  TrendingUpOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  UserOutlined,
  CalendarOutlined,
  BarChartOutlined,
  BookOutlined
} from '@ant-design/icons'
import AppLayout from '@/components/Layout/AppLayout'
import { getSales, getSalesStats, getProducts, Sale, Product } from '@/lib/api'

const { Title, Paragraph, Text } = Typography
const { TabPane } = Tabs
const { RangePicker } = DatePicker

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
  const [salesStats, setSalesStats] = useState<any>(null)

  // Simulated current user ID (in real app, get from auth context)
  const currentUserId = 1

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      await Promise.all([
        loadSalesStats(),
        loadRecentSales(),
        loadMyProducts()
      ])
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      message.error('Erro ao carregar dados do dashboard')
    } finally {
      setLoading(false)
    }
  }

  const loadSalesStats = async () => {
    try {
      const response = await getSalesStats({
        seller_id: currentUserId,
        days: 30
      })
      
      if (response.success && response.data) {
        setSalesStats(response.data)
        setStats({
          totalRevenue: response.data.totals.total_revenue,
          totalSales: response.data.totals.completed_sales,
          totalDownloads: response.data.totals.completed_sales * 1.2, // Estimate
          averageRating: 4.7, // Would come from user profile
          monthlyGrowth: 12.5 // Calculate from historical data
        })
      }
    } catch (error) {
      console.error('Error loading sales stats:', error)
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
      const response = await getSales({
        seller_id: currentUserId,
        page: 1,
        per_page: 10
      })
      
      if (response.success && response.data) {
        setRecentSales(response.data.sales)
      }
    } catch (error) {
      console.error('Error loading recent sales:', error)
      // Fallback to mock data
      const mockSales: Sale[] = [
        {
          id: 1,
          amount: 15.90,
          status: 'completed',
          paymentMethod: 'credit_card',
          transactionId: 'tx_123',
          product: { id: 1, title: 'Plano de Aula: Matemática Básica - Frações' },
          buyer: { id: 2, name: 'Ana Silva' },
          seller: { id: 1, name: 'Prof. Maria Silva' },
          createdAt: '2025-01-20T00:00:00Z',
          updatedAt: '2025-01-20T00:00:00Z'
        }
      ]
      setRecentSales(mockSales)
    } finally {
      setSalesLoading(false)
    }
  }

  const loadMyProducts = async () => {
    setProductsLoading(true)
    try {
      // In real implementation, filter by author_id
      const response = await getProducts({
        page: 1,
        per_page: 20
      })
      
      if (response.success && response.data) {
        setMyProducts(response.data.products)
      }
    } catch (error) {
      console.error('Error loading products:', error)
      // Fallback to mock data
      const mockProducts: Product[] = [
        {
          id: 1,
          title: 'Plano de Aula: Matemática Básica - Frações',
          description: 'Conjunto completo de atividades...',
          price: 15.90,
          category: 'Planos de Aula',
          subject: 'Matemática',
          gradeLevel: ['4º ano', '5º ano'],
          tags: ['Frações', 'Matemática'],
          status: 'active',
          downloadCount: 156,
          rating: 4.8,
          reviewCount: 24,
          totalRevenue: 2480.40,
          author: {
            id: 1,
            name: 'Prof. Maria Silva',
            email: 'maria@email.com',
            rating: 4.9
          },
          createdAt: '2025-01-10T00:00:00Z',
          updatedAt: '2025-01-10T00:00:00Z'
        }
      ]
      setMyProducts(mockProducts)
    } finally {
      setProductsLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const salesColumns = [
    {
      title: 'Produto',
      dataIndex: ['product', 'title'],
      key: 'productTitle',
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: 'Comprador',
      dataIndex: ['buyer', 'name'],
      key: 'buyerName',
      render: (text: string) => (
        <div className="flex items-center space-x-2">
          <Avatar size="small" icon={<UserOutlined />} />
          <span>{text}</span>
        </div>
      )
    },
    {
      title: 'Valor',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => <Text strong>{formatCurrency(amount)}</Text>
    },
    {
      title: 'Data',
      dataIndex: 'createdAt',
      key: 'date',
      render: (date: string) => formatDate(date)
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors = {
          completed: 'green',
          pending: 'orange',
          cancelled: 'red'
        }
        const labels = {
          completed: 'Concluído',
          pending: 'Pendente',
          cancelled: 'Cancelado'
        }
        return <Tag color={colors[status as keyof typeof colors]}>{labels[status as keyof typeof labels]}</Tag>
      }
    }
  ]

  const productsColumns = [
    {
      title: 'Produto',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <Text strong className="line-clamp-2">{text}</Text>
    },
    {
      title: 'Preço',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => formatCurrency(price)
    },
    {
      title: 'Downloads',
      dataIndex: 'downloadCount',
      key: 'downloads',
      render: (downloads: number) => (
        <div className="flex items-center space-x-1">
          <DownloadOutlined />
          <span>{downloads}</span>
        </div>
      )
    },
    {
      title: 'Avaliação',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number, record: Product) => (
        <div className="flex items-center space-x-2">
          <Rate disabled defaultValue={rating} allowHalf className="text-sm" />
          <Text className="text-gray-500">({record.reviewCount})</Text>
        </div>
      )
    },
    {
      title: 'Receita',
      dataIndex: 'totalRevenue',
      key: 'revenue',
      render: (revenue: number) => <Text strong>{formatCurrency(revenue)}</Text>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors = {
          active: 'green',
          draft: 'orange',
          inactive: 'red'
        }
        const labels = {
          active: 'Ativo',
          draft: 'Rascunho',
          inactive: 'Inativo'
        }
        return <Tag color={colors[status as keyof typeof colors]}>{labels[status as keyof typeof labels]}</Tag>
      }
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (record: Product) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} size="small" />
          <Button type="text" icon={<EditOutlined />} size="small" />
          <Button type="text" icon={<DeleteOutlined />} size="small" danger />
        </Space>
      )
    }
  ]

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={6}>
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
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Total de Vendas"
              value={stats.totalSales}
              valueStyle={{ color: '#1890ff' }}
              prefix={<ShopOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Downloads"
              value={stats.totalDownloads}
              valueStyle={{ color: '#722ed1' }}
              prefix={<DownloadOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Avaliação Média"
              value={stats.averageRating}
              precision={1}
              valueStyle={{ color: '#faad14' }}
              prefix={<StarOutlined />}
              suffix="/5"
            />
          </Card>
        </Col>
      </Row>

      {/* Growth Card */}
      <Card>
        <Row gutter={24} align="middle">
          <Col xs={24} sm={12}>
            <Statistic
              title="Crescimento Mensal"
              value={stats.monthlyGrowth}
              precision={1}
              valueStyle={{ color: '#3f8600' }}
              prefix={<TrendingUpOutlined />}
              suffix="%"
            />
            <Progress 
              percent={stats.monthlyGrowth} 
              strokeColor="#3f8600" 
              showInfo={false}
              className="mt-2"
            />
          </Col>
          <Col xs={24} sm={12}>
            <div className="text-center">
              <BarChartOutlined className="text-4xl text-blue-600 mb-2" />
              <Paragraph className="text-gray-600">
                Seus materiais estão performando bem! Continue criando conteúdo de qualidade.
              </Paragraph>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Recent Sales */}
      <Card 
        title="Vendas Recentes" 
        extra={
          <Button type="link" icon={<EyeOutlined />}>
            Ver Todas
          </Button>
        }
      >
        <Spin spinning={salesLoading}>
          <List
            dataSource={recentSales.slice(0, 5)}
            renderItem={(sale) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={sale.product.title}
                  description={`Comprado por ${sale.buyer.name} em ${formatDate(sale.createdAt)}`}
                />
                <div className="text-right">
                  <Text strong className="text-green-600">{formatCurrency(sale.amount)}</Text>
                  <br />
                  <Tag color={sale.status === 'completed' ? 'green' : 'orange'}>
                    {sale.status === 'completed' ? 'Concluído' : 'Pendente'}
                  </Tag>
                </div>
              </List.Item>
            )}
          />
        </Spin>
      </Card>
    </div>
  )

  const SalesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Title level={4}>Histórico de Vendas</Title>
        <Space>
          <RangePicker />
          <Select defaultValue="all" style={{ width: 120 }}>
            <Select.Option value="all">Todos</Select.Option>
            <Select.Option value="completed">Concluídos</Select.Option>
            <Select.Option value="pending">Pendentes</Select.Option>
          </Select>
        </Space>
      </div>
      
      <Card>
        <Table
          dataSource={recentSales}
          columns={salesColumns}
          rowKey="id"
          loading={salesLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} vendas`
          }}
        />
      </Card>
    </div>
  )

  const ProductsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Title level={4}>Meus Produtos</Title>
        <Button type="primary" icon={<PlusOutlined />}>
          Novo Produto
        </Button>
      </div>
      
      <Card>
        <Table
          dataSource={myProducts}
          columns={productsColumns}
          rowKey="id"
          loading={productsLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} produtos`
          }}
        />
      </Card>
    </div>
  )

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Title level={2}>Dashboard</Title>
          <Paragraph className="text-lg text-gray-600">
            Gerencie seus produtos e acompanhe suas vendas
          </Paragraph>
        </div>

        {/* Tabs */}
        <Card>
          <Spin spinning={loading}>
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane 
                tab={
                  <span>
                    <BarChartOutlined />
                    Visão Geral
                  </span>
                } 
                key="overview"
              >
                <OverviewTab />
              </TabPane>
              
              <TabPane 
                tab={
                  <span>
                    <ShopOutlined />
                    Vendas
                    <Badge count={recentSales.length} className="ml-2" />
                  </span>
                } 
                key="sales"
              >
                <SalesTab />
              </TabPane>
              
              <TabPane 
                tab={
                  <span>
                    <BookOutlined />
                    Produtos
                    <Badge count={myProducts.length} className="ml-2" />
                  </span>
                } 
                key="products"
              >
                <ProductsTab />
              </TabPane>
            </Tabs>
          </Spin>
        </Card>
      </div>
    </AppLayout>
  )
}

