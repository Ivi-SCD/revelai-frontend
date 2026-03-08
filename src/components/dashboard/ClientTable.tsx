'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Eye, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Cliente, Produto } from '@/types/api';

interface ClientTableProps {
  clients: Cliente[];
  products: Produto[];
  onViewJourney: (clientId: string, productId: string) => void;
}

export default function ClientTable({ clients, products, onViewJourney }: ClientTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-rose-400" />;
      default:
        return <Minus className="w-4 h-4 text-amber-400" />;
    }
  };

  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return '😊';
      case 'negative':
        return '😟';
      default:
        return '😐';
    }
  };

  const getSentimentBadge = (sentiment: string) => {
    const variants = {
      positive: 'sentiment-positive',
      neutral: 'sentiment-neutral', 
      negative: 'sentiment-negative'
    };
    
    return variants[sentiment as keyof typeof variants] || variants.neutral;
  };

  // Mock data for demo - replace with real API calls
  const mockClientData = clients.map((client, index) => ({
    ...client,
    product: products[index % products.length] || products[0],
    fase: 'Implementação',
    sentimento: ['positive', 'neutral', 'negative'][index % 3] as 'positive' | 'neutral' | 'negative',
    score: Math.floor(Math.random() * 40) + 60
  }));

  const filteredClients = mockClientData.filter(client =>
    client.nome_cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.product?.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="glass-card">
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Lista de Clientes</h3>
          <Button className="bg-indigo-500 hover:bg-indigo-600">
            <Plus className="w-4 h-4 mr-2" />
            Novo Cliente
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Nome</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Fase Atual</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Sentimento</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Score</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client, index) => (
                <motion.tr
                  key={client.id_cliente}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-white font-medium">{client.nome_cliente}</p>
                      <p className="text-gray-400 text-sm">{client.product?.nome}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline" className="border-indigo-500/50 text-indigo-300">
                      {client.fase}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getSentimentEmoji(client.sentimento)}</span>
                      <Badge className={getSentimentBadge(client.sentimento)}>
                        {client.sentimento}
                      </Badge>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            client.score >= 80 ? 'bg-emerald-500' : 
                            client.score >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${client.score}%` }}
                        />
                      </div>
                      <span className="text-white text-sm">{client.score}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewJourney(client.id_cliente, client.product.id_produto)}
                      className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Jornada
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}
