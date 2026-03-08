'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Settings, 
  Sparkles, 
  Brain, 
  Clock, 
  Star,
  CheckCircle2,
  Circle,
  PlayCircle
} from 'lucide-react';
import { Task, Progresso, Treinamento } from '@/types/api';

interface ImplementacaoPhaseProps {
  tasks: Task[];
  progresso: Progresso;
  treinamentos: Treinamento[];
  onGenerateAI: () => void;
  onTaskUpdate: (taskId: string, status: 'pendente' | 'em_andamento' | 'concluido') => void;
  isLoading?: boolean;
}

export default function ImplementacaoPhase({ 
  tasks, 
  progresso, 
  treinamentos, 
  onGenerateAI, 
  onTaskUpdate,
  isLoading 
}: ImplementacaoPhaseProps) {
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const taskColumns = [
    { id: 'pendente', title: 'Pendente', color: 'border-amber-500/30' },
    { id: 'em_andamento', title: 'Em Andamento', color: 'border-blue-500/30' },
    { id: 'concluido', title: 'Concluído', color: 'border-emerald-500/30' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'concluido':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'em_andamento':
        return <PlayCircle className="w-4 h-4 text-blue-400" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getComplexityStars = (complexity: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < complexity ? 'text-amber-400 fill-current' : 'text-gray-600'
        }`}
      />
    ));
  };

  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="space-y-4">
          <Settings className="w-16 h-16 text-indigo-400 mx-auto" />
          <h3 className="text-xl font-semibold text-white">Nenhuma tarefa de implementação</h3>
          <p className="text-gray-400">Gere as tarefas de implementação com base na análise de contratação</p>
          <Button
            onClick={onGenerateAI}
            disabled={isLoading}
            className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600"
          >
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="mr-2"
                >
                  <Brain className="w-4 h-4" />
                </motion.div>
                Gerando tarefas...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Gerar Implementação IA
              </>
            )}
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
            <Sparkles className="w-3 h-3 mr-1" />
            IA Generated
          </Badge>
        </div>
        <Button
          onClick={onGenerateAI}
          disabled={isLoading}
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10"
        >
          {isLoading ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
              <Brain className="w-4 h-4" />
            </motion.div>
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Progress Overview */}
      <Card className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Progresso Geral</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Tarefas Concluídas</span>
            <span className="text-white font-bold">{progresso.concluidas}/{progresso.total}</span>
          </div>
          <Progress value={progresso.percentual} className="h-3" />
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <p className="text-amber-300 font-bold">{tasks.filter(t => t.status === 'pendente').length}</p>
              <p className="text-gray-400 text-sm">Pendentes</p>
            </div>
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-blue-300 font-bold">{tasks.filter(t => t.status === 'em_andamento').length}</p>
              <p className="text-gray-400 text-sm">Em Andamento</p>
            </div>
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <p className="text-emerald-300 font-bold">{tasks.filter(t => t.status === 'concluido').length}</p>
              <p className="text-gray-400 text-sm">Concluídas</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Task Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {taskColumns.map((column) => (
          <Card key={column.id} className={`glass-card p-4 border ${column.color}`}>
            <h4 className="font-semibold text-white mb-4 flex items-center">
              {getStatusIcon(column.id)}
              <span className="ml-2">{column.title}</span>
              <Badge className="ml-auto bg-white/10 text-white">
                {tasks.filter(t => t.status === column.id).length}
              </Badge>
            </h4>
            
            <div className="space-y-3 min-h-[200px]">
              {tasks
                .filter(task => task.status === column.id)
                .map((task) => (
                  <motion.div
                    key={task.id_task}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    className="glass-card p-3 cursor-pointer"
                    onClick={() => {
                      // Move to next status
                      const statuses: ('pendente' | 'em_andamento' | 'concluido')[] = ['pendente', 'em_andamento', 'concluido'];
                      const currentIndex = statuses.indexOf(task.status);
                      if (currentIndex < statuses.length - 1) {
                        onTaskUpdate(task.id_task, statuses[currentIndex + 1]);
                      }
                    }}
                  >
                    <div className="space-y-2">
                      <p className="text-white text-sm font-medium">{task.descricao}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          {getComplexityStars(task.complexidade)}
                        </div>
                        <div className="flex items-center space-x-1 text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span className="text-xs">{task.tempo_desenvolvimento}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Training Section */}
      {treinamentos.length > 0 && (
        <Card className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Settings className="w-5 h-5 text-indigo-400 mr-2" />
            Trilhas de Treinamento
          </h3>
          <div className="space-y-4">
            {treinamentos.map((treinamento) => (
              <div key={treinamento.id_treinamento} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-white">{treinamento.trilha}</h4>
                  <Badge variant="outline" className="border-indigo-500/50 text-indigo-300">
                    {treinamento.progresso_percentual}% completo
                  </Badge>
                </div>
                
                <Progress value={treinamento.progresso_percentual} className="h-2" />
                
                <div className="space-y-2">
                  {treinamento.cursos.map((curso, index) => (
                    <div key={index} className="flex items-center space-x-3 p-2 bg-white/5 rounded-lg">
                      <CheckCircle2 className={`w-4 h-4 ${
                        curso.concluido ? 'text-emerald-400' : 'text-gray-400'
                      }`} />
                      <div className="flex-1">
                        <p className="text-white text-sm">{curso.nome}</p>
                        <p className="text-gray-400 text-xs">{curso.descricao}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </motion.div>
  );
}
