# 🚀 Configuração Supabase + Processos de Compra - EduMarketplace

## 📋 Passo a Passo Completo

### 1. Criar Projeto no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Crie uma conta ou faça login
4. Clique em "New Project"
5. Configure:
   - **Name:** edumarketplace
   - **Database Password:** (anote a senha)
   - **Region:** South America (São Paulo)
6. Aguarde a criação (2-3 minutos)

### 2. Configurar Schema do Banco

Acesse o **SQL Editor** no dashboard do Supabase e execute:

```sql
-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de usuários
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  user_type VARCHAR(50) DEFAULT 'buyer' CHECK (user_type IN ('buyer', 'seller', 'admin')),
  bio TEXT,
  avatar_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  specialties TEXT,
  experience_years INTEGER,
  education TEXT,
  average_rating DECIMAL(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  total_sales INTEGER DEFAULT 0,
  total_revenue DECIMAL(10,2) DEFAULT 0,
  total_products INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Tabela de produtos
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  grade_level TEXT[] NOT NULL,
  tags TEXT[],
  file_url TEXT,
  thumbnail_url TEXT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'draft', 'inactive')),
  download_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  total_revenue DECIMAL(10,2) DEFAULT 0,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de avaliações
CREATE TABLE reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, user_id)
);

-- Tabela de vendas
CREATE TABLE sales (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled', 'refunded')),
  payment_method VARCHAR(50),
  payment_id VARCHAR(255),
  transaction_id VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de carrinho
CREATE TABLE cart_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Tabela de favoritos
CREATE TABLE favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Índices para performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_subject ON products(subject);
CREATE INDEX idx_products_author ON products(author_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_sales_buyer ON sales(buyer_id);
CREATE INDEX idx_sales_seller ON sales(seller_id);
CREATE INDEX idx_sales_status ON sales(status);
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);

-- Triggers para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sales_updated_at BEFORE UPDATE ON sales FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 3. Inserir Dados de Exemplo

```sql
-- Inserir usuários de exemplo
INSERT INTO users (id, email, name, user_type, bio, is_verified, average_rating, rating_count, total_sales, total_products) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'maria.silva@email.com', 'Prof. Maria Silva', 'seller', 'Professora de Matemática com 15 anos de experiência', true, 4.9, 24, 156, 8),
('550e8400-e29b-41d4-a716-446655440002', 'ana.costa@email.com', 'Prof. Ana Costa', 'seller', 'Especialista em Língua Portuguesa', true, 4.7, 18, 89, 5),
('550e8400-e29b-41d4-a716-446655440003', 'carlos.santos@email.com', 'Prof. Carlos Santos', 'seller', 'Professor de Ciências e Biologia', true, 4.8, 32, 124, 12),
('550e8400-e29b-41d4-a716-446655440004', 'lucia.ferreira@email.com', 'Prof. Lucia Ferreira', 'seller', 'Professora de História', true, 4.6, 15, 67, 4),
('550e8400-e29b-41d4-a716-446655440005', 'roberto.lima@email.com', 'Prof. Roberto Lima', 'seller', 'Especialista em Matemática Lúdica', true, 4.4, 28, 198, 9),
('550e8400-e29b-41d4-a716-446655440006', 'marina.oliveira@email.com', 'Prof. Marina Oliveira', 'seller', 'Arte-educadora', true, 4.9, 21, 76, 6);

