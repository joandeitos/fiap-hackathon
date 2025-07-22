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

const { Header, Content, Footer } = Layout

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false) // Simular estado de login
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
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: <Link href="/dashboard">Dashboard</Link>,
    },
  ]

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Meu Perfil',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Configurações',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Sair',
      onClick: () => setIsLoggedIn(false),
    },
  ]

  return (
    <Layout>
      <Header className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-xl font-bold text-gray-800 hidden sm:block">
              EduMarketplace
            </span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Menu
            mode="horizontal"
            selectedKeys={[pathname]}
            items={menuItems}
            className="border-none bg-transparent"
          />
          
          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <Space className="cursor-pointer">
                  <Avatar icon={<UserOutlined />} />
                  <span className="text-gray-700">João Silva</span>
                </Space>
              </Dropdown>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  type="default" 
                  icon={<LoginOutlined />}
                  onClick={() => setIsLoggedIn(true)}
                >
                  Entrar
                </Button>
                <Button 
                  type="primary"
                  onClick={() => setIsLoggedIn(true)}
                >
                  Cadastrar
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <Button
          className="md:hidden"
          type="text"
          icon={<MenuOutlined />}
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
            {isLoggedIn ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar icon={<UserOutlined />} />
                  <span className="text-gray-700">João Silva</span>
                </div>
                <Menu
                  mode="vertical"
                  items={userMenuItems}
                  className="border-none"
                />
              </div>
            ) : (
              <div className="space-y-3">
                <Button 
                  type="default" 
                  icon={<LoginOutlined />}
                  block
                  onClick={() => {
                    setIsLoggedIn(true)
                    setMobileMenuVisible(false)
                  }}
                >
                  Entrar
                </Button>
                <Button 
                  type="primary"
                  block
                  onClick={() => {
                    setIsLoggedIn(true)
                    setMobileMenuVisible(false)
                  }}
                >
                  Cadastrar
                </Button>
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

