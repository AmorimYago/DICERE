# Dockerfile (exemplo recomendado)
FROM node:18-bullseye-slim

WORKDIR /app

# Copia package.json primeiro para aproveitar cache de layer
COPY package*.json ./

# Instala dependências
RUN npm install --legacy-peer-deps

# Copia pasta prisma para permitir prisma generate antes do build
COPY prisma ./prisma

# Gera Prisma Client
RUN npx prisma generate

# Copia o restante do código
COPY . .

# Garante diretório de uploads existe no build
RUN mkdir -p public/uploads

ENV NODE_ENV=production

# Executa build do Next.js
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]