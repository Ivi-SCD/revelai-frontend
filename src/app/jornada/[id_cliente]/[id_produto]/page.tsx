'use client';

import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Loader2, Sparkles, Handshake, Settings, GraduationCap, Play, TrendingUp, AlertCircle, CheckCircle, Clock, Star } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { apiService } from '@/lib/api';

const phases = [
  { id: 1, name: 'Contratação', icon: Handshake },
  { id: 2, name: 'Implantação', icon: Settings },
  { id: 3, name: 'Treinamento', icon: GraduationCap },
  { id: 4, name: 'Uso', icon: Play },
  { id: 5, name: 'Evolução', icon: TrendingUp },
];

export default function JourneyPage() {
  const params = useParams();
  const queryClient = useQueryClient();
  const idCliente = params.id_cliente as string;
  const idProduto = params.id_produto as string;
  const [activePhase, setActivePhase] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

  // Fetch journey data
  const { data: jornada, isLoading: loadingJornada, error: errorJornada, refetch: refetchJornada } = useQuery({
    queryKey: ['jornada', idCliente, idProduto],
    queryFn: () => apiService.getJornada(idCliente, idProduto),
    enabled: !!idCliente && !!idProduto,
    retry: 1,
  });

  // Fetch analise
  const { data: analise, refetch: refetchAnalise } = useQuery({
    queryKey: ['analise', idCliente, idProduto],
    queryFn: () => apiService.getAnaliseUltima(idCliente, idProduto),
    enabled: !!idCliente && !!idProduto && activePhase === 1,
    retry: false,
  });

  // Fetch tasks
  const { data: tasks = [], refetch: refetchTasks } = useQuery({
    queryKey: ['tasks', idCliente, idProduto],
    queryFn: async () => {
      const result = await apiService.getTasks(idCliente, idProduto);
      console.log('Tasks from API:', result);
      return result;
    },
    enabled: !!idCliente && !!idProduto && activePhase === 2,
    retry: false,
  });

  // Fetch progresso
  const { data: progresso, refetch: refetchProgresso } = useQuery({
    queryKey: ['progresso', idCliente, idProduto],
    queryFn: () => apiService.getProgressoTasks(idCliente, idProduto),
    enabled: !!idCliente && !!idProduto && activePhase === 2,
    retry: false,
  });

  // Fetch treinamentos
  const { data: treinamentos = [], refetch: refetchTreinamentos } = useQuery({
    queryKey: ['treinamentos', idCliente, idProduto],
    queryFn: () => apiService.getTreinamentos(idCliente, idProduto),
    enabled: !!idCliente && !!idProduto && (activePhase === 2 || activePhase === 3),
    retry: false,
  });

  // Fetch uso
  const { data: uso, refetch: refetchUso } = useQuery({
    queryKey: ['uso', idCliente, idProduto],
    queryFn: () => apiService.getUso(idCliente, idProduto),
    enabled: !!idCliente && !!idProduto && activePhase === 4,
    retry: false,
  });

  // Fetch evolucao
  const { data: evolucao, refetch: refetchEvolucao } = useQuery({
    queryKey: ['evolucao', idCliente, idProduto],
    queryFn: () => apiService.getEvolucao(idCliente, idProduto),
    enabled: !!idCliente && !!idProduto && activePhase === 5,
    retry: false,
  });

  const handleGenerateAI = async () => {
    setGenerating(true);
    try {
      switch (activePhase) {
        case 1:
          await apiService.gerarAnalise({ id_cliente: idCliente, id_produto: idProduto });
          await refetchAnalise();
          break;
        case 2:
          await apiService.gerarImplementacao({ id_cliente: idCliente, id_produto: idProduto });
          await refetchTasks();
          await refetchProgresso();
          await refetchTreinamentos();
          break;
        case 4:
          await apiService.gerarUso({ id_cliente: idCliente, id_produto: idProduto });
          await refetchUso();
          break;
        case 5:
          await apiService.gerarEvolucao({ id_cliente: idCliente, id_produto: idProduto });
          await refetchEvolucao();
          break;
      }
      await refetchJornada();
    } catch (error) {
      console.error('Error generating:', error);
    } finally {
      setGenerating(false);
    }
  };

  const taskMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: 'pendente' | 'em_andamento' | 'concluido' }) =>
      apiService.updateTaskStatus(taskId, status),
    onMutate: ({ taskId }) => {
      setUpdatingTaskId(taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', idCliente, idProduto] });
      queryClient.invalidateQueries({ queryKey: ['progresso', idCliente, idProduto] });
    },
    onError: (error) => {
      console.error('Error updating task:', error);
    },
    onSettled: () => {
      setUpdatingTaskId(null);
    },
  });

  const handleTaskUpdate = (taskId: string, status: 'pendente' | 'em_andamento' | 'concluido') => {
    taskMutation.mutate({ taskId, status });
  };

  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😟';
      default: return '😐';
    }
  };

  if (loadingJornada) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 text-[#25A3FE] animate-spin" />
        </div>
      </Layout>
    );
  }

  if (errorJornada) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-96 text-center">
          <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
          <h2 className="text-xl font-semibold text-[#515151] mb-2">Erro ao carregar jornada</h2>
          <p className="text-gray-500 mb-4">Verifique se o backend está rodando em localhost:8000</p>
          <button onClick={() => refetchJornada()} className="btn-primary">
            Tentar novamente
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {jornada?.cliente?.nome_cliente || 'Cliente'}
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              {jornada?.produto?.nome || 'Produto'} • {jornada?.produto?.fase_atual || 'Em andamento'}
            </p>
          </div>
          <button 
            onClick={handleGenerateAI}
            disabled={generating || activePhase === 3}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            {generating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            Gerar com IA
          </button>
        </div>

        {/* Client & Product Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card p-4">
            <p className="text-gray-600 text-xs uppercase tracking-wide mb-2">Cliente</p>
            <p className="text-gray-900 font-medium">{jornada?.cliente?.nome_cliente || '-'}</p>
            <p className="text-gray-500 text-sm font-mono">{jornada?.cliente?.id_cliente || '-'}</p>
          </div>
          <div className="card p-4">
            <p className="text-gray-600 text-xs uppercase tracking-wide mb-2">Produto</p>
            <p className="text-gray-900 font-medium">{jornada?.produto?.nome || '-'}</p>
            <div className="flex items-center gap-2 mt-1">
              {jornada?.produto?.tipo && <span className="badge-info">{jornada.produto.tipo}</span>}
              {jornada?.produto?.fase_atual && <span className="badge-neutral">{jornada.produto.fase_atual}</span>}
            </div>
          </div>
        </div>

        {/* Phase Timeline */}
        <div className="card p-4">
          <div className="flex items-center justify-between">
            {phases.map((phase, index) => {
              const Icon = phase.icon;
              const isActive = activePhase === phase.id;
              const isCompleted = phase.id < activePhase;
              
              return (
                <div key={phase.id} className="flex items-center flex-1">
                  <button
                    onClick={() => setActivePhase(phase.id)}
                    className={`flex flex-col items-center p-3 rounded-lg transition-colors w-full ${
                      isActive ? 'bg-[#25A3FE]/10' : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      isActive ? 'bg-[#25A3FE] text-white' :
                      isCompleted ? 'bg-emerald-500 text-white' :
                      'bg-gray-200 text-gray-500'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-xs font-medium ${
                      isActive ? 'text-[#25A3FE]' : 'text-gray-500'
                    }`}>
                      {phase.name}
                    </span>
                  </button>
                  {index < phases.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-2 ${
                      phase.id < activePhase ? 'bg-emerald-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Phase Content */}
        <div className="card p-5">
          {/* Phase 1: Contratação */}
          {activePhase === 1 && (
            <div className="space-y-6">
              {analise ? (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="badge-info flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Gerado por IA
                    </span>
                    <span className="text-gray-500 text-sm">{analise.data_analise}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Sentiment */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-600 text-sm mb-2">Sentimento</p>
                      <div className="flex items-center gap-2">
                        <span className="text-3xl">{getSentimentEmoji(analise.sentimento)}</span>
                        <span className={`text-lg font-medium ${
                          analise.sentimento === 'positive' ? 'text-emerald-600' :
                          analise.sentimento === 'negative' ? 'text-rose-600' : 'text-amber-600'
                        }`}>
                          {analise.sentimento === 'positive' ? 'Positivo' :
                           analise.sentimento === 'negative' ? 'Negativo' : 'Neutro'}
                        </span>
                      </div>
                    </div>

                    {/* Engagement Score */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-600 text-sm mb-2">Engajamento</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-semibold text-gray-900">{analise.engajamento_score}</span>
                        <span className="text-gray-500">/100</span>
                      </div>
                      <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#25A3FE] rounded-full transition-all"
                          style={{ width: `${analise.engajamento_score}%` }}
                        />
                      </div>
                    </div>

                    {/* Pipeline */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-600 text-sm mb-2">Pipeline</p>
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-[#25A3FE]" />
                        <span className="text-2xl font-semibold text-gray-900">{analise.velocidade_pipeline_dias}</span>
                        <span className="text-gray-600">dias</span>
                      </div>
                    </div>
                  </div>

                  {/* Plan */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-600 text-sm mb-2">Plano Recomendado</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      analise.plano_recomendado === 'full' ? 'bg-blue-100 text-[#25A3FE]' :
                      analise.plano_recomendado === 'standard' ? 'bg-blue-50 text-[#25A3FE]' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {analise.plano_recomendado.toUpperCase()}
                    </span>
                    <p className="text-gray-700 text-sm mt-2">{analise.justificativa_plano}</p>
                  </div>

                  {/* Risks & Success */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600 text-sm mb-3 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-500" /> Riscos Identificados
                      </p>
                      <div className="space-y-2">
                        {analise.riscos_identificados.map((risco, i) => (
                          <div key={i} className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-sm text-gray-700">
                            {risco}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm mb-3 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" /> Critérios de Sucesso
                      </p>
                      <div className="space-y-2">
                        {analise.criterios_sucesso.map((criterio, i) => (
                          <div key={i} className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm text-gray-700">
                            {criterio}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Handshake className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Nenhuma análise de contratação disponível</p>
                  <button onClick={handleGenerateAI} disabled={generating} className="btn-primary">
                    {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span className="ml-2">Gerar Análise</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Phase 2: Implantação */}
          {activePhase === 2 && (
            <div className="space-y-6">
              {tasks.length > 0 ? (
                <>
                  {/* Progress */}
                  {progresso && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-600 text-sm">Progresso</p>
                        <span className="text-gray-900 font-medium">{progresso.concluidas}/{progresso.total} tarefas</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full transition-all"
                          style={{ width: `${progresso.percentual}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Tasks Kanban */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(['pendente', 'em_andamento', 'concluido'] as const).map((columnStatus) => (
                      <div key={columnStatus} className="space-y-3">
                        <h3 className={`text-sm font-medium px-2 ${
                          columnStatus === 'pendente' ? 'text-amber-600' :
                          columnStatus === 'em_andamento' ? 'text-[#25A3FE]' : 'text-emerald-600'
                        }`}>
                          {columnStatus === 'pendente' ? 'Pendente' :
                           columnStatus === 'em_andamento' ? 'Em Andamento' : 'Concluído'}
                        </h3>
                        <div className="space-y-2">
                          {tasks.filter(t => (t.status || 'pendente') === columnStatus).map((task) => {
                            const isUpdating = updatingTaskId === task.id_task;
                            return (
                              <div 
                                key={task.id_task}
                                className={`bg-gray-50 border border-gray-200 rounded-lg p-3 transition-colors ${
                                  columnStatus !== 'concluido' && !isUpdating ? 'cursor-pointer hover:border-gray-300' : ''
                                } ${isUpdating ? 'opacity-50' : ''}`}
                                onClick={() => {
                                  if (isUpdating) return;
                                  const nextStatus = columnStatus === 'pendente' ? 'em_andamento' : 
                                                     columnStatus === 'em_andamento' ? 'concluido' : 'concluido';
                                  if (columnStatus !== 'concluido') handleTaskUpdate(task.id_task, nextStatus);
                                }}
                              >
                                <div className="flex items-center gap-2">
                                  {isUpdating && <Loader2 className="w-4 h-4 animate-spin text-[#25A3FE]" />}
                                  <p className="text-gray-900 text-sm">{task.descricao}</p>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                  <div className="flex items-center gap-0.5">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <Star key={i} className={`w-3 h-3 ${
                                        i < task.complexidade ? 'text-amber-500 fill-current' : 'text-gray-300'
                                      }`} />
                                    ))}
                                  </div>
                                  <span className="text-gray-600 text-xs">{task.tempo_desenvolvimento}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Nenhuma tarefa de implantação disponível</p>
                  <button onClick={handleGenerateAI} disabled={generating} className="btn-primary">
                    {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span className="ml-2">Gerar Implantação</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Phase 3: Treinamento */}
          {activePhase === 3 && (
            <div className="space-y-6">
              {treinamentos.length > 0 ? (
                treinamentos.map((treinamento) => (
                  <div key={treinamento.id_treinamento} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-gray-900 font-medium">{treinamento.trilha}</h3>
                      <span className="text-[#25A3FE] text-sm font-medium">{treinamento.progresso_percentual}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                      <div 
                        className="h-full bg-[#25A3FE] rounded-full"
                        style={{ width: `${treinamento.progresso_percentual}%` }}
                      />
                    </div>
                    <div className="space-y-2">
                      {treinamento.cursos.map((curso, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            curso.concluido ? 'bg-emerald-500' : 'bg-gray-300'
                          }`}>
                            {curso.concluido && <CheckCircle className="w-3 h-3 text-white" />}
                          </div>
                          <div>
                            <p className="text-gray-900 text-sm">{curso.nome}</p>
                            <p className="text-gray-600 text-xs">{curso.descricao}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Treinamentos serão gerados junto com a implantação</p>
                </div>
              )}
            </div>
          )}

          {/* Phase 4: Uso */}
          {activePhase === 4 && (
            <div className="space-y-6">
              {uso ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-600 text-sm mb-2">Score de Satisfação</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-semibold text-gray-900">{uso.score_satisfacao}</span>
                        <span className="text-gray-500">/100</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-600 text-sm mb-2">Métricas de Uso</p>
                      <div className="space-y-1">
                        {Object.entries(uso.metricas_uso).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">{key}</span>
                            <span className="text-gray-900">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sentiment Timeline */}
                  <div>
                    <p className="text-gray-600 text-sm mb-3">Timeline de Sentimentos</p>
                    <div className="space-y-3">
                      {uso.sentimentos_reunioes.map((reuniao) => (
                        <div key={reuniao.id_historico} className="flex items-start gap-3">
                          <span className="text-2xl">{getSentimentEmoji(reuniao.sentimento)}</span>
                          <div className="flex-1 bg-gray-50 rounded-lg p-3">
                            <p className="text-gray-700 text-sm">{reuniao.resumo}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Play className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Nenhuma análise de uso disponível</p>
                  <button onClick={handleGenerateAI} disabled={generating} className="btn-primary">
                    {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span className="ml-2">Gerar Análise de Uso</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Phase 5: Evolução */}
          {activePhase === 5 && (
            <div className="space-y-6">
              {evolucao ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-600 text-sm mb-2">Maturidade</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        evolucao.maturidade_atual === 'expert' ? 'bg-blue-100 text-[#25A3FE]' :
                        evolucao.maturidade_atual === 'avancado' ? 'bg-blue-50 text-[#25A3FE]' :
                        evolucao.maturidade_atual === 'intermediario' ? 'bg-blue-50 text-[#25A3FE]' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {evolucao.maturidade_atual.toUpperCase()}
                      </span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-600 text-sm mb-2">Score de Evolução</p>
                      <span className="text-3xl font-semibold text-gray-900">{evolucao.score_evolucao}</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-600 text-sm mb-2">Tendência</p>
                      <span className={`text-lg font-medium ${
                        evolucao.tendencia === 'crescente' ? 'text-emerald-600' :
                        evolucao.tendencia === 'decrescente' ? 'text-rose-600' : 'text-amber-600'
                      }`}>
                        {evolucao.tendencia === 'crescente' ? '↑ Crescente' :
                         evolucao.tendencia === 'decrescente' ? '↓ Decrescente' : '→ Estável'}
                      </span>
                    </div>
                  </div>

                  {/* Milestones */}
                  <div>
                    <p className="text-gray-600 text-sm mb-3">Marcos</p>
                    <div className="space-y-3">
                      {evolucao.marcos.map((marco, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-3 h-3 rounded-full bg-[#25A3FE] mt-1.5" />
                          <div className="flex-1">
                            <p className="text-gray-900 text-sm">{marco.descricao}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-gray-600 text-xs">{marco.data}</span>
                              <span className="badge-info">{marco.impacto}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Opportunities */}
                  <div>
                    <p className="text-gray-600 text-sm mb-3">Oportunidades de Expansão</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {evolucao.oportunidades_expansao.map((op, i) => (
                        <div key={i} className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm text-gray-700">
                          {op}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Nenhuma análise de evolução disponível</p>
                  <button onClick={handleGenerateAI} disabled={generating} className="btn-primary">
                    {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span className="ml-2">Gerar Análise de Evolução</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
