<div align="center">

# 🚀 RevelAI

![Imagem Logo Revelia](/docs/images/revelai.png)

### Plataforma Inteligente de Customer Success

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**Transforme dados em insights acionáveis com IA para maximizar o sucesso do cliente**

[Demo](http://localhost:3000) · [Backend](../revelai-backend) · [Documentação](#-documentação)

</div>

---

## 📋 Sobre o Projeto

O **RevelAI** é uma plataforma completa de Customer Success que utiliza Inteligência Artificial para acompanhar toda a jornada do cliente, desde a contratação até a evolução contínua. A plataforma analisa sentimentos, gera insights automatizados e fornece recomendações personalizadas para cada fase do relacionamento.

### ✨ Principais Diferenciais

- 🤖 **IA Generativa** - Análises automáticas com LLMs (Groq/LLaMA)
- 📊 **Jornada Completa** - 5 fases: Contratação → Implantação → Treinamento → Uso → Evolução
- 🎯 **Insights Acionáveis** - Recomendações práticas baseadas em dados
- ⚡ **Real-time** - Atualizações instantâneas com TanStack Query

---

## 🛠️ Tech Stack

| Categoria | Tecnologia |
|-----------|------------|
| **Framework** | Next.js 15 (App Router) |
| **Linguagem** | TypeScript |
| **Estilização** | Tailwind CSS + shadcn/ui |
| **Estado** | TanStack Query (React Query) |
| **Ícones** | Lucide React |
| **Backend** | FastAPI + MongoDB + LangChain |

---

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Backend rodando em `localhost:8000`

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/relevai-frontend.git
cd relevai-frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse **http://localhost:3000** 🎉

---

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Páginas (App Router)
│   ├── page.tsx           # Dashboard principal
│   ├── jornada/           # Jornada do cliente
│   ├── reunioes/          # Input de reuniões
│   └── documentos/        # Input de documentos
├── components/
│   ├── layout/            # Layout, Sidebar, Header
│   ├── journey/           # Componentes da jornada
│   └── ui/                # Componentes reutilizáveis
├── lib/
│   └── api.ts             # Serviço de API
└── types/
    └── api.ts             # Tipos TypeScript
```

---

## 🎯 Funcionalidades

### 📊 Dashboard
- Visão geral de clientes e produtos
- Criação rápida de empresas para teste
- Busca e filtros

### 🛤️ Jornada do Cliente

| Fase | Descrição |
|------|-----------|
| **1. Contratação** | Análise de sentimento, engagement score, plano recomendado |
| **2. Implantação** | Kanban de tasks, progresso, treinamentos |
| **3. Treinamento** | Trilhas de cursos com progresso |
| **4. Uso** | Score de satisfação, métricas, timeline de sentimentos |
| **5. Evolução** | Maturidade, marcos, oportunidades de expansão |

### 🤖 Geração com IA
- Clique em "Gerar com IA" em qualquer fase
- Análises automáticas baseadas em dados do cliente
- Recomendações personalizadas

---

## 🔌 API Endpoints

```typescript
// Clientes & Produtos
GET  /api/v1/clientes/
POST /api/v1/clientes/
GET  /api/v1/clientes/produtos
POST /api/v1/clientes/produtos

// Jornada
GET  /api/v1/jornada/cliente/{id}/produto/{id}

// Geração IA
POST /api/v1/analises/           # Contratação
POST /api/v1/implementacao/gerar # Implantação
POST /api/v1/uso/gerar           # Uso
POST /api/v1/evolucao/gerar      # Evolução

// Tasks
PATCH /api/v1/implementacao/tasks/{id}
GET   /api/v1/implementacao/tasks/progresso/cliente/{id}/produto/{id}
```

---

## 🎨 Design System

- **Cor Primária**: `#25A3FE` (Azul)
- **Sucesso**: Emerald
- **Erro**: Rose
- **Alerta**: Amber
- **Cards**: Bordas suaves com sombras sutis
- **Tipografia**: Sistema nativo com hierarquia clara

---

## 📦 Scripts

```bash
npm run dev      # Desenvolvimento
npm run build    # Build de produção
npm run start    # Iniciar produção
npm run lint     # Verificar código
```

---

## 🐳 Docker

```bash
# Build
docker build -t relevai-frontend .

# Run
docker run -p 3000:3000 relevai-frontend
```

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">

**Feito com ❤️ para transformar Customer Success com IA**

</div>
