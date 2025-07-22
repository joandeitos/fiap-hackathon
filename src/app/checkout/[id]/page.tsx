'use client'

import React, { useState, useEffect } from 'react'
import { 
  Card, 
  Button, 
  Steps, 
  Form, 
  Input, 
  Select, 
  Radio, 
  Typography, 
  Divider,
  Space,
  message,
  Spin,
  Row,
  Col,
  Alert
} from 'antd'
import { 
  CreditCardOutlined,
  BankOutlined,
  QrcodeOutlined,
  LockOutlined,
  CheckCircleOutlined,
  UserOutlined
} from '@ant-design/icons'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import AppLayout from '@/components/Layout/AppLayout'
import { getProduct, createSale, Product } from '@/lib/supabase-api'
import { useUser } from '@clerk/nextjs'

const { Title, Paragraph, Text } = Typography
const { Step } = Steps

export default function CheckoutPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, isSignedIn } = useUser()
  
  const productId = params.id as string
  const isMultiple = productId === 'multiple'
  const productIds = isMultiple ? searchParams?.get('products')?.split(',') || [] : [productId]
  
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    if (!isSignedIn) {
      message.warning('Você precisa estar logado para fazer uma compra')
      router.push('/sign-in')
      return
    }
    
    loadProducts()
  }, [productIds, isSignedIn])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const loadedProducts: Product[] = []
      
      for (const id of productIds) {
        const response = await getProduct(id)
        if (response.success && response.data) {
          loadedProducts.push(response.data)
        }
      }
      
      if (loadedProducts.length === 0) {
        message.error('Produto(s) não encontrado(s)')
        router.push('/produtos')
        return
      }
      
      setProducts(loadedProducts)
    } catch (error) {
      console.error('Error loading products:', error)
      message.error('Erro ao carregar produto(s)')
      router.push('/produtos')
    } finally {
      setLoading(false)
    }
  }

  const calculateTotal = () => {
    return products.reduce((total, product) => total + product.price, 0)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const handlePayment = async (values: any) => {
    if (!user) {
      message.error('Usuário não autenticado')
      return
    }

    setProcessing(true)
    try {
      const sales = []
      
      for (const product of products) {
        const saleData = {
          product_id: product.id,
          buyer_id: user.id,
          seller_id: product.author_id,
          amount: product.price,
          payment_method: values.paymentMethod,
          payment_id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }
        
        const response = await createSale(saleData)
        if (response.success && response.data) {
          sales.push(response.data)
        } else {
          throw new Error(response.error || 'Erro ao processar venda')
        }
      }
      
      message.success('Compra realizada com sucesso!')
      setCurrentStep(2)
      
    } catch (error: any) {
      console.error('Error processing payment:', error)
      message.error(error.message || 'Erro ao processar pagamento')
    } finally {
      setProcessing(false)
    }
  }

  const steps = [
    {
      title: 'Revisão',
      description: 'Confirme os itens'
    },
    {
      title: 'Pagamento',
      description: 'Escolha a forma de pagamento'
    },
    {
      title: 'Confirmação',
      description: 'Finalize a compra'
    }
  ]

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

  if (!isSignedIn) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto py-8">
          <Alert
            message="Login Necessário"
            description="Você precisa estar logado para fazer uma compra."
            type="warning"
            showIcon
            action={
              <Button type="primary" onClick={() => router.push('/sign-in')}>
                Fazer Login
              </Button>
            }
          />
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <Title level={2}>Finalizar Compra</Title>
          <Paragraph className="text-gray-600">
            Complete sua compra de forma segura
          </Paragraph>
        </div>

        {/* Steps */}
        <Card className="mb-6">
          <Steps current={currentStep} items={steps} />
        </Card>

        <Row gutter={[24, 24]}>
          {/* Main Content */}
          <Col xs={24} lg={16}>
            {currentStep === 0 && (
              <Card title="Revisão do Pedido">
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <UserOutlined className="text-2xl text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <Title level={5}>{product.title}</Title>
                        <div className="flex items-center space-x-2 mb-2">
                          <UserOutlined className="text-gray-400" />
                          <Text className="text-gray-600">{product.author?.name}</Text>
                        </div>
                        <Text strong className="text-lg text-blue-600">
                          {formatPrice(product.price)}
                        </Text>
                      </div>
                    </div>
                  ))}
                  
                  <div className="text-right pt-4 border-t">
                    <Button 
                      type="primary" 
                      size="large"
                      onClick={() => setCurrentStep(1)}
                    >
                      Continuar para Pagamento
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {currentStep === 1 && (
              <Card title="Informações de Pagamento">
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handlePayment}
                >
                  <Form.Item
                    name="paymentMethod"
                    label="Forma de Pagamento"
                    rules={[{ required: true, message: 'Selecione uma forma de pagamento' }]}
                  >
                    <Radio.Group className="w-full">
                      <Space direction="vertical" className="w-full">
                        <Radio value="credit_card" className="w-full">
                          <div className="flex items-center space-x-3">
                            <CreditCardOutlined className="text-xl" />
                            <div>
                              <div className="font-medium">Cartão de Crédito</div>
                              <div className="text-sm text-gray-500">Visa, Mastercard, Elo</div>
                            </div>
                          </div>
                        </Radio>
                        <Radio value="pix" className="w-full">
                          <div className="flex items-center space-x-3">
                            <QrcodeOutlined className="text-xl" />
                            <div>
                              <div className="font-medium">PIX</div>
                              <div className="text-sm text-gray-500">Pagamento instantâneo</div>
                            </div>
                          </div>
                        </Radio>
                      </Space>
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item
                    name="cardNumber"
                    label="Número do Cartão"
                    rules={[{ required: true, message: 'Digite o número do cartão' }]}
                  >
                    <Input 
                      placeholder="1234 5678 9012 3456"
                      prefix={<CreditCardOutlined />}
                    />
                  </Form.Item>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="expiryDate"
                        label="Validade"
                        rules={[{ required: true, message: 'Digite a validade' }]}
                      >
                        <Input placeholder="MM/AA" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="cvv"
                        label="CVV"
                        rules={[{ required: true, message: 'Digite o CVV' }]}
                      >
                        <Input placeholder="123" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="cardName"
                    label="Nome no Cartão"
                    rules={[{ required: true, message: 'Digite o nome no cartão' }]}
                  >
                    <Input placeholder="Nome como está no cartão" />
                  </Form.Item>

                  <div className="flex space-x-4">
                    <Button onClick={() => setCurrentStep(0)}>
                      Voltar
                    </Button>
                    <Button 
                      type="primary" 
                      htmlType="submit"
                      loading={processing}
                      icon={<LockOutlined />}
                    >
                      Finalizar Compra
                    </Button>
                  </div>
                </Form>
              </Card>
            )}

            {currentStep === 2 && (
              <Card>
                <div className="text-center py-8">
                  <CheckCircleOutlined className="text-6xl text-green-500 mb-4" />
                  <Title level={2}>Compra Realizada com Sucesso!</Title>
                  <Paragraph className="text-lg text-gray-600 mb-6">
                    Seus materiais educacionais já estão disponíveis para download.
                  </Paragraph>
                  <Space>
                    <Button type="primary" onClick={() => router.push('/compras')}>
                      Ver Minhas Compras
                    </Button>
                    <Button onClick={() => router.push('/produtos')}>
                      Continuar Comprando
                    </Button>
                  </Space>
                </div>
              </Card>
            )}
          </Col>

          {/* Order Summary */}
          <Col xs={24} lg={8}>
            <Card title="Resumo do Pedido" className="sticky top-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  {products.map((product) => (
                    <div key={product.id} className="flex justify-between">
                      <Text className="text-sm">{product.title}</Text>
                      <Text className="text-sm">{formatPrice(product.price)}</Text>
                    </div>
                  ))}
                </div>
                
                <Divider />
                
                <div className="flex justify-between">
                  <Text>Subtotal:</Text>
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
              </div>
            </Card>

            {/* Security Info */}
            <Card className="mt-4">
              <div className="text-center space-y-2">
                <LockOutlined className="text-2xl text-green-600" />
                <Title level={5}>Pagamento Seguro</Title>
                <Paragraph className="text-sm text-gray-600">
                  Seus dados estão protegidos com criptografia SSL de 256 bits
                </Paragraph>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </AppLayout>
  )
}

