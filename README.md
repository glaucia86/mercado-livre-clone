# 🛒 Mercado Livre Clone - Glaucia Lemos

<div align="center">

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

*Um marketplace moderno inspirado no Mercado Livre, construído com as melhores práticas de desenvolvimento full-stack*

</div>

## 📋 Índice

- [🎯 Visão Geral](#-visão-geral)
- [🏗️ Arquitetura](#️-arquitetura)
- [⚡ Funcionalidades](#-funcionalidades)
- [🛠️ Stack Tecnológica](#️-stack-tecnológica)
- [🚀 Como Executar](#-como-executar)
- [📁 Estrutura do Projeto](#-estrutura-do-projeto)
- [🎓 Conceitos Demonstrados](#-conceitos-demonstrados)
- [🔄 API Endpoints](#-api-endpoints)
- [🎨 Design System](#-design-system)
- [🧪 Testes e Qualidade](#-testes-e-qualidade)
- [🔮 Próximos Passos](#-próximos-passos)

## 🎯 Visão Geral

Este projeto é uma implementação moderna de um marketplace e-commerce inspirado no MercadoLibre, desenvolvido como demonstração de arquitetura full-stack escalável. A aplicação combina um frontend Next.js 14 com App Router e um backend Express.js, utilizando TypeScript para type safety completo.

### ✨ Destaques

- **Arquitetura limpa** com separação clara de responsabilidades
- **Type safety** completo entre frontend e backend
- **Performance otimizada** com debounce, lazy loading e caching
- **UX moderno** com loading states, animações e feedback visual
- **Responsivo** para desktop, tablet e mobile
- **Acessibilidade** seguindo padrões WCAG
- **Extensível** preparado para features futuras

## 🏗️ Arquitetura

### 📐 Arquitetura em Camadas (Layered Architecture)

```mermaid
graph TB
    %% Presentation Layer
    subgraph "🎨 Presentation Layer"
        direction TB
        UI[UI Components<br/>- ProductCard<br/>- Filters<br/>- Layout<br/>- Modal]
        Pages[Pages & Routes<br/>- Home Page<br/>- Product Detail<br/>- App Router]
        Hooks[Custom Hooks<br/>- useDebounce<br/>- useSearchDebounce<br/>- useLocalStorage]
        
        Pages --> UI
        UI --> Hooks
    end
    
    %% API Layer
    subgraph "🌐 API Layer"
        direction TB
        Routes[Express Routes<br/>- /products<br/>- /products/:id<br/>- /health]
        Middleware[Middleware<br/>- CORS<br/>- Error Handler<br/>- Logger]
        Validation[Validation<br/>- Zod Schemas<br/>- Input Sanitization<br/>- Type Checking]
        
        Routes --> Middleware
        Routes --> Validation
    end
    
    %% Business Logic Layer
    subgraph "⚙️ Business Logic Layer"
        direction TB
        Controllers[Controllers<br/>- Product Controller<br/>- Search Controller<br/>- Discount Controller]
        Services[Services<br/>- Product Service<br/>- Search Service<br/>- Filter Service]
        Utils[Utilities<br/>- Price Calculator<br/>- Search Parser<br/>- Data Transformer]
        
        Controllers --> Services
        Services --> Utils
    end
    
    %% Data Access Layer
    subgraph "💾 Data Access Layer"
        direction TB
        DataStore[JSON Data Store<br/>- products.json<br/>- categories.json<br/>- mock data]
        FileSystem[File System<br/>- Read Operations<br/>- Data Parsing<br/>- Error Handling]
        
        DataStore --> FileSystem
    end
    
    %% External Services
    subgraph "🌐 External Services"
        direction TB
        CDN[CDN Images<br/>- Product Photos<br/>- Optimized Assets<br/>- Global Delivery]
        Browser[Browser APIs<br/>- Local Storage<br/>- Session Storage<br/>- Cache API]
    end
    
    %% Connections between layers
    Hooks -->|HTTP Requests| Routes
    Routes -->|Response| Hooks
    Routes --> Controllers
    Controllers --> Services
    Services --> DataStore
    
    UI -->|Load Assets| CDN
    Hooks -->|Store State| Browser
    
    %% Styling
    classDef presentation fill:#e3f2fd,stroke:#1976d2,stroke-width:3px
    classDef api fill:#f3e5f5,stroke:#7b1fa2,stroke-width:3px
    classDef business fill:#fff3e0,stroke:#f57c00,stroke-width:3px
    classDef data fill:#e8f5e8,stroke:#388e3c,stroke-width:3px
    classDef external fill:#fce4ec,stroke:#c2185b,stroke-width:3px
    
    class UI,Pages,Hooks presentation
    class Routes,Middleware,Validation api
    class Controllers,Services,Utils business
    class DataStore,FileSystem data
    class CDN,Browser external
```

### 🔄 Fluxo de Dados Detalhado

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant UI as 🎨 UI Component
    participant H as 🪝 Custom Hook
    participant API as 🌐 API Layer
    participant C as ⚙️ Controller
    participant S as 🛠️ Service
    participant D as 💾 Data Store
    participant Cache as 🗄️ Cache
    
    Note over U,Cache: Fluxo Completo de Busca de Produtos
    
    U->>UI: Digite termo "smartphone"
    UI->>UI: Mostra loading skeleton
    UI->>H: Chama useSearchDebounce
    H->>H: Aplica debounce (800ms)
    
    alt Cache Hit
        H->>Cache: Verifica cache local
        Cache-->>H: Retorna dados cached
        H-->>UI: Atualiza com dados cached
        UI-->>U: Mostra resultados instantâneos
    else Cache Miss
        H->>API: GET /api/products?search=smartphone
        API->>API: Valida query com Zod
        
        alt Validação OK
            API->>C: Chama ProductController
            C->>S: Chama ProductService
            S->>S: Aplica filtros e paginação
            S->>D: Busca em products.json
            D-->>S: Retorna produtos filtrados
            S-->>C: Dados processados
            C-->>API: Response formatada
            API-->>H: JSON com produtos
            H->>Cache: Salva no cache
            H-->>UI: Atualiza estado
            UI-->>U: Mostra resultados
        else Validação Erro
            API-->>H: Error 400
            H-->>UI: Mostra erro de validação
            UI-->>U: Feedback de erro
        end
    end
    
    Note over U,Cache: Aplicação de Desconto Dinâmico
    
    U->>UI: Clica "Aplicar Desconto 15%"
    UI->>UI: Abre modal de confirmação
    U->>UI: Confirma desconto
    UI->>H: Chama applyDiscount
    H->>API: POST /api/products/:id/discount
    API->>C: ProductController.applyDiscount
    C->>S: ProductService.calculateDiscount
    S->>S: Calcula novo preço
    S->>D: Atualiza temporariamente
    D-->>S: Produto com desconto
    S-->>C: Dados atualizados
    C-->>API: Response com novo preço
    API-->>H: Produto atualizado
    H->>Cache: Invalida cache
    H-->>UI: Atualiza preço na tela
    UI->>UI: Animação de mudança de preço
    UI-->>U: Feedback visual de sucesso
```

### 🏗️ Arquitetura de Componentes React

```mermaid
graph TD
    %% Root Level
    subgraph "🏠 Application Root"
        App[App Router<br/>layout.tsx]
        Global[Global Providers<br/>- Error Boundary<br/>- Theme Provider]
    end
    
    %% Page Level
    subgraph "📄 Page Components"
        HomePage[Home Page<br/>- Product Listing<br/>- Search Interface]
        ProductPage[Product Detail Page<br/>- Product Info<br/>- Related Products]
        NotFound[404 Page<br/>- Error Handling]
    end
    
    %% Feature Components
    subgraph "🧩 Feature Components"
        ProductList[Product List<br/>- Grid Layout<br/>- Pagination<br/>- Loading States]
        SearchBar[Search Bar<br/>- Auto-complete<br/>- Filters<br/>- Debounced Input]
        ProductCard[Product Card<br/>- Image Gallery<br/>- Price Display<br/>- Actions]
        Filters[Filter Panel<br/>- Category Filter<br/>- Price Range<br/>- Shipping Options]
    end
    
    %% UI Components
    subgraph "🎨 UI Components"
        Modal[Modal System<br/>- Discount Modal<br/>- Confirmation Dialog]
        Button[Button Components<br/>- Primary/Secondary<br/>- Loading States]
        Input[Input Components<br/>- Text Input<br/>- Search Input<br/>- Range Slider]
        Card[Card Components<br/>- Product Card<br/>- Info Card]
        Loading[Loading Components<br/>- Skeleton<br/>- Spinner<br/>- Progress Bar]
    end
    
    %% Custom Hooks
    subgraph "🪝 Custom Hooks"
        useSearch[useSearchDebounce<br/>- Debounced Search<br/>- Cache Management]
        useProducts[useProducts<br/>- Product Fetching<br/>- State Management]
        useFilters[useFilters<br/>- Filter Logic<br/>- URL Sync]
        useLocalStorage[useLocalStorage<br/>- Persistence<br/>- Sync State]
    end
    
    %% Services
    subgraph "🌐 Services & Utils"
        APIService[API Service<br/>- HTTP Client<br/>- Error Handling<br/>- Response Parsing]
        CacheService[Cache Service<br/>- Local Storage<br/>- Session Storage<br/>- Memory Cache]
        UtilsService[Utils<br/>- Price Formatter<br/>- Date Formatter<br/>- Validators]
    end
    
    %% Connections
    App --> Global
    Global --> HomePage
    Global --> ProductPage
    Global --> NotFound
    
    HomePage --> ProductList
    HomePage --> SearchBar
    HomePage --> Filters
    
    ProductPage --> ProductCard
    ProductPage --> Modal
    
    ProductList --> ProductCard
    ProductList --> Loading
    
    SearchBar --> Input
    SearchBar --> Button
    
    ProductCard --> Card
    ProductCard --> Button
    ProductCard --> Modal
    
    Filters --> Input
    Filters --> Button
    
    %% Hooks connections
    HomePage --> useSearch
    HomePage --> useProducts
    HomePage --> useFilters
    
    ProductPage --> useProducts
    ProductPage --> useLocalStorage
    
    ProductList --> useProducts
    SearchBar --> useSearch
    Filters --> useFilters
    
    %% Services connections
    useSearch --> APIService
    useProducts --> APIService
    useProducts --> CacheService
    useLocalStorage --> CacheService
    
    APIService --> UtilsService
    CacheService --> UtilsService
    
    %% Styling
    classDef root fill:#fff3e0,stroke:#f57c00,stroke-width:3px
    classDef pages fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef features fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef ui fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    classDef hooks fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    classDef services fill:#e0f2f1,stroke:#00695c,stroke-width:2px
    
    class App,Global root
    class HomePage,ProductPage,NotFound pages
    class ProductList,SearchBar,ProductCard,Filters features
    class Modal,Button,Input,Card,Loading ui
    class useSearch,useProducts,useFilters,useLocalStorage hooks
    class APIService,CacheService,UtilsService services
```

### 🎯 Padrões de Arquitetura Implementados

#### 1. **Layered Architecture (Arquitetura em Camadas)**
- **Presentation Layer**: Componentes React, páginas Next.js
- **API Layer**: Rotas Express, middleware, validação
- **Business Logic**: Controllers, services, regras de negócio
- **Data Access**: Acesso aos dados JSON, file system

#### 2. **Clean Architecture Principles**
- **Separation of Concerns**: Cada camada tem responsabilidade específica
- **Dependency Inversion**: Camadas superiores não dependem de implementações
- **Single Responsibility**: Cada módulo tem uma única responsabilidade

#### 3. **Design Patterns Utilizados**
- **Repository Pattern**: Abstração do acesso aos dados
- **Service Layer Pattern**: Lógica de negócio centralizada
- **Factory Pattern**: Criação de instâncias padronizada
- **Observer Pattern**: Hooks React para mudanças de estado
- **Strategy Pattern**: Diferentes estratégias de filtro e busca

## ⚡ Funcionalidades

### 🛍️ Core Features

- **📱 Catálogo de Produtos** - Exibição responsiva com grid adaptativo
- **🔍 Busca Inteligente** - Busca por título e descrição com debounce
- **🎯 Filtros Avançados** - Por categoria, preço, frete grátis
- **📄 Paginação** - Load more progressivo para melhor UX
- **💰 Sistema de Desconto** - Aplicação dinâmica de descontos
- **📋 Detalhes do Produto** - Página completa com todas as informações

### 🎨 UX/UI Features

- **⚡ Performance** - Loading states e skeleton screens
- **📱 Responsivo** - Design mobile-first com breakpoints customizados
- **🎭 Animações** - Transições suaves e micro-interações
- **♿ Acessibilidade** - ARIA labels, keyboard navigation, alto contraste
- **🔄 Real-time** - Updates instantâneos sem refresh

### 🛠️ Developer Features

- **🔒 Type Safety** - TypeScript end-to-end
- **✅ Validação** - Schemas Zod no backend
- **📝 Logging** - Sistema de logs detalhado
- **🐛 Error Handling** - Tratamento graceful de erros
- **🧪 Testável** - Arquitetura preparada para testes

## 🛠️ Stack Tecnológica

### Frontend

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **Next.js** | 15^.0.0 | Framework React com SSR/SSG |
| **React** | 18.2.0 | Biblioteca de interface |
| **TypeScript** | 5^.0.0 | Type safety e DX |
| **TailwindCSS** | 3.3.0 | Styling utility-first |
| **Lucide React** | Latest | Ícones SVG otimizados |

### Backend

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **Express.js** | 5.1.0 | Framework web minimalista |
| **TypeScript** | 5.8.3 | Type safety no servidor |
| **Zod** | 3.25.53 | Validação e parsing de schemas |
| **CORS** | 2.8.5 | Cross-origin resource sharing |
| **tsx** | 4.19.4 | Execução TypeScript |

### Desenvolvimento

| Ferramenta | Propósito |
|------------|-----------|
| **ESLint** | Linting e qualidade de código |
| **Prettier** | Formatação automática |
| **Vitest** | Framework de testes |
| **Git** | Controle de versão |

## 🚀 Como Executar

### Pré-requisitos

- **Node.js** 18+ instalado
- **npm** ou **yarn** como package manager
- **Git** para clonagem

### 🔧 Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/glaucia86/mercado-livre-clone.git
cd mercado-livre-clone

# 2. Instale dependências do backend
cd backend
npm install

# 3. Instale dependências do frontend
cd ../frontend
npm install
```

### ▶️ Execução

```bash
# Terminal 1: Backend (porta 3001)
cd backend
npm run dev

# Terminal 2: Frontend (porta 3000)
cd frontend
npm run dev
```

### 🌐 Acesso

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001/api
- **Health Check:** http://localhost:3001/api/health

### 🧪 Testes

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 📁 Estrutura do Projeto

```
mercado-livre-clone/
├── 📁 backend/                  # Servidor Express.js
│   ├── 📁 src/
│   │   ├── 📁 controllers/      # Controladores HTTP
│   │   │   └── 📄 products.controller.ts
│   │   ├── 📁 services/         # Lógica de negócio
│   │   │   └── 📄 product.service.ts
│   │   ├── 📁 data/            # Dados mockados
│   │   │   └── 📄 products.json
│   │   ├── 📁 types/           # Definições TypeScript
│   │   │   └── 📄 index.ts
│   │   ├── 📁 middleware/      # Middlewares Express
│   │   │   └── 📄 error.ts
│   │   ├── 📁 routes/          # Definições de rotas
│   │   │   └── 📄 products.routes.ts
│   │   └── 📄 app.ts           # Configuração do servidor
│   ├── 📄 package.json
│   └── 📄 tsconfig.json
│
├── 📁 frontend/                 # Aplicação Next.js
│   ├── 📁 src/
│   │   ├── 📁 app/             # App Router (Next.js 14)
│   │   │   ├── 📁 products/
│   │   │   │   └── 📁 [id]/
│   │   │   │       └── 📄 page.tsx
│   │   │   ├── 📄 page.tsx     # Página principal
│   │   │   ├── 📄 layout.tsx   # Layout global
│   │   │   └── 📄 globals.css  # Estilos globais
│   │   ├── 📁 components/      # Componentes React
│   │   │   ├── 📄 ProductCard.tsx
│   │   │   ├── 📄 Filters.tsx
│   │   │   └── 📄 DiscountModal.tsx
│   │   ├── 📁 hooks/           # Custom hooks
│   │   │   └── 📄 useDebounce.ts
│   │   ├── 📁 services/        # Comunicação com API
│   │   │   └── 📄 api.service.ts
│   │   └── 📁 types/           # Tipos compartilhados
│   │       └── 📄 index.ts
│   ├── 📄 package.json
│   ├── 📄 tailwind.config.js
│   ├── 📄 next.config.js
│   └── 📄 tsconfig.json
│
├── 📄 README.md               # Este arquivo
├── 📄 run.md                  # Instruções de execução
└── 📄 doc.md                  # Documentação técnica
```

## 🎓 Conceitos Demonstrados

### 🏗️ Arquitetura e Padrões

- **🔧 Clean Architecture** - Separação em camadas bem definidas
- **🎯 Single Responsibility** - Cada classe/função tem uma responsabilidade
- **🔄 Dependency Injection** - Services injetados nos controllers
- **🏭 Factory Pattern** - Criação de instâncias padronizada
- **📦 Repository Pattern** - Abstração da camada de dados

### 🎨 Frontend Avançado

- **⚡ Custom Hooks** - Lógica reutilizável (useDebounce)
- **🔄 State Management** - Estados locais e derivados
- **🎭 Compound Components** - Componentes composáveis
- **📱 Responsive Design** - Mobile-first com breakpoints
- **♿ Accessibility** - ARIA, semântica, navegação por teclado

### ⚙️ Backend Moderno

- **✅ Input Validation** - Schemas Zod type-safe
- **🛡️ Error Handling** - Middleware centralizado
- **📝 Logging** - Sistema de logs estruturado
- **🔒 Type Safety** - TypeScript end-to-end
- **🌐 CORS** - Configuração adequada para SPA

### 🚀 Performance

- **⏱️ Debouncing** - Redução de requests desnecessários
- **🖼️ Image Optimization** - Next.js Image component
- **📦 Code Splitting** - Loading automático por rota
- **🔄 Memoization** - useCallback e useMemo estratégicos

### 🧪 Qualidade de Código

- **📏 ESLint** - Linting rules customizadas
- **🎨 Prettier** - Formatação consistente
- **📝 TypeScript** - Type checking rigoroso
- **🧪 Testing** - Estrutura preparada para testes

## 🔄 API Endpoints

### 📦 Produtos

```http
# Listar produtos com filtros
GET /api/products?search=termo&category=smartphones&page=1&limit=12

# Buscar produto específico
GET /api/products/:id

# Listar categorias disponíveis
GET /api/products/categories

# Aplicar desconto (Live Coding Feature)
POST /api/products/:id/discount
Content-Type: application/json
{
  "percentage": 15
}
```

### 🏥 Sistema

```http
# Health check
GET /api/health

# Informações da API
GET /api
```

### 📊 Exemplos de Resposta

```json
// GET /api/products
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "ML-001",
        "title": "Samsung Galaxy S24 Ultra 256GB",
        "price": 6999.99,
        "currency": "BRL",
        "category": "smartphones",
        "seller": {
          "name": "Tech Premium",
          "reputation": 98
        },
        "shipping": { "free": true },
        "rating": 4.8,
        "reviews": 2847
      }
    ],
    "total": 6,
    "page": 1,
    "totalPages": 1
  }
}
```

## 🎨 Design System

### 🎨 Paleta de Cores

```css
/* Cores Principais */
--primary-blue: #3483FA;      /* Azul MercadoLibre */
--primary-yellow: #FFE600;    /* Amarelo MercadoLibre */
--success-green: #00A650;     /* Verde sucesso */
--warning-orange: #FF6900;    /* Laranja aviso */
--error-red: #F23C4D;         /* Vermelho erro */

/* Tons de Cinza */
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-500: #6B7280;
--gray-900: #111827;
```

### 📐 Tipografia

```css
/* Famílias */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;

/* Escalas */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
```

### 📱 Breakpoints

```css
/* Mobile First */
--mobile: 0px;      /* 0-639px */
--tablet: 640px;    /* 640-1023px */
--desktop: 1024px;  /* 1024-1279px */
--xl: 1280px;       /* 1280px+ */
```

### 🎭 Componentes

- **ProductCard** - Card responsivo com hover effects
- **Filters** - Sidebar de filtros com debounce
- **LoadingSpinner** - Indicadores de carregamento
- **ErrorBoundary** - Tratamento visual de erros

## 🧪 Testes e Qualidade

### 🎯 Cobertura de Testes

- **📊 Meta:** 80%+ cobertura de código
- **🧪 Unitários:** Services e utils
- **🔗 Integração:** API endpoints
- **🎭 Componentes:** Rendering e interações

### 📏 Métricas de Qualidade

```bash
# Análise estática
npm run lint          # ESLint
npm run type-check     # TypeScript
npm run format         # Prettier

# Performance
npm run build         # Bundle analysis
npm run lighthouse    # Performance audit
```

### 🛡️ Validação

- **Backend:** Validação Zod em todas as rotas
- **Frontend:** Validação de forms e inputs
- **Types:** Type safety end-to-end
- **Runtime:** Error boundaries e fallbacks

## 🔮 Próximos Passos

### 🚀 Próximas Features

- [ ] **🔐 Autenticação** - JWT + refresh tokens
- [ ] **🛒 Carrinho** - Persistência e checkout
- [ ] **💳 Pagamentos** - Integração Stripe/PayPal
- [ ] **⭐ Reviews** - Sistema de avaliações
- [ ] **🔔 Notificações** - Real-time com WebSockets
- [ ] **📊 Dashboard** - Analytics para vendedores

### 🏗️ Melhorias Técnicas

- [ ] **🗄️ Database** - PostgreSQL + Prisma ORM
- [ ] **🔄 Cache** - Redis para performance
- [ ] **🐳 Docker** - Containerização completa
- [ ] **☁️ Deploy** - CI/CD com GitHub Actions
- [ ] **📈 Monitoring** - Logs e métricas
- [ ] **🧪 Testing** - Cobertura 100% + E2E

### 📈 Escalabilidade

- [ ] **🌐 CDN** - Assets globais
- [ ] **🔍 Search** - Elasticsearch
- [ ] **📱 Mobile App** - React Native
- [ ] **🤖 AI** - Recomendações personalizadas
- [ ] **🌍 I18n** - Internacionalização
- [ ] **📊 Analytics** - Business Intelligence

---

<div align="center">

### 🤝 Contribuindo

Contributions são bem-vindas! Veja o [CONTRIBUTING.md](CONTRIBUTING.md) para guidelines.

### 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

### 👨‍💻 Autor

Desenvolvido com ❤️ para demonstrar best practices em desenvolvimento full-stack.

**[⬆ Voltar ao topo](#-mercado-livre-clone---glaucia-lemos)**

</div>