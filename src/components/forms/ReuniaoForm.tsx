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
import { Calendar, FileText, Upload, Send } from 'lucide-react';
import { Cliente, Produto } from '@/types/api';

interface ReuniaoFormProps {
  clientes: Cliente[];
  produtos: Produto[];
}

export default function ReuniaoForm({ clientes, produtos }: ReuniaoFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    id_cliente: '',
    id_produto: '',
    data_reuniao: '',
    informacoes_reuniao: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // TODO: API call to save meeting data
      console.log('Meeting data:', formData);
      
      // Show success and redirect
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (error) {
      console.error('Error saving meeting:', error);
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
          <Calendar className="w-8 h-8 text-indigo-400" />
          <h1 className="text-3xl font-bold gradient-text">Adicionar Reunião</h1>
        </motion.div>
        <p className="text-gray-400">
          Registre as informações da reunião para enriquecer a análise da jornada do cliente
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

          {/* Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Data da Reunião</label>
            <Input
              type="datetime-local"
              value={formData.data_reuniao}
              onChange={(e) => setFormData(prev => ({ ...prev, data_reuniao: e.target.value }))}
              className="bg-white/5 border-white/10 text-white"
              required
            />
          </div>

          {/* Meeting Information */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Informações da Reunião
              <Badge variant="outline" className="ml-2 border-indigo-500/50 text-indigo-300">
                Rich Text
              </Badge>
            </label>
            <Textarea
              value={formData.informacoes_reuniao}
              onChange={(e) => setFormData(prev => ({ ...prev, informacoes_reuniao: e.target.value }))}
              placeholder="Descreva os pontos principais da reunião, decisões tomadas, próximos passos..."
              className="bg-white/5 border-white/10 text-white placeholder-gray-400 min-h-[120px]"
              required
            />
          </div>

          {/* File Upload (Optional) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Anexos (Opcional)</label>
            <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-white/40 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Arraste arquivos ou clique para上传</p>
              <p className="text-gray-500 text-xs mt-1">PDF, DOC, DOCX até 10MB</p>
            </div>
          </div>

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
              disabled={isSubmitting || !formData.id_cliente || !formData.id_produto}
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
                  Salvar Reunião
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
}
