'use client'

import { useState } from 'react'
import { 
  Typography, 
  Card, 
  Row, 
  Col, 
  Form,
  Input,
  Select,
  Button,
  message,
  Space
} from 'antd'
import { 
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  SendOutlined,
  CustomerServiceOutlined
} from '@ant-design/icons'
import AppLayout from '@/components/Layout/AppLayout'

const { Title, Paragraph } = Typography
const { TextArea } = Input
const { Option } = Select

export default function ContatoPage() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      // Simular envio do formulário
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      message.success('Mensagem enviada com sucesso! Responderemos em breve.')
      form.resetFields()
    } catch (error) {
      message.error('Erro ao enviar mensagem. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const contactInfo = [
    {
      icon: <MailOutlined className="text-blue-600 text-2xl" />,
      title: 'Email',
      content: 'contato@edumarketplace.com.br',
      description: 'Resposta em até 24 horas'
    },
    {
      icon: <PhoneOutlined className="text-green-600 text-2xl" />,
      title: 'Telefone',
      content: '(11) 3000-0000',
      description: 'Seg a Sex, 9h às 18h'
    },
    {
      icon: <EnvironmentOutlined className="text-red-600 text-2xl" />,
      title: 'Endereço',
      content: 'São Paulo, SP - Brasil',
      description: 'Atendimento presencial com agendamento'
    },
    {
      icon: <ClockCircleOutlined className="text-purple-600 text-2xl" />,
      title: 'Horário de Atendimento',
      content: 'Segunda a Sexta',
      description: '9h às 18h (horário de Brasília)'
    }
  ]

  const faqItems = [
    {
      question: 'Como posso vender meus materiais?',
      answer: 'Cadastre-se gratuitamente e acesse o dashboard para publicar seus materiais.'
    },
    {
      question: 'Qual a taxa cobrada nas vendas?',
      answer: 'Cobramos uma taxa de 10% sobre cada venda realizada na plataforma.'
    },
    {
      question: 'Como recebo o pagamento das vendas?',
      answer: 'Os pagamentos são processados semanalmente via PIX ou transferência bancária.'
    },
    {
      question: 'Posso baixar novamente um material comprado?',
      answer: 'Sim, você tem acesso vitalício aos materiais comprados em sua área de compras.'
    }
  ]

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <Title level={1} className="text-white mb-4">
              Entre em Contato
            </Title>
            <Paragraph className="text-xl text-blue-100 max-w-2xl mx-auto">
              Estamos aqui para ajudar! Entre em contato conosco através dos canais abaixo 
              ou envie uma mensagem diretamente pelo formulário.
            </Paragraph>
          </div>
        </div>

        <div className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <Row gutter={[32, 32]}>
              {/* Informações de Contato */}
              <Col xs={24} lg={8}>
                <div className="space-y-6">
                  <Title level={3}>Informações de Contato</Title>
                  
                  {contactInfo.map((info, index) => (
                    <Card key={index} className="border-0 shadow-sm">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          {info.icon}
                        </div>
                        <div>
                          <Title level={5} className="mb-1">
                            {info.title}
                          </Title>
                          <Paragraph className="font-medium mb-1">
                            {info.content}
                          </Paragraph>
                          <Paragraph className="text-gray-600 text-sm mb-0">
                            {info.description}
                          </Paragraph>
                        </div>
                      </div>
                    </Card>
                  ))}

                  {/* Suporte Rápido */}
                  <Card className="bg-blue-50 border-blue-200">
                    <div className="text-center">
                      <CustomerServiceOutlined className="text-blue-600 text-3xl mb-3" />
                      <Title level={5} className="mb-2">
                        Precisa de Ajuda Rápida?
                      </Title>
                      <Paragraph className="text-gray-600 mb-4">
                        Consulte nossa central de ajuda com as perguntas mais frequentes.
                      </Paragraph>
                      <Button type="primary">
                        Acessar FAQ
                      </Button>
                    </div>
                  </Card>
                </div>
              </Col>

              {/* Formulário de Contato */}
              <Col xs={24} lg={16}>
                <Card title="Envie sua Mensagem" className="shadow-lg">
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    size="large"
                  >
                    <Row gutter={16}>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          name="name"
                          label="Nome Completo"
                          rules={[
                            { required: true, message: 'Por favor, digite seu nome' },
                            { min: 2, message: 'Nome deve ter pelo menos 2 caracteres' }
                          ]}
                        >
                          <Input placeholder="Seu nome completo" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          name="email"
                          label="Email"
                          rules={[
                            { required: true, message: 'Por favor, digite seu email' },
                            { type: 'email', message: 'Digite um email válido' }
                          ]}
                        >
                          <Input placeholder="seu@email.com" />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          name="phone"
                          label="Telefone (opcional)"
                        >
                          <Input placeholder="(11) 99999-9999" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          name="subject"
                          label="Assunto"
                          rules={[
                            { required: true, message: 'Por favor, selecione um assunto' }
                          ]}
                        >
                          <Select placeholder="Selecione o assunto">
                            <Option value="support">Suporte Técnico</Option>
                            <Option value="sales">Dúvidas sobre Vendas</Option>
                            <Option value="purchase">Problemas com Compras</Option>
                            <Option value="partnership">Parcerias</Option>
                            <Option value="suggestion">Sugestões</Option>
                            <Option value="other">Outros</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item
                      name="message"
                      label="Mensagem"
                      rules={[
                        { required: true, message: 'Por favor, digite sua mensagem' },
                        { min: 10, message: 'Mensagem deve ter pelo menos 10 caracteres' }
                      ]}
                    >
                      <TextArea
                        rows={6}
                        placeholder="Descreva sua dúvida, sugestão ou problema em detalhes..."
                        maxLength={1000}
                        showCount
                      />
                    </Form.Item>

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        icon={<SendOutlined />}
                        size="large"
                        block
                      >
                        {loading ? 'Enviando...' : 'Enviar Mensagem'}
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
              </Col>
            </Row>
          </div>
        </div>

        {/* FAQ Rápido */}
        <div className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <Title level={2}>Perguntas Frequentes</Title>
              <Paragraph className="text-lg text-gray-600">
                Encontre respostas rápidas para as dúvidas mais comuns
              </Paragraph>
            </div>

            <Row gutter={[24, 24]}>
              {faqItems.map((item, index) => (
                <Col xs={24} md={12} key={index}>
                  <Card className="h-full">
                    <Title level={5} className="mb-3">
                      {item.question}
                    </Title>
                    <Paragraph className="text-gray-600 mb-0">
                      {item.answer}
                    </Paragraph>
                  </Card>
                </Col>
              ))}
            </Row>

            <div className="text-center mt-8">
              <Space>
                <Button type="primary" size="large">
                  Ver Todas as Perguntas
                </Button>
                <Button size="large">
                  Central de Ajuda
                </Button>
              </Space>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Title level={2} className="text-white mb-6">
              Ainda não encontrou o que procura?
            </Title>
            <Paragraph className="text-xl text-green-100 mb-8">
              Nossa equipe de suporte está sempre pronta para ajudar você a aproveitar 
              ao máximo a plataforma EduMarketplace.
            </Paragraph>
            <Space size="large">
              <Button size="large" className="bg-white text-green-600 border-white hover:bg-gray-100">
                Agendar Conversa
              </Button>
              <Button size="large" type="default" ghost>
                Suporte por WhatsApp
              </Button>
            </Space>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

