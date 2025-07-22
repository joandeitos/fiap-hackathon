# 🆓 Guia Completo: Hospedagem GRATUITA da API EduMarketplace

## 📋 Índice
1. [Opções Totalmente Gratuitas](#opções-totalmente-gratuitas)
2. [AWS Free Tier (12 meses grátis)](#aws-free-tier)
3. [Vercel Serverless Functions](#vercel-serverless-functions)
4. [Railway (Recomendado)](#railway-recomendado)
5. [Render](#render)
6. [Heroku Alternatives](#heroku-alternatives)
7. [Comparação das Opções](#comparação-das-opções)

---

## 🌟 Opções Totalmente Gratuitas

### 1. **Railway** (Recomendado) 🚀
- ✅ **$5 de crédito mensal** (suficiente para APIs pequenas)
- ✅ **Deploy automático** via GitHub
- ✅ **PostgreSQL gratuito**
- ✅ **Domínio personalizado**
- ✅ **SSL automático**

#### Como usar Railway:

```bash
# 1. Instalar Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Inicializar projeto
railway init

# 4. Deploy
railway up
```

#### Configuração `railway.json`:
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "python src/main.py",
    "healthcheckPath": "/api/health"
  }
}
```

### 2. **Render** 🌐
- ✅ **Plano gratuito permanente**
- ✅ **750 horas/mês** (suficiente para uso contínuo)
- ✅ **PostgreSQL gratuito** (90 dias)
- ✅ **SSL automático**
- ❌ **Sleep após 15min inatividade**

#### Como usar Render:

1. **Conectar GitHub** no dashboard do Render
2. **Criar Web Service** apontando para o repositório
3. **Configurar build:**
   ```bash
   Build Command: pip install -r requirements.txt
   Start Command: python src/main.py
   ```

### 3. **Vercel Serverless Functions** ⚡
- ✅ **Totalmente gratuito** para projetos pessoais
- ✅ **100GB bandwidth/mês**
- ✅ **Execuções ilimitadas**
- ✅ **Deploy automático**
- ❌ **Timeout de 10s** (Hobby plan)

#### Estrutura para Vercel:
```
/api
  /products
    index.py
    [id].py
  /users
    index.py
  /health
    index.py
```

#### Exemplo `api/products/index.py`:
```python
from flask import Flask, request, jsonify
import json

app = Flask(__name__)

def handler(request):
    if request.method == 'GET':
        # Retornar lista de produtos
        products = [
            {"id": 1, "title": "Produto 1", "price": 15.90},
            {"id": 2, "title": "Produto 2", "price": 12.50}
        ]
        return jsonify({"success": True, "data": {"products": products}})
    
    return jsonify({"error": "Method not allowed"}), 405
```

### 4. **Supabase** (Backend as a Service) 🗄️
- ✅ **PostgreSQL gratuito**
- ✅ **API REST automática**
- ✅ **Autenticação incluída**
- ✅ **2GB storage**
- ✅ **50MB database**

#### Como usar Supabase:

1. **Criar projeto** em supabase.com
2. **Criar tabelas** via SQL Editor:
```sql
-- Tabela de produtos
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  category VARCHAR(100),
  subject VARCHAR(100),
  grade_level TEXT[],
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  author_id INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de usuários
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  user_type VARCHAR(50) DEFAULT 'buyer',
  created_at TIMESTAMP DEFAULT NOW()
);
```

3. **Usar API REST automática:**
```javascript
// No frontend
const supabaseUrl = 'https://seu-projeto.supabase.co'
const supabaseKey = 'sua-chave-publica'

// Buscar produtos
const { data: products } = await supabase
  .from('products')
  .select('*')
  .limit(10)
```

### 5. **PlanetScale** (Database) + **Vercel** (API) 🌍
- ✅ **MySQL gratuito** (PlanetScale)
- ✅ **10GB storage**
- ✅ **1 bilhão row reads/mês**
- ✅ **Branching de database**

---

## 🆓 AWS Free Tier (12 meses grátis)

### Recursos Gratuitos:
- **Lambda:** 1M requests/mês + 400.000 GB-segundos
- **API Gateway:** 1M requests/mês
- **RDS:** 750 horas/mês (t2.micro)
- **EC2:** 750 horas/mês (t2.micro)
- **S3:** 5GB storage

### Configuração AWS Free Tier:

#### 1. Lambda + API Gateway (Grátis por 12 meses)
```yaml
# serverless.yml
service: edumarketplace-api-free

provider:
  name: aws
  runtime: python3.9
  region: us-east-1
  memorySize: 128  # Mínimo para economizar
  timeout: 10      # Máximo para free tier

functions:
  api:
    handler: handler.main
    events:
      - http:
          path: /{proxy+}
          method: ANY
          cors: true
```

#### 2. RDS Free Tier
```bash
aws rds create-db-instance \
    --db-instance-identifier edumarketplace-free \
    --db-instance-class db.t2.micro \
    --engine postgres \
    --allocated-storage 20 \
    --master-username admin \
    --master-user-password SuaSenha123
```

---

## 🔥 Configuração Completa: Railway (Recomendado)

### Passo 1: Preparar o Código

#### 1.1 Atualizar `src/main.py`:
```python
import os
from flask import Flask
from flask_cors import CORS
from routes.products import products_bp
from routes.sales import sales_bp

app = Flask(__name__)
CORS(app)

# Registrar blueprints
app.register_blueprint(products_bp, url_prefix='/api')
app.register_blueprint(sales_bp, url_prefix='/api')

@app.route('/api/health')
def health():
    return {"status": "ok", "message": "EduMarketplace API is running"}

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
```

#### 1.2 Criar `requirements.txt`:
```txt
Flask==2.3.3
Flask-CORS==4.0.0
Flask-SQLAlchemy==3.0.5
python-dotenv==1.0.0
bcrypt==4.0.1
psycopg2-binary==2.9.7
gunicorn==21.2.0
```

#### 1.3 Criar `Procfile`:
```
web: gunicorn --bind 0.0.0.0:$PORT src.main:app
```

### Passo 2: Deploy no Railway

#### 2.1 Via GitHub (Recomendado):
1. **Push código** para GitHub
2. **Conectar Railway** ao repositório
3. **Deploy automático** a cada push

#### 2.2 Via CLI:
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Inicializar
railway init

# Deploy
railway up

# Adicionar domínio personalizado
railway domain
```

### Passo 3: Configurar Banco PostgreSQL

#### 3.1 Adicionar PostgreSQL no Railway:
```bash
# Via CLI
railway add postgresql

# Ou via dashboard: Add Service > PostgreSQL
```

#### 3.2 Configurar Variáveis de Ambiente:
```bash
# Railway define automaticamente:
DATABASE_URL=postgresql://user:pass@host:port/db
PORT=3000

# Adicionar manualmente:
FLASK_ENV=production
JWT_SECRET=sua-chave-secreta-aqui
```

---

## 📊 Comparação das Opções Gratuitas

| Serviço | Custo | Banco | Limitações | Uptime |
|---------|-------|-------|------------|--------|
| **Railway** | $5 crédito/mês | PostgreSQL ✅ | Créditos limitados | 99.9% |
| **Render** | Grátis | PostgreSQL 90d | Sleep 15min | 99% |
| **Vercel** | Grátis | Externo | 10s timeout | 99.9% |
| **Supabase** | Grátis | PostgreSQL ✅ | 50MB DB | 99.9% |
| **AWS Free** | 12 meses | RDS ✅ | Após 12 meses | 99.99% |

---

## 🚀 Solução Recomendada: Railway + PostgreSQL

### Por que Railway?
1. **$5 crédito mensal** suficiente para APIs pequenas
2. **PostgreSQL incluído** sem limitações de tempo
3. **Deploy automático** via GitHub
4. **Sem sleep** da aplicação
5. **SSL e domínio** incluídos

### Configuração Rápida:

```bash
# 1. Preparar repositório
git add .
git commit -m "Prepare for Railway deploy"
git push origin main

# 2. Conectar Railway
# - Acessar railway.app
# - Conectar GitHub
# - Selecionar repositório
# - Deploy automático

# 3. Adicionar PostgreSQL
# - Dashboard > Add Service > PostgreSQL
# - Conectar ao projeto

# 4. Configurar variáveis
# - FLASK_ENV=production
# - JWT_SECRET=sua-chave
```

### URL Final:
```
https://seu-projeto.up.railway.app/api/health
```

---

## 🔄 Alternativa: Supabase (100% Gratuito)

### Vantagens:
- **API REST automática** baseada no schema
- **Autenticação incluída**
- **Real-time subscriptions**
- **Dashboard admin**

### Como implementar:

#### 1. Criar projeto no Supabase
#### 2. Definir schema:
```sql
-- Executar no SQL Editor do Supabase
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  category VARCHAR(100),
  subject VARCHAR(100),
  grade_level TEXT[],
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  author_name VARCHAR(255),
  author_email VARCHAR(255),
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Inserir dados de exemplo
INSERT INTO products (title, description, price, category, subject, grade_level, rating, review_count, download_count, author_name, author_email, tags) VALUES
('Plano de Aula: Matemática Básica - Frações', 'Conjunto completo de atividades para ensinar frações', 15.90, 'Planos de Aula', 'Matemática', ARRAY['4º ano', '5º ano'], 4.8, 24, 156, 'Prof. Maria Silva', 'maria@email.com', ARRAY['Frações', 'Matemática Básica']),
('Atividades de Português - Interpretação', 'Material para desenvolver interpretação textual', 12.50, 'Atividades', 'Português', ARRAY['3º ano', '4º ano', '5º ano'], 4.6, 18, 89, 'Prof. Ana Costa', 'ana@email.com', ARRAY['Interpretação', 'Leitura']);
```

#### 3. Atualizar frontend para usar Supabase:
```javascript
// src/lib/api.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://seu-projeto.supabase.co'
const supabaseKey = 'sua-chave-publica'
const supabase = createClient(supabaseUrl, supabaseKey)

export const getProducts = async (params = {}) => {
  try {
    let query = supabase.from('products').select('*')
    
    if (params.search) {
      query = query.ilike('title', `%${params.search}%`)
    }
    
    if (params.category && params.category !== 'all') {
      query = query.eq('category', params.category)
    }
    
    const { data, error } = await query.limit(12)
    
    if (error) throw error
    
    return {
      success: true,
      data: {
        products: data,
        pagination: { total: data.length }
      }
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const getProduct = async (id) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
```

---

## 💡 Recomendação Final

### Para Desenvolvimento/Teste:
**Supabase** - 100% gratuito, setup rápido

### Para Produção Pequena:
**Railway** - $5/mês em créditos, mais confiável

### Para Aprendizado AWS:
**AWS Free Tier** - 12 meses grátis, experiência real

### Configuração Mais Simples:
1. **Supabase** para banco e API REST
2. **Vercel** para frontend (já configurado)
3. **Zero custo** total

**Qual opção você gostaria que eu implemente primeiro?**

