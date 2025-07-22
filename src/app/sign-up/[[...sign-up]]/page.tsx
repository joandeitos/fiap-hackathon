'use client'

// import { SignUp } from '@clerk/nextjs'
import { Card, Typography, Row, Col, Button, Form, Input, Select } from 'antd'
import { 
  BookOutlined, 
  DollarOutlined, 
  UserOutlined,
  CheckCircleOutlined,
  LockOutlined,
  MailOutlined
} from '@ant-design/icons'
import Link from 'next/link'

const { Title, Paragraph } = Typography
const { Option } = Select

export default function SignUpPage() {
  const benefits = [
    {
      icon: <BookOutlined className="text-blue-600 text-xl" />,
      title: 'Acesso a Milhares de Materiais',
      description: 'Explore recursos educacionais de qualidade criados por professores experientes'
    },
    {
      icon: <DollarOutlined className="text-green-600 text-xl" />,
      title: 'Monetize seu Conhecimento',
      description: 'Venda seus materiais e transforme sua experiência em renda extra'
    },
    {
      icon: <UserOutlined className="text-purple-600 text-xl" />,
      title: 'Comunidade de Educadores',
      description: 'Conecte-se com outros professores e compartilhe experiências'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <Row gutter={[32, 32]} align="middle" className="min-h-screen">
          <Col xs={24} lg={12}>
            <div className="text-center lg:text-left">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto lg:mx-0 mb-6">
                <span className="text-white font-bold text-2xl">E</span>
              </div>
              
              <Title level={1} className="mb-4">
                Junte-se ao EduMarketplace
              </Title>
              
              <Paragraph className="text-lg text-gray-600 mb-8">
                Transforme sua paixão por ensinar em uma fonte de renda. 
                Conecte-se com milhares de educadores e alunos.
              </Paragraph>

              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg shadow-md flex items-center justify-center">
                      {benefit.icon}
                    </div>
                    <div>
                      <Title level={4} className="mb-1">
                        {benefit.title}
                      </Title>
                      <Paragraph className="text-gray-600 mb-0">
                        {benefit.description}
                      </Paragraph>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Col>

          <Col xs={24} lg={12}>
            <Card className="shadow-xl border-0 max-w-md mx-auto">
              <div className="text-center mb-6">
                <Title level={3} className="mb-2">
                  Criar Conta
                </Title>
                <Paragraph className="text-gray-600">
                  Preencha os dados abaixo para começar
                </Paragraph>
              </div>

              <Form
                name="signup"
                layout="vertical"
                onFinish={(values) => {
                  console.log('Cadastro:', values)
                  // Aqui seria a integração com autenticação
                }}
              >
                <Form.Item
                  name="name"
                  label="Nome Completo"
                  rules={[{ required: true, message: 'Por favor, insira seu nome!' }]}
                >
                  <Input 
                    prefix={<UserOutlined />} 
                    placeholder="Seu nome completo"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Por favor, insira seu email!' },
                    { type: 'email', message: 'Email inválido!' }
                  ]}
                >
                  <Input 
                    prefix={<MailOutlined />} 
                    placeholder="seu@email.com"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="userType"
                  label="Tipo de Usuário"
                  rules={[{ required: true, message: 'Selecione o tipo de usuário!' }]}
                >
                  <Select placeholder="Selecione..." size="large">
                    <Option value="teacher">Professor/Educador</Option>
                    <Option value="buyer">Comprador</Option>
                    <Option value="both">Ambos</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="password"
                  label="Senha"
                  rules={[
                    { required: true, message: 'Por favor, insira sua senha!' },
                    { min: 6, message: 'Senha deve ter pelo menos 6 caracteres!' }
                  ]}
                >
                  <Input.Password 
                    prefix={<LockOutlined />} 
                    placeholder="Sua senha"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  label="Confirmar Senha"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: 'Por favor, confirme sua senha!' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve()
                        }
                        return Promise.reject(new Error('As senhas não coincidem!'))
                      },
                    }),
                  ]}
                >
                  <Input.Password 
                    prefix={<LockOutlined />} 
                    placeholder="Confirme sua senha"
                    size="large"
                  />
                </Form.Item>

                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    size="large"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 border-0 hover:from-blue-700 hover:to-purple-700"
                  >
                    Criar Conta
                  </Button>
                </Form.Item>
              </Form>

              <div className="text-center">
                <Paragraph className="text-gray-600">
                  Já tem uma conta?{' '}
                  <Link href="/sign-in" className="text-blue-600 hover:text-blue-700 font-medium">
                    Entre aqui
                  </Link>
                </Paragraph>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}

