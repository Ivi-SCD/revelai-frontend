'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Sparkles, Users, BarChart3, Target, TrendingUp, Search, Eye, Loader2 } from 'lucide-react';
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { apiService } from '@/lib/api';

export default function Dashboard() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

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

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 text-sm mt-1">Acompanhe a jornada dos seus clientes</p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Nova Análise
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
    </Layout>
  );
}
