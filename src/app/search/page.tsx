'use client'

import { useState, useEffect } from 'react'
import { 
  Typography, 
  Card, 
  Row, 
  Col, 
  Input,
  Select,
  Slider,
  Button,
  Checkbox,
  List,
  Rate,
  Tag,
  Pagination,
  Spin,
  Empty,
  message
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

const { Title } = Typography
const { Option } = Select
const { CheckboxGroup } = Checkbox

interface SearchFilters {
  query: string
  category: string
  subject: string
  priceRange: [number, number]
  rating: number
  level: string[]
  sortBy: string
}

interface Product {
  id: number
  title: string
  description: string
  price: number
  author: string
  category: string
  subject: string
  rating: number
  downloadCount: number
  level: string[]
  tags: string[]
}

export default function SearchPage() {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: '',
    subject: '',
    priceRange: [0, 100],
    rating: 0,
    level: [],
    sortBy: 'relevance'
  })
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(12)

  // Dados mock de produtos
  const mockProducts: Product[] = [
    {
      id: 1,
      title: 'Plano de Aula: Matemática Básica - Frações',
      description: 'Conjunto completo de atividades para ensinar frações de forma lúdica e interativa.',
      price: 15.90,
      author: 'Prof. Maria Silva',
      category: 'Matemática',
      subject: 'Álgebra',
      rating: 4.8,
      downloadCount: 156,
      level: ['Fundamental II'],
      tags: ['frações', 'matemática básica', 'atividades']
    },
    {
      id: 2,
      title: 'Atividades de Português - Interpretação de Texto',
      description: 'Material didático com 20 textos diversos e questões de interpretação.',
      price: 22.50,
      author: 'Prof. João Santos',
      category: 'Português',
      subject: 'Literatura',
      rating: 4.9,
      downloadCount: 203,
      level: ['Fundamental II', 'Ensino Médio'],
      tags: ['interpretação', 'leitura', 'português']
    },
    {
      id: 3,
      title: 'Experimentos de Ciências - Sistema Solar',
      description: 'Roteiros de experimentos práticos sobre astronomia e sistema solar.',
      price: 18.00,
      author: 'Prof. Ana Costa',
      category: 'Ciências',
      subject: 'Física',
      rating: 4.7,
      downloadCount: 89,
      level: ['Fundamental II'],
      tags: ['astronomia', 'experimentos', 'sistema solar']
    },
    {
      id: 4,
      title: 'História do Brasil - Linha do Tempo',
      description: 'Material visual com linha do tempo interativa da história brasileira.',
      price: 25.00,
      author: 'Prof. Carlos Lima',
      category: 'História',
      subject: 'História do Brasil',
      rating: 4.6,
      downloadCount: 134,
      level: ['Ensino Médio'],
      tags: ['história', 'brasil', 'linha do tempo']
    },
    {
      id: 5,
      title: 'Jogos Educativos - Tabuada Divertida',
      description: 'Jogos e atividades lúdicas para memorização da tabuada.',
      price: 12.90,
      author: 'Prof. Lucia Ferreira',
      category: 'Matemática',
      subject: 'Aritmética',
      rating: 4.9,
      downloadCount: 267,
      level: ['Fundamental I'],
      tags: ['tabuada', 'jogos', 'matemática']
    },
    {
      id: 6,
      title: 'Arte e Criatividade - Técnicas de Pintura',
      description: 'Guia completo com técnicas de pintura para iniciantes.',
      price: 20.00,
      author: 'Prof. Roberto Silva',
      category: 'Arte',
      subject: 'Artes Visuais',
      rating: 4.5,
      downloadCount: 78,
      level: ['Fundamental I', 'Fundamental II'],
      tags: ['arte', 'pintura', 'criatividade']
    }
  ]

  const categories = ['Matemática', 'Português', 'Ciências', 'História', 'Geografia', 'Arte', 'Música', 'Educação Física']
  const subjects = ['Álgebra', 'Geometria', 'Literatura', 'Gramática', 'Biologia', 'Química', 'Física', 'História do Brasil', 'Artes Visuais']
  const levels = ['Pré-escola', 'Fundamental I', 'Fundamental II', 'Ensino Médio', 'EJA']
  const sortOptions = [
    { value: 'relevance', label: 'Relevância' },
    { value: 'price_asc', label: 'Menor Preço' },
    { value: 'price_desc', label: 'Maior Preço' },
    { value: 'rating', label: 'Melhor Avaliação' },
    { value: 'downloads', label: 'Mais Baixados' },
    { value: 'newest', label: 'Mais Recentes' }
  ]

  useEffect(() => {
    setProducts(mockProducts)
    setFilteredProducts(mockProducts)
  }, [])

  useEffect(() => {
    applyFilters()
  }, [filters, products])

  const applyFilters = () => {
    setLoading(true)
    
    setTimeout(() => {
      let filtered = [...products]

      // Filtro por texto
      if (filters.query) {
        const query = filters.query.toLowerCase()
        filtered = filtered.filter(product => 
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.tags.some(tag => tag.toLowerCase().includes(query)) ||
          product.author.toLowerCase().includes(query)
        )
      }

      // Filtro por categoria
      if (filters.category) {
        filtered = filtered.filter(product => product.category === filters.category)
      }

      // Filtro por matéria
      if (filters.subject) {
        filtered = filtered.filter(product => product.subject === filters.subject)
      }

      // Filtro por faixa de preço
      filtered = filtered.filter(product => 
        product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
      )

      // Filtro por avaliação
      if (filters.rating > 0) {
        filtered = filtered.filter(product => product.rating >= filters.rating)
      }

      // Filtro por nível
      if (filters.level.length > 0) {
        filtered = filtered.filter(product => 
          product.level.some(level => filters.level.includes(level))
        )
      }

      // Ordenação
      switch (filters.sortBy) {
        case 'price_asc':
          filtered.sort((a, b) => a.price - b.price)
          break
        case 'price_desc':
          filtered.sort((a, b) => b.price - a.price)
          break
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating)
          break
        case 'downloads':
          filtered.sort((a, b) => b.downloadCount - a.downloadCount)
          break
        default:
          // Relevância (manter ordem original)
          break
      }

      setFilteredProducts(filtered)
      setCurrentPage(1)
      setLoading(false)
    }, 500)
  }

  const clearFilters = () => {
    setFilters({
      query: '',
      category: '',
      subject: '',
      priceRange: [0, 100],
      rating: 0,
      level: [],
      sortBy: 'relevance'
    })
    message.info('Filtros limpos')
  }

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, query: value }))
  }

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <Title level={2}>Busca Avançada</Title>
            <p className="text-gray-600">Encontre exatamente o material que você precisa</p>
          </div>

          <Row gutter={[24, 24]}>
            {/* Sidebar de Filtros */}
            <Col xs={24} lg={6}>
              <Card title={
                <div className="flex items-center justify-between">
                  <span><FilterOutlined className="mr-2" />Filtros</span>
                  <Button 
                    type="link" 
                    size="small" 
                    icon={<ClearOutlined />}
                    onClick={clearFilters}
                  >
                    Limpar
                  </Button>
                </div>
              }>
                <div className="space-y-6">
                  {/* Busca por texto */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Buscar por:
                    </label>
                    <Input
                      placeholder="Digite palavras-chave..."
                      prefix={<SearchOutlined />}
                      value={filters.query}
                      onChange={(e) => handleSearch(e.target.value)}
                      allowClear
                    />
                  </div>

                  {/* Categoria */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoria:
                    </label>
                    <Select
                      placeholder="Selecione uma categoria"
                      style={{ width: '100%' }}
                      value={filters.category || undefined}
                      onChange={(value) => setFilters(prev => ({ ...prev, category: value || '' }))}
                      allowClear
                    >
                      {categories.map(category => (
                        <Option key={category} value={category}>{category}</Option>
                      ))}
                    </Select>
                  </div>

                  {/* Matéria */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Matéria:
                    </label>
                    <Select
                      placeholder="Selecione uma matéria"
                      style={{ width: '100%' }}
                      value={filters.subject || undefined}
                      onChange={(value) => setFilters(prev => ({ ...prev, subject: value || '' }))}
                      allowClear
                    >
                      {subjects.map(subject => (
                        <Option key={subject} value={subject}>{subject}</Option>
                      ))}
                    </Select>
                  </div>

                  {/* Faixa de Preço */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Faixa de Preço: R$ {filters.priceRange[0]} - R$ {filters.priceRange[1]}
                    </label>
                    <Slider
                      range
                      min={0}
                      max={100}
                      value={filters.priceRange}
                      onChange={(value) => setFilters(prev => ({ ...prev, priceRange: value as [number, number] }))}
                      marks={{
                        0: 'R$ 0',
                        50: 'R$ 50',
                        100: 'R$ 100+'
                      }}
                    />
                  </div>

                  {/* Avaliação Mínima */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Avaliação Mínima:
                    </label>
                    <Rate
                      value={filters.rating}
                      onChange={(value) => setFilters(prev => ({ ...prev, rating: value }))}
                      allowHalf
                      allowClear
                    />
                  </div>

                  {/* Nível de Ensino */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nível de Ensino:
                    </label>
                    <CheckboxGroup
                      options={levels}
                      value={filters.level}
                      onChange={(value) => setFilters(prev => ({ ...prev, level: value as string[] }))}
                      className="flex flex-col space-y-2"
                    />
                  </div>
                </div>
              </Card>
            </Col>

            {/* Área Principal */}
            <Col xs={24} lg={18}>
              {/* Barra de Resultados e Ordenação */}
              <Card className="mb-6">
                <Row justify="space-between" align="middle">
                  <Col>
                    <span className="text-gray-600">
                      {filteredProducts.length} materiais encontrados
                      {filters.query && ` para "${filters.query}"`}
                    </span>
                  </Col>
                  <Col>
                    <Select
                      value={filters.sortBy}
                      onChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
                      style={{ width: 200 }}
                    >
                      {sortOptions.map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Col>
                </Row>
              </Card>

              {/* Resultados */}
              {loading ? (
                <div className="text-center py-12">
                  <Spin size="large" />
                </div>
              ) : filteredProducts.length === 0 ? (
                <Card>
                  <Empty
                    description="Nenhum material encontrado"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  >
                    <Button type="primary" onClick={clearFilters}>
                      Limpar Filtros
                    </Button>
                  </Empty>
                </Card>
              ) : (
                <>
                  <List
                    grid={{
                      gutter: 16,
                      xs: 1,
                      sm: 2,
                      md: 2,
                      lg: 3,
                      xl: 3,
                      xxl: 4
                    }}
                    dataSource={paginatedProducts}
                    renderItem={(product) => (
                      <List.Item>
                        <Card
                          hoverable
                          cover={
                            <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                              <BookOutlined className="text-4xl text-blue-600" />
                            </div>
                          }
                          actions={[
                            <Link key="view" href={`/produtos/${product.id}`}>
                              <Button type="link">Ver Detalhes</Button>
                            </Link>
                          ]}
                        >
                          <Card.Meta
                            title={
                              <div className="h-12 overflow-hidden">
                                <Link href={`/produtos/${product.id}`} className="hover:text-blue-600">
                                  {product.title}
                                </Link>
                              </div>
                            }
                            description={
                              <div className="space-y-2">
                                <div className="h-12 overflow-hidden text-sm text-gray-600">
                                  {product.description}
                                </div>
                                <div className="flex items-center space-x-2 text-xs text-gray-500">
                                  <UserOutlined />
                                  <span>{product.author}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <Tag color="blue">{product.category}</Tag>
                                  <span className="font-bold text-green-600">
                                    R$ {product.price.toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <Rate disabled defaultValue={product.rating} size="small" />
                                  <div className="flex items-center text-xs text-gray-500">
                                    <DownloadOutlined className="mr-1" />
                                    {product.downloadCount}
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {product.level.map(level => (
                                    <Tag key={level} size="small" color="green">
                                      {level}
                                    </Tag>
                                  ))}
                                </div>
                              </div>
                            }
                          />
                        </Card>
                      </List.Item>
                    )}
                  />

                  {/* Paginação */}
                  <div className="text-center mt-8">
                    <Pagination
                      current={currentPage}
                      total={filteredProducts.length}
                      pageSize={pageSize}
                      onChange={setCurrentPage}
                      showSizeChanger={false}
                      showQuickJumper
                      showTotal={(total, range) =>
                        `${range[0]}-${range[1]} de ${total} materiais`
                      }
                    />
                  </div>
                </>
              )}
            </Col>
          </Row>
        </div>
      </div>
    </AppLayout>
  )
}

