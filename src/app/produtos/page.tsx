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
    loadProducts() // Load real data from Supabase
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
      } else {
        // Fallback categories
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
        // Fallback subjects
        setSubjects(['Matemática', 'Português', 'Ciências', 'História', 'Geografia', 'Arte', 'Educação Física'])
      }
    } catch (error) {
      console.error('Error loading subjects:', error)
      setSubjects(['Matemática', 'Português', 'Ciências', 'História', 'Geografia', 'Arte', 'Educação Física'])
    }
  }

  const loadProducts = async () => {
    setLoading(true)
    try {
      const params = {
        page: currentPage,
        per_page: pageSize,
        search: searchTerm || undefined,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        subject: selectedSubject !== 'all' ? selectedSubject : undefined,
        min_price: priceRange[0],
        max_price: priceRange[1],
        grade_levels: selectedGradeLevels.length > 0 ? selectedGradeLevels : undefined
      }

      const response = await getProducts(params)
      
      if (response.success && response.data) {
        setProducts(response.data.items || [])
        setTotalProducts(response.data.pagination?.total || 0)
      } else {
        message.error('Erro ao carregar produtos')
        setProducts([])
        setTotalProducts(0)
      }
    } catch (error) {
      console.error('Error loading products:', error)
      message.error('Erro ao conectar com o servidor')
      setProducts([])
      setTotalProducts(0)
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
          options={gradeLevels}
          value={selectedGradeLevels}
          onChange={setSelectedGradeLevels}
          className="flex flex-col space-y-2"
        />
      </div>

      <Button 
        type="default" 
        icon={<ClearOutlined />} 
        onClick={clearFilters}
        block
      >
        Limpar Filtros
      </Button>
    </div>
  )

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
              <BookOutlined className="mr-2" />
              Catálogo Completo
            </div>
            <Title level={1} className="mb-4">
              Materiais Educacionais
            </Title>
            <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore nossa coleção de recursos educacionais criados por professores experientes
            </Paragraph>
          </div>

          {/* Search and Filters */}
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={16} lg={18}>
              <Input
                size="large"
                placeholder="Buscar por título, descrição ou tags..."
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} md={8} lg={6}>
              <Button
                type="primary"
                icon={<FilterOutlined />}
                onClick={() => setFilterDrawerVisible(true)}
                className="w-full md:w-auto"
                size="large"
              >
                Filtros
              </Button>
            </Col>
          </Row>
        </div>

        {/* Results */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <Text className="text-gray-600">
              {loading ? 'Carregando...' : `${totalProducts} ${totalProducts === 1 ? 'material encontrado' : 'materiais encontrados'}`}
            </Text>
            {(selectedCategory !== 'all' || selectedSubject !== 'all' || selectedGradeLevels.length > 0 || searchTerm) && (
              <Button type="link" onClick={clearFilters} icon={<ClearOutlined />}>
                Limpar Filtros
              </Button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <Spin size="large" />
          </div>
        ) : products.length === 0 ? (
          <Empty
            image={<BookOutlined className="text-6xl text-gray-300" />}
            description={
              <div>
                <Title level={4}>Nenhum material encontrado</Title>
                <Paragraph>Tente ajustar os filtros ou buscar por outros termos</Paragraph>
              </div>
            }
          >
            <Button type="primary" onClick={clearFilters}>
              Limpar Filtros
            </Button>
          </Empty>
        ) : (
          <>
            <Row gutter={[24, 24]}>
              {products.map((product) => (
                <Col key={product.id} xs={24} sm={12} lg={8} xl={6}>
                  <Card
                    hoverable
                    className="h-full"
                    cover={
                      <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                        <BookOutlined className="text-4xl text-gray-400" />
                      </div>
                    }
                    actions={[
                      <Link key="view" href={`/produtos/${product.id}`}>
                        <Button type="primary" size="small">
                          Ver Detalhes
                        </Button>
                      </Link>
                    ]}
                  >
                    <div className="space-y-3">
                      <div>
                        <Title level={5} className="mb-2 line-clamp-2">
                          {product.title}
                        </Title>
                        <Paragraph className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {product.description}
                        </Paragraph>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <UserOutlined className="text-gray-400" />
                          <Text className="text-sm text-gray-600">
                            {product.author?.name}
                          </Text>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Rate disabled defaultValue={product.rating} size="small" />
                          <Text className="text-xs text-gray-500">
                            ({product.review_count})
                          </Text>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <DownloadOutlined className="text-gray-400" />
                          <Text className="text-sm text-gray-600">
                            {product.download_count} downloads
                          </Text>
                        </div>
                        <Text strong className="text-lg text-blue-600">
                          {formatPrice(product.price)}
                        </Text>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        <Tag color="blue">{product.category}</Tag>
                        <Tag color="green">{product.subject}</Tag>
                      </div>

                      {product.grade_level && product.grade_level.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {product.grade_level.slice(0, 2).map((level) => (
                            <Tag key={level} color="orange" size="small">
                              {level}
                            </Tag>
                          ))}
                          {product.grade_level.length > 2 && (
                            <Tag color="orange" size="small">
                              +{product.grade_level.length - 2}
                            </Tag>
                          )}
                        </div>
                      )}
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

        {/* Filter Drawer */}
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

