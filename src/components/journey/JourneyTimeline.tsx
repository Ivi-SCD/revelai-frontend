'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Handshake, 
  Settings, 
  GraduationCap, 
  Play, 
  TrendingUp,
  Sparkles,
  Brain,
  Clock,
  Star,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface JourneyTimelineProps {
  activePhase: number;
  onPhaseClick: (phase: number) => void;
}

const phases = [
  {
    id: 1,
    name: 'CONTRATAÇÃO',
    icon: Handshake,
    description: 'Análise inicial e planejamento',
    color: 'indigo'
  },
  {
    id: 2,
    name: 'IMPLANTAÇÃO',
    icon: Settings,
    description: 'Configuração e setup',
    color: 'emerald'
  },
  {
    id: 3,
    name: 'TREINAMENTO',
    icon: GraduationCap,
    description: 'Capacitação da equipe',
    color: 'amber'
  },
  {
    id: 4,
    name: 'USO',
    icon: Play,
    description: 'Utilização e satisfação',
    color: 'rose'
  },
  {
    id: 5,
    name: 'EVOLUÇÃO',
    icon: TrendingUp,
    description: 'Crescimento e expansão',
    color: 'violet'
  }
];

export default function JourneyTimeline({ activePhase, onPhaseClick }: JourneyTimelineProps) {
  return (
    <div className="mb-12">
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-12 left-0 right-0 h-1 bg-white/10 rounded-full" />
        <motion.div
          className="absolute top-12 left-0 h-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: `${((activePhase - 1) / 4) * 100}%` }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />

        {/* Phase Cards */}
        <div className="relative flex justify-between">
          {phases.map((phase, index) => {
            const isActive = phase.id === activePhase;
            const isCompleted = phase.id < activePhase;
            const Icon = phase.icon;

            return (
              <motion.div
                key={phase.id}
                className="flex-1 flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onPhaseClick(phase.id)}
                  className={`relative cursor-pointer transition-all ${
                    isActive ? 'z-10' : ''
                  }`}
                >
                  <Card className={`glass-card p-4 text-center transition-all ${
                    isActive 
                      ? 'ring-2 ring-indigo-500 bg-indigo-500/10' 
                      : isCompleted 
                        ? 'bg-emerald-500/10 border-emerald-500/30'
                        : 'hover:bg-white/10'
                  }`}>
                    {/* Phase Circle */}
                    <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-500 to-violet-500'
                        : isCompleted
                          ? 'bg-emerald-500'
                          : 'bg-white/10'
                    }`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Phase Info */}
                    <h3 className="font-semibold text-white mb-1">{phase.name}</h3>
                    <p className="text-xs text-gray-400 mb-2">{phase.description}</p>

                    {/* Status Badge */}
                    {isActive && (
                      <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
                        Atual
                      </Badge>
                    )}
                    {isCompleted && (
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                        Concluído
                      </Badge>
                    )}

                    {/* AI Badge for active phase */}
                    {isActive && (
                      <div className="mt-2 flex items-center justify-center space-x-1">
                        <Sparkles className="w-3 h-3 text-indigo-400" />
                        <span className="text-xs text-indigo-400">IA Generated</span>
                      </div>
                    )}
                  </Card>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
