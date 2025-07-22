'use client'

// import { SignIn } from '@clerk/nextjs'
import { Card, Typography, Button, Form, Input } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import Link from 'next/link'

const { Title, Paragraph } = Typography

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
            <span className="text-white font-bold text-2xl">E</span>
          </div>
          <Title level={2} className="mb-2">
            Bem-vindo de volta!
          </Title>
          <Paragraph className="text-gray-600">
            Entre na sua conta para acessar o EduMarketplace
          </Paragraph>
        </div>

        <Card className="shadow-xl border-0">
          <Form
            name="signin"
            layout="vertical"
            onFinish={(values) => {
              console.log('Login:', values)
              // Aqui seria a integração com autenticação
            }}
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Por favor, insira seu email!' },
                { type: 'email', message: 'Email inválido!' }
              ]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="seu@email.com"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Senha"
              rules={[{ required: true, message: 'Por favor, insira sua senha!' }]}
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="Sua senha"
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
                Entrar
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center">
            <Paragraph className="text-gray-600">
              Não tem uma conta?{' '}
              <Link href="/sign-up" className="text-blue-600 hover:text-blue-700 font-medium">
                Cadastre-se aqui
              </Link>
            </Paragraph>
          </div>
        </Card>
      </div>
    </div>
  )
}

