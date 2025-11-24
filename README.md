# 🎯 DICERE - Comunicação para Crianças Autistas

<div align="center">
  <img src="public/dicere-logo.jpeg" alt="DICERE Logo" width="200"/>
  
  **Sistema de Comunicação Alternativa e Aumentativa (AAC)**
  
  Desenvolvido especialmente para crianças autistas e suas famílias
</div>

## 📖 Sobre o Projeto

DICERE é uma aplicação web moderna de comunicação alternativa e aumentativa (AAC) projetada para ajudar crianças autistas a se comunicarem de forma eficaz através de pictogramas e imagens. O sistema oferece uma interface intuitiva, colorida e acessível, seguindo as melhores práticas de design inclusivo.

### ✨ Características Principais

- 🎨 **Interface AAC Intuitiva**: 13 categorias organizadas com pictogramas claros
- 🌐 **Integração ARASAAC**: Acesso a milhares de pictogramas em português
- 👨‍👩‍👧 **Sistema de Dois Usuários**: Contas separadas para pais e crianças
- 📊 **Relatórios Detalhados**: Histórico de comunicação com export para PDF e email
- 🔊 **Text-to-Speech**: Síntese de voz em português para palavras e frases
- 📱 **Design Responsivo**: Funciona perfeitamente em tablets e smartphones
- 🎨 **Personalização**: Pais podem criar categorias e adicionar pictogramas customizados
- ☁️ **Upload de Imagens**: Armazenamento seguro na AWS S3
- 🔐 **Autenticação Segura**: Sistema de login com NextAuth.js

## 🎨 Cores da Marca

- **Azul**: `#2196F3` - Principal
- **Laranja**: `#FF6B35` - Destaque
- **Amarelo**: `#FFC107` - Acento
- **Verde**: `#4CAF50` - Sucesso

## 🛠️ Tecnologias

### Frontend

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização moderna
- **Radix UI** - Componentes acessíveis
- **Lucide React** - Ícones

### Backend

- **Next.js API Routes** - Backend serverless
- **Prisma ORM** - ORM para banco de dados
- **PostgreSQL** - Banco de dados relacional
- **NextAuth.js** - Autenticação

### Infraestrutura

- **AWS S3** - Armazenamento de imagens
- **Vercel** - Hospedagem e deploy
- **ARASAAC API** - Pictogramas AAC

## 📂 Estrutura do Projeto

```
dicere/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── categories/
│   │   ├── children/
│   │   ├── child-access
│   │   ├── reports/
│   │   ├── images/
│   │   ├── sequences/
│   │   ├── signup/
│   │   ├── upload/
│   │   └── arasaac/
│   ├── dashboard/
│   ├── login/
│   ├── register/
│   ├── aac/
│   ├── reports/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   ├── aac-interface.tsx
│   ├── dashboard-content.tsx
│   └── reports-interface.tsx
├── lib/
│   ├── auth.ts
│   ├── db.ts
│   ├── arasaac.ts
│   ├── permissions.ts
│   ├── email.ts
│   └── pdf.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
└── public/
    └── dicere-logo.jpeg
```

## 🚀 Instalação e Execução

### Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- Conta AWS (para S3)

### Passo a Passo

1. **Clone o repositório**

```bash
git clone <url-do-repositorio>
cd dicere
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure as variáveis de ambiente**

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dicere"
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="<gerar-com-openssl-rand-base64-32>"
# Opicional
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="<sua-key>"
AWS_SECRET_ACCESS_KEY="<sua-secret>"
AWS_S3_BUCKET="dicere-images"
```

4. **Configure o banco de dados**

```bash
# Criar migrations
npx prisma migrate dev

# Popular com categorias e pictogramas
npx prisma db seed
```

5. **Execute o projeto**

```bash
npm run dev
```

Acesse: [http://localhost:3001](http://localhost:3001)

## 👥 Tipos de Usuário

### 👨‍👩‍👧 PAI (Parent/Caregiver)

**Permissões:**

- ✅ Acessar dashboard
- ✅ Criar e gerenciar perfis de crianças
- ✅ Criar categorias personalizadas
- ✅ Adicionar pictogramas customizados
- ✅ Visualizar relatórios detalhados
- ✅ Enviar relatórios por email
- ✅ Exportar relatórios em PDF
- ✅ Usar interface AAC

### 👧 CRIANÇA (Child)

**Permissões:**

- ✅ Usar interface AAC
- ✅ Acessar todas as categorias
- ❌ Acessar dashboard
- ❌ Ver relatórios
- ❌ Criar/editar conteúdo

## 📚 Categorias de Comunicação

O DICERE inclui 13 categorias pré-configuradas com pictogramas da API ARASAAC:

1. **Geral** - Palavras básicas (eu, sim, não, obrigado)
2. **Comida** - Alimentos e refeições
3. **Bebidas** - Diferentes tipos de bebidas
4. **Sentimentos** - Emoções e estados emocionais
5. **Saúde** - Questões de saúde
6. **Objetos** - Objetos comuns do dia a dia
7. **Lugares** - Locais e ambientes
8. **Roupas** - Vestuário e acessórios
9. **Cores** - Cores básicas
10. **Números** - Números e quantidades
11. **Alfabeto** - Letras e Caracteres especiais
12. **Formas** - Formas geométricas
13. **Diversão** - Atividades recreativas

## 📊 Sistema de Relatórios

### Funcionalidades

- **Histórico Diário**: Registro de todas as comunicações
- **Palavras Mais Usadas**: Top palavras por frequência
- **Estatísticas**: Total de sequências e imagens usadas
- **Visualização**: Interface amigável com gráficos
- **Export PDF**: Download de relatórios em formato PDF
- **Email**: Envio de informações básicas de relatórios

### Como Usar

1. Acesse o dashboard
2. Selecione a criança
3. Clique em "Ver Relatórios"
4. Escolha a data desejada
5. Use os botões "Enviar Email" ou "Baixar PDF"

## 🔐 Segurança

- ✅ Autenticação JWT com NextAuth.js
- ✅ Senhas criptografadas com bcrypt
- ✅ Validação de permissões por role
- ✅ HTTPS obrigatório em produção
- ✅ Sanitização de inputs
- ✅ CORS configurado
- ✅ Rate limiting nas APIs

## 👏 Créditos

- **ARASAAC**: Pictogramas AAC (Creative Commons BY-NC-SA)
- **Next.js**: Framework React
- **Vercel**: Hospedagem e infraestrutura
- **Radix UI**: Componentes acessíveis
- **Tailwind CSS**: Framework CSS

## 📞 Contato

Para dúvidas, sugestões ou suporte:

- **Email**: yago.amorim4045@gmail.com

---

<div align="center">
  <p>Feito com ❤️ para ajudar crianças autistas a se comunicarem</p>
  <p><strong>DICERE</strong> © 2024</p>
</div>
