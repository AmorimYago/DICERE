# 🚀 Guia de Deploy - DICERE

Este guia fornece instruções detalhadas para fazer o deploy da aplicação DICERE no Vercel.

## 📋 Pré-requisitos

Antes de começar o deploy, certifique-se de ter:

1. **Conta no Vercel**
   - Crie uma conta em [vercel.com](https://vercel.com)
   - Conecte sua conta GitHub/GitLab/Bitbucket

2. **Banco de Dados PostgreSQL**
   - Opções recomendadas:
     - [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
     - [Supabase](https://supabase.com)
     - [Neon](https://neon.tech)
     - [Railway](https://railway.app)

3. **AWS S3 Bucket** (para armazenamento de imagens)
   - Criar bucket no AWS S3
   - Configurar IAM user com permissões de leitura/escrita
   - Configurar CORS no bucket

## 🔧 Configuração

### 1. Preparar o Repositório

```bash
# Inicializar git (se ainda não foi feito)
git init

# Adicionar todos os arquivos
git add .

# Commit inicial
git commit -m "Initial commit - DICERE project"

# Conectar com repositório remoto
git remote add origin <sua-url-do-repositorio>

# Push para o repositório
git push -u origin main
```

### 2. Configurar Variáveis de Ambiente

Crie as seguintes variáveis de ambiente no Vercel Dashboard:

#### Banco de Dados
```
DATABASE_URL=postgresql://user:password@host:5432/dicere?schema=public
```

#### Autenticação NextAuth
```
NEXTAUTH_URL=https://seu-dominio.vercel.app
NEXTAUTH_SECRET=<gerar com: openssl rand -base64 32>
```

#### AWS S3
```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=<sua-access-key>
AWS_SECRET_ACCESS_KEY=<sua-secret-key>
AWS_S3_BUCKET=dicere-images
```

#### Email (Opcional)
```
EMAIL_FROM=noreply@dicere.com
SENDGRID_API_KEY=<sua-api-key>
```

### 3. Configurar Banco de Dados

#### Executar Migrações Prisma

```bash
# Gerar cliente Prisma
npx prisma generate

# Criar migrações
npx prisma migrate dev --name init

# Ou aplicar migrações em produção
npx prisma migrate deploy
```

#### Popular Banco de Dados

```bash
# Executar seed para popular categorias e pictogramas
npx prisma db seed

# Ou adicionar ao package.json:
# "prisma": {
#   "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
# }
```

### 4. Configurar AWS S3

#### CORS Configuration

Adicione a seguinte configuração CORS no seu bucket S3:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["https://seu-dominio.vercel.app"],
    "ExposeHeaders": ["ETag"]
  }
]
```

#### Bucket Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::dicere-images/*"
    }
  ]
}
```

## 🚀 Deploy no Vercel

### Opção 1: Deploy via Dashboard

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Selecione o repositório do DICERE
3. Configure as variáveis de ambiente
4. Clique em "Deploy"

### Opção 2: Deploy via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login no Vercel
vercel login

# Deploy
vercel

# Deploy para produção
vercel --prod
```

## ✅ Pós-Deploy

### 1. Verificar Build

Certifique-se de que o build foi bem-sucedido:
- Verifique os logs no Vercel Dashboard
- Teste as rotas principais: `/`, `/login`, `/dashboard`

### 2. Testar Funcionalidades

- ✅ Autenticação (login/registro)
- ✅ Dashboard de pais
- ✅ Interface AAC
- ✅ Upload de imagens
- ✅ Relatórios
- ✅ Busca de pictogramas ARASAAC

### 3. Configurar Domínio Customizado (Opcional)

1. Vá para Project Settings > Domains
2. Adicione seu domínio
3. Configure DNS records conforme instruções do Vercel

### 4. Monitoramento

Configure ferramentas de monitoramento:
- **Vercel Analytics**: Automaticamente ativado
- **Sentry** (opcional): Para error tracking
- **Google Analytics** (opcional): Para analytics

## 🔒 Segurança

### Checklist de Segurança

- [ ] NEXTAUTH_SECRET é forte e único
- [ ] DATABASE_URL não está exposta publicamente
- [ ] AWS credentials estão seguras
- [ ] CORS está configurado corretamente no S3
- [ ] HTTPS está ativo (automático no Vercel)
- [ ] Rate limiting está configurado para APIs sensíveis

## 🐛 Troubleshooting

### Build Failed

**Problema**: Erro ao fazer build
**Solução**: 
```bash
# Limpar cache e reinstalar
rm -rf node_modules .next
npm install
npm run build
```

### Database Connection Error

**Problema**: Não consegue conectar ao banco
**Solução**: 
- Verifique se DATABASE_URL está correta
- Certifique-se de que o banco permite conexões externas
- Verifique se as migrations foram aplicadas

### Images Not Loading

**Problema**: Imagens não carregam
**Solução**:
- Verifique configurações CORS do S3
- Confirme AWS credentials
- Teste acesso direto ao bucket

### Authentication Issues

**Problema**: Erro ao fazer login
**Solução**:
- Verifique NEXTAUTH_URL
- Confirme NEXTAUTH_SECRET
- Verifique se usuário existe no banco

## 📚 Recursos Adicionais

- [Documentação Vercel](https://vercel.com/docs)
- [Next.js Deploy](https://nextjs.org/docs/deployment)
- [Prisma Deploy](https://www.prisma.io/docs/guides/deployment)
- [NextAuth Deploy](https://next-auth.js.org/deployment)

## 🆘 Suporte

Se encontrar problemas:
1. Verifique os logs no Vercel Dashboard
2. Consulte a documentação acima
3. Entre em contato com a equipe de desenvolvimento

---

**DICERE** - Comunicação para Crianças Autistas
