'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cliente, Produto } from '@/types/api';

interface ClientProductHeaderProps {
  cliente: Cliente;
  produto: Produto;
}

export default function ClientProductHeader({ cliente, produto }: ClientProductHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-6 mb-8">
      {/* Client Card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1"
      >
        <Card className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Cliente</h3>
            <Badge variant="outline" className="border-indigo-500/50 text-indigo-300">
              ID: {cliente.id_cliente}
            </Badge>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold gradient-text">{cliente.nome_cliente}</h2>
            <p className="text-gray-400">Cliente em jornada de transformação digital</p>
          </div>
        </Card>
      </motion.div>

      {/* Product Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1"
      >
        <Card className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Produto</h3>
            <Badge variant="outline" className="border-violet-500/50 text-violet-300">
              ID: {produto.id_produto}
            </Badge>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">{produto.nome}</h2>
            <p className="text-gray-400">{produto.descricao}</p>
            <div className="flex items-center space-x-2 pt-2">
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                {produto.tipo}
              </Badge>
              <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
                {produto.fase_atual}
              </Badge>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
