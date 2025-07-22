'use client'

import { useState, useEffect } from 'react'
import { Typography, Card, Row, Col, Spin, message, Tag } from 'antd'
import { 
  BookOutlined,
  CalculatorOutlined,
  ExperimentOutlined,
  GlobalOutlined,
  PictureOutlined,
  MusicNoteOutlined,
  TrophyOutlined,
  HeartOutlined,
  BulbOutlined
} from '@ant-design/icons'
import Link from 'next/link'
import AppLayout from '@/components/Layout/AppLayout'
import { getSubjects } from '@/lib/api'

const { Title, Paragraph } = Typography

interface Subject {
  id: number
  name: string
  description: string
  count: number
  category: string
  level: string[]
  icon: string
}

export default function MateriasPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)

  // Ícones para cada matéria
  const subjectIcons: { [key: string]: JSX.Element } = {
    'Álgebra': <CalculatorOutlined className="text-blue-600 text-3xl" />,
    'Geometria': <CalculatorOutlined className="text-blue-500 text-3xl" />,
    'Literatura': <BookOutlined className="text-green-600 text-3xl" />,
    'Gramática': <BookOutlined className="text-green-500 text-3xl" />,
    'Biologia': <ExperimentOutlined className="text-purple-600 text-3xl" />,
    'Química': <ExperimentOutlined className="text-purple-500 text-3xl" />,
    'Física': <BulbOutlined className="text-yellow-600 text-3xl" />,
    'História do Brasil': <GlobalOutlined className="text-orange-600 text-3xl" />,
    'História Geral': <GlobalOutlined className="text-orange-500 text-3xl" />,
    'Geografia Física': <GlobalOutlined className="text-teal-600 text-3xl" />,
    'Geografia Humana': <GlobalOutlined className="text-teal-500 text-3xl" />,
    'Artes Visuais': <PictureOutlined className="text-pink-600 text-3xl" />,
    'Teatro': <PictureOutlined className="text-pink-500 text-3xl" />,
    'Educação Musical': <MusicNoteOutlined className="text-indigo-600 text-3xl" />,
    'Esportes': <TrophyOutlined className="text-red-600 text-3xl" />,
    'Ética': <HeartOutlined className="text-gray-600 text-3xl" />
  }

  // Cores para os níveis
  const levelColors: { [key: string]: string } = {
    'Fundamental I': 'green',
    'Fundamental II': 'blue',
    'Ensino Médio': 'purple',
    'EJA': 'orange',
    'Pré-escola': 'pink'
  }

  // Dados mock das matérias
  const mockSubjects: Subject[] = [
    {
      id: 1,
      name: 'Álgebra',
      description: 'Equações, funções e sistemas lineares',
      count: 450,
      category: 'Matemática',
      level: ['Fundamental II', 'Ensino Médio'],
      icon: 'Álgebra'
    },
    {
      id: 2,
      name: 'Geometria',
      description: 'Formas, áreas, volumes e geometria analítica',
      count: 380,
      category: 'Matemática',
      level: ['Fundamental I', 'Fundamental II', 'Ensino Médio'],
      icon: 'Geometria'
    },
    {
      id: 3,
      name: 'Literatura',
      description: 'Análise literária, autores e movimentos',
      count: 520,
      category: 'Português',
      level: ['Fundamental II', 'Ensino Médio'],
      icon: 'Literatura'
    },
    {
      id: 4,
      name: 'Gramática',
      description: 'Sintaxe, morfologia e ortografia',
      count: 460,
      category: 'Português',
      level: ['Fundamental I', 'Fundamental II', 'Ensino Médio'],
      icon: 'Gramática'
    },
    {
      id: 5,
      name: 'Biologia',
      description: 'Seres vivos, ecologia e genética',
      count: 340,
      category: 'Ciências',
      level: ['Fundamental II', 'Ensino Médio'],
      icon: 'Biologia'
    },
    {
      id: 6,
      name: 'Química',
      description: 'Átomos, moléculas e reações químicas',
      count: 280,
      category: 'Ciências',
      level: ['Ensino Médio'],
      icon: 'Química'
    },
    {
      id: 7,
      name: 'Física',
      description: 'Mecânica, termodinâmica e eletromagnetismo',
      count: 260,
      category: 'Ciências',
      level: ['Ensino Médio'],
      icon: 'Física'
    },
    {
      id: 8,
      name: 'História do Brasil',
      description: 'Colonização, império e república',
      count: 350,
      category: 'História',
      level: ['Fundamental II', 'Ensino Médio'],
      icon: 'História do Brasil'
    },
    {
      id: 9,
      name: 'História Geral',
      description: 'Civilizações antigas e história mundial',
      count: 270,
      category: 'História',
      level: ['Fundamental II', 'Ensino Médio'],
      icon: 'História Geral'
    },
    {
      id: 10,
      name: 'Geografia Física',
      description: 'Relevo, clima e recursos naturais',
      count: 290,
      category: 'Geografia',
      level: ['Fundamental II', 'Ensino Médio'],
      icon: 'Geografia Física'
    },
    {
      id: 11,
      name: 'Geografia Humana',
      description: 'População, urbanização e economia',
      count: 250,
      category: 'Geografia',
      level: ['Fundamental II', 'Ensino Médio'],
      icon: 'Geografia Humana'
    },
    {
      id: 12,
      name: 'Artes Visuais',
      description: 'Desenho, pintura e história da arte',
      count: 220,
      category: 'Arte',
      level: ['Fundamental I', 'Fundamental II', 'Ensino Médio'],
      icon: 'Artes Visuais'
    },
    {
      id: 13,
      name: 'Teatro',
      description: 'Expressão corporal e dramaturgia',
      count: 150,
      category: 'Arte',
      level: ['Fundamental II', 'Ensino Médio'],
      icon: 'Teatro'
    },
    {
      id: 14,
      name: 'Educação Musical',
      description: 'Teoria musical e prática instrumental',
      count: 180,
      category: 'Música',
      level: ['Fundamental I', 'Fundamental II', 'Ensino Médio'],
      icon: 'Educação Musical'
    },
    {
      id: 15,
      name: 'Esportes',
      description: 'Modalidades esportivas e atividades físicas',
      count: 200,
      category: 'Educação Física',
      level: ['Fundamental I', 'Fundamental II', 'Ensino Médio'],
      icon: 'Esportes'
    }
  ]

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true)
        // Tentar buscar da API
        const response = await getSubjects()
        if (response.success && response.data.length > 0) {
          setSubjects(response.data)
        } else {
          // Usar dados mock se API falhar
          setSubjects(mockSubjects)
        }
      } catch (error) {
        console.error('Erro ao carregar matérias:', error)
        // Usar dados mock em caso de erro
        setSubjects(mockSubjects)
        message.info('Exibindo matérias de exemplo')
      } finally {
        setLoading(false)
      }
    }

    fetchSubjects()
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
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <Title level={1} className="text-white mb-4">
              Explore por Matérias
            </Title>
            <Paragraph className="text-xl text-green-100 max-w-2xl mx-auto">
              Encontre materiais específicos para cada disciplina e nível de ensino. 
              Recursos organizados por especialistas em cada área.
            </Paragraph>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <Row gutter={[24, 24]}>
              {subjects.map((subject) => (
                <Col xs={24} sm={12} lg={8} key={subject.id}>
                  <Link href={`/produtos?materia=${encodeURIComponent(subject.name)}`}>
                    <Card 
                      className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-sm hover:scale-105"
                      bodyStyle={{ padding: '24px' }}
                    >
                      <div className="text-center">
                        <div className="mb-4">
                          {subjectIcons[subject.icon] || <BookOutlined className="text-gray-600 text-3xl" />}
                        </div>
                        <Title level={4} className="mb-2">
                          {subject.name}
                        </Title>
                        <Tag color="blue" className="mb-3">
                          {subject.category}
                        </Tag>
                        <Paragraph className="text-gray-600 mb-4 min-h-[48px]">
                          {subject.description}
                        </Paragraph>
                        
                        {/* Níveis de Ensino */}
                        <div className="mb-4">
                          <div className="flex flex-wrap justify-center gap-1">
                            {subject.level.map((level) => (
                              <Tag 
                                key={level} 
                                color={levelColors[level] || 'default'}
                                className="text-xs"
                              >
                                {level}
                              </Tag>
                            ))}
                          </div>
                        </div>

                        <div className="bg-green-50 rounded-lg p-3">
                          <Paragraph className="text-green-600 font-medium mb-0">
                            {subject.count.toLocaleString()} materiais disponíveis
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

        {/* Filter Info */}
        <div className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Title level={3} className="mb-4">
              Níveis de Ensino
            </Title>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {Object.entries(levelColors).map(([level, color]) => (
                <Tag key={level} color={color} className="text-sm px-3 py-1">
                  {level}
                </Tag>
              ))}
            </div>
            <Paragraph className="text-gray-600">
              Cada matéria indica os níveis de ensino para os quais possui materiais disponíveis.
            </Paragraph>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Title level={2} className="mb-6">
              Precisa de uma matéria específica?
            </Title>
            <Paragraph className="text-lg text-gray-600 mb-8">
              Use nossa busca avançada para encontrar exatamente o que precisa 
              ou explore todos os materiais disponíveis.
            </Paragraph>
            <div className="space-x-4">
              <Link href="/search">
                <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
                  Busca Avançada
                </button>
              </Link>
              <Link href="/produtos">
                <button className="border-2 border-green-600 text-green-600 px-8 py-3 rounded-lg font-medium hover:bg-green-600 hover:text-white transition-colors">
                  Ver Todos os Materiais
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

