'use client'

import React, { useState } from 'react'
import { Layout, Menu, Button, Drawer, Avatar, Dropdown, Space } from 'antd'
import { 
  MenuOutlined, 
  HomeOutlined, 
  ShopOutlined, 
  DashboardOutlined,
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  SettingOutlined
} from '@ant-design/icons'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser, SignOutButton } from '@clerk/nextjs'

const { Header, Content, Footer } = Layout

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false)
  const { isSignedIn, user } = useUser()
  const pathname = usePathname()

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link href="/">Início</Link>,
    },
    {
      key: '/produtos',
      icon: <ShopOutlined />,
      label: <Link href="/produtos">Produtos</Link>,
    },
    {
      key: '/upload',
      icon: <UserOutlined />,
      label: <Link href="/upload">Publicar</Link>,
    },
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: <Link href="/dashboard">Dashboard</Link>,
    },
  ]

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link href="/profile">Meu Perfil</Link>,
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: <Link href="/profile">Configurações</Link>,
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: (
        <SignOutButton>
          Sair
        </SignOutButton>
      ),
    },
  ]

  return (
    <Layout>
      <Header className="flex items-center justify-between px-4 lg:px-8 bg-white shadow-sm border-b border-gray-100">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">EduMarketplace</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-gray-800">
                EduMarketplace
              </span>
              <p className="text-xs text-gray-500 -mt-1">Transformando Educação</p>
            </div>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Menu
            mode="horizontal"
            selectedKeys={[pathname]}
            items={menuItems}
            className="border-none bg-transparent text-gray-700"
            style={{ 
              fontSize: '16px',
              fontWeight: '500'
            }}
          />
          
          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {isSignedIn ? (
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <Space className="cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
                  <Avatar 
                    src={user?.imageUrl} 
                    icon={<UserOutlined />} 
                    className="bg-blue-600" 
                  />
                  <span className="text-gray-700 font-medium">
                    {user?.firstName || 'Usuário'}
                  </span>
                </Space>
              </Dropdown>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/sign-in">
                  <Button 
                    type="text" 
                    icon={<LoginOutlined />}
                    className="font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                    size="large"
                  >
                    Entrar
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button 
                    type="primary"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 border-none font-medium shadow-lg hover:shadow-xl transition-all"
                    size="large"
                  >
                    Cadastrar
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <Button
          className="md:hidden bg-gradient-to-r from-blue-600 to-purple-600 border-none hover:from-blue-700 hover:to-purple-700"
          type="primary"
          icon={<MenuOutlined className="text-white" />}
          onClick={() => setMobileMenuVisible(true)}
        />

        {/* Mobile Drawer */}
        <Drawer
          title="Menu"
          placement="right"
          onClose={() => setMobileMenuVisible(false)}
          open={mobileMenuVisible}
          width={280}
        >
          <Menu
            mode="vertical"
            selectedKeys={[pathname]}
            items={menuItems}
            className="border-none"
          />
          
          <div className="mt-8 pt-8 border-t border-gray-200">
            {isSignedIn ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar 
                    src={user?.imageUrl} 
                    icon={<UserOutlined />} 
                    className="bg-blue-600" 
                  />
                  <span className="text-gray-700">
                    {user?.firstName || 'Usuário'}
                  </span>
                </div>
                <Menu
                  mode="vertical"
                  items={userMenuItems}
                  className="border-none"
                />
              </div>
            ) : (
              <div className="space-y-3">
                <Link href="/sign-in">
                  <Button 
                    type="default" 
                    icon={<LoginOutlined />}
                    block
                    onClick={() => setMobileMenuVisible(false)}
                  >
                    Entrar
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button 
                    type="primary"
                    block
                    onClick={() => setMobileMenuVisible(false)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 border-none"
                  >
                    Cadastrar
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </Drawer>
      </Header>

      <Content className="min-h-screen">
        {children}
      </Content>

      <Footer>
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-600">
            © 2025 EduMarketplace. Todos os direitos reservados.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Conectando professores e transformando a educação
          </p>
        </div>
      </Footer>
    </Layout>
  )
}

