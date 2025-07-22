'use client'

import { Typography, Card, Divider } from 'antd'
import AppLayout from '@/components/Layout/AppLayout'

const { Title, Paragraph } = Typography

export default function PrivacyPage() {
  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="shadow-lg">
            <div className="text-center mb-8">
              <Title level={1}>Política de Privacidade</Title>
              <Paragraph className="text-gray-600">
                Última atualização: 22 de julho de 2025
              </Paragraph>
            </div>

            <div className="space-y-8">
              <section>
                <Title level={2}>1. Informações que Coletamos</Title>
                <Paragraph>
                  Coletamos informações que você nos fornece diretamente, incluindo:
                </Paragraph>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Nome, email e informações de perfil</li>
                  <li>Materiais educacionais que você publica</li>
                  <li>Informações de pagamento (processadas por terceiros seguros)</li>
                  <li>Comunicações conosco</li>
                </ul>
              </section>

              <Divider />

              <section>
                <Title level={2}>2. Como Usamos suas Informações</Title>
                <Paragraph>
                  Utilizamos suas informações para:
                </Paragraph>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Fornecer e melhorar nossos serviços</li>
                  <li>Processar transações</li>
                  <li>Comunicar atualizações e novidades</li>
                  <li>Garantir a segurança da plataforma</li>
                  <li>Cumprir obrigações legais</li>
                </ul>
              </section>

              <Divider />

              <section>
                <Title level={2}>3. Compartilhamento de Informações</Title>
                <Paragraph>
                  Não vendemos suas informações pessoais. Podemos compartilhar dados apenas:
                </Paragraph>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Com seu consentimento explícito</li>
                  <li>Para cumprir obrigações legais</li>
                  <li>Com prestadores de serviços confiáveis</li>
                  <li>Para proteger direitos e segurança</li>
                </ul>
              </section>

              <Divider />

              <section>
                <Title level={2}>4. Cookies e Tecnologias Similares</Title>
                <Paragraph>
                  Utilizamos cookies para melhorar sua experiência, incluindo:
                </Paragraph>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Cookies essenciais para funcionamento do site</li>
                  <li>Cookies de análise para melhorar nossos serviços</li>
                  <li>Cookies de personalização para sua experiência</li>
                </ul>
              </section>

              <Divider />

              <section>
                <Title level={2}>5. Segurança dos Dados</Title>
                <Paragraph>
                  Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações, 
                  incluindo criptografia, controles de acesso e monitoramento contínuo.
                </Paragraph>
              </section>

              <Divider />

              <section>
                <Title level={2}>6. Seus Direitos</Title>
                <Paragraph>
                  Você tem o direito de:
                </Paragraph>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Acessar suas informações pessoais</li>
                  <li>Corrigir dados incorretos</li>
                  <li>Solicitar exclusão de seus dados</li>
                  <li>Portabilidade de dados</li>
                  <li>Retirar consentimento a qualquer momento</li>
                </ul>
              </section>

              <Divider />

              <section>
                <Title level={2}>7. Retenção de Dados</Title>
                <Paragraph>
                  Mantemos suas informações pelo tempo necessário para fornecer nossos serviços 
                  e cumprir obrigações legais. Dados de transações são mantidos conforme exigido por lei.
                </Paragraph>
              </section>

              <Divider />

              <section>
                <Title level={2}>8. Alterações nesta Política</Title>
                <Paragraph>
                  Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças significativas 
                  através da plataforma ou por email.
                </Paragraph>
              </section>

              <Divider />

              <section>
                <Title level={2}>9. Contato</Title>
                <Paragraph>
                  Para questões sobre privacidade, entre em contato:
                </Paragraph>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Email: <strong>privacidade@edumarketplace.com.br</strong></li>
                  <li>Telefone: <strong>(11) 3000-0000</strong></li>
                  <li>Endereço: <strong>São Paulo, SP - Brasil</strong></li>
                </ul>
              </section>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}

