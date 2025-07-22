'use client'

import React, { useState, useEffect } from 'react'
import { 
  Row, 
  Col, 
  Card, 
  Button, 
  Input, 
  Select, 
  Slider, 
  Checkbox, 
  Tag, 
  Rate, 
  Typography, 
  Pagination,
  Spin,
  Empty,
  message,
  Drawer,
  Space
} from 'antd'
import { 
  SearchOutlined,
  FilterOutlined,
  ClearOutlined,
  BookOutlined,
  UserOutlined,
  DownloadOutlined
} from '@ant-design/icons'
import Link from 'next/link'
import AppLayout from '@/components/Layout/AppLayout'
import { getProducts, getCategories, getSubjects, Product } from '@/lib/api'

const { Title, Paragraph, Text } = Typography
const { Option } = Select

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100])
  const [selectedGradeLevels, setSelectedGradeLevels] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [subjects, setSubjects] = useState<string[]>([])
  const pageSize = 12

  const gradeLevels = ['1º ano', '2º ano', '3º ano', '4º ano', '5º ano', '6º ano', '7º ano', '8º ano', '9º ano']

  // Load initial data
  useEffect(() => {
    loadCategories()
    loadSubjects()
    loadMockProducts() // Load mock data immediately
  }, [])

  // Load products when filters change
  useEffect(() => {
    loadMockProducts()
  }, [currentPage, searchTerm, selectedCategory, selectedSubject, priceRange, selectedGradeLevels])

  const loadCategories = async () => {
    try {
      const response = await getCategories()
      if (response.success && response.data) {
        setCategories(response.data)
      } else {
        // Mock categories
        setCategories(['Planos de Aula', 'Atividades', 'Experimentos', 'Material Didático', 'Jogos Educativos', 'Arte e Criatividade'])
      }
    } catch (error) {
      console.error('Error loading categories:', error)
      setCategories(['Planos de Aula', 'Atividades', 'Experimentos', 'Material Didático', 'Jogos Educativos', 'Arte e Criatividade'])
    }
  }

  const loadSubjects = async () => {
    try {
      const response = await getSubjects()
      if (response.success && response.data) {
        setSubjects(response.data)
      } else {
        // Mock subjects
        setSubjects(['Matemática', 'Português', 'Ciências', 'História', 'Geografia', 'Arte', 'Educação Física'])
      }
    } catch (error) {
      console.error('Error loading subjects:', error)
      setSubjects(['Matemática', 'Português', 'Ciências', 'História', 'Geografia', 'Arte', 'Educação Física'])
    }
  }

  const loadMockProducts = () => {
    setLoading(true)
    
    const mockProducts: Product[] = [
      {
        id: 1,
        title: 'Plano de Aula: Matemática Básica - Frações',
        description: 'Conjunto completo de atividades para ensinar frações de forma lúdica e interativa. Inclui exercícios práticos, jogos educativos e avaliações formativas.',
        price: 15.90,
        category: 'Planos de Aula',
        subject: 'Matemática',
        gradeLevel: ['4º ano', '5º ano'],
        rating: 4.8,
        reviewCount: 24,
        downloadCount: 156,
        author: {
          id: 1,
          name: 'Prof. Maria Silva',
          email: 'maria@email.com',
          rating: 4.9
        },
        thumbnailUrl: '/api/placeholder/300/200',
        tags: ['Frações', 'Matemática Básica', 'Ensino Fundamental'],
        createdAt: '2025-01-10T00:00:00Z',
        updatedAt: '2025-01-10T00:00:00Z',
        status: 'active',
        totalRevenue: 0
      },
      {
        id: 2,
        title: 'Atividades de Português - Interpretação de Texto',
        description: 'Material completo para desenvolver habilidades de interpretação textual com textos variados e questões elaboradas.',
        price: 12.50,
        category: 'Atividades',
        subject: 'Português',
        gradeLevel: ['3º ano', '4º ano', '5º ano'],
        rating: 4.6,
        reviewCount: 18,
        downloadCount: 89,
        author: {
          id: 2,
          name: 'Prof. Ana Costa',
          email: 'ana@email.com',
          rating: 4.7
        },
        thumbnailUrl: '/api/placeholder/300/200',
        tags: ['Interpretação', 'Leitura', 'Português'],
        createdAt: '2025-01-08T00:00:00Z',
        updatedAt: '2025-01-08T00:00:00Z',
        status: 'active',
        totalRevenue: 0
      },
      {
        id: 3,
        title: 'Experimentos de Ciências - Sistema Solar',
        description: 'Atividades práticas e experimentos para ensinar sobre o sistema solar de forma divertida e educativa.',
        price: 18.90,
        category: 'Experimentos',
        subject: 'Ciências',
        gradeLevel: ['4º ano', '5º ano', '6º ano'],
        rating: 4.9,
        reviewCount: 32,
        downloadCount: 124,
        author: {
          id: 3,
          name: 'Prof. Carlos Santos',
          email: 'carlos@email.com',
          rating: 4.8
        },
        thumbnailUrl: '/api/placeholder/300/200',
        tags: ['Sistema Solar', 'Experimentos', 'Astronomia'],
        createdAt: '2025-01-05T00:00:00Z',
        updatedAt: '2025-01-05T00:00:00Z',
        status: 'active',
        totalRevenue: 0
      },
      {
        id: 4,
        title: 'História do Brasil - Linha do Tempo',
        description: 'Material didático com linha do tempo interativa da história do Brasil, incluindo atividades e exercícios.',
        price: 22.00,
        category: 'Material Didático',
        subject: 'História',
        gradeLevel: ['6º ano', '7º ano', '8º ano'],
        rating: 4.7,
        reviewCount: 15,
        downloadCount: 67,
        author: {
          id: 4,
          name: 'Prof. Lucia Ferreira',
          email: 'lucia@email.com',
          rating: 4.6
        },
        thumbnailUrl: '/api/placeholder/300/200',
        tags: ['História do Brasil', 'Linha do Tempo', 'Ensino Fundamental'],
        createdAt: '2025-01-03T00:00:00Z',
        updatedAt: '2025-01-03T00:00:00Z',
        status: 'active',
        totalRevenue: 0
      },
      {
        id: 5,
        title: 'Jogos Educativos - Tabuada Divertida',
        description: 'Coleção de jogos e atividades lúdicas para ensinar e praticar a tabuada de multiplicação.',
        price: 14.90,
        category: 'Jogos Educativos',
        subject: 'Matemática',
        gradeLevel: ['2º ano', '3º ano', '4º ano'],
        rating: 4.5,
        reviewCount: 28,
        downloadCount: 198,
        author: {
          id: 5,
          name: 'Prof. Roberto Lima',
          email: 'roberto@email.com',
          rating: 4.4
        },
        thumbnailUrl: '/api/placeholder/300/200',
        tags: ['Tabuada', 'Jogos', 'Multiplicação'],
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
        status: 'active',
        totalRevenue: 0
      },
      {
        id: 6,
        title: 'Arte e Criatividade - Técnicas de Pintura',
        description: 'Guia completo com técnicas de pintura para crianças, incluindo materiais necessários e passo a passo.',
        price: 16.50,
        category: 'Arte e Criatividade',
        subject: 'Arte',
        gradeLevel: ['1º ano', '2º ano', '3º ano', '4º ano'],
        rating: 4.8,
        reviewCount: 21,
        downloadCount: 76,
        author: {
          id: 6,
          name: 'Prof. Marina Oliveira',
          email: 'marina@email.com',
          rating: 4.9
        },
        thumbnailUrl: '/api/placeholder/300/200',
        tags: ['Pintura', 'Arte', 'Criatividade'],
        createdAt: '2024-12-28T00:00:00Z',
        updatedAt: '2024-12-28T00:00:00Z',
        status: 'active',
        totalRevenue: 0
      }
    ]

    // Apply filters to mock data
    let filteredProducts = mockProducts

    if (searchTerm) {
      filteredProducts = filteredProducts.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (selectedCategory !== 'all') {
      filteredProducts = filteredProducts.filter(product => product.category === selectedCategory)
    }

    if (selectedSubject !== 'all') {
      filteredProducts = filteredProducts.filter(product => product.subject === selectedSubject)
    }

    if (selectedGradeLevels.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        product.gradeLevel.some(level => selectedGradeLevels.includes(level))
      )
    }

    filteredProducts = filteredProducts.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    )

    setProducts(filteredProducts)
    setTotalProducts(filteredProducts.length)
    setLoading(false)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const clearFilters = () => {
    setSelectedCategory('all')
    setSelectedSubject('all')
    setPriceRange([0, 100])
    setSelectedGradeLevels([])
    setSearchTerm('')
    setCurrentPage(1)
  }

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <Title level={5}>Categoria</Title>
        <Select
          value={selectedCategory}
          onChange={setSelectedCategory}
          className="w-full"
        >
          <Option value="all">Todas as Categorias</Option>
          {categories.map(category => (
            <Option key={category} value={category}>
              {category}
            </Option>
          ))}
        </Select>
      </div>

      <div>
        <Title level={5}>Matéria</Title>
        <Select
          value={selectedSubject}
          onChange={setSelectedSubject}
          className="w-full"
        >
          <Option value="all">Todas as Matérias</Option>
          {subjects.map(subject => (
            <Option key={subject} value={subject}>
              {subject}
            </Option>
          ))}
        </Select>
      </div>

      <div>
        <Title level={5}>Faixa de Preço</Title>
        <Slider
          range
          min={0}
          max={100}
          value={priceRange}
          onChange={setPriceRange}
          marks={{
            0: 'R$ 0',
            50: 'R$ 50',
            100: 'R$ 100+'
          }}
        />
        <div className="text-center mt-2">
          <Text>{formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}</Text>
        </div>
      </div>

      <div>
        <Title level={5}>Ano Escolar</Title>
        <Checkbox.Group
          options={gradeLevels}
          value={selectedGradeLevels}
          onChange={setSelectedGradeLevels}
          className="flex flex-col space-y-2"
        />
      </div>

      <Button 
        onClick={clearFilters}
        icon={<ClearOutlined />}
        className="w-full"
      >
        Limpar Filtros
      </Button>
    </div>
  )

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Title level={2}>Catálogo de Materiais Educacionais</Title>
          <Paragraph className="text-lg text-gray-600">
            Descubra recursos incríveis criados por professores para professores
          </Paragraph>
        </div>

        {/* Search and Results Count */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} md={16}>
            <Input
              size="large"
              placeholder="Buscar materiais educacionais..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col xs={24} md={8} className="flex justify-between items-center">
            <Text strong>{totalProducts} materiais encontrados</Text>
            <Button
              icon={<FilterOutlined />}
              onClick={() => setFilterDrawerVisible(true)}
              className="md:hidden"
            >
              Filtros
            </Button>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          {/* Filters Sidebar - Desktop */}
          <Col xs={0} md={6}>
            <Card title="Filtros" className="sticky top-4">
              <FilterContent />
            </Card>
          </Col>

          {/* Products Grid */}
          <Col xs={24} md={18}>
            {loading ? (
              <div className="text-center py-12">
                <Spin size="large" />
              </div>
            ) : products.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div>
                    <Title level={4}>Nenhum material encontrado</Title>
                    <Paragraph>Tente ajustar os filtros ou termos de busca</Paragraph>
                  </div>
                }
              />
            ) : (
              <>
                <Row gutter={[16, 16]}>
                  {products.map(product => (
                    <Col key={product.id} xs={24} sm={12} lg={8}>
                      <Card
                        hoverable
                        cover={
                          <div className="h-48 bg-gray-200 flex items-center justify-center">
                            <BookOutlined className="text-4xl text-gray-400" />
                          </div>
                        }
                        actions={[
                          <Link key="view" href={`/produtos/${product.id}`}>
                            <Button type="primary" block>
                              Ver Detalhes
                            </Button>
                          </Link>
                        ]}
                      >
                        <div className="space-y-3">
                          <div>
                            <Space wrap>
                              <Tag color="blue">{product.category}</Tag>
                              <Tag color="green">{product.subject}</Tag>
                            </Space>
                          </div>

                          <Title level={5} className="line-clamp-2">
                            {product.title}
                          </Title>

                          <Paragraph className="text-gray-600 line-clamp-2">
                            {product.description}
                          </Paragraph>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Rate disabled defaultValue={product.rating} allowHalf size="small" />
                              <Text className="text-sm text-gray-500">
                                ({product.reviewCount})
                              </Text>
                            </div>
                            <div className="flex items-center space-x-1 text-gray-500">
                              <DownloadOutlined />
                              <Text className="text-sm">{product.downloadCount}</Text>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <UserOutlined className="text-gray-400" />
                              <Text className="text-sm">{product.author.name}</Text>
                            </div>
                            <Text strong className="text-lg text-blue-600">
                              {formatPrice(product.price)}
                            </Text>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>

                {/* Pagination */}
                {totalProducts > pageSize && (
                  <div className="text-center mt-8">
                    <Pagination
                      current={currentPage}
                      total={totalProducts}
                      pageSize={pageSize}
                      onChange={setCurrentPage}
                      showSizeChanger={false}
                      showQuickJumper
                      showTotal={(total, range) =>
                        `${range[0]}-${range[1]} de ${total} materiais`
                      }
                    />
                  </div>
                )}
              </>
            )}
          </Col>
        </Row>

        {/* Mobile Filter Drawer */}
        <Drawer
          title="Filtros"
          placement="right"
          onClose={() => setFilterDrawerVisible(false)}
          open={filterDrawerVisible}
          width={300}
        >
          <FilterContent />
        </Drawer>
      </div>
    </AppLayout>
  )
}

