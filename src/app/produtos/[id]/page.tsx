'use client'

import React, { useState, useEffect } from 'react'
import { 
  Row, 
  Col, 
  Card, 
  Button, 
  Tag, 
  Rate, 
  Typography, 
  Space,
  Avatar,
  Divider,
  List,
  Spin,
  message,
  Modal,
  Form,
  Input,
  Statistic
} from 'antd'
import { 
  DownloadOutlined,
  StarOutlined,
  UserOutlined,
  BookOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
  ShareAltOutlined,
  CalendarOutlined,
  EyeOutlined
} from '@ant-design/icons'
import { useParams } from 'next/navigation'
import AppLayout from '@/components/Layout/AppLayout'
import { getProduct, createSale, createReview, Product, Review } from '@/lib/api'

const { Title, Paragraph, Text } = Typography
const { TextArea } = Input

export default function ProductDetailPage() {
  const params = useParams()
  const productId = parseInt(params.id as string)
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [reviewModalVisible, setReviewModalVisible] = useState(false)
  const [submittingReview, setSubmittingReview] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    if (productId) {
      loadProduct()
    }
  }, [productId])

  const loadProduct = async () => {
    setLoading(true)
    try {
      const response = await getProduct(productId)
      
      if (response.success && response.data) {
        setProduct(response.data)
      } else {
        message.error('Produto não encontrado')
      }
    } catch (error) {
      console.error('Error loading product:', error)
      message.error('Erro ao carregar produto')
      
      // Fallback to mock data
      const mockProduct: Product = {
        id: productId,
        title: 'Plano de Aula: Matemática Básica - Frações',
        description: 'Conjunto completo de atividades para ensinar frações de forma lúdica e interativa. Inclui exercícios práticos, jogos educativos e avaliações formativas. Este material foi desenvolvido com base em anos de experiência em sala de aula e testado com centenas de alunos.',
        price: 15.90,
        category: 'Planos de Aula',
        subject: 'Matemática',
        gradeLevel: ['4º ano', '5º ano'],
        rating: 4.8,
        reviewCount: 24,
        downloadCount: 156,
        author: {
          id: 1,
          name: 'Prof. Maria Silva',
          email: 'maria@email.com',
          rating: 4.9
        },
        thumbnailUrl: '/api/placeholder/400/300',
        tags: ['Frações', 'Matemática Básica', 'Ensino Fundamental'],
        createdAt: '2025-01-10T00:00:00Z',
        updatedAt: '2025-01-10T00:00:00Z',
        status: 'active',
        totalRevenue: 0,
        reviews: [
          {
            id: 1,
            rating: 5,
            comment: 'Material excelente! Meus alunos adoraram as atividades.',
            user: { id: 2, name: 'Ana Costa' },
            createdAt: '2025-01-15T00:00:00Z',
            updatedAt: '2025-01-15T00:00:00Z'
          },
          {
            id: 2,
            rating: 4,
            comment: 'Muito bem estruturado e fácil de aplicar.',
            user: { id: 3, name: 'João Santos' },
            createdAt: '2025-01-12T00:00:00Z',
            updatedAt: '2025-01-12T00:00:00Z'
          }
        ]
      }
      setProduct(mockProduct)
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async () => {
    setPurchasing(true)
    try {
      // Simulate user ID (in real app, get from auth context)
      const buyerId = 1
      
      const response = await createSale({
        productId: productId,
        buyerId: buyerId,
        paymentMethod: 'credit_card'
      })
      
      if (response.success) {
        message.success('Compra realizada com sucesso!')
        // In real app, redirect to download page or show download link
      } else {
        message.error(response.error || 'Erro ao processar compra')
      }
    } catch (error) {
      console.error('Error purchasing product:', error)
      message.error('Erro ao processar compra')
    } finally {
      setPurchasing(false)
    }
  }

  const handleSubmitReview = async (values: { rating: number; comment: string }) => {
    setSubmittingReview(true)
    try {
      // Simulate user ID (in real app, get from auth context)
      const userId = 1
      
      const response = await createReview(productId, {
        rating: values.rating,
        comment: values.comment,
        userId: userId
      })
      
      if (response.success) {
        message.success('Avaliação enviada com sucesso!')
        setReviewModalVisible(false)
        form.resetFields()
        loadProduct() // Reload to show new review
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
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto py-12">
          <Spin size="large" className="flex justify-center" />
        </div>
      </AppLayout>
    )
  }

  if (!product) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto py-12 text-center">
          <BookOutlined className="text-6xl text-gray-300 mb-4" />
          <Title level={3}>Produto não encontrado</Title>
          <Paragraph>O produto que você está procurando não existe ou foi removido.</Paragraph>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        <Row gutter={[32, 32]}>
          {/* Product Image and Info */}
          <Col xs={24} lg={16}>
            <Card>
              {/* Product Image */}
              <div className="mb-6">
                <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <BookOutlined className="text-6xl text-gray-400" />
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-4">
                <div>
                  <Space wrap>
                    <Tag color="blue">{product.category}</Tag>
                    <Tag color="green">{product.subject}</Tag>
                    {product.gradeLevel.map(level => (
                      <Tag key={level} color="purple">{level}</Tag>
                    ))}
                  </Space>
                </div>

                <Title level={2}>{product.title}</Title>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Rate disabled defaultValue={product.rating} allowHalf />
                    <Text strong>{product.rating}</Text>
                    <Text className="text-gray-500">({product.reviewCount} avaliações)</Text>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <DownloadOutlined />
                    <Text>{product.downloadCount} downloads</Text>
                  </div>
                </div>

                <Paragraph className="text-lg">
                  {product.description}
                </Paragraph>

                <div>
                  <Title level={5}>Tags:</Title>
                  <Space wrap>
                    {product.tags.map(tag => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </Space>
                </div>

                <div className="flex items-center space-x-2 text-gray-500">
                  <CalendarOutlined />
                  <Text>Publicado em {formatDate(product.createdAt)}</Text>
                </div>
              </div>
            </Card>

            {/* Reviews Section */}
            <Card title="Avaliações" className="mt-6">
              <div className="mb-4">
                <Button 
                  type="primary" 
                  icon={<StarOutlined />}
                  onClick={() => setReviewModalVisible(true)}
                >
                  Escrever Avaliação
                </Button>
              </div>

              <List
                dataSource={product.reviews || []}
                renderItem={(review: Review) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} />}
                      title={
                        <div className="flex items-center space-x-2">
                          <Text strong>{review.user.name}</Text>
                          <Rate disabled defaultValue={review.rating} className="text-sm" />
                        </div>
                      }
                      description={
                        <div>
                          <Paragraph>{review.comment}</Paragraph>
                          <Text className="text-gray-400 text-sm">
                            {formatDate(review.createdAt)}
                          </Text>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          {/* Sidebar */}
          <Col xs={24} lg={8}>
            {/* Purchase Card */}
            <Card className="sticky top-4">
              <div className="text-center mb-6">
                <Title level={2} className="text-blue-600 mb-2">
                  {formatPrice(product.price)}
                </Title>
                <Text className="text-gray-600">Pagamento único</Text>
              </div>

              <div className="space-y-4 mb-6">
                <Button 
                  type="primary" 
                  size="large" 
                  block 
                  icon={<ShoppingCartOutlined />}
                  loading={purchasing}
                  onClick={handlePurchase}
                >
                  Comprar Agora
                </Button>
                
                <div className="flex space-x-2">
                  <Button icon={<HeartOutlined />} block>
                    Favoritar
                  </Button>
                  <Button icon={<ShareAltOutlined />} block>
                    Compartilhar
                  </Button>
                </div>
              </div>

              <Divider />

              {/* Author Info */}
              <div className="text-center">
                <Avatar size={64} icon={<UserOutlined />} className="mb-3" />
                <Title level={4}>{product.author.name}</Title>
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <Rate disabled defaultValue={product.author.rating} allowHalf className="text-sm" />
                  <Text className="text-gray-500">({product.author.rating})</Text>
                </div>
                <Button type="link">Ver Perfil do Professor</Button>
              </div>

              <Divider />

              {/* Product Stats */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Text>Downloads:</Text>
                  <Text strong>{product.downloadCount}</Text>
                </div>
                <div className="flex justify-between">
                  <Text>Avaliações:</Text>
                  <Text strong>{product.reviewCount}</Text>
                </div>
                <div className="flex justify-between">
                  <Text>Categoria:</Text>
                  <Text strong>{product.category}</Text>
                </div>
                <div className="flex justify-between">
                  <Text>Matéria:</Text>
                  <Text strong>{product.subject}</Text>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Review Modal */}
        <Modal
          title="Escrever Avaliação"
          open={reviewModalVisible}
          onCancel={() => setReviewModalVisible(false)}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmitReview}
          >
            <Form.Item
              name="rating"
              label="Avaliação"
              rules={[{ required: true, message: 'Por favor, dê uma nota' }]}
            >
              <Rate />
            </Form.Item>

            <Form.Item
              name="comment"
              label="Comentário"
              rules={[{ required: true, message: 'Por favor, escreva um comentário' }]}
            >
              <TextArea 
                rows={4} 
                placeholder="Compartilhe sua experiência com este material..."
              />
            </Form.Item>

            <Form.Item>
              <div className="flex space-x-2">
                <Button 
                  type="primary" 
                  htmlType="submit"
                  loading={submittingReview}
                  block
                >
                  Enviar Avaliação
                </Button>
                <Button onClick={() => setReviewModalVisible(false)} block>
                  Cancelar
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AppLayout>
  )
}

