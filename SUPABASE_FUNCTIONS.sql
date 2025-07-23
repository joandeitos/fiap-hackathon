-- =====================================================
-- SCRIPT DE FUNÇÕES PARA SUPABASE - EDUMARKETPLACE
-- =====================================================
-- Execute este script no SQL Editor do Supabase
-- para criar as funções necessárias para o sistema

-- 1. Função para incrementar contador de downloads
CREATE OR REPLACE FUNCTION increment_download_count(product_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE products 
    SET download_count = download_count + 1,
        updated_at = NOW()
    WHERE id = product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Função para atualizar rating do produto baseado nas avaliações
CREATE OR REPLACE FUNCTION update_product_rating(product_id UUID)
RETURNS void AS $$
DECLARE
    avg_rating DECIMAL(3,2);
    review_count INTEGER;
BEGIN
    -- Calcular média das avaliações e contar total
    SELECT AVG(rating), COUNT(*) 
    INTO avg_rating, review_count
    FROM reviews 
    WHERE product_id = update_product_rating.product_id;
    
    -- Atualizar produto com novos valores
    UPDATE products 
    SET rating = COALESCE(avg_rating, 0),
        review_count = review_count,
        updated_at = NOW()
    WHERE id = update_product_rating.product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Função para atualizar estatísticas do usuário vendedor
CREATE OR REPLACE FUNCTION update_seller_stats(seller_id UUID)
RETURNS void AS $$
DECLARE
    total_sales INTEGER;
    total_revenue DECIMAL(10,2);
    total_products INTEGER;
    avg_rating DECIMAL(3,2);
    rating_count INTEGER;
BEGIN
    -- Contar vendas completadas
    SELECT COUNT(*), COALESCE(SUM(amount), 0)
    INTO total_sales, total_revenue
    FROM sales 
    WHERE seller_id = update_seller_stats.seller_id 
    AND status = 'completed';
    
    -- Contar produtos ativos
    SELECT COUNT(*)
    INTO total_products
    FROM products 
    WHERE author_id = update_seller_stats.seller_id 
    AND status = 'active';
    
    -- Calcular rating médio baseado nos produtos
    SELECT AVG(rating), SUM(review_count)
    INTO avg_rating, rating_count
    FROM products 
    WHERE author_id = update_seller_stats.seller_id 
    AND status = 'active'
    AND review_count > 0;
    
    -- Atualizar estatísticas do usuário
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

-- 4. Trigger para atualizar rating quando uma nova avaliação é criada
CREATE OR REPLACE FUNCTION trigger_update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
    -- Atualizar rating do produto
    PERFORM update_product_rating(NEW.product_id);
    
    -- Atualizar estatísticas do vendedor
    PERFORM update_seller_stats((
        SELECT author_id 
        FROM products 
        WHERE id = NEW.product_id
    ));
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para reviews
DROP TRIGGER IF EXISTS reviews_update_rating ON reviews;
CREATE TRIGGER reviews_update_rating
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_product_rating();

-- 5. Trigger para atualizar estatísticas quando uma venda é completada
CREATE OR REPLACE FUNCTION trigger_update_sale_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Se a venda foi completada, incrementar download e atualizar estatísticas
    IF NEW.status = 'completed' AND (OLD IS NULL OR OLD.status != 'completed') THEN
        -- Incrementar download count
        PERFORM increment_download_count(NEW.product_id);
        
        -- Atualizar estatísticas do vendedor
        PERFORM update_seller_stats(NEW.seller_id);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para sales
DROP TRIGGER IF EXISTS sales_update_stats ON sales;
CREATE TRIGGER sales_update_stats
    AFTER INSERT OR UPDATE ON sales
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_sale_stats();

-- 6. Função para buscar produtos com filtros (otimizada)
CREATE OR REPLACE FUNCTION search_products(
    search_term TEXT DEFAULT NULL,
    category_filter TEXT DEFAULT NULL,
    subject_filter TEXT DEFAULT NULL,
    min_price DECIMAL DEFAULT NULL,
    max_price DECIMAL DEFAULT NULL,
    grade_levels TEXT[] DEFAULT NULL,
    limit_count INTEGER DEFAULT 12,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE(
    id UUID,
    title VARCHAR,
    description TEXT,
    price DECIMAL,
    category VARCHAR,
    subject VARCHAR,
    grade_level TEXT[],
    tags TEXT[],
    rating DECIMAL,
    review_count INTEGER,
    download_count INTEGER,
    author_id UUID,
    author_name VARCHAR,
    author_email VARCHAR,
    author_rating DECIMAL,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.title,
        p.description,
        p.price,
        p.category,
        p.subject,
        p.grade_level,
        p.tags,
        p.rating,
        p.review_count,
        p.download_count,
        p.author_id,
        u.name as author_name,
        u.email as author_email,
        u.average_rating as author_rating,
        p.created_at
    FROM products p
    JOIN users u ON p.author_id = u.id
    WHERE p.status = 'active'
    AND (search_term IS NULL OR (
        p.title ILIKE '%' || search_term || '%' OR
        p.description ILIKE '%' || search_term || '%' OR
        EXISTS (SELECT 1 FROM unnest(p.tags) AS tag WHERE tag ILIKE '%' || search_term || '%')
    ))
    AND (category_filter IS NULL OR p.category = category_filter)
    AND (subject_filter IS NULL OR p.subject = subject_filter)
    AND (min_price IS NULL OR p.price >= min_price)
    AND (max_price IS NULL OR p.price <= max_price)
    AND (grade_levels IS NULL OR p.grade_level && grade_levels)
    ORDER BY p.created_at DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Função para obter estatísticas do dashboard
CREATE OR REPLACE FUNCTION get_dashboard_stats(user_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
    user_type VARCHAR;
BEGIN
    -- Verificar tipo de usuário
    SELECT u.user_type INTO user_type
    FROM users u
    WHERE u.id = get_dashboard_stats.user_id;
    
    IF user_type = 'seller' THEN
        -- Estatísticas para vendedor
        SELECT json_build_object(
            'total_products', COUNT(p.id),
            'total_sales', COALESCE(SUM(s.amount), 0),
            'total_downloads', COALESCE(SUM(p.download_count), 0),
            'average_rating', COALESCE(AVG(p.rating), 0),
            'recent_sales', (
                SELECT json_agg(
                    json_build_object(
                        'id', s.id,
                        'amount', s.amount,
                        'product_title', p2.title,
                        'buyer_name', u2.name,
                        'created_at', s.created_at
                    )
                )
                FROM sales s
                JOIN products p2 ON s.product_id = p2.id
                JOIN users u2 ON s.buyer_id = u2.id
                WHERE s.seller_id = get_dashboard_stats.user_id
                AND s.status = 'completed'
                ORDER BY s.created_at DESC
                LIMIT 5
            )
        ) INTO result
        FROM products p
        LEFT JOIN sales s ON p.id = s.product_id AND s.status = 'completed'
        WHERE p.author_id = get_dashboard_stats.user_id
        AND p.status = 'active';
    ELSE
        -- Estatísticas para comprador
        SELECT json_build_object(
            'total_purchases', COUNT(s.id),
            'total_spent', COALESCE(SUM(s.amount), 0),
            'favorite_category', (
                SELECT p.category
                FROM sales s2
                JOIN products p ON s2.product_id = p.id
                WHERE s2.buyer_id = get_dashboard_stats.user_id
                GROUP BY p.category
                ORDER BY COUNT(*) DESC
                LIMIT 1
            ),
            'recent_purchases', (
                SELECT json_agg(
                    json_build_object(
                        'id', s.id,
                        'amount', s.amount,
                        'product_title', p2.title,
                        'seller_name', u2.name,
                        'created_at', s.created_at
                    )
                )
                FROM sales s
                JOIN products p2 ON s.product_id = p2.id
                JOIN users u2 ON s.seller_id = u2.id
                WHERE s.buyer_id = get_dashboard_stats.user_id
                AND s.status = 'completed'
                ORDER BY s.created_at DESC
                LIMIT 5
            )
        ) INTO result
        FROM sales s
        WHERE s.buyer_id = get_dashboard_stats.user_id
        AND s.status = 'completed';
    END IF;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Função para verificar se usuário já comprou um produto
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

-- 9. Atualizar todas as estatísticas existentes (executar uma vez)
DO $$
DECLARE
    product_record RECORD;
    user_record RECORD;
BEGIN
    -- Atualizar ratings de todos os produtos
    FOR product_record IN SELECT id FROM products WHERE status = 'active' LOOP
        PERFORM update_product_rating(product_record.id);
    END LOOP;
    
    -- Atualizar estatísticas de todos os vendedores
    FOR user_record IN SELECT id FROM users WHERE user_type = 'seller' LOOP
        PERFORM update_seller_stats(user_record.id);
    END LOOP;
END $$;

-- 10. Conceder permissões necessárias
GRANT EXECUTE ON FUNCTION increment_download_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION update_product_rating(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION update_seller_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION search_products(TEXT, TEXT, TEXT, DECIMAL, DECIMAL, TEXT[], INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_dashboard_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION user_owns_product(UUID, UUID) TO authenticated;

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================
-- Após executar este script, todas as funções estarão
-- disponíveis e o sistema funcionará corretamente.
-- =====================================================

