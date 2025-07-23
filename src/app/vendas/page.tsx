'use client'

import { useState, useEffect } from 'react'
import { 
  Typography, 
  Card, 
  Table, 
  Row, 
  Col, 
  Statistic, 
  DatePicker, 
  Select,
  Button,
  Tag,
  Space,
  message,
  Spin
} from 'antd'
import { 
  DollarOutlined,
  ShoppingOutlined,
  RiseOutlined,
  DownloadOutlined,
  EyeOutlined,
  FilterOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import AppLayout from '@/components/Layout/AppLayout'
import { getUserSales, Product } from '@/lib/api'

const { Title } = Typography
const { RangePicker } = DatePicker
const { Option } = Select

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

export default function VendasPage() {
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [filteredSales, setFilteredSales] = useState<Sale[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dateRange, setDateRange] = useState<[any, any] | null>(null)

  // Simulated current user ID (in real app, get from auth context)
  const currentUserId = '550e8400-e29b-41d4-a716-446655440001'

  useEffect(() => {
    loadSales()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [sales, statusFilter, dateRange])

  const loadSales = async () => {
    setLoading(true)
    try {
      const response = await getUserSales(currentUserId)
      
      if (response.success && response.data) {
        setSales(response.data)
      } else {
        message.error('Erro ao carregar vendas')
        setSales([])
      }
    } catch (error) {
      console.error('Error loading sales:', error)
      message.error('Erro ao conectar com o servidor')
      setSales([])
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...sales]

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(sale => sale.status === statusFilter)
    }

    // Filter by date range
    if (dateRange && dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0].startOf('day')
      const endDate = dateRange[1].endOf('day')
      
      filtered = filtered.filter(sale => {
        const saleDate = new Date(sale.created_at)
        return saleDate >= startDate.toDate() && saleDate <= endDate.toDate()
      })
    }

    setFilteredSales(filtered)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'green'
      case 'pending': return 'orange'
      case 'cancelled': return 'red'
      case 'refunded': return 'purple'
      default: return 'default'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluída'
      case 'pending': return 'Pendente'
      case 'cancelled': return 'Cancelada'
      case 'refunded': return 'Reembolsada'
      default: return status
    }
  }

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'credit_card': return 'Cartão de Crédito'
      case 'debit_card': return 'Cartão de Débito'
      case 'pix': return 'PIX'
      case 'bank_transfer': return 'Transferência Bancária'
      default: return method
    }
  }

  // Calculate statistics
  const totalRevenue = filteredSales
    .filter(sale => sale.status === 'completed')
    .reduce((sum, sale) => sum + sale.amount, 0)
  
  const totalSales = filteredSales.filter(sale => sale.status === 'completed').length
  const pendingSales = filteredSales.filter(sale => sale.status === 'pending').length
  const averageSaleValue = totalSales > 0 ? totalRevenue / totalSales : 0

  const columns: ColumnsType<Sale> = [
    {
      title: 'Produto',
      key: 'product',
      render: (record: Sale) => (
        <div>
          <div className="font-medium">
            {record.product?.title || 'Produto não encontrado'}
          </div>
          <div className="text-sm text-gray-500">
            {record.product?.category}
          </div>
        </div>
      )
    },
    {
      title: 'Valor',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <span className="font-semibold text-green-600">
          {formatPrice(amount)}
        </span>
      ),
      sorter: (a, b) => a.amount - b.amount
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
      filters: [
        { text: 'Concluída', value: 'completed' },
        { text: 'Pendente', value: 'pending' },
        { text: 'Cancelada', value: 'cancelled' },
        { text: 'Reembolsada', value: 'refunded' }
      ],
      onFilter: (value, record) => record.status === value
    },
    {
      title: 'Pagamento',
      dataIndex: 'payment_method',
      key: 'payment_method',
      render: (method: string) => getPaymentMethodText(method)
    },
    {
      title: 'Data',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => formatDate(date),
      sorter: (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      defaultSortOrder: 'descend'
    },
    {
      title: 'ID Transação',
      dataIndex: 'transaction_id',
      key: 'transaction_id',
      render: (id: string) => (
        <span className="text-xs text-gray-500 font-mono">
          {id || 'N/A'}
        </span>
      )
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (record: Sale) => (
        <Space>
          <Button 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => {
              // Navigate to sale details
              message.info('Funcionalidade em desenvolvimento')
            }}
          >
            Detalhes
          </Button>
        </Space>
      )
    }
  ]

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <Title level={2} className="mb-2">
            Minhas Vendas
          </Title>
          <p className="text-gray-600">
            Acompanhe o histórico de vendas dos seus materiais educacionais
          </p>
        </div>

        {/* Statistics Cards */}
        <Row gutter={[24, 24]} className="mb-8">
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Receita Total"
                value={totalRevenue}
                precision={2}
                valueStyle={{ color: '#3f8600' }}
                prefix={<DollarOutlined />}
                formatter={(value) => formatPrice(Number(value))}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Vendas Concluídas"
                value={totalSales}
                valueStyle={{ color: '#1890ff' }}
                prefix={<ShoppingOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Vendas Pendentes"
                value={pendingSales}
                valueStyle={{ color: '#faad14' }}
                prefix={<RiseOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Ticket Médio"
                value={averageSaleValue}
                precision={2}
                valueStyle={{ color: '#722ed1' }}
                prefix={<DownloadOutlined />}
                formatter={(value) => formatPrice(Number(value))}
              />
            </Card>
          </Col>
        </Row>

        {/* Filters */}
        <Card className="mb-6">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={8} md={6}>
              <Select
                placeholder="Filtrar por status"
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: '100%' }}
              >
                <Option value="all">Todos os Status</Option>
                <Option value="completed">Concluídas</Option>
                <Option value="pending">Pendentes</Option>
                <Option value="cancelled">Canceladas</Option>
                <Option value="refunded">Reembolsadas</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <RangePicker
                placeholder={['Data inicial', 'Data final']}
                value={dateRange}
                onChange={setDateRange}
                style={{ width: '100%' }}
                format="DD/MM/YYYY"
              />
            </Col>
            <Col xs={24} sm={4} md={4}>
              <Button
                icon={<FilterOutlined />}
                onClick={() => {
                  setStatusFilter('all')
                  setDateRange(null)
                }}
              >
                Limpar
              </Button>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className="text-right">
                <span className="text-gray-600">
                  {filteredSales.length} {filteredSales.length === 1 ? 'venda' : 'vendas'}
                </span>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Sales Table */}
        <Card>
          <Table
            columns={columns}
            dataSource={filteredSales}
            loading={loading}
            rowKey="id"
            pagination={{
              pageSize: 20,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} de ${total} vendas`,
              pageSizeOptions: ['10', '20', '50', '100']
            }}
            scroll={{ x: 800 }}
            locale={{
              emptyText: loading ? (
                <div className="py-8">
                  <Spin size="large" />
                </div>
              ) : (
                <div className="py-8 text-center">
                  <ShoppingOutlined className="text-4xl text-gray-300 mb-4" />
                  <div className="text-gray-500">
                    {statusFilter === 'all' 
                      ? 'Nenhuma venda encontrada'
                      : `Nenhuma venda ${getStatusText(statusFilter).toLowerCase()} encontrada`
                    }
                  </div>
                </div>
              )
            }}
          />
        </Card>
      </div>
    </AppLayout>
  )
}

