'use client'

import { useState, useEffect } from 'react'
import { Typography, Card, Row, Col, Spin, message } from 'antd'
import { 
  BookOutlined,
  CalculatorOutlined,
  ExperimentOutlined,
  GlobalOutlined,
  PictureOutlined,
  MusicNoteOutlined,
  TrophyOutlined,
  HeartOutlined
} from '@ant-design/icons'
import Link from 'next/link'
import AppLayout from '@/components/Layout/AppLayout'
import { getCategories } from '@/lib/api'

const { Title, Paragraph } = Typography

interface Category {
  id: number
  name: string
  description: string
  count: number
  icon: string
}

export default function CategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  // Ícones para cada categoria
  const categoryIcons: { [key: string]: JSX.Element } = {
    'Matemática': <CalculatorOutlined className="text-blue-600 text-4xl" />,
    'Português': <BookOutlined className="text-green-600 text-4xl" />,
    'Ciências': <ExperimentOutlined className="text-purple-600 text-4xl" />,
    'História': <GlobalOutlined className="text-orange-600 text-4xl" />,
    'Geografia': <GlobalOutlined className="text-teal-600 text-4xl" />,
    'Arte': <PictureOutlined className="text-pink-600 text-4xl" />,
    'Música': <MusicNoteOutlined className="text-indigo-600 text-4xl" />,
    'Educação Física': <TrophyOutlined className="text-red-600 text-4xl" />,
    'Filosofia': <HeartOutlined className="text-gray-600 text-4xl" />
  }

  // Dados mock das categorias
  const mockCategories: Category[] = [
    {
      id: 1,
      name: 'Matemática',
      description: 'Planos de aula, exercícios e jogos matemáticos para todos os níveis',
      count: 1250,
      icon: 'Matemática'
    },
    {
      id: 2,
      name: 'Português',
      description: 'Materiais de língua portuguesa, literatura e interpretação de texto',
      count: 980,
      icon: 'Português'
    },
    {
      id: 3,
      name: 'Ciências',
      description: 'Experimentos, projetos e conteúdos de ciências naturais',
      count: 750,
      icon: 'Ciências'
    },
    {
      id: 4,
      name: 'História',
      description: 'Recursos didáticos sobre história do Brasil e mundial',
      count: 620,
      icon: 'História'
    },
    {
      id: 5,
      name: 'Geografia',
      description: 'Mapas, atividades e projetos de geografia física e humana',
      count: 540,
      icon: 'Geografia'
    },
    {
      id: 6,
      name: 'Arte',
      description: 'Projetos artísticos, técnicas de desenho e atividades criativas',
      count: 430,
      icon: 'Arte'
    },
    {
      id: 7,
      name: 'Música',
      description: 'Partituras, exercícios musicais e projetos de educação musical',
      count: 320,
      icon: 'Música'
    },
    {
      id: 8,
      name: 'Educação Física',
      description: 'Atividades esportivas, jogos e exercícios para desenvolvimento motor',
      count: 280,
      icon: 'Educação Física'
    },
    {
      id: 9,
      name: 'Filosofia',
      description: 'Textos, debates e atividades de reflexão filosófica',
      count: 150,
      icon: 'Filosofia'
    }
  ]

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        // Tentar buscar da API
        const response = await getCategories()
        if (response.success && response.data.length > 0) {
          setCategories(response.data)
        } else {
          // Usar dados mock se API falhar
          setCategories(mockCategories)
        }
      } catch (error) {
        console.error('Erro ao carregar categorias:', error)
        // Usar dados mock em caso de erro
        setCategories(mockCategories)
        message.info('Exibindo categorias de exemplo')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Spin size="large" />
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <Title level={1} className="text-white mb-4">
              Explore por Categorias
            </Title>
            <Paragraph className="text-xl text-blue-100 max-w-2xl mx-auto">
              Encontre materiais educacionais organizados por área de conhecimento. 
              Cada categoria contém recursos criados por professores especialistas.
            </Paragraph>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <Row gutter={[24, 24]}>
              {categories.map((category) => (
                <Col xs={24} sm={12} lg={8} key={category.id}>
                  <Link href={`/produtos?categoria=${encodeURIComponent(category.name)}`}>
                    <Card 
                      className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-sm hover:scale-105"
                      bodyStyle={{ padding: '24px' }}
                    >
                      <div className="text-center">
                        <div className="mb-4">
                          {categoryIcons[category.icon] || <BookOutlined className="text-gray-600 text-4xl" />}
                        </div>
                        <Title level={4} className="mb-3">
                          {category.name}
                        </Title>
                        <Paragraph className="text-gray-600 mb-4 min-h-[48px]">
                          {category.description}
                        </Paragraph>
                        <div className="bg-blue-50 rounded-lg p-3">
                          <Paragraph className="text-blue-600 font-medium mb-0">
                            {category.count.toLocaleString()} materiais disponíveis
                          </Paragraph>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Title level={2} className="mb-6">
              Não encontrou sua categoria?
            </Title>
            <Paragraph className="text-lg text-gray-600 mb-8">
              Nossa plataforma está sempre crescendo. Sugerir novas categorias ou 
              explore todos os materiais disponíveis.
            </Paragraph>
            <div className="space-x-4">
              <Link href="/produtos">
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Ver Todos os Materiais
                </button>
              </Link>
              <Link href="/contato">
                <button className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition-colors">
                  Sugerir Categoria
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

