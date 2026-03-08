'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Sparkles, 
  Brain,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { Uso } from '@/types/api';

interface UsoPhaseProps {
  data: Uso | null;
  onGenerateAI: () => void;
  isLoading?: boolean;
}

export default function UsoPhase({ data, onGenerateAI, isLoading }: UsoPhaseProps) {
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

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'sentiment-positive';
      case 'negative':
        return 'sentiment-negative';
      default:
        return 'sentiment-neutral';
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

  if (!data) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="space-y-4">
          <Play className="w-16 h-16 text-indigo-400 mx-auto" />
          <h3 className="text-xl font-semibold text-white">Nenhuma análise de uso</h3>
          <p className="text-gray-400">Analise o uso e satisfação do cliente com a plataforma</p>
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
                Gerando análise...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Gerar Análise de Uso IA
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

      {/* Satisfaction Score */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Score de Satisfação</h3>
          <div className="space-y-4">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="text-5xl font-bold gradient-text mb-2"
              >
                {data.score_satisfacao}
              </motion.div>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-3xl">{getSentimentEmoji(
                  data.score_satisfacao >= 80 ? 'positive' : 
                  data.score_satisfacao >= 60 ? 'neutral' : 'negative'
                )}</span>
                <Badge className={
                  data.score_satisfacao >= 80 ? 'sentiment-positive' :
                  data.score_satisfacao >= 60 ? 'sentiment-neutral' :
                  'sentiment-negative'
                }>
                  {data.score_satisfacao >= 80 ? 'Satisfeito' :
                   data.score_satisfacao >= 60 ? 'Neutro' : 'Insatisfeito'}
                </Badge>
              </div>
            </div>
            
            <Progress value={data.score_satisfacao} className="h-3" />
            
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                <p className="text-rose-300 font-bold">0-59</p>
                <p className="text-gray-400 text-xs">Risco</p>
              </div>
              <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <p className="text-amber-300 font-bold">60-79</p>
                <p className="text-gray-400 text-xs">Atenção</p>
              </div>
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <p className="text-emerald-300 font-bold">80-100</p>
                <p className="text-gray-400 text-xs">Ótimo</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Usage Metrics */}
        <Card className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Métricas de Uso</h3>
          <div className="space-y-4">
            {Object.entries(data.metricas_uso).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 capitalize">
                    {key.replace('_', ' ')}
                  </span>
                  <span className="text-white font-bold">
                    {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
                  </span>
                </div>
                {typeof value === 'number' && (
                  <Progress 
                    value={Math.min((value as number) * 10, 100)} 
                    className="h-2" 
                  />
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Meeting Sentiment Timeline */}
      <Card className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <MessageSquare className="w-5 h-5 text-indigo-400 mr-2" />
          Timeline de Sentimento das Reuniões
        </h3>
        <div className="space-y-4">
          {data.sentimentos_reunioes.map((reuniao, index) => (
            <motion.div
              key={reuniao.id_historico}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-4"
            >
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full ${
                  reuniao.sentimento === 'positive' ? 'bg-emerald-400' :
                  reuniao.sentimento === 'negative' ? 'bg-rose-400' :
                  'bg-amber-400'
                }`} />
                {index < data.sentimentos_reunioes.length - 1 && (
                  <div className="w-0.5 h-16 bg-white/20 mt-2" />
                )}
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getSentimentEmoji(reuniao.sentimento)}</span>
                  <Badge className={getSentimentColor(reuniao.sentimento)}>
                    {reuniao.sentimento}
                  </Badge>
                </div>
                <p className="text-gray-300 text-sm">{reuniao.resumo}</p>
                <div className="flex items-center space-x-2 text-gray-400 text-xs">
                  <Calendar className="w-3 h-3" />
                  <span>Reunião #{reuniao.id_historico}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* AI Recommendations */}
      <Card className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Sparkles className="w-5 h-5 text-indigo-400 mr-2" />
          Recomendações da IA
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <h4 className="font-medium text-emerald-300 mb-2">O que está funcionando bem</h4>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Alta adoção da plataforma</li>
              <li>• Feedback positivo nas reuniões</li>
              <li>• Engajamento consistente</li>
            </ul>
          </div>
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <h4 className="font-medium text-amber-300 mb-2">Oportunidades de melhoria</h4>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Expandir treinamentos avançados</li>
              <li>• Aumentar frequência de check-ins</li>
              <li>• Explorar novos casos de uso</li>
            </ul>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
