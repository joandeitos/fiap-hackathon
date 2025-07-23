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
  Popconfirm,
  Tag
} from 'antd'
import { 
  ShoppingCartOutlined,
  DeleteOutlined,
  CreditCardOutlined,
  BookOutlined,
  UserOutlined,
  ClearOutlined
} from '@ant-design/icons'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/Layout/AppLayout'
import { getCartItems, removeFromCart, clearCart, updateCartItemQuantity } from '@/lib/supabase-api'
import { Product } from '@/lib/api'

const { Title, Paragraph, Text } = Typography

interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  created_at: string
  product?: Product
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [removing, setRemoving] = useState<string | null>(null)
  const [clearing, setClearing] = useState(false)
  const [updating, setUpdating] = useState<string | null>(null)
  const router = useRouter()

  // Mock user ID - in real app, get from auth context
  const userId = '550e8400-e29b-41d4-a716-446655440007'

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
        setCartItems([])
      }
    } catch (error) {
      console.error('Error loading cart items:', error)
      message.error('Erro ao conectar com o servidor')
      setCartItems([])
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

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return
    
    setUpdating(productId)
    try {
      const response = await updateCartItemQuantity(userId, productId, quantity)
      if (response.success) {
        loadCartItems()
      } else {
        message.error(response.error || 'Erro ao atualizar quantidade')
      }
    } catch (error) {
      console.error('Error updating quantity:', error)
      message.error('Erro ao atualizar quantidade')
    } finally {
      setUpdating(null)
    }
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      message.warning('Seu carrinho está vazio')
      return
    }
    
    // For multiple items, we'll create a checkout session
    // For now, redirect to the first item's checkout page
    const firstItem = cartItems[0]
    if (firstItem.product) {
      router.push(`/checkout/${firstItem.product.id}`)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity
  }, 0)

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

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
          <Title level={2} className="mb-2">
            Carrinho de Compras
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
                  <Paragraph>Adicione alguns materiais educacionais para começar</Paragraph>
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
                title={`Itens no Carrinho (${totalItems})`}
                extra={
                  <Popconfirm
                    title="Tem certeza que deseja limpar o carrinho?"
                    onConfirm={handleClearCart}
                    okText="Sim"
                    cancelText="Não"
                  >
                    <Button 
                      icon={<ClearOutlined />} 
                      loading={clearing}
                      danger
                    >
                      Limpar Carrinho
                    </Button>
                  </Popconfirm>
                }
              >
                <List
                  dataSource={cartItems}
                  renderItem={(item) => (
                    <List.Item
                      key={item.id}
                      actions={[
                        <Popconfirm
                          key="remove"
                          title="Remover este item do carrinho?"
                          onConfirm={() => handleRemoveItem(item.product_id)}
                          okText="Sim"
                          cancelText="Não"
                        >
                          <Button 
                            icon={<DeleteOutlined />} 
                            loading={removing === item.product_id}
                            danger
                            size="small"
                          >
                            Remover
                          </Button>
                        </Popconfirm>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                            <BookOutlined className="text-2xl text-gray-400" />
                          </div>
                        }
                        title={
                          <div className="flex items-center justify-between">
                            <div>
                              <Link href={`/produtos/${item.product?.id}`}>
                                <span className="text-lg font-semibold hover:text-blue-600">
                                  {item.product?.title || 'Produto não encontrado'}
                                </span>
                              </Link>
                              <div className="flex items-center space-x-2 mt-1">
                                <Tag color="blue">{item.product?.category}</Tag>
                                <Tag color="green">{item.product?.subject}</Tag>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-green-600">
                                {formatPrice((item.product?.price || 0) * item.quantity)}
                              </div>
                              <div className="text-sm text-gray-500">
                                {formatPrice(item.product?.price || 0)} cada
                              </div>
                            </div>
                          </div>
                        }
                        description={
                          <div className="mt-3">
                            <Paragraph className="text-gray-600 mb-3">
                              {item.product?.description}
                            </Paragraph>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-1">
                                  <Avatar size="small" icon={<UserOutlined />} />
                                  <span className="text-sm text-gray-600">
                                    {item.product?.author?.name}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Text>Quantidade:</Text>
                                <InputNumber
                                  min={1}
                                  max={10}
                                  value={item.quantity}
                                  onChange={(value) => {
                                    if (value) {
                                      handleUpdateQuantity(item.product_id, value)
                                    }
                                  }}
                                  loading={updating === item.product_id}
                                  size="small"
                                  style={{ width: 80 }}
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
                    <Text>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'itens'}):</Text>
                    <Text strong>{formatPrice(subtotal)}</Text>
                  </div>
                  
                  <div className="flex justify-between">
                    <Text>Taxa de processamento:</Text>
                    <Text>Grátis</Text>
                  </div>
                  
                  <Divider />
                  
                  <div className="flex justify-between">
                    <Text strong className="text-lg">Total:</Text>
                    <Text strong className="text-lg text-green-600">
                      {formatPrice(subtotal)}
                    </Text>
                  </div>
                  
                  <Button
                    type="primary"
                    size="large"
                    icon={<CreditCardOutlined />}
                    onClick={handleCheckout}
                    block
                    className="mt-6"
                  >
                    Finalizar Compra
                  </Button>
                  
                  <div className="text-center mt-4">
                    <Link href="/produtos">
                      <Button type="link">
                        Continuar Comprando
                      </Button>
                    </Link>
                  </div>
                </div>

                <Divider />

                <div className="space-y-3">
                  <Title level={5}>Informações da Compra</Title>
                  <div className="text-sm text-gray-600 space-y-2">
                    <div>✓ Download imediato após pagamento</div>
                    <div>✓ Acesso vitalício aos materiais</div>
                    <div>✓ Suporte técnico incluído</div>
                    <div>✓ Garantia de satisfação</div>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        )}
      </div>
    </AppLayout>
  )
}