-- Inserir produtos de exemplo
INSERT INTO products (id, title, description, price, category, subject, grade_level, tags, rating, review_count, download_count, author_id) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'Plano de Aula: Matemática Básica - Frações', 'Conjunto completo de atividades para ensinar frações de forma lúdica e interativa. Inclui exercícios práticos, jogos educativos e avaliações formativas.', 15.90, 'Planos de Aula', 'Matemática', ARRAY['4º ano', '5º ano'], ARRAY['Frações', 'Matemática Básica', 'Ensino Fundamental'], 4.8, 24, 156, '550e8400-e29b-41d4-a716-446655440001'),
('650e8400-e29b-41d4-a716-446655440002', 'Atividades de Português - Interpretação de Texto', 'Material completo para desenvolver habilidades de interpretação textual com textos variados e questões elaboradas.', 12.50, 'Atividades', 'Português', ARRAY['3º ano', '4º ano', '5º ano'], ARRAY['Interpretação', 'Leitura', 'Português'], 4.6, 18, 89, '550e8400-e29b-41d4-a716-446655440002'),
('650e8400-e29b-41d4-a716-446655440003', 'Experimentos de Ciências - Sistema Solar', 'Atividades práticas e experimentos para ensinar sobre o sistema solar de forma divertida e educativa.', 18.90, 'Experimentos', 'Ciências', ARRAY['4º ano', '5º ano', '6º ano'], ARRAY['Sistema Solar', 'Experimentos', 'Astronomia'], 4.9, 32, 124, '550e8400-e29b-41d4-a716-446655440003'),
('650e8400-e29b-41d4-a716-446655440004', 'História do Brasil - Linha do Tempo', 'Material didático com linha do tempo interativa da história do Brasil, incluindo atividades e exercícios.', 22.00, 'Material Didático', 'História', ARRAY['6º ano', '7º ano', '8º ano'], ARRAY['História do Brasil', 'Linha do Tempo', 'Ensino Fundamental'], 4.7, 15, 67, '550e8400-e29b-41d4-a716-446655440004'),
('650e8400-e29b-41d4-a716-446655440005', 'Jogos Educativos - Tabuada Divertida', 'Coleção de jogos e atividades lúdicas para ensinar e praticar a tabuada de multiplicação.', 14.90, 'Jogos Educativos', 'Matemática', ARRAY['2º ano', '3º ano', '4º ano'], ARRAY['Tabuada', 'Jogos', 'Multiplicação'], 4.5, 28, 198, '550e8400-e29b-41d4-a716-446655440005'),
('650e8400-e29b-41d4-a716-446655440006', 'Arte e Criatividade - Técnicas de Pintura', 'Guia completo com técnicas de pintura para crianças, incluindo materiais necessários e passo a passo.', 16.50, 'Arte e Criatividade', 'Arte', ARRAY['1º ano', '2º ano', '3º ano', '4º ano'], ARRAY['Pintura', 'Arte', 'Criatividade'], 4.8, 21, 76, '550e8400-e29b-41d4-a716-446655440006');

-- Inserir algumas avaliações
INSERT INTO reviews (product_id, user_id, rating, comment) VALUES
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 5, 'Material excelente! Meus alunos adoraram as atividades de frações.'),
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 4, 'Muito bem estruturado e fácil de aplicar em sala de aula.'),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 5, 'Ótimo material para trabalhar interpretação de texto.'),
('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', 5, 'Os experimentos são fantásticos! As crianças ficaram encantadas.');
```

### 4. Configurar RLS (Row Level Security)

```sql
-- Habilitar RLS nas tabelas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Políticas para produtos (leitura pública)
CREATE POLICY "Produtos são visíveis para todos" ON products FOR SELECT USING (status = 'active');
CREATE POLICY "Autores podem gerenciar seus produtos" ON products FOR ALL USING (auth.uid() = author_id);

-- Políticas para usuários (perfis públicos)
CREATE POLICY "Perfis são visíveis para todos" ON users FOR SELECT USING (true);
CREATE POLICY "Usuários podem atualizar seu próprio perfil" ON users FOR UPDATE USING (auth.uid() = id);

-- Políticas para avaliações (leitura pública, escrita autenticada)
CREATE POLICY "Avaliações são visíveis para todos" ON reviews FOR SELECT USING (true);
CREATE POLICY "Usuários autenticados podem criar avaliações" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuários podem editar suas próprias avaliações" ON reviews FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para vendas (privadas)
CREATE POLICY "Usuários veem apenas suas vendas" ON sales FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
CREATE POLICY "Sistema pode criar vendas" ON sales FOR INSERT WITH CHECK (true);
CREATE POLICY "Sistema pode atualizar vendas" ON sales FOR UPDATE USING (true);

-- Políticas para carrinho (privado)
CREATE POLICY "Usuários veem apenas seu carrinho" ON cart_items FOR ALL USING (auth.uid() = user_id);

-- Políticas para favoritos (privado)
CREATE POLICY "Usuários veem apenas seus favoritos" ON favorites FOR ALL USING (auth.uid() = user_id);
```

### 5. Obter Chaves de API

1. No dashboard do Supabase, vá para **Settings > API**
2. Copie:
   - **URL:** `https://seu-projeto.supabase.co`
   - **anon public:** `eyJ...` (chave pública)
   - **service_role:** `eyJ...` (chave privada - não expor no frontend)

### 6. Configurar no Projeto

Anote essas informações para configurar no projeto Next.js.

