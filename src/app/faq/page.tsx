'use client'

import { useState } from 'react'
import { 
  Typography, 
  Card, 
  Collapse, 
  Input,
  Row,
  Col,
  Button,
  Tag,
  Space
} from 'antd'
import { 
  SearchOutlined,
  QuestionCircleOutlined,
  BookOutlined,
  DollarOutlined,
  ShoppingOutlined,
  UserOutlined,
  SettingOutlined,
  SafetyOutlined
} from '@ant-design/icons'
import Link from 'next/link'
import AppLayout from '@/components/Layout/AppLayout'

const { Title, Paragraph } = Typography
const { Panel } = Collapse

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  tags: string[]
}

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { key: 'all', label: 'Todas', icon: <QuestionCircleOutlined />, color: 'default' },
    { key: 'getting-started', label: 'Primeiros Passos', icon: <BookOutlined />, color: 'blue' },
    { key: 'selling', label: 'Vendas', icon: <DollarOutlined />, color: 'green' },
    { key: 'buying', label: 'Compras', icon: <ShoppingOutlined />, color: 'orange' },
    { key: 'account', label: 'Conta', icon: <UserOutlined />, color: 'purple' },
    { key: 'technical', label: 'Técnico', icon: <SettingOutlined />, color: 'red' },
    { key: 'security', label: 'Segurança', icon: <SafetyOutlined />, color: 'cyan' }
  ]

  const faqData: FAQItem[] = [
    // Primeiros Passos
    {
      id: '1',
      question: 'Como faço para me cadastrar na plataforma?',
      answer: 'Para se cadastrar, clique no botão "Cadastrar" no topo da página e preencha seus dados básicos. Você pode usar seu email ou fazer login social com Google. O cadastro é 100% gratuito e leva menos de 2 minutos.',
      category: 'getting-started',
      tags: ['cadastro', 'registro', 'conta']
    },
    {
      id: '2',
      question: 'Qual a diferença entre professor e comprador?',
      answer: 'Professores podem vender e comprar materiais, enquanto compradores apenas adquirem conteúdo. Você pode alterar seu perfil a qualquer momento nas configurações da conta. Ambos os perfis têm acesso completo à plataforma.',
      category: 'getting-started',
      tags: ['perfil', 'professor', 'comprador']
    },
    {
      id: '3',
      question: 'Como navegar pela plataforma?',
      answer: 'Use o menu principal para acessar Produtos (catálogo), Dashboard (área pessoal) e outras seções. A busca no topo permite encontrar materiais específicos. O dashboard centraliza suas atividades de compra e venda.',
      category: 'getting-started',
      tags: ['navegação', 'menu', 'dashboard']
    },

    // Vendas
    {
      id: '4',
      question: 'Como publico meu primeiro material?',
      answer: 'Acesse o Dashboard > Produtos > Novo Material. Preencha título, descrição, categoria, preço e faça upload dos arquivos. Após revisão (até 24h), seu material estará disponível para venda.',
      category: 'selling',
      tags: ['publicar', 'material', 'venda']
    },
    {
      id: '5',
      question: 'Qual taxa é cobrada nas vendas?',
      answer: 'Cobramos 10% sobre cada venda realizada. Esta taxa cobre processamento de pagamento, hospedagem, suporte e melhorias da plataforma. Você recebe 90% do valor de cada venda.',
      category: 'selling',
      tags: ['taxa', 'comissão', 'pagamento']
    },
    {
      id: '6',
      question: 'Quando e como recebo meus pagamentos?',
      answer: 'Os pagamentos são processados semanalmente, toda sexta-feira. Você pode receber via PIX (instantâneo) ou transferência bancária (1-2 dias úteis). Valor mínimo para saque é R$ 20,00.',
      category: 'selling',
      tags: ['pagamento', 'saque', 'pix']
    },
    {
      id: '7',
      question: 'Posso editar um material já publicado?',
      answer: 'Sim, você pode editar título, descrição e preço a qualquer momento. Para alterar arquivos, o material passará por nova revisão. Materiais já vendidos mantêm a versão original para os compradores.',
      category: 'selling',
      tags: ['editar', 'atualizar', 'material']
    },

    // Compras
    {
      id: '8',
      question: 'Como comprar um material?',
      answer: 'Encontre o material desejado, clique em "Comprar" e escolha a forma de pagamento. Após confirmação, você terá acesso imediato ao download na área "Minhas Compras".',
      category: 'buying',
      tags: ['comprar', 'pagamento', 'download']
    },
    {
      id: '9',
      question: 'Posso baixar novamente um material comprado?',
      answer: 'Sim! Você tem acesso vitalício aos materiais comprados. Acesse "Minhas Compras" no menu para baixar quantas vezes precisar. Não há limite de downloads.',
      category: 'buying',
      tags: ['download', 'acesso', 'vitalício']
    },
    {
      id: '10',
      question: 'Como solicitar reembolso?',
      answer: 'Reembolsos podem ser solicitados em até 7 dias após a compra, caso o material não atenda às expectativas. Entre em contato pelo suporte com justificativa. Analisamos cada caso individualmente.',
      category: 'buying',
      tags: ['reembolso', 'devolução', 'suporte']
    },

    // Conta
    {
      id: '11',
      question: 'Como alterar meus dados pessoais?',
      answer: 'Acesse Perfil > Editar Perfil para alterar nome, email, telefone e outros dados. Algumas alterações podem exigir confirmação por email. Mantenha seus dados sempre atualizados.',
      category: 'account',
      tags: ['perfil', 'dados', 'editar']
    },
    {
      id: '12',
      question: 'Como alterar minha senha?',
      answer: 'Vá em Configurações > Segurança > Alterar Senha. Digite a senha atual e a nova senha duas vezes. Use senhas fortes com pelo menos 8 caracteres, incluindo números e símbolos.',
      category: 'account',
      tags: ['senha', 'segurança', 'login']
    },
    {
      id: '13',
      question: 'Posso excluir minha conta?',
      answer: 'Sim, você pode excluir sua conta em Configurações > Conta > Excluir Conta. Esta ação é irreversível e remove todos seus dados. Materiais vendidos continuam disponíveis para compradores.',
      category: 'account',
      tags: ['excluir', 'deletar', 'conta']
    },

    // Técnico
    {
      id: '14',
      question: 'Quais formatos de arquivo são aceitos?',
      answer: 'Aceitamos PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, ZIP e RAR até 50MB. Para materiais maiores, use compactação ZIP. Imagens devem estar em JPG ou PNG.',
      category: 'technical',
      tags: ['formato', 'arquivo', 'upload']
    },
    {
      id: '15',
      question: 'Estou com problemas no upload, o que fazer?',
      answer: 'Verifique sua conexão, tamanho do arquivo (máx 50MB) e formato. Tente usar outro navegador ou limpe o cache. Se persistir, entre em contato com o suporte técnico.',
      category: 'technical',
      tags: ['upload', 'erro', 'arquivo']
    },
    {
      id: '16',
      question: 'A plataforma funciona no celular?',
      answer: 'Sim! Nossa plataforma é totalmente responsiva e funciona perfeitamente em smartphones e tablets. Você pode navegar, comprar e gerenciar sua conta pelo celular.',
      category: 'technical',
      tags: ['mobile', 'celular', 'responsivo']
    },

    // Segurança
    {
      id: '17',
      question: 'Meus dados estão seguros?',
      answer: 'Sim! Usamos criptografia SSL, servidores seguros e seguimos a LGPD. Seus dados pessoais e de pagamento são protegidos com os mais altos padrões de segurança.',
      category: 'security',
      tags: ['segurança', 'dados', 'lgpd']
    },
    {
      id: '18',
      question: 'Como denunciar conteúdo inadequado?',
      answer: 'Use o botão "Denunciar" na página do material ou entre em contato conosco. Analisamos todas as denúncias em até 24h e tomamos as medidas necessárias.',
      category: 'security',
      tags: ['denúncia', 'conteúdo', 'moderação']
    }
  ]

  // Filtrar FAQs baseado na busca e categoria
  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = searchTerm === '' || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Title level={1} className="text-white mb-4">
              Perguntas Frequentes
            </Title>
            <Paragraph className="text-xl text-purple-100 mb-8">
              Encontre respostas rápidas para suas dúvidas sobre o EduMarketplace
            </Paragraph>
            
            {/* Busca */}
            <div className="max-w-md mx-auto">
              <Input
                size="large"
                placeholder="Buscar por palavra-chave..."
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <Row gutter={[32, 32]}>
              {/* Sidebar de Categorias */}
              <Col xs={24} lg={6}>
                <Card title="Categorias" className="sticky top-4">
                  <div className="space-y-2">
                    {categories.map(category => (
                      <Button
                        key={category.key}
                        type={selectedCategory === category.key ? 'primary' : 'text'}
                        block
                        className="text-left justify-start"
                        onClick={() => setSelectedCategory(category.key)}
                      >
                        <Space>
                          {category.icon}
                          {category.label}
                        </Space>
                      </Button>
                    ))}
                  </div>

                  <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                    <Title level={5} className="mb-2">
                      Não encontrou sua resposta?
                    </Title>
                    <Paragraph className="text-sm text-gray-600 mb-3">
                      Entre em contato conosco e teremos prazer em ajudar!
                    </Paragraph>
                    <Link href="/contato">
                      <Button type="primary" size="small" block>
                        Falar Conosco
                      </Button>
                    </Link>
                  </div>
                </Card>
              </Col>

              {/* Área Principal - FAQs */}
              <Col xs={24} lg={18}>
                {/* Resultados */}
                <div className="mb-6">
                  <Title level={3}>
                    {selectedCategory === 'all' ? 'Todas as Perguntas' : 
                     categories.find(c => c.key === selectedCategory)?.label}
                  </Title>
                  <Paragraph className="text-gray-600">
                    {filteredFAQs.length} pergunta(s) encontrada(s)
                    {searchTerm && ` para "${searchTerm}"`}
                  </Paragraph>
                </div>

                {/* Lista de FAQs */}
                {filteredFAQs.length > 0 ? (
                  <Collapse
                    size="large"
                    className="bg-white"
                    expandIconPosition="end"
                  >
                    {filteredFAQs.map(faq => (
                      <Panel
                        key={faq.id}
                        header={
                          <div>
                            <Title level={5} className="mb-1">
                              {faq.question}
                            </Title>
                            <div className="flex flex-wrap gap-1">
                              <Tag 
                                color={categories.find(c => c.key === faq.category)?.color}
                                size="small"
                              >
                                {categories.find(c => c.key === faq.category)?.label}
                              </Tag>
                              {faq.tags.slice(0, 2).map(tag => (
                                <Tag key={tag} size="small">
                                  {tag}
                                </Tag>
                              ))}
                            </div>
                          </div>
                        }
                      >
                        <div className="pl-4 border-l-4 border-blue-200">
                          <Paragraph className="text-gray-700 mb-0">
                            {faq.answer}
                          </Paragraph>
                        </div>
                      </Panel>
                    ))}
                  </Collapse>
                ) : (
                  <Card>
                    <div className="text-center py-12">
                      <QuestionCircleOutlined className="text-4xl text-gray-400 mb-4" />
                      <Title level={4} className="text-gray-500 mb-2">
                        Nenhuma pergunta encontrada
                      </Title>
                      <Paragraph className="text-gray-400 mb-4">
                        Tente usar outros termos de busca ou selecione uma categoria diferente.
                      </Paragraph>
                      <Space>
                        <Button onClick={() => setSearchTerm('')}>
                          Limpar Busca
                        </Button>
                        <Button onClick={() => setSelectedCategory('all')}>
                          Ver Todas
                        </Button>
                      </Space>
                    </div>
                  </Card>
                )}
              </Col>
            </Row>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Title level={2} className="mb-6">
              Ainda tem dúvidas?
            </Title>
            <Paragraph className="text-lg text-gray-600 mb-8">
              Nossa equipe de suporte está sempre pronta para ajudar você. 
              Entre em contato através dos nossos canais de atendimento.
            </Paragraph>
            <Space size="large">
              <Link href="/contato">
                <Button type="primary" size="large">
                  Falar com Suporte
                </Button>
              </Link>
              <Link href="/suporte">
                <Button size="large">
                  Central de Ajuda
                </Button>
              </Link>
            </Space>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

