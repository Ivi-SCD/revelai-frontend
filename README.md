# RevelAI - Frontend

Uma plataforma moderna de Customer Success powered by AI construída com Next.js 14, TypeScript, Tailwind CSS e shadcn/ui.

## 🚀 Tecnologias Utilizadas

- **Next.js 14** com App Router
- **TypeScript** para type safety
- **Tailwind CSS** para estilização
- **shadcn/ui** para componentes UI
- **Framer Motion** para animações
- **TanStack Query** para gerenciamento de dados
- **Lucide React** para ícones
- **Recharts** para gráficos

## 📁 Estrutura do Projeto

```
src/
├── app/                          # Páginas Next.js
│   ├── globals.css              # Estilos globais
│   ├── layout.tsx               # Layout principal
│   ├── page.tsx                 # Dashboard
│   ├── jornada/[id_cliente]/[id_produto]/  # Jornada do cliente
│   ├── reunioes/                # Formulário de reuniões
│   └── documentos/             # Formulário de documentos
├── components/
│   ├── layout/                  # Componentes de layout
│   │   ├── Layout.tsx
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   ├── dashboard/              # Componentes do dashboard
│   │   ├── StatCard.tsx
│   │   └── ClientTable.tsx
│   ├── journey/                # Componentes da jornada
│   │   ├── ClientProductHeader.tsx
│   │   ├── JourneyTimeline.tsx
│   │   └── phases/             # Fases da jornada
│   ├── forms/                  # Formulários
│   │   ├── ReuniaoForm.tsx
│   │   └── DocumentoForm.tsx
│   ├── ui/                     # Componentes UI reutilizáveis
│   │   ├── animated-components.tsx
│   │   └── ai-generation-modal.tsx
│   └── Providers.tsx           # React Query provider
├── lib/
│   ├── api.ts                  # Serviço de API
│   └── utils.ts                # Utilitários
└── types/
    └── api.ts                  # Tipos TypeScript da API
```

## 🎨 Design System

- **Cores Primárias**: Gradiente Indigo/Violet (#6366f1 → #8b5cf6)
- **Cores Secundárias**: Emerald (positivo), Rose (negativo), Amber (alerta)
- **Background**: Slate-950 com grid pattern sutil
- **Cards**: Glass-morphism effect com backdrop-blur
- **Animações**: Framer Motion para transições suaves
- **Tipografia**: Inter font com hierarquia clara

## 🛠️ Funcionalidades Principais

### 1. Dashboard
- **Hero Section**: Título animado com gradient text
- **Stats Cards**: 4 cards com métricas principais e trends
- **Client Table**: Lista de clientes com busca, sentimentos e scores
- **Quick Actions**: Botões para nova análise e ver jornada

### 2. Jornada do Cliente (Página Hero)
- **Client & Product Header**: Cards com informações do cliente e produto
- **Journey Timeline**: Timeline horizontal com 5 fases clicáveis
- **Phase 1 - Contratação**: Análise de sentimento, engagement score, planos
- **Phase 2 - Implementação**: Kanban board de tasks, progresso, treinamentos
- **Phase 3 - Treinamento**: Trilhas e cursos com progresso
- **Phase 4 - Uso**: Satisfação, timeline de sentimentos, métricas
- **Phase 5 - Evolução**: Maturidade, milestones, oportunidades

### 3. Geração AI
- **Loading Animations**: Ícones pulsantes e spinning
- **Streaming Effects**: Animações de revelação de conteúdo
- **Error Handling**: Estados de erro e retry

### 4. Formulários de Input
- **Reuniões**: Formulário rich text para notas de reunião
- **Documentos**: Upload de arquivos e informações completas

## 🔌 Integração com Backend

O frontend se conecta a um backend FastAPI rodando em `http://localhost:8000`:

```typescript
// Exemplo de chamada API
const { data: clientes } = useQuery({
  queryKey: ['clientes'],
  queryFn: () => apiService.getClientes(),
});
```

### Endpoints Principais

- `GET /api/v1/clientes/` - Lista todos os clientes
- `GET /api/v1/clientes/produtos` - Lista produtos
- `GET /api/v1/jornada/cliente/{id}/produto/{id}` - Jornada completa
- `POST /api/v1/analises/` - Gerar análise de contratação
- `POST /api/v1/implementacao/gerar` - Gerar implementação
- `POST /api/v1/uso/gerar` - Gerar análise de uso
- `POST /api/v1/evolucao/gerar` - Gerar análise de evolução

## 🎯 Features de Hackathon

### Real-time AI Generation
- Loading states com brain/sparkle animations
- Streaming effects para revelação de conteúdo
- Progress indicators e toast notifications

### Smooth Animations
- Page transitions com Framer Motion
- Card reveals e hover effects
- Number counters animados de 0 ao valor
- Sentiment faces que mudam expressão

### Interactive Journey Timeline
- Horizontal stepper com 5 fases
- Glow effects na fase atual
- Clickable cards com smooth transitions

### Responsive Design
- Funciona em large screen demos
- Tablet-friendly layout
- Mobile-responsive components

### Empty States
- Beautiful illustrations quando não há dados
- Call-to-action para "Generate your first AI analysis!"

### Gamification Elements
- Confetti animation quando tasks são concluídas
- Progress rings animados
- Achievement badges

## 🚀 Getting Started

1. **Instale as dependências**:
   ```bash
   npm install
   ```

2. **Configure as variáveis de ambiente**:
   ```bash
   cp .env.example .env.local
   ```

3. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

4. **Acesse a aplicação**:
   ```
   http://localhost:3000
   ```

## 📊 Componentes Animados

### AnimatedProgressRing
```typescript
<AnimatedProgressRing 
  value={85} 
  size={120}
  color="emerald"
  label="Score"
/>
```

### AnimatedCounter
```typescript
<AnimatedCounter 
  value={1234} 
  duration={2}
  suffix=" clientes"
/>
```

### AnimatedTimeline
```typescript
<AnimatedTimeline 
  items={timelineItems}
/>
```

## 🎨 Customização

### Cores
Modifique as cores no `globals.css`:
```css
.gradient-text {
  @apply bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent;
}
```

### Animações
Configure durações e easings nos componentes:
```typescript
transition={{ duration: 0.5, ease: "easeInOut" }}
```

## 📱 Performance

- **Code Splitting**: Next.js automatic code splitting
- **Lazy Loading**: Componentes carregados sob demanda
- **Image Optimization**: Next.js Image component
- **Caching**: TanStack Query com cache inteligente

## 🔒 TypeScript

O projeto é 100% tipado com interfaces para:
- Respostas da API
- Props dos componentes
- Estados dos formulários
- Tipos de eventos

## 🚀 Deploy

### Vercel (Recomendado)
```bash
npm run build
vercel --prod
```

### Docker
```bash
docker build -t relevai-frontend .
docker run -p 3000:3000 relevai-frontend
```

## 🏆 Conclusão

Este frontend foi projetado para vencer hackathons com:
- **UI/UX excepcional** com animações suaves
- **Demonstração clara** do valor da IA
- **Código limpo** e mantível
- **Performance otimizada**
- **Experiência completa** do usuário

A jornada do cliente é a página principal que conta uma história completa, mostrando como a IA transforma dados em insights acionáveis para Customer Success.
