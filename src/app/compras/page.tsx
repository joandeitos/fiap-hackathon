'use client'

import { useState, useEffect } from 'react'
import { 
  Typography, 
  Card, 
  List, 
  Row, 
  Col, 
  Button,
  Tag,
  Rate,
  Avatar,
  Space,
  message,
  Spin,
  Modal,
  Input
} from 'antd'
import { 
  DownloadOutlined,
  EyeOutlined,
  StarOutlined,
  UserOutlined,
  CalendarOutlined,
  DollarOutlined
} from '@ant-design/icons'
import Link from 'next/link'
import AppLayout from '@/components/Layout/AppLayout'

const { Title, Paragraph } = Typography
const { TextArea } = Input

interface Purchase {
  id: number
  productTitle: string
  productDescription: string
  authorName: string
  authorAvatar?: string
  amount: number
  purchaseDate: string
  category: string
  downloadCount: number
  userRating?: number
  userReview?: string
  status: 'completed' | 'processing' | 'failed'
}

export default function ComprasPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewModalVisible, setReviewModalVisible] = useState(false)
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewText, setReviewText] = useState('')

  // Dados mock de compras
  const mockPurchases: Purchase[] = [
    {
      id: 1,
      productTitle: 'Jogos Matemáticos para Ensino Fundamental',
      productDescription: 'Conjunto completo de jogos educativos para ensinar matemática de forma divertida',
      authorName: 'Prof. Maria Silva',
      authorAvatar: undefined,
      amount: 25.00,
      purchaseDate: '2025-01-20',
      category: 'Matemática',
      downloadCount: 3,
      userRating: 5,
      userReview: 'Excelente material! Meus alunos adoraram os jogos.',
      status: 'completed'
    },
    {
      id: 2,
      productTitle: 'Planos de Aula - História do Brasil',
      productDescription: 'Planos detalhados sobre a história do Brasil para ensino médio',
      authorName: 'Prof. João Santos',
      authorAvatar: undefined,
      amount: 30.00,
      purchaseDate: '2025-01-18',
      category: 'História',
      downloadCount: 1,
      userRating: 4,
      userReview: 'Muito bom, mas poderia ter mais atividades práticas.',
      status: 'completed'
    },
    {
      id: 3,
      productTitle: 'Experimentos de Química - Ensino Médio',
      productDescription: 'Roteiros de experimentos práticos para aulas de química',
      authorName: 'Prof. Ana Costa',
      authorAvatar: undefined,
      amount: 35.00,
      purchaseDate: '2025-01-15',
      category: 'Ciências',
      downloadCount: 2,
      status: 'completed'
    },
    {
      id: 4,
      productTitle: 'Atividades de Português - Interpretação',
      productDescription: 'Exercícios variados de interpretação de texto',
      authorName: 'Prof. Carlos Lima',
      authorAvatar: undefined,
      amount: 20.00,
      purchaseDate: '2025-01-12',
      category: 'Português',
      downloadCount: 0,
      status: 'processing'
    }
  ]

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        setLoading(true)
        // Simular carregamento da API
        await new Promise(resolve => setTimeout(resolve, 1000))
        setPurchases(mockPurchases)
        message.info('Exibindo histórico de compras')
      } catch (error) {
        console.error('Erro ao carregar compras:', error)
        setPurchases(mockPurchases)
      } finally {
        setLoading(false)
      }
    }

    fetchPurchases()
  }, [])

  const handleDownload = (purchase: Purchase) => {
    message.success(`Download iniciado: ${purchase.productTitle}`)
    // Aqui seria implementado o download real
  }

  const handleReview = (purchase: Purchase) => {
    setSelectedPurchase(purchase)
    setReviewRating(purchase.userRating || 0)
    setReviewText(purchase.userReview || '')
    setReviewModalVisible(true)
  }

  const handleSubmitReview = () => {
    if (selectedPurchase) {
      // Atualizar a avaliação localmente
      const updatedPurchases = purchases.map(p => 
        p.id === selectedPurchase.id 
          ? { ...p, userRating: reviewRating, userReview: reviewText }
          : p
      )
      setPurchases(updatedPurchases)
      message.success('Avaliação salva com sucesso!')
      setReviewModalVisible(false)
      setSelectedPurchase(null)
      setReviewRating(0)
      setReviewText('')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'green'
      case 'processing': return 'orange'
      case 'failed': return 'red'
      default: return 'default'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluída'
      case 'processing': return 'Processando'
      case 'failed': return 'Falhou'
      default: return 'Desconhecido'
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Spin size="large" />
        </div>
      </AppLayout>
    )
  }

  const totalSpent = purchases
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0)

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <Title level={2}>Minhas Compras</Title>
            <p className="text-gray-600">Histórico de materiais adquiridos</p>
          </div>

          {/* Resumo */}
          <Row gutter={[24, 24]} className="mb-8">
            <Col xs={24} sm={8}>
              <Card>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {purchases.filter(p => p.status === 'completed').length}
                  </div>
                  <div className="text-gray-600">Materiais Adquiridos</div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    R$ {totalSpent.toFixed(2)}
                  </div>
                  <div className="text-gray-600">Total Investido</div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {purchases.reduce((sum, p) => sum + p.downloadCount, 0)}
                  </div>
                  <div className="text-gray-600">Downloads Realizados</div>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Lista de Compras */}
          <Card>
            <List
              itemLayout="vertical"
              size="large"
              pagination={{
                pageSize: 5,
                showSizeChanger: true,
                showQuickJumper: true
              }}
              dataSource={purchases}
              renderItem={(purchase) => (
                <List.Item
                  key={purchase.id}
                  actions={[
                    <Space key="actions">
                      {purchase.status === 'completed' && (
                        <Button 
                          type="primary" 
                          icon={<DownloadOutlined />}
                          onClick={() => handleDownload(purchase)}
                        >
                          Download
                        </Button>
                      )}
                      <Link href={`/produtos/${purchase.id}`}>
                        <Button icon={<EyeOutlined />}>
                          Ver Detalhes
                        </Button>
                      </Link>
                      {purchase.status === 'completed' && (
                        <Button 
                          icon={<StarOutlined />}
                          onClick={() => handleReview(purchase)}
                        >
                          {purchase.userRating ? 'Editar Avaliação' : 'Avaliar'}
                        </Button>
                      )}
                    </Space>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        src={purchase.authorAvatar} 
                        icon={<UserOutlined />}
                        size={64}
                      />
                    }
                    title={
                      <div className="flex justify-between items-start">
                        <span className="text-lg font-medium">{purchase.productTitle}</span>
                        <Tag color={getStatusColor(purchase.status)}>
                          {getStatusText(purchase.status)}
                        </Tag>
                      </div>
                    }
                    description={
                      <div className="space-y-2">
                        <Paragraph className="text-gray-600 mb-2">
                          {purchase.productDescription}
                        </Paragraph>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <span>
                            <UserOutlined className="mr-1" />
                            {purchase.authorName}
                          </span>
                          <span>
                            <CalendarOutlined className="mr-1" />
                            {purchase.purchaseDate}
                          </span>
                          <span>
                            <DollarOutlined className="mr-1" />
                            R$ {purchase.amount.toFixed(2)}
                          </span>
                          <Tag color="blue">{purchase.category}</Tag>
                        </div>
                        {purchase.downloadCount > 0 && (
                          <div className="text-sm text-gray-500">
                            <DownloadOutlined className="mr-1" />
                            {purchase.downloadCount} download(s) realizados
                          </div>
                        )}
                        {purchase.userRating && (
                          <div className="flex items-center space-x-2">
                            <Rate disabled defaultValue={purchase.userRating} size="small" />
                            <span className="text-sm text-gray-500">
                              Sua avaliação: {purchase.userRating}/5
                            </span>
                          </div>
                        )}
                        {purchase.userReview && (
                          <div className="bg-gray-50 p-3 rounded-lg mt-2">
                            <div className="text-sm font-medium text-gray-700 mb-1">
                              Sua avaliação:
                            </div>
                            <div className="text-sm text-gray-600">
                              &quot;{purchase.userReview}&quot;
                            </div>
                          </div>
                        )}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>

          {/* Modal de Avaliação */}
          <Modal
            title="Avaliar Material"
            open={reviewModalVisible}
            onOk={handleSubmitReview}
            onCancel={() => {
              setReviewModalVisible(false)
              setSelectedPurchase(null)
              setReviewRating(0)
              setReviewText('')
            }}
            okText="Salvar Avaliação"
            cancelText="Cancelar"
          >
            {selectedPurchase && (
              <div className="space-y-4">
                <div>
                  <Title level={5}>{selectedPurchase.productTitle}</Title>
                  <Paragraph className="text-gray-600">
                    por {selectedPurchase.authorName}
                  </Paragraph>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sua avaliação:
                  </label>
                  <Rate 
                    value={reviewRating} 
                    onChange={setReviewRating}
                    allowHalf
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comentário (opcional):
                  </label>
                  <TextArea
                    rows={4}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Compartilhe sua experiência com este material..."
                    maxLength={500}
                    showCount
                  />
                </div>
              </div>
            )}
          </Modal>
        </div>
      </div>
    </AppLayout>
  )
}

