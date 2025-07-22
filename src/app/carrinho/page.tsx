'use client'

import React, { useState, useEffect } from 'react'
import { 
  Card, 
  Button, 
  Typography, 
  List, 
  Avatar, 
  Space, 
  Divider,
  Empty,
  message,
  Spin,
  Row,
  Col,
  InputNumber,
  Popconfirm
} from 'antd'
import { 
  ShoppingCartOutlined,
  DeleteOutlined,
  CreditCardOutlined,
  BookOutlined,
  UserOutlined
} from '@ant-design/icons'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/Layout/AppLayout'
import { getCartItems, removeFromCart, clearCart, CartItem } from '@/lib/supabase-api'

const { Title, Paragraph, Text } = Typography

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [removing, setRemoving] = useState<string | null>(null)
  const [clearing, setClearing] = useState(false)
  const router = useRouter()

  // Mock user ID - in real app, get from auth context
  const userId = '550e8400-e29b-41d4-a716-446655440001'

  useEffect(() => {
    loadCartItems()
  }, [])

  const loadCartItems = async () => {
    setLoading(true)
    try {
      const response = await getCartItems(userId)
      if (response.success && response.data) {
        setCartItems(response.data)
      } else {
        message.error('Erro ao carregar carrinho')
      }
    } catch (error) {
      console.error('Error loading cart:', error)
      message.error('Erro ao conectar com o servidor')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveItem = async (productId: string) => {
    setRemoving(productId)
    try {
      const response = await removeFromCart(userId, productId)
      if (response.success) {
        message.success('Item removido do carrinho')
        loadCartItems()
      } else {
        message.error(response.error || 'Erro ao remover item')
      }
    } catch (error) {
      console.error('Error removing item:', error)
      message.error('Erro ao remover item')
    } finally {
      setRemoving(null)
    }
  }

  const handleClearCart = async () => {
    setClearing(true)
    try {
      const response = await clearCart(userId)
      if (response.success) {
        message.success('Carrinho limpo com sucesso')
        setCartItems([])
      } else {
        message.error(response.error || 'Erro ao limpar carrinho')
      }
    } catch (error) {
      console.error('Error clearing cart:', error)
      message.error('Erro ao limpar carrinho')
    } finally {
      setClearing(false)
    }
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      message.warning('Carrinho vazio')
      return
    }
    
    // For multiple items, we'll create a checkout session
    const productIds = cartItems.map(item => item.product_id).join(',')
    router.push(`/checkout/multiple?products=${productIds}`)
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity
    }, 0)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto py-8">
          <div className="text-center py-12">
            <Spin size="large" />
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <Title level={2}>
            <ShoppingCartOutlined className="mr-3" />
            Meu Carrinho
          </Title>
          <Paragraph className="text-gray-600">
            Revise seus itens antes de finalizar a compra
          </Paragraph>
        </div>

        {cartItems.length === 0 ? (
          <Card>
            <Empty
              image={<ShoppingCartOutlined className="text-6xl text-gray-300" />}
              description={
                <div>
                  <Title level={4}>Seu carrinho está vazio</Title>
                  <Paragraph>Explore nosso catálogo e adicione materiais educacionais incríveis!</Paragraph>
                </div>
              }
            >
              <Link href="/produtos">
                <Button type="primary" size="large">
                  Explorar Produtos
                </Button>
              </Link>
            </Empty>
          </Card>
        ) : (
          <Row gutter={[24, 24]}>
            {/* Cart Items */}
            <Col xs={24} lg={16}>
              <Card 
                title={`${cartItems.length} ${cartItems.length === 1 ? 'item' : 'itens'} no carrinho`}
                extra={
                  <Popconfirm
                    title="Limpar carrinho"
                    description="Tem certeza que deseja remover todos os itens?"
                    onConfirm={handleClearCart}
                    okText="Sim"
                    cancelText="Não"
                  >
                    <Button 
                      danger 
                      loading={clearing}
                      icon={<DeleteOutlined />}
                    >
                      Limpar Carrinho
                    </Button>
                  </Popconfirm>
                }
              >
                <List
                  itemLayout="horizontal"
                  dataSource={cartItems}
                  renderItem={(item) => (
                    <List.Item
                      actions={[
                        <Popconfirm
                          key="remove"
                          title="Remover item"
                          description="Tem certeza que deseja remover este item?"
                          onConfirm={() => handleRemoveItem(item.product_id)}
                          okText="Sim"
                          cancelText="Não"
                        >
                          <Button 
                            danger 
                            type="text"
                            icon={<DeleteOutlined />}
                            loading={removing === item.product_id}
                          >
                            Remover
                          </Button>
                        </Popconfirm>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <BookOutlined className="text-2xl text-gray-400" />
                          </div>
                        }
                        title={
                          <Link href={`/produtos/${item.product_id}`}>
                            <span className="hover:text-blue-600 cursor-pointer">
                              {item.product?.title}
                            </span>
                          </Link>
                        }
                        description={
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <UserOutlined className="text-gray-400" />
                              <Text className="text-sm text-gray-600">
                                {item.product?.author?.name}
                              </Text>
                            </div>
                            <div className="flex items-center justify-between">
                              <Text strong className="text-lg text-blue-600">
                                {formatPrice(item.product?.price || 0)}
                              </Text>
                              <div className="flex items-center space-x-2">
                                <Text>Quantidade:</Text>
                                <InputNumber
                                  min={1}
                                  max={1}
                                  value={item.quantity}
                                  disabled
                                  size="small"
                                />
                              </div>
                            </div>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>

            {/* Order Summary */}
            <Col xs={24} lg={8}>
              <Card title="Resumo do Pedido" className="sticky top-4">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Text>Subtotal ({cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'}):</Text>
                    <Text strong>{formatPrice(calculateTotal())}</Text>
                  </div>
                  
                  <div className="flex justify-between">
                    <Text>Taxa de processamento:</Text>
                    <Text>Grátis</Text>
                  </div>
                  
                  <Divider />
                  
                  <div className="flex justify-between">
                    <Title level={4}>Total:</Title>
                    <Title level={4} className="text-blue-600">
                      {formatPrice(calculateTotal())}
                    </Title>
                  </div>
                  
                  <Button 
                    type="primary" 
                    size="large" 
                    block
                    icon={<CreditCardOutlined />}
                    onClick={handleCheckout}
                  >
                    Finalizar Compra
                  </Button>
                  
                  <div className="text-center">
                    <Link href="/produtos">
                      <Button type="link">
                        Continuar Comprando
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>

              {/* Security Info */}
              <Card className="mt-4">
                <div className="text-center space-y-2">
                  <div className="text-green-600 text-2xl">🔒</div>
                  <Title level={5}>Compra Segura</Title>
                  <Paragraph className="text-sm text-gray-600">
                    Seus dados estão protegidos com criptografia SSL
                  </Paragraph>
                </div>
              </Card>
            </Col>
          </Row>
        )}
      </div>
    </AppLayout>
  )
}

