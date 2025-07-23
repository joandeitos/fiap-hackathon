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
  Input,
  Form
} from 'antd'
import { 
  DownloadOutlined,
  EyeOutlined,
  StarOutlined,
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  ShoppingOutlined
} from '@ant-design/icons'
import Link from 'next/link'
import AppLayout from '@/components/Layout/AppLayout'
import { getUserSales, createReview, Product } from '@/lib/api'

const { Title, Paragraph } = Typography
const { TextArea } = Input

interface Purchase {
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

export default function ComprasPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewModalVisible, setReviewModalVisible] = useState(false)
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null)
  const [submittingReview, setSubmittingReview] = useState(false)
  const [form] = Form.useForm()

  // Simulated current user ID (in real app, get from auth context)
  const currentUserId = '550e8400-e29b-41d4-a716-446655440007'

  useEffect(() => {
    loadPurchases()
  }, [])

  const loadPurchases = async () => {
    setLoading(true)
    try {
      // Get purchases where current user is the buyer
      const response = await getUserSales(currentUserId, 'buyer')
      
      if (response.success && response.data) {
        setPurchases(response.data)
      } else {
        message.error('Erro ao carregar compras')
        setPurchases([])
      }
    } catch (error) {
      console.error('Error loading purchases:', error)
      message.error('Erro ao conectar com o servidor')
      setPurchases([])
    } finally {
      setLoading(false)
    }
  }

  const handleReview = (purchase: Purchase) => {
    setSelectedPurchase(purchase)
    setReviewModalVisible(true)
  }

  const handleSubmitReview = async (values: any) => {
    if (!selectedPurchase?.product) return
    
    setSubmittingReview(true)
    try {
      const response = await createReview({
        product_id: selectedPurchase.product.id,
        user_id: currentUserId,
        rating: values.rating,
        comment: values.comment
      })
      
      if (response.success) {
        message.success('Avaliação enviada com sucesso!')
        setReviewModalVisible(false)
        form.resetFields()
        setSelectedPurchase(null)
        // Reload purchases to get updated data
        loadPurchases()
      } else {
        message.error(response.error || 'Erro ao enviar avaliação')
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      message.error('Erro ao enviar avaliação')
    } finally {
      setSubmittingReview(false)
    }
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
      year: 'numeric'
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
      case 'pending': return 'Processando'
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
  const completedPurchases = purchases.filter(p => p.status === 'completed')
  const totalSpent = completedPurchases.reduce((sum, purchase) => sum + purchase.amount, 0)
  const totalMaterials = completedPurchases.length

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-6xl mx-auto py-8">
          <div className="text-center py-12">
            <Spin size="large" />
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <Title level={2} className="mb-2">
            Minhas Compras
          </Title>
          <Paragraph className="text-gray-600">
            Acesse e gerencie todos os materiais educacionais que você adquiriu
          </Paragraph>
        </div>

        {/* Statistics */}
        <Row gutter={[24, 24]} className="mb-8">
          <Col xs={24} sm={8}>
            <Card>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <ShoppingOutlined className="text-2xl text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{totalMaterials}</div>
                  <div className="text-gray-600">Materiais Adquiridos</div>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <DollarOutlined className="text-2xl text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{formatPrice(totalSpent)}</div>
                  <div className="text-gray-600">Total Investido</div>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <DownloadOutlined className="text-2xl text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {completedPurchases.reduce((sum, p) => sum + (p.product?.download_count || 0), 0)}
                  </div>
                  <div className="text-gray-600">Downloads Disponíveis</div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Purchases List */}
        <Card>
          {purchases.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingOutlined className="text-6xl text-gray-300 mb-4" />
              <Title level={4} className="text-gray-500">
                Nenhuma compra encontrada
              </Title>
              <Paragraph className="text-gray-400 mb-6">
                Você ainda não adquiriu nenhum material educacional
              </Paragraph>
              <Link href="/produtos">
                <Button type="primary" size="large">
                  Explorar Materiais
                </Button>
              </Link>
            </div>
          ) : (
            <List
              itemLayout="vertical"
              dataSource={purchases}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} de ${total} compras`
              }}
              renderItem={(purchase) => (
                <List.Item
                  key={purchase.id}
                  actions={[
                    <Space key="actions">
                      {purchase.status === 'completed' && (
                        <>
                          <Button 
                            type="primary" 
                            icon={<DownloadOutlined />}
                            onClick={() => {
                              message.success('Download iniciado!')
                            }}
                          >
                            Download
                          </Button>
                          <Button 
                            icon={<StarOutlined />}
                            onClick={() => handleReview(purchase)}
                          >
                            Avaliar
                          </Button>
                        </>
                      )}
                      <Link href={`/produtos/${purchase.product?.id}`}>
                        <Button icon={<EyeOutlined />}>
                          Ver Detalhes
                        </Button>
                      </Link>
                    </Space>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                        <UserOutlined className="text-2xl text-gray-400" />
                      </div>
                    }
                    title={
                      <div className="flex items-center justify-between">
                        <div>
                          <Link href={`/produtos/${purchase.product?.id}`}>
                            <span className="text-lg font-semibold hover:text-blue-600">
                              {purchase.product?.title || 'Produto não encontrado'}
                            </span>
                          </Link>
                          <div className="flex items-center space-x-2 mt-1">
                            <Tag color={getStatusColor(purchase.status)}>
                              {getStatusText(purchase.status)}
                            </Tag>
                            <Tag color="blue">{purchase.product?.category}</Tag>
                            <Tag color="green">{purchase.product?.subject}</Tag>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-green-600">
                            {formatPrice(purchase.amount)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {getPaymentMethodText(purchase.payment_method)}
                          </div>
                        </div>
                      </div>
                    }
                    description={
                      <div className="mt-3">
                        <Paragraph className="text-gray-600 mb-3">
                          {purchase.product?.description}
                        </Paragraph>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Avatar size="small" icon={<UserOutlined />} />
                              <span className="text-sm text-gray-600">
                                {purchase.product?.author?.name}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              <CalendarOutlined className="text-gray-400" />
                              <span className="text-sm text-gray-600">
                                Comprado em {formatDate(purchase.created_at)}
                              </span>
                            </div>
                            
                            {purchase.product?.rating && (
                              <div className="flex items-center space-x-1">
                                <Rate 
                                  disabled 
                                  defaultValue={purchase.product.rating} 
                                  size="small" 
                                />
                                <span className="text-sm text-gray-600">
                                  ({purchase.product.review_count})
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <DownloadOutlined className="text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {purchase.product?.download_count || 0} downloads
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </Card>

        {/* Review Modal */}
        <Modal
          title="Avaliar Material"
          open={reviewModalVisible}
          onCancel={() => {
            setReviewModalVisible(false)
            setSelectedPurchase(null)
            form.resetFields()
          }}
          footer={null}
          width={600}
        >
          {selectedPurchase && (
            <div className="mb-6">
              <Title level={5}>{selectedPurchase.product?.title}</Title>
              <Paragraph className="text-gray-600">
                Como foi sua experiência com este material?
              </Paragraph>
            </div>
          )}
          
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmitReview}
          >
            <Form.Item
              name="rating"
              label="Avaliação"
              rules={[{ required: true, message: 'Por favor, dê uma nota!' }]}
            >
              <Rate />
            </Form.Item>

            <Form.Item
              name="comment"
              label="Comentário"
              rules={[{ required: true, message: 'Por favor, escreva um comentário!' }]}
            >
              <TextArea
                rows={4}
                placeholder="Compartilhe sua experiência com este material. Como ele te ajudou? O que mais gostou?"
              />
            </Form.Item>

            <Form.Item className="mb-0">
              <div className="flex justify-end space-x-2">
                <Button 
                  onClick={() => {
                    setReviewModalVisible(false)
                    setSelectedPurchase(null)
                    form.resetFields()
                  }}
                >
                  Cancelar
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  loading={submittingReview}
                >
                  Enviar Avaliação
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AppLayout>
  )
}

