'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Sparkles, 
  Brain,
  Calendar,
  Target,
  Award,
  ArrowUp,
  ArrowRight,
  ArrowDown
} from 'lucide-react';
import { Evolucao } from '@/types/api';

interface EvolucaoPhaseProps {
  data: Evolucao | null;
  onGenerateAI: () => void;
  isLoading?: boolean;
}

export default function EvolucaoPhase({ data, onGenerateAI, isLoading }: EvolucaoPhaseProps) {
  const getMaturityColor = (maturidade: string) => {
    switch (maturidade) {
      case 'expert':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'avancado':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      case 'intermediario':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getMaturityLevel = (maturidade: string) => {
    const levels = ['iniciante', 'intermediario', 'avancado', 'expert'];
    return levels.indexOf(maturidade) + 1;
  };

  const getTrendIcon = (tendencia: string) => {
    switch (tendencia) {
      case 'crescente':
        return <ArrowUp className="w-4 h-4 text-emerald-400" />;
      case 'decrescente':
        return <ArrowDown className="w-4 h-4 text-rose-400" />;
      default:
        return <ArrowRight className="w-4 h-4 text-amber-400" />;
    }
  };

  const getTrendColor = (tendencia: string) => {
    switch (tendencia) {
      case 'crescente':
        return 'sentiment-positive';
      case 'decrescente':
        return 'sentiment-negative';
      default:
        return 'sentiment-neutral';
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
          <TrendingUp className="w-16 h-16 text-indigo-400 mx-auto" />
          <h3 className="text-xl font-semibold text-white">Nenhuma análise de evolução</h3>
          <p className="text-gray-400">Acompanhe a evolução e maturidade do cliente na plataforma</p>
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
                Gerar Análise de Evolução IA
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

      {/* Maturity and Score */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Maturity Level */}
        <Card className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Nível de Maturidade</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge className={getMaturityColor(data.maturidade_atual)}>
                {data.maturidade_atual.toUpperCase()}
              </Badge>
              <div className="flex items-center space-x-2">
                {getTrendIcon(data.tendencia)}
                <Badge className={getTrendColor(data.tendencia)}>
                  {data.tendencia}
                </Badge>
              </div>
            </div>

            {/* Maturity Gauge */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Iniciante</span>
                <span>Expert</span>
              </div>
              <div className="relative h-4 bg-white/10 rounded-full overflow-hidden">
                <div className="absolute inset-0 flex">
                  {['iniciante', 'intermediario', 'avancado', 'expert'].map((level, index) => (
                    <div
                      key={level}
                      className={`flex-1 ${
                        index % 2 === 0 ? 'bg-white/20' : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>
                <motion.div
                  className="absolute top-0 h-full w-4 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                  initial={{ left: '0%' }}
                  animate={{ left: `${((getMaturityLevel(data.maturidade_atual) - 1) / 3) * 100}%` }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              {['Iniciante', 'Intermediário', 'Avançado', 'Expert'].map((level, index) => (
                <div
                  key={level}
                  className={`p-2 rounded-lg text-xs ${
                    index < getMaturityLevel(data.maturidade_atual)
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'bg-white/5 text-gray-400'
                  }`}
                >
                  {level}
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Evolution Score */}
        <Card className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Score de Evolução</h3>
          <div className="space-y-4">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="text-5xl font-bold gradient-text mb-2"
              >
                {data.score_evolucao}
              </motion.div>
              <div className="flex items-center justify-center space-x-2">
                {getTrendIcon(data.tendencia)}
                <span className="text-gray-400 capitalize">{data.tendencia}</span>
              </div>
            </div>
            
            <Progress value={data.score_evolucao} className="h-3" />
            
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                <p className="text-rose-300 font-bold">0-49</p>
                <p className="text-gray-400 text-xs">Baixo</p>
              </div>
              <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <p className="text-amber-300 font-bold">50-79</p>
                <p className="text-gray-400 text-xs">Médio</p>
              </div>
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <p className="text-emerald-300 font-bold">80-100</p>
                <p className="text-gray-400 text-xs">Alto</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Milestones Timeline */}
      <Card className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Target className="w-5 h-5 text-indigo-400 mr-2" />
          Marcos da Jornada
        </h3>
        <div className="space-y-4">
          {data.marcos.map((marco, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-4"
            >
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 bg-indigo-400 rounded-full" />
                {index < data.marcos.length - 1 && (
                  <div className="w-0.5 h-16 bg-white/20 mt-2" />
                )}
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-indigo-400" />
                  <h4 className="font-medium text-white">{marco.descricao}</h4>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(marco.data).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <Badge variant="outline" className="border-indigo-500/50 text-indigo-300">
                    {marco.impacto}
                  </Badge>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Expansion Opportunities */}
      <Card className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 text-emerald-400 mr-2" />
          Oportunidades de Expansão
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.oportunidades_expansao.map((oportunidade, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg"
            >
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0" />
                <p className="text-gray-300">{oportunidade}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
