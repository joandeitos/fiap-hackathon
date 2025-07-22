'use client'

import { Typography, Card, Row, Col, Avatar, Statistic } from 'antd'
import { 
  TeamOutlined, 
  BookOutlined, 
  TrophyOutlined,
  HeartOutlined,
  RocketOutlined,
  GlobalOutlined
} from '@ant-design/icons'
import AppLayout from '@/components/Layout/AppLayout'

const { Title, Paragraph } = Typography

export default function AboutPage() {
  const stats = [
    { title: 'Professores Cadastrados', value: '15,000+', icon: <TeamOutlined /> },
    { title: 'Materiais Disponíveis', value: '50,000+', icon: <BookOutlined /> },
    { title: 'Downloads Realizados', value: '500,000+', icon: <TrophyOutlined /> },
    { title: 'Estados Atendidos', value: '27', icon: <GlobalOutlined /> }
  ]

  const team = [
    {
      name: 'Ana Silva',
      role: 'CEO & Fundadora',
      description: 'Professora há 15 anos, especialista em educação digital',
      avatar: 'A'
    },
    {
      name: 'Carlos Santos',
      role: 'CTO',
      description: 'Engenheiro de software com foco em EdTech',
      avatar: 'C'
    },
    {
      name: 'Maria Costa',
      role: 'Head de Educação',
      description: 'Pedagoga e consultora educacional',
      avatar: 'M'
    },
    {
      name: 'João Oliveira',
      role: 'Head de Produto',
      description: 'Product Manager especializado em plataformas educacionais',
      avatar: 'J'
    }
  ]

  const values = [
    {
      icon: <HeartOutlined className="text-red-500 text-3xl" />,
      title: 'Paixão pela Educação',
      description: 'Acreditamos que a educação transforma vidas e sociedades'
    },
    {
      icon: <RocketOutlined className="text-blue-500 text-3xl" />,
      title: 'Inovação Constante',
      description: 'Sempre buscamos novas formas de melhorar o ensino'
    },
    {
      icon: <TeamOutlined className="text-green-500 text-3xl" />,
      title: 'Comunidade Forte',
      description: 'Valorizamos a colaboração entre educadores'
    }
  ]

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <Title level={1} className="text-white mb-6">
              Sobre o EduMarketplace
            </Title>
            <Paragraph className="text-xl text-blue-100 max-w-3xl mx-auto">
              Somos uma plataforma criada por educadores, para educadores. Nossa missão é democratizar 
              o acesso a materiais educacionais de qualidade e valorizar o trabalho dos professores brasileiros.
            </Paragraph>
          </div>
        </div>

        {/* Stats Section */}
        <div className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <Row gutter={[32, 32]}>
              {stats.map((stat, index) => (
                <Col xs={12} md={6} key={index}>
                  <Card className="text-center border-0 shadow-sm">
                    <div className="text-blue-600 text-3xl mb-4">
                      {stat.icon}
                    </div>
                    <Statistic
                      title={stat.title}
                      value={stat.value}
                      valueStyle={{ color: '#1890ff', fontSize: '2rem', fontWeight: 'bold' }}
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </div>

        {/* Mission Section */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <Row gutter={[48, 48]} align="middle">
              <Col xs={24} lg={12}>
                <Title level={2}>Nossa História</Title>
                <Paragraph className="text-lg text-gray-600 mb-6">
                  O EduMarketplace nasceu da necessidade real de professores que buscavam materiais 
                  de qualidade e queriam monetizar seu conhecimento. Fundado em 2023 por educadores 
                  experientes, crescemos rapidamente para nos tornar a maior plataforma de recursos 
                  educacionais do Brasil.
                </Paragraph>
                <Paragraph className="text-lg text-gray-600">
                  Hoje, conectamos milhares de professores em todo o país, facilitando o compartilhamento 
                  de conhecimento e a melhoria da qualidade do ensino brasileiro.
                </Paragraph>
              </Col>
              <Col xs={24} lg={12}>
                <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-0">
                  <div className="text-center p-8">
                    <Title level={3}>Nossa Missão</Title>
                    <Paragraph className="text-gray-600 text-lg">
                      &quot;Transformar a educação brasileira através da colaboração entre professores, 
                      democratizando o acesso a materiais de qualidade e valorizando o trabalho docente.&quot;
                    </Paragraph>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </div>

        {/* Values Section */}
        <div className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <Title level={2}>Nossos Valores</Title>
              <Paragraph className="text-lg text-gray-600">
                Os princípios que guiam nosso trabalho diário
              </Paragraph>
            </div>
            <Row gutter={[32, 32]}>
              {values.map((value, index) => (
                <Col xs={24} md={8} key={index}>
                  <Card className="h-full text-center border-0 shadow-sm">
                    <div className="mb-4">{value.icon}</div>
                    <Title level={4}>{value.title}</Title>
                    <Paragraph className="text-gray-600">
                      {value.description}
                    </Paragraph>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </div>

        {/* Team Section */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <Title level={2}>Nossa Equipe</Title>
              <Paragraph className="text-lg text-gray-600">
                Conheça as pessoas por trás do EduMarketplace
              </Paragraph>
            </div>
            <Row gutter={[32, 32]}>
              {team.map((member, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <Card className="text-center border-0 shadow-sm">
                    <Avatar size={80} className="bg-blue-600 mb-4">
                      {member.avatar}
                    </Avatar>
                    <Title level={4} className="mb-2">{member.name}</Title>
                    <Paragraph className="text-blue-600 font-medium mb-3">
                      {member.role}
                    </Paragraph>
                    <Paragraph className="text-gray-600 text-sm">
                      {member.description}
                    </Paragraph>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Title level={2} className="text-white mb-6">
              Junte-se à Nossa Comunidade
            </Title>
            <Paragraph className="text-xl text-blue-100 mb-8">
              Faça parte da maior rede de educadores do Brasil. Compartilhe conhecimento, 
              encontre recursos incríveis e transforme a educação junto conosco.
            </Paragraph>
            <div className="space-x-4">
              <a href="/sign-up" className="inline-block">
                <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                  Cadastre-se Gratuitamente
                </button>
              </a>
              <a href="/contato" className="inline-block">
                <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors">
                  Entre em Contato
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

