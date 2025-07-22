'use client'

import { useState, useEffect } from 'react'
import { 
  Typography, 
  Card, 
  Row, 
  Col, 
  Button,
  Form,
  Input,
  Radio,
  Divider,
  Steps,
  message,
  Spin,
  Avatar,
  Tag
} from 'antd'
import { 
  CreditCardOutlined,
  BankOutlined,
  QrcodeOutlined,
  LockOutlined,
  CheckCircleOutlined,
  UserOutlined
} from '@ant-design/icons'
import { useParams, useRouter } from 'next/navigation'
import AppLayout from '@/components/Layout/AppLayout'
// import { useUser } from '@clerk/nextjs'

const { Title, Paragraph } = Typography
const { Step } = Steps

interface Product {
  id: number
  title: string
  description: string
  price: number
  author: string
  authorAvatar?: string
  category: string
  rating: number
  downloadCount: number
}

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  // const { user, isSignedIn } = useUser()
  const user = {
    firstName: 'Maria',
    lastName: 'Silva',
    emailAddresses: [{ emailAddress: 'maria.silva@email.com' }]
  }
  const isSignedIn = true
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState('credit_card')
  const [processing, setProcessing] = useState(false)
  const [form] = Form.useForm()

  // Produto mock baseado no ID
  const mockProduct: Product = {
    id: Number(params.id),
    title: 'Plano de Aula: Matemática Básica - Frações',
    description: 'Conjunto completo de atividades para ensinar frações de forma lúdica e interativa. Inclui exercícios práticos, jogos e avaliações.',
    price: 15.90,
    author: 'Prof. Maria Silva',
    authorAvatar: undefined,
    category: 'Matemática',
    rating: 4.8,
    downloadCount: 156
  }

  useEffect(() => {
    // Verificar se usuário está logado
    if (!isSignedIn) {
      message.warning('Você precisa estar logado para fazer uma compra')
      router.push('/sign-in')
      return
    }

    const fetchProduct = async () => {
      try {
        setLoading(true)
        // Simular carregamento do produto
        await new Promise(resolve => setTimeout(resolve, 1000))
        setProduct(mockProduct)
      } catch (error) {
        console.error('Erro ao carregar produto:', error)
        message.error('Erro ao carregar produto')
        router.push('/produtos')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id, isSignedIn, router])

  const handlePayment = async (values: any) => {
    setProcessing(true)
    try {
      // Simular processamento do pagamento
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setCurrentStep(2) // Ir para step de confirmação
      message.success('Pagamento processado com sucesso!')
      
      // Redirecionar após alguns segundos
      setTimeout(() => {
        router.push('/compras')
      }, 3000)
    } catch (error) {
      message.error('Erro ao processar pagamento')
    } finally {
      setProcessing(false)
    }
  }

  const paymentMethods = [
    {
      value: 'credit_card',
      label: 'Cartão de Crédito',
      icon: <CreditCardOutlined />,
      description: 'Visa, Mastercard, Elo'
    },
    {
      value: 'debit_card',
      label: 'Cartão de Débito',
      icon: <BankOutlined />,
      description: 'Débito online'
    },
    {
      value: 'pix',
      label: 'PIX',
      icon: <QrcodeOutlined />,
      description: 'Pagamento instantâneo'
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

  if (!product) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Title level={3}>Produto não encontrado</Title>
            <Button type="primary" onClick={() => router.push('/produtos')}>
              Voltar aos Produtos
            </Button>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <Title level={2}>Finalizar Compra</Title>
            <Steps current={currentStep} className="mt-4">
              <Step title="Revisão" />
              <Step title="Pagamento" />
              <Step title="Confirmação" />
            </Steps>
          </div>

          <Row gutter={[24, 24]}>
            {/* Coluna Principal */}
            <Col xs={24} lg={16}>
              {currentStep === 0 && (
                <Card title="Revisar Pedido">
                  <div className="flex items-start space-x-4 mb-6">
                    <Avatar 
                      src={product.authorAvatar} 
                      icon={<UserOutlined />}
                      size={64}
                    />
                    <div className="flex-1">
                      <Title level={4} className="mb-2">{product.title}</Title>
                      <Paragraph className="text-gray-600 mb-2">
                        {product.description}
                      </Paragraph>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>por {product.author}</span>
                        <Tag color="blue">{product.category}</Tag>
                        <span>⭐ {product.rating} ({product.downloadCount} downloads)</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Button 
                      type="primary" 
                      size="large"
                      onClick={() => setCurrentStep(1)}
                    >
                      Continuar para Pagamento
                    </Button>
                  </div>
                </Card>
              )}

              {currentStep === 1 && (
                <Card title="Método de Pagamento">
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={handlePayment}
                  >
                    <Form.Item name="paymentMethod" initialValue={paymentMethod}>
                      <Radio.Group 
                        value={paymentMethod} 
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full"
                      >
                        <div className="space-y-3">
                          {paymentMethods.map((method) => (
                            <Radio.Button 
                              key={method.value} 
                              value={method.value}
                              className="w-full h-auto p-4 text-left"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="text-xl">{method.icon}</div>
                                <div>
                                  <div className="font-medium">{method.label}</div>
                                  <div className="text-sm text-gray-500">
                                    {method.description}
                                  </div>
                                </div>
                              </div>
                            </Radio.Button>
                          ))}
                        </div>
                      </Radio.Group>
                    </Form.Item>

                    {paymentMethod === 'credit_card' && (
                      <div className="space-y-4">
                        <Form.Item
                          name="cardNumber"
                          label="Número do Cartão"
                          rules={[{ required: true, message: 'Digite o número do cartão' }]}
                        >
                          <Input 
                            placeholder="1234 5678 9012 3456"
                            prefix={<CreditCardOutlined />}
                            maxLength={19}
                          />
                        </Form.Item>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              name="expiryDate"
                              label="Validade"
                              rules={[{ required: true, message: 'Digite a validade' }]}
                            >
                              <Input placeholder="MM/AA" maxLength={5} />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              name="cvv"
                              label="CVV"
                              rules={[{ required: true, message: 'Digite o CVV' }]}
                            >
                              <Input 
                                placeholder="123" 
                                maxLength={4}
                                prefix={<LockOutlined />}
                              />
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
                      </div>
                    )}

                    {paymentMethod === 'pix' && (
                      <div className="text-center py-8">
                        <QrcodeOutlined className="text-6xl text-blue-600 mb-4" />
                        <Paragraph>
                          Após confirmar, você receberá o código PIX para pagamento
                        </Paragraph>
                      </div>
                    )}

                    <div className="flex justify-between mt-6">
                      <Button onClick={() => setCurrentStep(0)}>
                        Voltar
                      </Button>
                      <Button 
                        type="primary" 
                        htmlType="submit"
                        loading={processing}
                        size="large"
                      >
                        {processing ? 'Processando...' : `Pagar R$ ${product.price.toFixed(2)}`}
                      </Button>
                    </div>
                  </Form>
                </Card>
              )}

              {currentStep === 2 && (
                <Card>
                  <div className="text-center py-8">
                    <CheckCircleOutlined className="text-6xl text-green-600 mb-4" />
                    <Title level={3} className="text-green-600 mb-4">
                      Compra Realizada com Sucesso!
                    </Title>
                    <Paragraph className="text-lg mb-6">
                      Seu material já está disponível para download na área de compras.
                    </Paragraph>
                    <div className="space-x-4">
                      <Button type="primary" onClick={() => router.push('/compras')}>
                        Ver Minhas Compras
                      </Button>
                      <Button onClick={() => router.push('/produtos')}>
                        Continuar Comprando
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </Col>

            {/* Sidebar - Resumo */}
            <Col xs={24} lg={8}>
              <Card title="Resumo do Pedido" className="sticky top-4">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>R$ {product.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxa de processamento:</span>
                    <span>R$ 0,00</span>
                  </div>
                  <Divider />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>R$ {product.price.toFixed(2)}</span>
                  </div>
                </div>

                <Divider />

                <div className="text-center text-sm text-gray-500">
                  <LockOutlined className="mr-1" />
                  Pagamento 100% seguro
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm">
                    <div className="font-medium text-blue-800 mb-1">
                      ✓ Download imediato
                    </div>
                    <div className="text-blue-600">
                      Acesso vitalício ao material
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </AppLayout>
  )
}

