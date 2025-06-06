# Como Executar o Projeto

## Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

## 🚀 Execução Rápida

### 1. Clone o repositório
```bash
git clone <repository-url>
cd mercado-libre-simple
```

### 2. Executar Backend
```bash
cd backend
npm install
npm run dev
```
✅ Servidor rodando em: http://localhost:3001
✅ API disponível em: http://localhost:3001/api

### 3. Executar Frontend (novo terminal)
```bash
cd frontend
npm install
npm run dev
```
✅ Aplicação disponível em: http://localhost:3000

## 🧪 Testar Endpoints

### Health Check
```bash
curl http://localhost:3001/api/health
```

### Listar Produtos
```bash
curl http://localhost:3001/api/products
```

### Buscar Produto
```bash
curl "http://localhost:3001/api/products?search=samsung"
```

### Produto por ID
```bash
curl http://localhost:3001/api/products/ML-001
```

## 🎯 Funcionalidades Principais

1. **Lista de Produtos** - http://localhost:3000
   - Busca por texto
   - Filtro por categoria
   - Paginação

2. **Detalhes do Produto** - http://localhost:3000/products/ML-001
   - Informações completas
   - Simulação de compra

## 🔧 Para o Live Coding

### Endpoint de Desconto (já implementado)
```bash
curl -X POST http://localhost:3001/api/products/ML-001/discount \
  -H "Content-Type: application/json" \
  -d '{"percentage": 15}'
```

## ⚡ Scripts Disponíveis

### Backend
- `npm run dev` - Desenvolvimento
- `npm run build` - Build produção
- `npm test` - Executar testes

### Frontend
- `npm run dev` - Desenvolvimento
- `npm run build` - Build produção
- `npm run lint` - Verificar código

## 🐛 Troubleshooting

### Porta em uso
Se a porta 3001 estiver em uso:
```bash
# Matar processo na porta
npx kill-port 3001
```

### Dependências
Se houver erro de dependências:
```bash
rm -rf node_modules package-lock.json
npm install
```

### CORS Error
Verifique se o backend está rodando na porta 3001 antes de iniciar o frontend.

## 📊 Estrutura do Projeto

```
mercado-libre-simple/
├── backend/          # API Express + TypeScript
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── data/products.json
│   │   └── app.ts
│   └── package.json
└── frontend/         # Next.js + TailwindCSS
    ├── src/
    │   ├── app/
    │   ├── components/
    │   └── services/
    └── package.json
```

## ✅ Checklist de Funcionamento

- [ ] Backend rodando na porta 3001
- [ ] Frontend rodando na porta 3000
- [ ] Lista de produtos carregando
- [ ] Busca funcionando
- [ ] Página de detalhes abrindo
- [ ] API endpoints respondendo

Projeto pronto para demonstração! 🎉