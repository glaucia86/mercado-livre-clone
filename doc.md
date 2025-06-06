# MercadoLibre Clone - Documentação

## 🎯 Visão Geral

Este projeto é uma aplicação simplificada inspirada no MercadoLibre, desenvolvida em 5 horas com foco na funcionalidade e arquitetura limpa.

## 🏗️ Arquitetura

### Backend (Express + TypeScript)
```
backend/
├── src/
│   ├── controllers/     # Controladores HTTP
│   ├── services/        # Lógica de negócio
│   ├── data/           # Dados JSON
│   ├── types/          # Definições TypeScript
│   ├── middleware/     # Middlewares Express
│   ├── routes/         # Definições de rotas
│   └── app.ts          # Configuração do servidor
```

### Frontend (Next.js + TailwindCSS)
```
frontend/
├── src/
│   ├── app/            # App Router (Next.js 14)
│   ├── components/     # Componentes React
│   ├── services/       # Comunicação com API
│   └── types/          # Tipos TypeScript compartilhados
```

## 🚀 Como Executar

### 1. Setup do Backend
```bash
cd backend
npm install
npm run dev
```
O servidor estará disponível em: http://localhost:3001

### 2. Setup do Frontend
```bash
cd frontend
npm install
npm run dev
```
A aplicação estará disponível em: http://localhost:3000

## 📡 API Endpoints

### Produtos
- `GET /api/products` - Lista produtos com filtros
  - Query params: `search`, `category`, `page`, `limit`, `minPrice`, `maxPrice`, `freeShipping`
- `GET /api/products/:id` - Detalhes de um produto
- `GET /api/products/categories` - Lista categorias
- `POST /api/products/:id/discount` - Aplica desconto (para live coding)

### Health Check
- `GET /api/health` - Status do servidor

## 🎨 Design Choices

### 1. Arquitetura Simplificada vs Clean Architecture
**Escolha:** Arquitetura simplificada com 3 camadas básicas
**Justificativa:** 
- Tempo limitado (5h)
- Foco na funcionalidade
- Facilita testes e manutenção
- Ainda mantém separação de responsabilidades

### 2. Stack Tecnológica
**Backend:**
- Express.js: Framework minimalista e rápido
- TypeScript: Type safety e melhor DX
- Zod: Validação type-safe
- JSON file: Persistência simples sem complexidade de DB

**Frontend:**
- Next.js 14: React framework moderno com SSR
- TailwindCSS: Styling rápido e responsivo
- TypeScript: Consistência de tipos com backend

### 3. Persistência de Dados
**Escolha:** Arquivo JSON estático
**Justificativa:**
- Requisito explícito do teste
- Simplicidade de setup
- Facilita demonstração
- Permite foco na lógica de negócio

### 4. Validação e Error Handling
**Escolha:** Zod para validação + middleware centralizado
**Justificativa:**
- Type-safe validation
- Error handling consistente
- Melhor experiência do desenvolvedor

## 🏆 Funcionalidades Implementadas

### Backend
- ✅ API RESTful completa
- ✅ Filtros de produtos (busca, categoria, preço)
- ✅ Paginação
- ✅ Validação de entrada com Zod
- ✅ Error handling centralizado
- ✅ CORS configurado
- ✅ Health check endpoint
- ✅ Preparado para feature de desconto

### Frontend
- ✅ Lista de produtos responsiva
- ✅ Página de detalhes do produto
- ✅ Busca por texto
- ✅ Filtro por categoria
- ✅ Paginação
- ✅ Design responsivo (mobile-first)
- ✅ Loading states
- ✅ Error handling
- ✅ SEO otimizado (metadata)

## 🔧 Desafios e Soluções

### 1. Tempo Limitado
**Desafio:** Implementar funcionalidade completa em 5h
**Solução:** 
- Arquitetura simplificada
- Foco em MVP funcional
- Reutilização de componentes
- Styling com framework (Tailwind)

### 2. Responsividade
**Desafio:** Interface responsiva sem tempo para testes extensivos
**Solução:**
- Mobile-first approach
- Grid system do Tailwind
- Componentes flexíveis
- Testes em breakpoints principais

### 3. Type Safety
**Desafio:** Manter types sincronizados entre frontend/backend
**Solução:**
- Tipos compartilhados
- Validação runtime com Zod
- API tipada no frontend

## 🧪 Testes

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm test
```

## 📈 Próximos Passos (Live Coding)

### Feature de Desconto
O backend já possui endpoint preparado:
```typescript
POST /api/products/:id/discount
{
  "percentage": 15
}
```

**Implementação no live coding:**
1. Expandir lógica de desconto no service
2. Persistir desconto aplicado
3. Atualizar frontend para mostrar preços com desconto
4. Adicionar validações de negócio

### Melhorias Futuras
- Autenticação de usuários
- Carrinho de compras
- Sistema de pagamento
- Reviews e ratings
- Recomendações
- Cache Redis
- Database real
- Testes E2E

## 📊 Métricas de Qualidade

- **Cobertura de testes:** Objetivo 80%+
- **Performance:** API < 100ms
- **Responsividade:** Suporte mobile/desktop
- **SEO:** Meta tags otimizadas
- **Acessibilidade:** Semântica HTML correta

## 🛠️ Scripts Úteis

```bash
# Backend
npm run dev          # Desenvolvimento
npm run build        # Build para produção
npm run start        # Executar build
npm test            # Executar testes

# Frontend
npm run dev         # Desenvolvimento
npm run build       # Build para produção
npm run start       # Executar build
npm run lint        # Linting
```

## 🌍 Variáveis de Ambiente

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Backend (.env)
```env
PORT=3001
NODE_ENV=development
```

## 📝 Considerações Finais

Este projeto demonstra como criar uma aplicação funcional e bem estruturada em tempo limitado, mantendo boas práticas de desenvolvimento e arquitetura limpa. A simplicidade escolhida permite fácil extensão e manutenção futura.

**Pontos fortes:**
- Arquitetura clara e extensível
- Type safety completo
- Interface responsiva
- API bem documentada
- Preparado para features futuras

**Trade-offs aceitos devido ao tempo:**
- Sem autenticação
- Persistência simples (JSON)
- Testes básicos
- UI minimalista mas funcional