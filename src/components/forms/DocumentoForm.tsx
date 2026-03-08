'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileText, Upload, Send, Eye } from 'lucide-react';
import { Cliente, Produto } from '@/types/api';

interface DocumentoFormProps {
  clientes: Cliente[];
  produtos: Produto[];
}

export default function DocumentoForm({ clientes, produtos }: DocumentoFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    id_cliente: '',
    id_produto: '',
    informacoes_completas: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // TODO: API call to save document data
      console.log('Document data:', formData);
      
      // Show success and redirect
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (error) {
      console.error('Error saving document:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      <div className="text-center space-y-4">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="inline-flex items-center space-x-2"
        >
          <FileText className="w-8 h-8 text-indigo-400" />
          <h1 className="text-3xl font-bold gradient-text">Adicionar Documento</h1>
        </motion.div>
        <p className="text-gray-400">
          Adicione documentos e informações relevantes para enriquecer a análise do cliente
        </p>
      </div>

      <Card className="glass-card p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Cliente</label>
            <Select
              value={formData.id_cliente}
              onValueChange={(value) => setFormData(prev => ({ ...prev, id_cliente: value }))}
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10">
                {clientes.map((cliente) => (
                  <SelectItem key={cliente.id_cliente} value={cliente.id_cliente}>
                    {cliente.nome_cliente}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Product Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Produto</label>
            <Select
              value={formData.id_produto}
              onValueChange={(value) => setFormData(prev => ({ ...prev, id_produto: value }))}
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Selecione um produto" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10">
                {produtos.map((produto) => (
                  <SelectItem key={produto.id_produto} value={produto.id_produto}>
                    {produto.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Document Information */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Informações Completas
              <Badge variant="outline" className="ml-2 border-indigo-500/50 text-indigo-300">
                Rich Text
              </Badge>
            </label>
            <Textarea
              value={formData.informacoes_completas}
              onChange={(e) => setFormData(prev => ({ ...prev, informacoes_completas: e.target.value }))}
              placeholder="Cole o conteúdo completo do documento, descreva os detalhes importantes, contexto, e qualquer informação relevante para a análise..."
              className="bg-white/5 border-white/10 text-white placeholder-gray-400 min-h-[200px]"
              required
            />
          </div>

          {/* Document Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Tipo de Documento</label>
            <Select defaultValue="contrato">
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10">
                <SelectItem value="contrato">Contrato</SelectItem>
                <SelectItem value="proposta">Proposta Comercial</SelectItem>
                <SelectItem value="relatorio">Relatório</SelectItem>
                <SelectItem value="email">Email/Correspondência</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Upload de Arquivo</label>
            <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-white/40 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Arraste o arquivo ou clique para selecionar</p>
              <p className="text-gray-500 text-xs mt-1">PDF, DOC, DOCX, TXT até 20MB</p>
            </div>
          </div>

          {/* Preview */}
          {formData.informacoes_completas && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                Pré-visualização
              </label>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 max-h-40 overflow-y-auto">
                <p className="text-gray-300 text-sm whitespace-pre-wrap">
                  {formData.informacoes_completas.substring(0, 500)}
                  {formData.informacoes_completas.length > 500 && '...'}
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/')}
              className="flex-1 border-white/20 text-white hover:bg-white/10"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.id_cliente || !formData.id_produto || !formData.informacoes_completas}
              className="flex-1 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="mr-2"
                  >
                    <Send className="w-4 h-4" />
                  </motion.div>
                  Salvando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Salvar Documento
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
}
