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
  TrendingUpOutlined,
  DownloadOutlined,
  EyeOutlined,
  FilterOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import AppLayout from '@/components/Layout/AppLayout'
import { getSales } from '@/lib/api'

const { Title } = Typography
const { RangePicker } = DatePicker
const { Option } = Select

interface Sale {
  id: number
  productTitle: string
  buyerName: string
  amount: number
  date: string
  status: 'completed' | 'pending' | 'cancelled'
  paymentMethod: string
}

export default function VendasPage() {
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [filteredSales, setFilteredSales] = useState<Sale[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Dados mock de vendas
  const mockSales: Sale[] = [
    {
      id: 1,
      productTitle: 'Plano de Aula: Frações Divertidas',
      buyerName: 'Maria Santos',
      amount: 15.90,
      date: '2025-01-22',
      status: 'completed',
      paymentMethod: 'Cartão de Crédito'
    },
    {
      id: 2,
      productTitle: 'Atividades de Interpretação de Texto',
      buyerName: 'João Silva',
      amount: 22.50,
      date: '2025-01-21',
      status: 'completed',
      paymentMethod: 'PIX'
    },
    {
      id: 3,
      productTitle: 'Experimentos de Ciências - Sistema Solar',
      buyerName: 'Ana Costa',
      amount: 18.00,
      date: '2025-01-20',
      status: 'completed',
      paymentMethod: 'Cartão de Débito'
    },
    {
      id: 4,
      productTitle: 'Jogos Educativos - Tabuada',
      buyerName: 'Carlos Oliveira',
      amount: 12.90,
      date: '2025-01-19',
      status: 'pending',
      paymentMethod: 'Boleto'
    },
    {
      id: 5,
      productTitle: 'História do Brasil - Linha do Tempo',
      buyerName: 'Lucia Ferreira',
      amount: 25.00,
      date: '2025-01-18',
      status: 'completed',
      paymentMethod: 'PIX'
    },
    {
      id: 6,
      productTitle: 'Arte e Criatividade - Técnicas de Pintura',
      buyerName: 'Roberto Lima',
      amount: 20.00,
      date: '2025-01-17',
      status: 'cancelled',
      paymentMethod: 'Cartão de Crédito'
    }
  ]

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true)
        // Tentar buscar da API
        const response = await getSales()
        if (response.success && response.data.length > 0) {
          setSales(response.data)
          setFilteredSales(response.data)
        } else {
          // Usar dados mock se API falhar
          setSales(mockSales)
          setFilteredSales(mockSales)
        }
      } catch (error) {
        console.error('Erro ao carregar vendas:', error)
        // Usar dados mock em caso de erro
        setSales(mockSales)
        setFilteredSales(mockSales)
        message.info('Exibindo dados de exemplo')
      } finally {
        setLoading(false)
      }
    }

    fetchSales()
  }, [])

  // Filtrar vendas por status
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredSales(sales)
    } else {
      setFilteredSales(sales.filter(sale => sale.status === statusFilter))
    }
  }, [statusFilter, sales])

  // Calcular estatísticas
  const completedSales = sales.filter(sale => sale.status === 'completed')
  const totalRevenue = completedSales.reduce((sum, sale) => sum + sale.amount, 0)
  const totalSales = completedSales.length
  const averageTicket = totalSales > 0 ? totalRevenue / totalSales : 0

  const columns: ColumnsType<Sale> = [
    {
      title: 'Produto',
      dataIndex: 'productTitle',
      key: 'productTitle',
      render: (text: string) => (
        <div className="font-medium">{text}</div>
      )
    },
    {
      title: 'Comprador',
      dataIndex: 'buyerName',
      key: 'buyerName'
    },
    {
      title: 'Valor',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <span className="font-medium text-green-600">
          R$ {amount.toFixed(2)}
        </span>
      ),
      sorter: (a, b) => a.amount - b.amount
    },
    {
      title: 'Data',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
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
          completed: 'Concluída',
          pending: 'Pendente',
          cancelled: 'Cancelada'
        }
        return (
          <Tag color={colors[status as keyof typeof colors]}>
            {labels[status as keyof typeof labels]}
          </Tag>
        )
      },
      filters: [
        { text: 'Concluída', value: 'completed' },
        { text: 'Pendente', value: 'pending' },
        { text: 'Cancelada', value: 'cancelled' }
      ],
      onFilter: (value, record) => record.status === value
    },
    {
      title: 'Pagamento',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod'
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            icon={<EyeOutlined />} 
            size="small"
          >
            Detalhes
          </Button>
        </Space>
      )
    }
  ]

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Spin size="large" />
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <Title level={2}>Histórico de Vendas</Title>
            <p className="text-gray-600">Acompanhe suas vendas e receita</p>
          </div>

          {/* Estatísticas */}
          <Row gutter={[24, 24]} className="mb-8">
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Receita Total"
                  value={totalRevenue}
                  precision={2}
                  prefix="R$"
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<DollarOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Total de Vendas"
                  value={totalSales}
                  prefix={<ShoppingOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Ticket Médio"
                  value={averageTicket}
                  precision={2}
                  prefix="R$"
                  prefix={<TrendingUpOutlined />}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
          </Row>

          {/* Filtros */}
          <Card className="mb-6">
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={8}>
                <Space>
                  <FilterOutlined />
                  <span>Filtros:</span>
                </Space>
              </Col>
              <Col xs={24} sm={8}>
                <Select
                  placeholder="Status"
                  style={{ width: '100%' }}
                  value={statusFilter}
                  onChange={setStatusFilter}
                >
                  <Option value="all">Todos os Status</Option>
                  <Option value="completed">Concluídas</Option>
                  <Option value="pending">Pendentes</Option>
                  <Option value="cancelled">Canceladas</Option>
                </Select>
              </Col>
              <Col xs={24} sm={8}>
                <RangePicker style={{ width: '100%' }} />
              </Col>
            </Row>
          </Card>

          {/* Tabela de Vendas */}
          <Card>
            <Table
              columns={columns}
              dataSource={filteredSales}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} de ${total} vendas`
              }}
              scroll={{ x: 800 }}
            />
          </Card>

          {/* Ações Rápidas */}
          <Card className="mt-6">
            <Title level={4} className="mb-4">Ações Rápidas</Title>
            <Space wrap>
              <Button type="primary" icon={<DownloadOutlined />}>
                Exportar Relatório
              </Button>
              <Button icon={<EyeOutlined />}>
                Ver Análise Detalhada
              </Button>
              <Button>
                Configurar Notificações
              </Button>
            </Space>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}

