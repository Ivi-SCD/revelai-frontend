'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Route, Loader2, Eye } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { apiService } from '@/lib/api';

export default function JornadaPage() {
  const router = useRouter();

  const { data: clientes = [], isLoading: loadingClientes } = useQuery({
    queryKey: ['clientes'],
    queryFn: () => apiService.getClientes(),
  });

  const { data: produtos = [], isLoading: loadingProdutos } = useQuery({
    queryKey: ['produtos'],
    queryFn: () => apiService.getProdutos(),
  });

  const isLoading = loadingClientes || loadingProdutos;

  const handleViewJourney = (clienteId: string, produtoId: string) => {
    router.push(`/jornada/${clienteId}/${produtoId}`);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <Route className="w-6 h-6 text-[#25A3FE]" />
            Jornadas
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Selecione um cliente e produto para visualizar a jornada
          </p>
        </div>

        <div className="card p-5">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-[#25A3FE] animate-spin" />
              <span className="ml-2 text-gray-500">Carregando...</span>
            </div>
          ) : clientes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum cliente encontrado</p>
              <p className="text-gray-400 text-sm mt-1">Verifique se o backend está rodando</p>
            </div>
          ) : (
            <div className="space-y-3">
              {clientes.map((cliente) => {
                const produto = produtos[0];
                return (
                  <div 
                    key={cliente.id_cliente}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <p className="text-gray-900 font-medium">{cliente.nome_cliente}</p>
                      <p className="text-gray-600 text-sm font-mono">{cliente.id_cliente}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      {produto && (
                        <div className="text-right">
                          <p className="text-gray-900 text-sm">{produto.nome}</p>
                          {produto.fase_atual && (
                            <span className="badge-info">{produto.fase_atual}</span>
                          )}
                        </div>
                      )}
                      <button
                        onClick={() => produto && handleViewJourney(cliente.id_cliente, produto.id_produto)}
                        disabled={!produto}
                        className="btn-primary flex items-center gap-2 disabled:opacity-50"
                      >
                        <Eye className="w-4 h-4" />
                        Ver Jornada
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
