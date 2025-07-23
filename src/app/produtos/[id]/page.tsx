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
  Avatar,
  Divider,
  List,
  Spin,
  message,
  Modal,
  Form,
  Input
} from 'antd'
import { 
  DownloadOutlined,
  StarOutlined,
  UserOutlined,
  BookOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
  ShareAltOutlined,
  CalendarOutlined
} from '@ant-design/icons'
import { useParams } from 'next/navigation'
import AppLayout from '@/components/Layout/AppLayout'
import { getProduct, createSale, createReview, Product, Review } from '@/lib/api'

const { Title, Paragraph, Text } = Typography
const { TextArea } = Input

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string
  
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
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async () => {
    if (!product) return
    
    setPurchasing(true)
    try {
      // Mock user ID - in real app, get from auth context
      const buyerId = '550e8400-e29b-41d4-a716-446655440007'
      
      const response = await createSale({
        product_id: product.id,
        buyer_id: buyerId,
        seller_id: product.author_id,
        amount: product.price,
        payment_method: 'credit_card'
      })
      
      if (response.success) {
        message.success('Compra realizada com sucesso!')
        // Redirect to checkout or downloads page
        window.location.href = `/checkout/${product.id}`
      } else {
        message.error(response.error || 'Erro ao processar compra')
      }
    } catch (error) {
      console.error('Error processing purchase:', error)
      message.error('Erro ao processar compra')
    } finally {
      setPurchasing(false)
    }
  }

  const handleSubmitReview = async (values: any) => {
    if (!product) return
    
    setSubmittingReview(true)
    try {
      // Mock user ID - in real app, get from auth context
      const userId = '550e8400-e29b-41d4-a716-446655440007'
      
      const response = await createReview({
        product_id: product.id,
        user_id: userId,
        rating: values.rating,
        comment: values.comment
      })
      
      if (response.success) {
        message.success('Avaliação enviada com sucesso!')
        setReviewModalVisible(false)
        form.resetFields()
        // Reload product to get updated reviews
        loadProduct()
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
        <div className="max-w-6xl mx-auto py-8">
          <div className="text-center py-12">
            <Spin size="large" />
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!product) {
    return (
      <AppLayout>
        <div className="max-w-6xl mx-auto py-8">
          <div className="text-center py-12">
            <BookOutlined className="text-6xl text-gray-300 mb-4" />
            <Title level={3}>Produto não encontrado</Title>
            <Paragraph>O produto que você está procurando não existe ou foi removido.</Paragraph>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto py-8">
        <Row gutter={[32, 32]}>
          {/* Product Image and Info */}
          <Col xs={24} lg={16}>
            <Card className="mb-6">
              {/* Product Image */}
              <div className="h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mb-6">
                <BookOutlined className="text-6xl text-gray-400" />
              </div>

              {/* Product Details */}
              <div className="space-y-4">
                <div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Tag color="blue">{product.category}</Tag>
                    <Tag color="green">{product.subject}</Tag>
                    {product.grade_level?.map((level) => (
                      <Tag key={level} color="orange">{level}</Tag>
                    ))}
                  </div>
                  
                  <Title level={2} className="mb-3">
                    {product.title}
                  </Title>
                  
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Rate disabled defaultValue={product.rating} />
                      <Text>
                        {product.rating} ({product.review_count} avaliações)
                      </Text>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DownloadOutlined />
                      <Text>{product.download_count} downloads</Text>
                    </div>
                  </div>
                </div>

                <Divider />

                <div>
                  <Title level={4}>Descrição</Title>
                  <Paragraph className="text-gray-700">
                    {product.description}
                  </Paragraph>
                </div>

                {product.tags && product.tags.length > 0 && (
                  <div>
                    <Title level={5}>Tags</Title>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </div>
                  </div>
                )}

                <Divider />

                {/* Author Info */}
                <div>
                  <Title level={4}>Sobre o Autor</Title>
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <Avatar size={64} icon={<UserOutlined />} />
                    <div>
                      <Title level={5} className="mb-1">
                        {product.author?.name}
                      </Title>
                      <div className="flex items-center space-x-2 mb-2">
                        <Rate disabled defaultValue={product.author?.average_rating || 0} size="small" />
                        <Text className="text-sm">
                          {product.author?.average_rating} ({product.author?.rating_count} avaliações)
                        </Text>
                      </div>
                      <Text className="text-gray-600">
                        {product.author?.total_products} produtos • {product.author?.total_sales} vendas
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Reviews Section */}
            <Card title="Avaliações">
              <div className="mb-4">
                <Button 
                  type="primary" 
                  icon={<StarOutlined />}
                  onClick={() => setReviewModalVisible(true)}
                >
                  Escrever Avaliação
                </Button>
              </div>

              {product.reviews && product.reviews.length > 0 ? (
                <List
                  dataSource={product.reviews}
                  renderItem={(review: Review) => (
                    <List.Item>
                      <div className="w-full">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Avatar size="small" icon={<UserOutlined />} />
                            <Text strong>{review.user?.name}</Text>
                            <Rate disabled defaultValue={review.rating} size="small" />
                          </div>
                          <Text className="text-gray-500 text-sm">
                            {formatDate(review.created_at)}
                          </Text>
                        </div>
                        <Paragraph className="mb-0">
                          {review.comment}
                        </Paragraph>
                      </div>
                    </List.Item>
                  )}
                />
              ) : (
                <div className="text-center py-8">
                  <StarOutlined className="text-4xl text-gray-300 mb-2" />
                  <Text className="text-gray-500">Ainda não há avaliações para este produto</Text>
                </div>
              )}
            </Card>
          </Col>

          {/* Purchase Sidebar */}
          <Col xs={24} lg={8}>
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
                  icon={<ShoppingCartOutlined />}
                  onClick={handlePurchase}
                  loading={purchasing}
                  block
                >
                  Comprar Agora
                </Button>
                
                <Button
                  size="large"
                  icon={<HeartOutlined />}
                  block
                >
                  Adicionar aos Favoritos
                </Button>
                
                <Button
                  size="large"
                  icon={<ShareAltOutlined />}
                  block
                >
                  Compartilhar
                </Button>
              </div>

              <Divider />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Text>Categoria:</Text>
                  <Text strong>{product.category}</Text>
                </div>
                <div className="flex justify-between">
                  <Text>Matéria:</Text>
                  <Text strong>{product.subject}</Text>
                </div>
                <div className="flex justify-between">
                  <Text>Publicado em:</Text>
                  <Text strong>{formatDate(product.created_at)}</Text>
                </div>
                <div className="flex justify-between">
                  <Text>Última atualização:</Text>
                  <Text strong>{formatDate(product.updated_at)}</Text>
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
                placeholder="Compartilhe sua experiência com este material..."
              />
            </Form.Item>

            <Form.Item className="mb-0">
              <div className="flex justify-end space-x-2">
                <Button onClick={() => setReviewModalVisible(false)}>
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

