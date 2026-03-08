'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { FileText, Loader2, Send } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { apiService } from '@/lib/api';

export default function DocumentosPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    id_cliente: '',
    id_produto: '',
    informacoes_completas: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { data: clientes = [], isLoading: loadingClientes } = useQuery({
    queryKey: ['clientes'],
    queryFn: () => apiService.getClientes(),
  });

  const { data: produtos = [], isLoading: loadingProdutos } = useQuery({
    queryKey: ['produtos'],
    queryFn: () => apiService.getProdutos(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    
    try {
      await apiService.addDocumento(formData);
      router.push('/');
    } catch (err) {
      setError('Erro ao salvar documento. Verifique se o backend está rodando.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const isLoading = loadingClientes || loadingProdutos;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#25A3FE]" />
            Adicionar Documento
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Adicione documentos e informações para análise da jornada
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-5">
          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-rose-600 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Cliente</label>
            <select
              value={formData.id_cliente}
              onChange={(e) => setFormData(prev => ({ ...prev, id_cliente: e.target.value }))}
              className="input-field w-full"
              required
              disabled={isLoading}
            >
              <option value="">Selecione um cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id_cliente} value={cliente.id_cliente}>
                  {cliente.nome_cliente}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Produto</label>
            <select
              value={formData.id_produto}
              onChange={(e) => setFormData(prev => ({ ...prev, id_produto: e.target.value }))}
              className="input-field w-full"
              required
              disabled={isLoading}
            >
              <option value="">Selecione um produto</option>
              {produtos.map((produto) => (
                <option key={produto.id_produto} value={produto.id_produto}>
                  {produto.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Informações do Documento</label>
            <textarea
              value={formData.informacoes_completas}
              onChange={(e) => setFormData(prev => ({ ...prev, informacoes_completas: e.target.value }))}
              placeholder="Cole o conteúdo do documento, descreva detalhes importantes, contexto e qualquer informação relevante..."
              className="input-field w-full min-h-[200px] resize-y"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="btn-secondary flex-1"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting || !formData.id_cliente || !formData.id_produto}
              className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Salvar Documento
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
