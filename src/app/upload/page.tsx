'use client'

import React, { useState } from 'react'
import { 
  Card, 
  Form, 
  Input, 
  Select, 
  InputNumber, 
  Upload, 
  Button, 
  Typography, 
  Row, 
  Col,
  Steps,
  message,
  Tag,
  Space,
  Divider,
  Alert
} from 'antd'
import { 
  UploadOutlined,
  FileTextOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  BookOutlined,
  TagsOutlined
} from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/Layout/AppLayout'
import { createProduct } from '@/lib/supabase-api'

const { Title, Paragraph, Text } = Typography
const { TextArea } = Input
const { Option } = Select
const { Step } = Steps

interface UploadFormData {
  title: string
  description: string
  category: string
  subject: string
  grade_level: string[]
  price: number
  tags: string[]
  file_url: string
  preview_images: string[]
}

export default function UploadPage() {
  const [form] = Form.useForm()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [fileList, setFileList] = useState<any[]>([])
  const [previewFiles, setPreviewFiles] = useState<any[]>([])
  const router = useRouter()

  // Mock user ID - in real app, get from auth context
  const userId = '550e8400-e29b-41d4-a716-446655440001'

  const categories = [
    'Planos de Aula',
    'Atividades',
    'Avaliações',
    'Jogos Educativos',
    'Material de Apoio',
    'Projetos',
    'Recursos Visuais',
    'Outros'
  ]

  const subjects = [
    'Matemática',
    'Português',
    'História',
    'Geografia',
    'Ciências',
    'Física',
    'Química',
    'Biologia',
    'Inglês',
    'Espanhol',
    'Arte',
    'Educação Física',
    'Filosofia',
    'Sociologia',
    'Literatura',
    'Redação',
    'Informática',
    'Outros'
  ]

  const gradeLevels = [
    'Educação Infantil',
    '1º Ano',
    '2º Ano',
    '3º Ano',
    '4º Ano',
    '5º Ano',
    '6º Ano',
    '7º Ano',
    '8º Ano',
    '9º Ano',
    '1º Ano EM',
    '2º Ano EM',
    '3º Ano EM',
    'EJA',
    'Ensino Superior'
  ]

  const steps = [
    {
      title: 'Informações Básicas',
      icon: <InfoCircleOutlined />,
      description: 'Título, descrição e categoria'
    },
    {
      title: 'Detalhes Educacionais',
      icon: <BookOutlined />,
      description: 'Matéria, série e tags'
    },
    {
      title: 'Arquivos e Preço',
      icon: <UploadOutlined />,
      description: 'Upload de arquivos e definição de preço'
    },
    {
      title: 'Revisão e Publicação',
      icon: <CheckCircleOutlined />,
      description: 'Revisar informações e publicar'
    }
  ]

  const handleNext = async () => {
    try {
      await form.validateFields()
      setCurrentStep(currentStep + 1)
    } catch (error) {
      message.error('Por favor, preencha todos os campos obrigatórios')
    }
  }

  const handlePrev = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const values = await form.validateFields()
      
      // Simulate file upload - in real app, upload to storage service
      const fileUrl = fileList.length > 0 ? 'https://example.com/file.pdf' : ''
      const previewImages = previewFiles.map(() => 'https://example.com/preview.jpg')

      const productData = {
        title: values.title,
        description: values.description,
        category: values.category,
        subject: values.subject,
        grade_level: values.grade_level,
        price: values.price,
        tags: values.tags || [],
        file_url: fileUrl,
        preview_images: previewImages,
        author_id: userId,
        status: 'active'
      }

      const response = await createProduct(productData)
      
      if (response.success) {
        message.success('Material publicado com sucesso!')
        router.push('/dashboard')
      } else {
        message.error(response.error || 'Erro ao publicar material')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      message.error('Erro ao publicar material')
    } finally {
      setLoading(false)
    }
  }

  const uploadProps = {
    beforeUpload: (file: any) => {
      const isValidType = file.type === 'application/pdf' || 
                         file.type.startsWith('application/vnd.openxmlformats') ||
                         file.type.startsWith('application/msword')
      
      if (!isValidType) {
        message.error('Apenas arquivos PDF, DOC e DOCX são permitidos!')
        return false
      }
      
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        message.error('O arquivo deve ter menos de 10MB!')
        return false
      }
      
      return false // Prevent automatic upload
    },
    onChange: (info: any) => {
      setFileList(info.fileList)
    }
  }

  const previewUploadProps = {
    beforeUpload: (file: any) => {
      const isImage = file.type.startsWith('image/')
      if (!isImage) {
        message.error('Apenas imagens são permitidas para preview!')
        return false
      }
      
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        message.error('A imagem deve ter menos de 2MB!')
        return false
      }
      
      return false
    },
    onChange: (info: any) => {
      setPreviewFiles(info.fileList)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <Form.Item
              name="title"
              label="Título do Material"
              rules={[
                { required: true, message: 'Por favor, insira o título' },
                { min: 10, message: 'O título deve ter pelo menos 10 caracteres' }
              ]}
            >
              <Input 
                placeholder="Ex: Plano de Aula - Frações para 5º Ano"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="description"
              label="Descrição Detalhada"
              rules={[
                { required: true, message: 'Por favor, insira a descrição' },
                { min: 50, message: 'A descrição deve ter pelo menos 50 caracteres' }
              ]}
            >
              <TextArea 
                rows={6}
                placeholder="Descreva detalhadamente o conteúdo do material, objetivos de aprendizagem, como usar, etc."
              />
            </Form.Item>

            <Form.Item
              name="category"
              label="Categoria"
              rules={[{ required: true, message: 'Por favor, selecione uma categoria' }]}
            >
              <Select placeholder="Selecione a categoria" size="large">
                {categories.map(category => (
                  <Option key={category} value={category}>{category}</Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <Form.Item
              name="subject"
              label="Matéria/Disciplina"
              rules={[{ required: true, message: 'Por favor, selecione a matéria' }]}
            >
              <Select placeholder="Selecione a matéria" size="large">
                {subjects.map(subject => (
                  <Option key={subject} value={subject}>{subject}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="grade_level"
              label="Ano/Série"
              rules={[{ required: true, message: 'Por favor, selecione pelo menos um ano' }]}
            >
              <Select 
                mode="multiple"
                placeholder="Selecione os anos/séries adequados"
                size="large"
              >
                {gradeLevels.map(level => (
                  <Option key={level} value={level}>{level}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="tags"
              label="Tags (Palavras-chave)"
              help="Adicione palavras-chave para facilitar a busca do seu material"
            >
              <Select 
                mode="tags"
                placeholder="Digite e pressione Enter para adicionar tags"
                size="large"
                tokenSeparators={[',']}
              />
            </Form.Item>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <Alert
              message="Upload de Arquivos"
              description="Faça upload do arquivo principal do seu material educacional. Formatos aceitos: PDF, DOC, DOCX (máx. 10MB)"
              type="info"
              showIcon
              className="mb-6"
            />

            <Form.Item
              name="file"
              label="Arquivo Principal"
              rules={[{ required: true, message: 'Por favor, faça upload do arquivo' }]}
            >
              <Upload.Dragger {...uploadProps} fileList={fileList}>
                <p className="ant-upload-drag-icon">
                  <FileTextOutlined className="text-4xl text-blue-600" />
                </p>
                <p className="ant-upload-text">
                  Clique ou arraste o arquivo para esta área
                </p>
                <p className="ant-upload-hint">
                  Suporte para PDF, DOC e DOCX. Máximo 10MB.
                </p>
              </Upload.Dragger>
            </Form.Item>

            <Form.Item
              name="preview_images"
              label="Imagens de Preview (Opcional)"
              help="Adicione imagens que mostrem o conteúdo do material"
            >
              <Upload.Dragger {...previewUploadProps} fileList={previewFiles} multiple>
                <p className="ant-upload-drag-icon">
                  <UploadOutlined className="text-4xl text-green-600" />
                </p>
                <p className="ant-upload-text">
                  Adicione imagens de preview
                </p>
                <p className="ant-upload-hint">
                  Formatos: JPG, PNG. Máximo 2MB cada.
                </p>
              </Upload.Dragger>
            </Form.Item>

            <Form.Item
              name="price"
              label="Preço (R$)"
              rules={[
                { required: true, message: 'Por favor, defina o preço' },
                { type: 'number', min: 0, message: 'O preço deve ser maior que zero' }
              ]}
            >
              <InputNumber
                prefix={<DollarOutlined />}
                placeholder="0.00"
                min={0}
                step={0.01}
                precision={2}
                size="large"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </div>
        )

      case 3:
        const values = form.getFieldsValue()
        return (
          <div className="space-y-6">
            <Alert
              message="Revisão Final"
              description="Revise todas as informações antes de publicar seu material"
              type="warning"
              showIcon
              className="mb-6"
            />

            <Card title="Informações do Material">
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Text strong>Título:</Text>
                  <div>{values.title}</div>
                </Col>
                <Col span={24}>
                  <Text strong>Descrição:</Text>
                  <div className="mt-2">{values.description}</div>
                </Col>
                <Col span={12}>
                  <Text strong>Categoria:</Text>
                  <div>{values.category}</div>
                </Col>
                <Col span={12}>
                  <Text strong>Matéria:</Text>
                  <div>{values.subject}</div>
                </Col>
                <Col span={12}>
                  <Text strong>Ano/Série:</Text>
                  <div>
                    {values.grade_level?.map((level: string) => (
                      <Tag key={level} color="blue">{level}</Tag>
                    ))}
                  </div>
                </Col>
                <Col span={12}>
                  <Text strong>Preço:</Text>
                  <div className="text-green-600 font-semibold">
                    R$ {values.price?.toFixed(2)}
                  </div>
                </Col>
                <Col span={24}>
                  <Text strong>Tags:</Text>
                  <div className="mt-2">
                    {values.tags?.map((tag: string) => (
                      <Tag key={tag} color="purple">{tag}</Tag>
                    ))}
                  </div>
                </Col>
                <Col span={24}>
                  <Text strong>Arquivos:</Text>
                  <div className="mt-2">
                    <div>📄 Arquivo principal: {fileList.length > 0 ? fileList[0].name : 'Nenhum arquivo'}</div>
                    <div>🖼️ Imagens de preview: {previewFiles.length} arquivo(s)</div>
                  </div>
                </Col>
              </Row>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <Title level={2} className="mb-2">
            Publicar Novo Material
          </Title>
          <Paragraph className="text-gray-600">
            Compartilhe seu conhecimento e monetize seus materiais educacionais
          </Paragraph>
        </div>

        {/* Steps */}
        <Card className="mb-8">
          <Steps current={currentStep} className="mb-8">
            {steps.map((step, index) => (
              <Step
                key={index}
                title={step.title}
                description={step.description}
                icon={step.icon}
              />
            ))}
          </Steps>
        </Card>

        {/* Form */}
        <Card>
          <Form
            form={form}
            layout="vertical"
            size="large"
          >
            {renderStepContent()}

            <Divider />

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <div>
                {currentStep > 0 && (
                  <Button onClick={handlePrev}>
                    Anterior
                  </Button>
                )}
              </div>
              
              <div>
                {currentStep < steps.length - 1 ? (
                  <Button type="primary" onClick={handleNext}>
                    Próximo
                  </Button>
                ) : (
                  <Button 
                    type="primary" 
                    onClick={handleSubmit}
                    loading={loading}
                    icon={<CheckCircleOutlined />}
                  >
                    Publicar Material
                  </Button>
                )}
              </div>
            </div>
          </Form>
        </Card>

        {/* Help Section */}
        <Card className="mt-8" title="Dicas para um Material de Sucesso">
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <div className="text-center">
                <FileTextOutlined className="text-3xl text-blue-600 mb-3" />
                <Title level={5}>Título Atrativo</Title>
                <Text className="text-gray-600">
                  Use um título claro e descritivo que mostre o valor do seu material
                </Text>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="text-center">
                <TagsOutlined className="text-3xl text-green-600 mb-3" />
                <Title level={5}>Tags Relevantes</Title>
                <Text className="text-gray-600">
                  Adicione palavras-chave que os professores usariam para buscar
                </Text>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="text-center">
                <DollarOutlined className="text-3xl text-purple-600 mb-3" />
                <Title level={5}>Preço Justo</Title>
                <Text className="text-gray-600">
                  Defina um preço competitivo baseado na qualidade e complexidade
                </Text>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    </AppLayout>
  )
}

