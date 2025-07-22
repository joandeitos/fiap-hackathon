'use client'

import React, { useState, useEffect } from 'react'
import { 
  Row, 
  Col, 
  Card, 
  Input, 
  Select, 
  Button, 
  Tag, 
  Rate, 
  Typography, 
  Space,
  Pagination,
  Drawer,
  Slider,
  Checkbox,
  Badge,
  Avatar,
  Divider,
  Spin,
  message
} from 'antd'
import { 
  SearchOutlined, 
  FilterOutlined, 
  AppstoreOutlined,
  BarsOutlined,
  DownloadOutlined,
  StarOutlined,
  UserOutlined,
  BookOutlined,
  DollarOutlined
} from '@ant-design/icons'
import Link from 'next/link'
import AppLayout from '@/components/Layout/AppLayout'
import { getProducts, getCategories, getSubjects, Product } from '@/lib/api'

const { Title, Paragraph, Text } = Typography
const { Option } = Select

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100])
  const [selectedGradeLevels, setSelectedGradeLevels] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const [categories, setCategories] = useState<string[]>([])
  const [subjects, setSubjects] = useState<string[]>([])
  const pageSize = 12

  const gradeLevels = ['1º ano', '2º ano', '3º ano', '4º ano', '5º ano', '6º ano', '7º ano', '8º ano', '9º ano']

  // Load initial data
  useEffect(() => {
    loadCategories()
    loadSubjects()
  }, [])

  // Load products when filters change
  useEffect(() => {
    loadProducts()
  }, [currentPage, searchTerm, selectedCategory, selectedSubject, priceRange, selectedGradeLevels])

  const loadCategories = async () => {
    try {
      const response = await getCategories()
      if (response.success && response.data) {
        setCategories(response.data)
      }
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const loadSubjects = async () => {
    try {
      const response = await getSubjects()
      if (response.success && response.data) {
        setSubjects(response.data)
      }
    } catch (error) {
      console.error('Error loading subjects:', error)
    }
  }

  const loadProducts = async () => {
    setLoading(true)
    try {
      const params = {
        page: currentPage,
        per_page: pageSize,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(selectedSubject !== 'all' && { subject: selectedSubject }),
        min_price: priceRange[0],
        max_price: priceRange[1],
        ...(selectedGradeLevels.length > 0 && { grade_levels: selectedGradeLevels })
      }

      const response = await getProducts(params)
      
      if (response.success && response.data) {
        setProducts(response.data.products)
        setTotalProducts(response.data.pagination.total)
      } else {
        message.error('Erro ao carregar produtos')
      }
    } catch (error) {
      console.error('Error loading products:', error)
      message.error('Erro ao conectar com o servidor')
      
      // Fallback to mock data if API fails
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
        }
      ]
      setProducts(mockProducts)
      setTotalProducts(mockProducts.length)
    } finally {
      setLoading(false)
    }
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
          value={selectedGradeLevels}
          onChange={setSelectedGradeLevels}
          className="flex flex-col space-y-2"
        >
          {gradeLevels.map(level => (
            <Checkbox key={level} value={level}>
              {level}
            </Checkbox>
          ))}
        </Checkbox.Group>
      </div>

      <Button
        type="default"
        block
        onClick={clearFilters}
      >
        Limpar Filtros
      </Button>
    </div>
  )

  const ProductCard = ({ product }: { product: Product }) => (
    <Card
      hoverable
      className="product-card h-full"
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
          <Tag color="blue">{product.category}</Tag>
          <Tag color="green">{product.subject}</Tag>
        </div>
        
        <Title level={5} className="line-clamp-2">
          {product.title}
        </Title>
        
        <Paragraph className="text-gray-600 line-clamp-3">
          {product.description}
        </Paragraph>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Rate disabled defaultValue={product.rating} allowHalf className="text-sm" />
            <Text className="text-gray-500">({product.reviewCount})</Text>
          </div>
          <div className="flex items-center space-x-1 text-gray-500">
            <DownloadOutlined />
            <Text>{product.downloadCount}</Text>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar size="small" icon={<UserOutlined />} />
            <Text className="text-sm">{product.author.name}</Text>
          </div>
          <Title level={4} className="text-blue-600 mb-0">
            {formatPrice(product.price)}
          </Title>
        </div>
        
        <div className="flex flex-wrap gap-1">
          {product.gradeLevel.map(level => (
            <Tag key={level} size="small">{level}</Tag>
          ))}
        </div>
      </div>
    </Card>
  )

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Title level={2}>Catálogo de Materiais Educacionais</Title>
          <Paragraph className="text-lg text-gray-600">
            Descubra recursos incríveis criados por professores para professores
          </Paragraph>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={12} lg={14}>
              <Input
                size="large"
                placeholder="Buscar materiais..."
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
            <Col xs={12} md={6} lg={4}>
              <Button
                size="large"
                icon={<FilterOutlined />}
                onClick={() => setFilterDrawerVisible(true)}
                className="w-full md:w-auto"
              >
                Filtros
              </Button>
            </Col>
            <Col xs={12} md={6} lg={6}>
              <div className="flex justify-end space-x-2">
                <Button
                  type={viewMode === 'grid' ? 'primary' : 'default'}
                  icon={<AppstoreOutlined />}
                  onClick={() => setViewMode('grid')}
                />
                <Button
                  type={viewMode === 'list' ? 'primary' : 'default'}
                  icon={<BarsOutlined />}
                  onClick={() => setViewMode('list')}
                />
              </div>
            </Col>
          </Row>
        </div>

        {/* Results Info */}
        <div className="mb-6">
          <Text className="text-gray-600">
            <strong>{totalProducts}</strong> {totalProducts === 1 ? 'material encontrado' : 'materiais encontrados'}
            {selectedCategory !== 'all' && <span> em <strong>{selectedCategory}</strong></span>}
            {searchTerm && <span> para <strong>&quot;{searchTerm}&quot;</strong></span>}
          </Text>
        </div>

        <Row gutter={24}>
          {/* Desktop Filters */}
          <Col xs={0} lg={6}>
            <Card title="Filtros" className="sticky top-4">
              <FilterContent />
            </Card>
          </Col>

          {/* Products */}
          <Col xs={24} lg={18}>
            <Spin spinning={loading}>
              {products.length > 0 ? (
                <>
                  <div className={viewMode === 'grid' 
                    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' 
                    : 'space-y-4'
                  }>
                    {products.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalProducts > pageSize && (
                    <div className="mt-8 text-center">
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
              ) : (
                <div className="text-center py-12">
                  <BookOutlined className="text-6xl text-gray-300 mb-4" />
                  <Title level={4} className="text-gray-500">
                    Nenhum material encontrado
                  </Title>
                  <Paragraph className="text-gray-400">
                    Tente ajustar os filtros ou termos de busca
                  </Paragraph>
                </div>
              )}
            </Spin>
          </Col>
        </Row>

        {/* Mobile Filter Drawer */}
        <Drawer
          title="Filtros"
          placement="right"
          onClose={() => setFilterDrawerVisible(false)}
          open={filterDrawerVisible}
          width={320}
        >
          <FilterContent />
        </Drawer>
      </div>
    </AppLayout>
  )
}

