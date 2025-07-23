-- =====================================================
-- SCRIPT COMPLETO SUPABASE - EDUMARKETPLACE
-- =====================================================
-- Execute este script completo no SQL Editor do Supabase
-- Ele criará TUDO do zero: tabelas, dados, funções e triggers

-- Limpar tudo primeiro (se existir)
DROP TRIGGER IF EXISTS reviews_update_rating ON reviews;
DROP TRIGGER IF EXISTS sales_update_stats ON sales;
DROP FUNCTION IF EXISTS trigger_update_product_rating();
DROP FUNCTION IF EXISTS trigger_update_sale_stats();
DROP FUNCTION IF EXISTS increment_download_count(UUID);
DROP FUNCTION IF EXISTS update_product_rating(UUID);
DROP FUNCTION IF EXISTS update_seller_stats(UUID);
DROP FUNCTION IF EXISTS search_products(TEXT, TEXT, TEXT, DECIMAL, DECIMAL, TEXT[], INTEGER, INTEGER);
DROP FUNCTION IF EXISTS get_dashboard_stats(UUID);
DROP FUNCTION IF EXISTS user_owns_product(UUID, UUID);
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Remover políticas RLS
DROP POLICY IF EXISTS "Produtos são visíveis para todos" ON products;
DROP POLICY IF EXISTS "Autores podem gerenciar seus produtos" ON products;
DROP POLICY IF EXISTS "Perfis são visíveis para todos" ON users;
DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio perfil" ON users;
DROP POLICY IF EXISTS "Avaliações são visíveis para todos" ON reviews;
DROP POLICY IF EXISTS "Usuários autenticados podem criar avaliações" ON reviews;
DROP POLICY IF EXISTS "Usuários podem editar suas próprias avaliações" ON reviews;
DROP POLICY IF EXISTS "Usuários veem apenas suas vendas" ON sales;
DROP POLICY IF EXISTS "Sistema pode criar vendas" ON sales;
DROP POLICY IF EXISTS "Sistema pode atualizar vendas" ON sales;
DROP POLICY IF EXISTS "Usuários veem apenas seu carrinho" ON cart_items;
DROP POLICY IF EXISTS "Usuários veem apenas seus favoritos" ON favorites;

