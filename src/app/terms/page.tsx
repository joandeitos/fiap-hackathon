'use client'

import { Typography, Card, Divider } from 'antd'
import AppLayout from '@/components/Layout/AppLayout'

const { Title, Paragraph } = Typography

export default function TermsPage() {
  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="shadow-lg">
            <div className="text-center mb-8">
              <Title level={1}>Termos de Uso</Title>
              <Paragraph className="text-gray-600">
                Última atualização: 22 de julho de 2025
              </Paragraph>
            </div>

            <div className="space-y-8">
              <section>
                <Title level={2}>1. Aceitação dos Termos</Title>
                <Paragraph>
                  Ao acessar e usar o EduMarketplace, você concorda em cumprir e estar vinculado a estes Termos de Uso. 
                  Se você não concordar com qualquer parte destes termos, não deve usar nossa plataforma.
                </Paragraph>
              </section>

              <Divider />

              <section>
                <Title level={2}>2. Descrição do Serviço</Title>
                <Paragraph>
                  O EduMarketplace é uma plataforma digital que conecta professores e educadores, permitindo:
                </Paragraph>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Compra e venda de materiais educacionais</li>
                  <li>Compartilhamento de recursos didáticos</li>
                  <li>Interação entre profissionais da educação</li>
                  <li>Monetização de conhecimento pedagógico</li>
                </ul>
              </section>

              <Divider />

              <section>
                <Title level={2}>3. Cadastro e Conta do Usuário</Title>
                <Paragraph>
                  Para usar nossos serviços, você deve:
                </Paragraph>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Fornecer informações precisas e atualizadas</li>
                  <li>Manter a segurança de sua conta</li>
                  <li>Ser responsável por todas as atividades em sua conta</li>
                  <li>Notificar-nos imediatamente sobre uso não autorizado</li>
                </ul>
              </section>

              <Divider />

              <section>
                <Title level={2}>4. Conteúdo e Propriedade Intelectual</Title>
                <Paragraph>
                  Os usuários mantêm os direitos autorais sobre seus materiais, mas concedem ao EduMarketplace 
                  uma licença para hospedar, exibir e distribuir o conteúdo na plataforma.
                </Paragraph>
                <Paragraph>
                  É proibido:
                </Paragraph>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Publicar conteúdo que viole direitos autorais</li>
                  <li>Compartilhar material ofensivo ou inadequado</li>
                  <li>Usar a plataforma para atividades ilegais</li>
                </ul>
              </section>

              <Divider />

              <section>
                <Title level={2}>5. Pagamentos e Reembolsos</Title>
                <Paragraph>
                  Todas as transações são processadas através de nossos parceiros de pagamento seguros. 
                  Reembolsos são processados de acordo com nossa política de reembolso, disponível em nossa central de ajuda.
                </Paragraph>
              </section>

              <Divider />

              <section>
                <Title level={2}>6. Limitação de Responsabilidade</Title>
                <Paragraph>
                  O EduMarketplace não se responsabiliza por danos diretos, indiretos, incidentais ou consequenciais 
                  resultantes do uso da plataforma. Nosso serviço é fornecido &quot;como está&quot;.
                </Paragraph>
              </section>

              <Divider />

              <section>
                <Title level={2}>7. Modificações dos Termos</Title>
                <Paragraph>
                  Reservamo-nos o direito de modificar estes termos a qualquer momento. 
                  As alterações entrarão em vigor imediatamente após a publicação na plataforma.
                </Paragraph>
              </section>

              <Divider />

              <section>
                <Title level={2}>8. Contato</Title>
                <Paragraph>
                  Para dúvidas sobre estes termos, entre em contato conosco através do email: 
                  <strong> legal@edumarketplace.com.br</strong>
                </Paragraph>
              </section>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}

