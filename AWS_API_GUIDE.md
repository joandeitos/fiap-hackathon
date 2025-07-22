# 🚀 Guia Completo: Deploy da API EduMarketplace na AWS

## 📋 Índice
1. [Opções de Deploy na AWS](#opções-de-deploy-na-aws)
2. [Opção Recomendada: Lambda + API Gateway](#opção-recomendada-lambda--api-gateway)
3. [Alternativa: EC2 com Docker](#alternativa-ec2-com-docker)
4. [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
5. [Configuração de Domínio e SSL](#configuração-de-domínio-e-ssl)
6. [Monitoramento e Logs](#monitoramento-e-logs)

---

## 🎯 Opções de Deploy na AWS

### 1. **AWS Lambda + API Gateway** (Recomendado)
- ✅ **Serverless** - Sem gerenciamento de servidor
- ✅ **Escalabilidade automática**
- ✅ **Custo baixo** - Paga apenas pelo uso
- ✅ **Ideal para APIs REST**

### 2. **Amazon EC2**
- ✅ **Controle total** do ambiente
- ✅ **Flexibilidade** máxima
- ❌ **Gerenciamento manual** de servidor
- ❌ **Custo fixo**

### 3. **AWS ECS/Fargate**
- ✅ **Containerização**
- ✅ **Escalabilidade**
- ❌ **Complexidade maior**

### 4. **AWS Elastic Beanstalk**
- ✅ **Deploy simples**
- ✅ **Gerenciamento automático**
- ❌ **Menos controle**

---

## 🌟 Opção Recomendada: Lambda + API Gateway

### Passo 1: Preparar o Código para Lambda

#### 1.1 Instalar Dependências
```bash
# Instalar Serverless Framework
npm install -g serverless

# Instalar plugins necessários
npm install --save-dev serverless-python-requirements
npm install --save-dev serverless-wsgi
```

#### 1.2 Criar arquivo `serverless.yml`
```yaml
service: edumarketplace-api

provider:
  name: aws
  runtime: python3.9
  region: us-east-1
  stage: ${opt:stage, 'dev'}
  environment:
    STAGE: ${self:provider.stage}
    DATABASE_URL: ${env:DATABASE_URL}
    JWT_SECRET: ${env:JWT_SECRET}

functions:
  api:
    handler: wsgi_handler.handler
    events:
      - http:
          path: /{proxy+}
          method: ANY
          cors: true
      - http:
          path: /
          method: ANY
          cors: true

plugins:
  - serverless-python-requirements
  - serverless-wsgi

custom:
  wsgi:
    app: src.main.app
    packRequirements: false
  pythonRequirements:
    dockerizePip: non-linux
    slim: true
    strip: false
```

#### 1.3 Criar `wsgi_handler.py`
```python
import serverless_wsgi
from src.main import app

def handler(event, context):
    return serverless_wsgi.handle_request(app, event, context)
```

#### 1.4 Atualizar `requirements.txt`
```txt
flask==2.3.3
flask-cors==4.0.0
flask-sqlalchemy==3.0.5
python-dotenv==1.0.0
bcrypt==4.0.1
serverless-wsgi==0.2.0
```

### Passo 2: Configurar AWS CLI

#### 2.1 Instalar AWS CLI
```bash
# Windows
curl "https://awscli.amazonaws.com/AWSCLIV2.msi" -o "AWSCLIV2.msi"
msiexec /i AWSCLIV2.msi

# macOS
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /

# Linux
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

#### 2.2 Configurar Credenciais
```bash
aws configure
# AWS Access Key ID: [Sua Access Key]
# AWS Secret Access Key: [Sua Secret Key]
# Default region name: us-east-1
# Default output format: json
```

### Passo 3: Deploy da API

#### 3.1 Deploy Inicial
```bash
# Deploy para ambiente de desenvolvimento
serverless deploy --stage dev

# Deploy para produção
serverless deploy --stage prod
```

#### 3.2 Verificar Deploy
```bash
# Listar funções
serverless info --stage dev

# Ver logs
serverless logs -f api --stage dev
```

---

## 🖥️ Alternativa: EC2 com Docker

### Passo 1: Criar Instância EC2

#### 1.1 Configurações Recomendadas
- **Tipo:** t3.micro (Free Tier) ou t3.small
- **AMI:** Amazon Linux 2
- **Storage:** 20GB SSD
- **Security Group:** HTTP (80), HTTPS (443), SSH (22)

#### 1.2 Conectar via SSH
```bash
ssh -i "sua-chave.pem" ec2-user@seu-ip-publico
```

### Passo 2: Configurar Ambiente

#### 2.1 Instalar Docker
```bash
sudo yum update -y
sudo yum install -y docker
sudo service docker start
sudo usermod -a -G docker ec2-user

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### 2.2 Criar `Dockerfile`
```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python", "src/main.py"]
```

#### 2.3 Criar `docker-compose.yml`
```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "80:5000"
    environment:
      - DATABASE_URL=sqlite:///edumarketplace.db
      - FLASK_ENV=production
    volumes:
      - ./data:/app/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl
    depends_on:
      - api
    restart: unless-stopped
```

### Passo 3: Deploy no EC2

#### 3.1 Enviar Código
```bash
# Comprimir código
tar -czf edumarketplace-api.tar.gz src/ requirements.txt Dockerfile docker-compose.yml

# Enviar via SCP
scp -i "sua-chave.pem" edumarketplace-api.tar.gz ec2-user@seu-ip:/home/ec2-user/

# No servidor
tar -xzf edumarketplace-api.tar.gz
```

#### 3.2 Executar
```bash
# Build e start
docker-compose up -d

# Verificar status
docker-compose ps

# Ver logs
docker-compose logs -f api
```

---

## 🗄️ Configuração do Banco de Dados

### Opção 1: Amazon RDS (Recomendado para Produção)

#### 1.1 Criar Instância RDS
```bash
aws rds create-db-instance \
    --db-instance-identifier edumarketplace-db \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --master-username admin \
    --master-user-password SuaSenhaSegura123 \
    --allocated-storage 20 \
    --vpc-security-group-ids sg-xxxxxxxxx \
    --backup-retention-period 7 \
    --multi-az \
    --storage-encrypted
```

#### 1.2 Configurar Variáveis de Ambiente
```bash
# Para Lambda
export DATABASE_URL="postgresql://admin:senha@endpoint.rds.amazonaws.com:5432/edumarketplace"

# Para EC2
echo "DATABASE_URL=postgresql://admin:senha@endpoint.rds.amazonaws.com:5432/edumarketplace" >> .env
```

### Opção 2: Amazon DynamoDB (NoSQL)

#### 2.1 Criar Tabelas
```python
import boto3

dynamodb = boto3.resource('dynamodb', region_name='us-east-1')

# Tabela de Produtos
products_table = dynamodb.create_table(
    TableName='edumarketplace-products',
    KeySchema=[
        {
            'AttributeName': 'id',
            'KeyType': 'HASH'
        }
    ],
    AttributeDefinitions=[
        {
            'AttributeName': 'id',
            'AttributeType': 'S'
        }
    ],
    BillingMode='PAY_PER_REQUEST'
)

# Tabela de Usuários
users_table = dynamodb.create_table(
    TableName='edumarketplace-users',
    KeySchema=[
        {
            'AttributeName': 'id',
            'KeyType': 'HASH'
        }
    ],
    AttributeDefinitions=[
        {
            'AttributeName': 'id',
            'AttributeType': 'S'
        }
    ],
    BillingMode='PAY_PER_REQUEST'
)
```

---

## 🌐 Configuração de Domínio e SSL

### Passo 1: Configurar Route 53

#### 1.1 Criar Hosted Zone
```bash
aws route53 create-hosted-zone \
    --name edumarketplace.com \
    --caller-reference $(date +%s)
```

#### 1.2 Criar Registro A
```bash
aws route53 change-resource-record-sets \
    --hosted-zone-id Z123456789 \
    --change-batch '{
        "Changes": [{
            "Action": "CREATE",
            "ResourceRecordSet": {
                "Name": "api.edumarketplace.com",
                "Type": "A",
                "AliasTarget": {
                    "DNSName": "seu-api-gateway.execute-api.us-east-1.amazonaws.com",
                    "EvaluateTargetHealth": false,
                    "HostedZoneId": "Z1UJRXOUMOOFQ8"
                }
            }
        }]
    }'
```

### Passo 2: Configurar SSL com ACM

#### 2.1 Solicitar Certificado
```bash
aws acm request-certificate \
    --domain-name api.edumarketplace.com \
    --validation-method DNS \
    --region us-east-1
```

#### 2.2 Validar Certificado
```bash
# Seguir instruções no console AWS para validação DNS
```

---

## 📊 Monitoramento e Logs

### CloudWatch Logs

#### 1.1 Configurar Logs para Lambda
```yaml
# No serverless.yml
provider:
  logs:
    restApi: true
  logRetentionInDays: 14
```

#### 1.2 Ver Logs
```bash
# Via CLI
aws logs describe-log-groups
aws logs get-log-events --log-group-name /aws/lambda/edumarketplace-api-dev-api

# Via Serverless
serverless logs -f api --stage dev --tail
```

### CloudWatch Metrics

#### 1.1 Métricas Importantes
- **Invocations:** Número de chamadas
- **Duration:** Tempo de execução
- **Errors:** Número de erros
- **Throttles:** Limitações de rate

#### 1.2 Criar Alarmes
```bash
aws cloudwatch put-metric-alarm \
    --alarm-name "API-High-Error-Rate" \
    --alarm-description "API error rate is too high" \
    --metric-name Errors \
    --namespace AWS/Lambda \
    --statistic Sum \
    --period 300 \
    --threshold 10 \
    --comparison-operator GreaterThanThreshold \
    --evaluation-periods 2
```

---

## 💰 Estimativa de Custos

### Lambda + API Gateway (Recomendado)
- **Lambda:** $0.20 por 1M requests
- **API Gateway:** $3.50 por 1M requests
- **RDS t3.micro:** ~$15/mês
- **Total estimado:** ~$20-30/mês para 100K requests

### EC2 t3.micro
- **Instância:** ~$8.50/mês
- **Storage:** ~$2/mês
- **RDS:** ~$15/mês
- **Total estimado:** ~$25-30/mês

---

## 🚀 Comandos de Deploy Rápido

### Para Lambda (Recomendado)
```bash
# 1. Configurar AWS CLI
aws configure

# 2. Instalar Serverless
npm install -g serverless

# 3. Deploy
serverless deploy --stage prod

# 4. Testar
curl https://seu-endpoint.execute-api.us-east-1.amazonaws.com/prod/api/health
```

### Para EC2
```bash
# 1. Criar instância EC2
# 2. Conectar via SSH
ssh -i "chave.pem" ec2-user@ip-publico

# 3. Instalar Docker
sudo yum update -y && sudo yum install -y docker
sudo service docker start

# 4. Deploy
docker run -d -p 80:5000 --name edumarketplace-api sua-imagem
```

---

## 📞 Próximos Passos

1. **Escolher a opção** (Lambda recomendado)
2. **Configurar AWS CLI** com suas credenciais
3. **Adaptar o código** para a opção escolhida
4. **Fazer deploy** seguindo os passos
5. **Configurar domínio** e SSL
6. **Testar endpoints** da API
7. **Configurar monitoramento**

**Qual opção você prefere implementar? Lambda + API Gateway ou EC2?**

