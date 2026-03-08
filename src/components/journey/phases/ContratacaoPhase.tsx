'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, 
  Brain, 
  Clock, 
  Star, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { Analise } from '@/types/api';

interface ContratacaoPhaseProps {
  data: Analise | null;
  onGenerateAI: () => void;
  isLoading?: boolean;
}

export default function ContratacaoPhase({ data, onGenerateAI, isLoading }: ContratacaoPhaseProps) {
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

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'starter':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'standard':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      case 'full':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
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
          <Brain className="w-16 h-16 text-indigo-400 mx-auto" />
          <h3 className="text-xl font-semibold text-white">Nenhuma análise gerada</h3>
          <p className="text-gray-400">Inicie a jornada gerando sua primeira análise de contratação com IA</p>
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
                Gerar Análise IA
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
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
            {data.data_analise}
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Analysis */}
        <Card className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Análise de Sentimento</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{getSentimentEmoji(data.sentimento)}</span>
                <div>
                  <p className="text-white font-medium capitalize">{data.sentimento}</p>
                  <p className="text-gray-400 text-sm">Sentimento atual</p>
                </div>
              </div>
              {getSentimentIcon(data.sentimento)}
            </div>
            
            {/* Engagement Score */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Engagement Score</span>
                <span className="text-white font-bold">{data.engajamento_score}/100</span>
              </div>
              <Progress value={data.engajamento_score} className="h-2" />
            </div>

            {/* Pipeline Velocity */}
            <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
              <Clock className="w-5 h-5 text-indigo-400" />
              <div>
                <p className="text-white font-medium">{data.velocidade_pipeline_dias} dias</p>
                <p className="text-gray-400 text-sm">Pipeline velocity</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Plan Recommendation */}
        <Card className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Plano Recomendado</h3>
          <div className="space-y-4">
            <Badge className={`text-sm px-3 py-1 ${getPlanColor(data.plano_recomendado)}`}>
              {data.plano_recomendado.toUpperCase()}
            </Badge>
            
            <p className="text-gray-300">{data.justificativa_plano}</p>
            
            <div className="space-y-2">
              <p className="text-gray-400 text-sm">Maturidade da empresa:</p>
              <Badge variant="outline" className="border-amber-500/50 text-amber-300">
                {data.grau_maturidade_empresa}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Risks */}
        <Card className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 text-rose-400 mr-2" />
            Riscos Identificados
          </h3>
          <div className="space-y-2">
            {data.riscos_identificados.map((risco, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-2 p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg"
              >
                <div className="w-2 h-2 bg-rose-400 rounded-full mt-2 flex-shrink-0" />
                <p className="text-gray-300 text-sm">{risco}</p>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Success Criteria */}
        <Card className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 text-emerald-400 mr-2" />
            Critérios de Sucesso
          </h3>
          <div className="space-y-2">
            {data.criterios_sucesso.map((criterio, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-2 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg"
              >
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-300 text-sm">{criterio}</p>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Next Steps */}
      <Card className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Próximos Passos</h3>
        <p className="text-gray-300">{data.proximos_passos}</p>
      </Card>
    </motion.div>
  );
}
