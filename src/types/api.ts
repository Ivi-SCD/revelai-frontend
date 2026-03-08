export interface Analise {
  id_analise: string;
  id_cliente: string;
  id_produto: string;
  metas_cliente: Record<string, any>;
  problema_cliente: string;
  grau_maturidade_empresa: "baixo" | "medio" | "alto";
  sentimento: "positive" | "neutral" | "negative";
  proximos_passos: string;
  canal: string;
  evolucao_sentimento: Record<string, string>;
  velocidade_pipeline_dias: number;
  engajamento_score: number;
  plano_recomendado: "starter" | "standard" | "full" | "custom";
  justificativa_plano: string;
  riscos_identificados: string[];
  criterios_sucesso: string[];
  data_analise: string;
}

export interface Task {
  id_task: string;
  id_cliente: string;
  id_produto: string;
  descricao: string;
  complexidade: number;
  tempo_desenvolvimento: string;
  status: "pendente" | "em_andamento" | "concluido";
}

export interface Progresso {
  total: number;
  concluidas: number;
  percentual: number;
}

export interface Treinamento {
  id_treinamento: string;
  id_cliente: string;
  id_produto: string;
  trilha: string;
  cursos: { nome: string; descricao: string; concluido: boolean }[];
  progresso_percentual: number;
}

export interface Uso {
  id_uso: string;
  id_cliente: string;
  id_produto: string;
  sentimentos_reunioes: { id_historico: string; sentimento: string; resumo: string }[];
  score_satisfacao: number;
  metricas_uso: Record<string, any>;
}

export interface Evolucao {
  id_evolucao: string;
  id_cliente: string;
  id_produto: string;
  marcos: { descricao: string; data: string; impacto: string }[];
  maturidade_atual: "iniciante" | "intermediario" | "avancado" | "expert";
  score_evolucao: number;
  tendencia: "crescente" | "estavel" | "decrescente";
  oportunidades_expansao: string[];
}

export interface Cliente {
  id_cliente: string;
  nome_cliente: string;
}

export interface Produto {
  id_produto: string;
  nome: string;
  descricao: string;
  tipo: string;
  fase_atual: string;
}

export interface Jornada {
  cliente: Cliente;
  produto: Produto;
  fases: {
    contratacao: { status: string; dados: Analise | null };
    implantacao: { status: string; progresso_tasks: Progresso; treinamentos: Treinamento[] };
    treinamento: { status: string; dados: any };
    uso: { status: string; dados: Uso | null };
    evolucao: { status: string; dados: Evolucao | null };
  };
}

export interface ReuniaoInput {
  id_cliente: string;
  id_produto: string;
  data_reuniao: string;
  informacoes_reuniao: string;
}

export interface DocumentoInput {
  id_cliente: string;
  id_produto: string;
  informacoes_completas: string;
}

export interface AIGenerationRequest {
  id_cliente: string;
  id_produto: string;
}

export interface ClienteCreateRequest {
  nome_cliente: string;
}

export interface ProdutoCreateRequest {
  nome: string;
  descricao: string;
  tipo: "servico" | "plataforma" | "consultoria";
}
