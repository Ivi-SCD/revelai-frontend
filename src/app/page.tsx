'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Sparkles, Users, BarChart3, Target, TrendingUp, Search, Eye, Loader2, Plus, Building2, Package, X } from 'lucide-react';
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { apiService } from '@/lib/api';

export default function Dashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createStep, setCreateStep] = useState<'cliente' | 'produto'>('cliente');
  const [clienteForm, setClienteForm] = useState({ nome_cliente: '' });
  const [produtoForm, setProdutoForm] = useState({ nome: '', descricao: '', tipo: 'plataforma' as const });
  const [createdCliente, setCreatedCliente] = useState<{ id_cliente: string; nome_cliente: string } | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);

  const { data: clientes = [], isLoading: loadingClientes, error: errorClientes } = useQuery({
    queryKey: ['clientes'],
    queryFn: () => apiService.getClientes(),
  });

  const { data: produtos = [], isLoading: loadingProdutos } = useQuery({
    queryKey: ['produtos'],
    queryFn: () => apiService.getProdutos(),
  });

  const isLoading = loadingClientes || loadingProdutos;

  const filteredClientes = clientes.filter(cliente =>
    cliente.nome_cliente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewJourney = (clienteId: string, produtoId: string) => {
    router.push(`/jornada/${clienteId}/${produtoId}`);
  };

  const clienteMutation = useMutation({
    mutationFn: (data: { nome_cliente: string }) => apiService.criarCliente(data),
    onSuccess: (cliente) => {
      setCreatedCliente(cliente);
      setCreateStep('produto');
      setCreateError(null);
    },
    onError: (error: Error) => {
      setCreateError(error.message);
    },
  });

  const produtoMutation = useMutation({
    mutationFn: (data: { nome: string; descricao: string; tipo: 'servico' | 'plataforma' | 'consultoria' }) => 
      apiService.criarProduto(data),
    onSuccess: (produto) => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      queryClient.invalidateQueries({ queryKey: ['produtos'] });
      setShowCreateModal(false);
      resetCreateForm();
      if (createdCliente) {
        router.push(`/jornada/${createdCliente.id_cliente}/${produto.id_produto}`);
      }
    },
    onError: (error: Error) => {
      setCreateError(error.message);
    },
  });

  const resetCreateForm = () => {
    setCreateStep('cliente');
    setClienteForm({ nome_cliente: '' });
    setProdutoForm({ nome: '', descricao: '', tipo: 'plataforma' });
    setCreatedCliente(null);
    setCreateError(null);
  };

  const handleCreateCliente = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteForm.nome_cliente.trim()) return;
    clienteMutation.mutate(clienteForm);
  };

  const handleCreateProduto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!produtoForm.nome.trim() || !produtoForm.descricao.trim()) return;
    produtoMutation.mutate(produtoForm);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 text-sm mt-1">Acompanhe a jornada dos seus clientes</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nova Empresa
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Clientes</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {isLoading ? '-' : clientes.length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Users className="w-5 h-5 text-[#25A3FE]" />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Produtos Ativos</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {isLoading ? '-' : produtos.length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Score Médio</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">--</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                <Target className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Taxa Evolução</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">--</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#25A3FE]" />
              </div>
            </div>
          </div>
        </div>

        {/* Client List */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Clientes</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-9 w-64"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-[#25A3FE] animate-spin" />
              <span className="ml-2 text-gray-600">Carregando...</span>
            </div>
          ) : errorClientes ? (
            <div className="text-center py-12">
              <p className="text-rose-600">Erro ao carregar clientes</p>
              <p className="text-gray-600 text-sm mt-1">Verifique se o backend está rodando em localhost:8000</p>
            </div>
          ) : filteredClientes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Nenhum cliente encontrado</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">Cliente</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">ID</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">Produto</th>
                    <th className="text-right py-3 px-4 text-gray-600 font-medium text-sm">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClientes.map((cliente) => {
                    const produto = produtos.find(p => p.id_produto) || produtos[0];
                    return (
                      <tr key={cliente.id_cliente} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">
                          <span className="text-gray-900 font-medium">{cliente.nome_cliente}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-gray-600 text-sm font-mono">{cliente.id_cliente}</span>
                        </td>
                        <td className="py-3 px-4">
                          {produto ? (
                            <div>
                              <span className="text-gray-900">{produto.nome}</span>
                              {produto.fase_atual && (
                                <span className="badge-info ml-2">{produto.fase_atual}</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => produto && handleViewJourney(cliente.id_cliente, produto.id_produto)}
                            disabled={!produto}
                            className="inline-flex items-center gap-1.5 text-[#25A3FE] hover:text-[#1a8fe0] text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Eye className="w-4 h-4" />
                            Ver Jornada
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create Enterprise Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <div className="flex items-center gap-3">
                {createStep === 'cliente' ? (
                  <Building2 className="w-5 h-5 text-[#25A3FE]" />
                ) : (
                  <Package className="w-5 h-5 text-[#25A3FE]" />
                )}
                <h2 className="text-lg font-semibold text-gray-900">
                  {createStep === 'cliente' ? 'Nova Empresa' : 'Novo Produto'}
                </h2>
              </div>
              <button 
                onClick={() => { setShowCreateModal(false); resetCreateForm(); }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5">
              {/* Step indicator */}
              <div className="flex items-center gap-2 mb-6">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  createStep === 'cliente' ? 'bg-[#25A3FE] text-white' : 'bg-emerald-500 text-white'
                }`}>
                  {createStep === 'produto' ? '✓' : '1'}
                </div>
                <div className={`flex-1 h-1 rounded ${createStep === 'produto' ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  createStep === 'produto' ? 'bg-[#25A3FE] text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  2
                </div>
              </div>

              {createError && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm">
                  {createError}
                </div>
              )}

              {createStep === 'cliente' ? (
                <form onSubmit={handleCreateCliente} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome da Empresa
                    </label>
                    <input
                      type="text"
                      value={clienteForm.nome_cliente}
                      onChange={(e) => setClienteForm({ nome_cliente: e.target.value })}
                      placeholder="Ex: Acme Corporation"
                      className="input-field w-full"
                      autoFocus
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!clienteForm.nome_cliente.trim() || clienteMutation.isPending}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    {clienteMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : null}
                    Continuar
                  </button>
                </form>
              ) : (
                <form onSubmit={handleCreateProduto} className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Empresa criada</p>
                    <p className="text-gray-900 font-medium">{createdCliente?.nome_cliente}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome do Produto
                    </label>
                    <input
                      type="text"
                      value={produtoForm.nome}
                      onChange={(e) => setProdutoForm({ ...produtoForm, nome: e.target.value })}
                      placeholder="Ex: Plataforma de Vendas"
                      className="input-field w-full"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição
                    </label>
                    <textarea
                      value={produtoForm.descricao}
                      onChange={(e) => setProdutoForm({ ...produtoForm, descricao: e.target.value })}
                      placeholder="Descreva o produto ou serviço..."
                      className="input-field w-full h-24 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo
                    </label>
                    <select
                      value={produtoForm.tipo}
                      onChange={(e) => setProdutoForm({ ...produtoForm, tipo: e.target.value as 'servico' | 'plataforma' | 'consultoria' })}
                      className="input-field w-full"
                    >
                      <option value="plataforma">Plataforma</option>
                      <option value="servico">Serviço</option>
                      <option value="consultoria">Consultoria</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={!produtoForm.nome.trim() || !produtoForm.descricao.trim() || produtoMutation.isPending}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    {produtoMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    Criar e Iniciar Jornada
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