-- Remover tabelas (em ordem reversa devido às foreign keys)
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS sales CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CRIAÇÃO DAS TABELAS
-- =====================================================

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

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_subject ON products(subject);
CREATE INDEX idx_products_author ON products(author_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_rating ON products(rating);
CREATE INDEX idx_sales_buyer ON sales(buyer_id);
CREATE INDEX idx_sales_seller ON sales(seller_id);
CREATE INDEX idx_sales_status ON sales(status);
CREATE INDEX idx_sales_created_at ON sales(created_at);
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_cart_user ON cart_items(user_id);
CREATE INDEX idx_favorites_user ON favorites(user_id);

-- =====================================================
-- FUNÇÕES E TRIGGERS
-- =====================================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sales_updated_at BEFORE UPDATE ON sales FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para incrementar contador de downloads
CREATE OR REPLACE FUNCTION increment_download_count(product_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE products 
    SET download_count = download_count + 1,
        updated_at = NOW()
    WHERE id = product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para atualizar rating do produto
CREATE OR REPLACE FUNCTION update_product_rating(product_id UUID)
RETURNS void AS $$
DECLARE
    avg_rating DECIMAL(3,2);
    review_count INTEGER;
BEGIN
    SELECT AVG(rating), COUNT(*) 
    INTO avg_rating, review_count
    FROM reviews 
    WHERE product_id = update_product_rating.product_id;
    
    UPDATE products 
    SET rating = COALESCE(avg_rating, 0),
        review_count = review_count,
        updated_at = NOW()
    WHERE id = update_product_rating.product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para atualizar estatísticas do vendedor
CREATE OR REPLACE FUNCTION update_seller_stats(seller_id UUID)
RETURNS void AS $$
DECLARE
    total_sales INTEGER;
    total_revenue DECIMAL(10,2);
    total_products INTEGER;
    avg_rating DECIMAL(3,2);
    rating_count INTEGER;
BEGIN
    SELECT COUNT(*), COALESCE(SUM(amount), 0)
    INTO total_sales, total_revenue
    FROM sales 
    WHERE seller_id = update_seller_stats.seller_id 
    AND status = 'completed';
    
    SELECT COUNT(*)
    INTO total_products
    FROM products 
    WHERE author_id = update_seller_stats.seller_id 
    AND status = 'active';
    
    SELECT AVG(rating), SUM(review_count)
    INTO avg_rating, rating_count
    FROM products 
    WHERE author_id = update_seller_stats.seller_id 
    AND status = 'active'
    AND review_count > 0;
    
    UPDATE users 
    SET total_sales = update_seller_stats.total_sales,
        total_revenue = update_seller_stats.total_revenue,
        total_products = update_seller_stats.total_products,
        average_rating = COALESCE(avg_rating, 0),
        rating_count = COALESCE(rating_count, 0),
        updated_at = NOW()
    WHERE id = update_seller_stats.seller_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para atualizar rating quando review é criada/atualizada
CREATE OR REPLACE FUNCTION trigger_update_product_rating()
RETURNS TRIGGER AS $$
DECLARE
    product_author_id UUID;
BEGIN
    IF TG_OP = 'DELETE' THEN
        SELECT author_id INTO product_author_id FROM products WHERE id = OLD.product_id;
        PERFORM update_product_rating(OLD.product_id);
        PERFORM update_seller_stats(product_author_id);
        RETURN OLD;
    ELSE
        SELECT author_id INTO product_author_id FROM products WHERE id = NEW.product_id;
        PERFORM update_product_rating(NEW.product_id);
        PERFORM update_seller_stats(product_author_id);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reviews_update_rating
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_product_rating();

-- Trigger para atualizar estatísticas quando venda é completada
CREATE OR REPLACE FUNCTION trigger_update_sale_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND (OLD IS NULL OR OLD.status != 'completed') THEN
        PERFORM increment_download_count(NEW.product_id);
        PERFORM update_seller_stats(NEW.seller_id);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sales_update_stats
    AFTER INSERT OR UPDATE ON sales
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_sale_stats();

-- Função para verificar se usuário possui produto
CREATE OR REPLACE FUNCTION user_owns_product(user_id UUID, product_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM sales 
        WHERE buyer_id = user_owns_product.user_id 
        AND product_id = user_owns_product.product_id 
        AND status = 'completed'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- INSERIR DADOS DE EXEMPLO
-- =====================================================

-- Inserir usuários
INSERT INTO users (id, email, name, user_type, bio, is_verified, average_rating, rating_count, total_sales, total_products) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'maria.silva@email.com', 'Prof. Maria Silva', 'seller', 'Professora de Matemática com 15 anos de experiência', true, 4.9, 24, 156, 8),
('550e8400-e29b-41d4-a716-446655440002', 'ana.costa@email.com', 'Prof. Ana Costa', 'seller', 'Especialista em Língua Portuguesa', true, 4.7, 18, 89, 5),
('550e8400-e29b-41d4-a716-446655440003', 'carlos.santos@email.com', 'Prof. Carlos Santos', 'seller', 'Professor de Ciências e Biologia', true, 4.8, 32, 124, 12),
('550e8400-e29b-41d4-a716-446655440004', 'lucia.ferreira@email.com', 'Prof. Lucia Ferreira', 'seller', 'Professora de História', true, 4.6, 15, 67, 4),
('550e8400-e29b-41d4-a716-446655440005', 'roberto.lima@email.com', 'Prof. Roberto Lima', 'seller', 'Especialista em Matemática Lúdica', true, 4.4, 28, 198, 9),
('550e8400-e29b-41d4-a716-446655440006', 'marina.oliveira@email.com', 'Prof. Marina Oliveira', 'seller', 'Arte-educadora', true, 4.9, 21, 76, 6),
('550e8400-e29b-41d4-a716-446655440007', 'joao.comprador@email.com', 'João Comprador', 'buyer', 'Professor interessado em novos materiais', false, 0, 0, 0, 0);

-- Inserir produtos
INSERT INTO products (id, title, description, price, category, subject, grade_level, tags, rating, review_count, download_count, author_id) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'Plano de Aula: Matemática Básica - Frações', 'Conjunto completo de atividades para ensinar frações de forma lúdica e interativa. Inclui exercícios práticos, jogos educativos e avaliações formativas.', 15.90, 'Planos de Aula', 'Matemática', ARRAY['4º ano', '5º ano'], ARRAY['Frações', 'Matemática Básica', 'Ensino Fundamental'], 4.8, 24, 156, '550e8400-e29b-41d4-a716-446655440001'),
('650e8400-e29b-41d4-a716-446655440002', 'Atividades de Português - Interpretação de Texto', 'Material completo para desenvolver habilidades de interpretação textual com textos variados e questões elaboradas.', 12.50, 'Atividades', 'Português', ARRAY['3º ano', '4º ano', '5º ano'], ARRAY['Interpretação', 'Leitura', 'Português'], 4.6, 18, 89, '550e8400-e29b-41d4-a716-446655440002'),
('650e8400-e29b-41d4-a716-446655440003', 'Experimentos de Ciências - Sistema Solar', 'Atividades práticas e experimentos para ensinar sobre o sistema solar de forma divertida e educativa.', 18.90, 'Experimentos', 'Ciências', ARRAY['4º ano', '5º ano', '6º ano'], ARRAY['Sistema Solar', 'Experimentos', 'Astronomia'], 4.9, 32, 124, '550e8400-e29b-41d4-a716-446655440003'),
('650e8400-e29b-41d4-a716-446655440004', 'História do Brasil - Linha do Tempo', 'Material didático com linha do tempo interativa da história do Brasil, incluindo atividades e exercícios.', 22.00, 'Material Didático', 'História', ARRAY['6º ano', '7º ano', '8º ano'], ARRAY['História do Brasil', 'Linha do Tempo', 'Ensino Fundamental'], 4.7, 15, 67, '550e8400-e29b-41d4-a716-446655440004'),
('650e8400-e29b-41d4-a716-446655440005', 'Jogos Educativos - Tabuada Divertida', 'Coleção de jogos e atividades lúdicas para ensinar e praticar a tabuada de multiplicação.', 14.90, 'Jogos Educativos', 'Matemática', ARRAY['2º ano', '3º ano', '4º ano'], ARRAY['Tabuada', 'Jogos', 'Multiplicação'], 4.5, 28, 198, '550e8400-e29b-41d4-a716-446655440005'),
('650e8400-e29b-41d4-a716-446655440006', 'Arte e Criatividade - Técnicas de Pintura', 'Guia completo com técnicas de pintura para crianças, incluindo materiais necessários e passo a passo.', 16.50, 'Arte e Criatividade', 'Arte', ARRAY['1º ano', '2º ano', '3º ano', '4º ano'], ARRAY['Pintura', 'Arte', 'Criatividade'], 4.8, 21, 76, '550e8400-e29b-41d4-a716-446655440006');

-- Inserir avaliações
INSERT INTO reviews (product_id, user_id, rating, comment) VALUES
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 5, 'Material excelente! Meus alunos adoraram as atividades de frações.'),
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 4, 'Muito bem estruturado e fácil de aplicar em sala de aula.'),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 5, 'Ótimo material para trabalhar interpretação de texto.'),
('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', 5, 'Os experimentos são fantásticos! As crianças ficaram encantadas.');

-- Inserir algumas vendas de exemplo
INSERT INTO sales (product_id, buyer_id, seller_id, amount, status, payment_method, transaction_id) VALUES
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440001', 15.90, 'completed', 'credit_card', 'txn_001'),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440002', 12.50, 'completed', 'pix', 'txn_002'),
('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440003', 18.90, 'completed', 'credit_card', 'txn_003');

-- =====================================================
-- CONFIGURAR RLS (ROW LEVEL SECURITY)
-- =====================================================

-- Habilitar RLS
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

-- =====================================================
-- CONCEDER PERMISSÕES
-- =====================================================

GRANT EXECUTE ON FUNCTION increment_download_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION update_product_rating(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION update_seller_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION user_owns_product(UUID, UUID) TO authenticated;

-- =====================================================
-- SCRIPT CONCLUÍDO COM SUCESSO!
-- =====================================================
-- Todas as tabelas, funções, triggers e dados foram criados.
-- O sistema está pronto para uso!
-- =====================================================

