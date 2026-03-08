'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Clock, TrendingUp } from 'lucide-react';

interface AnimatedProgressRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  color?: 'indigo' | 'emerald' | 'amber' | 'rose';
}

export function AnimatedProgressRing({ 
  value, 
  size = 120, 
  strokeWidth = 8, 
  label, 
  color = 'indigo' 
}: AnimatedProgressRingProps) {
  const colors = {
    indigo: '#6366f1',
    emerald: '#10b981',
    amber: '#f59e0b',
    rose: '#f43f5e'
  };

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors[color]}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          strokeLinecap="round"
        />
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-2xl font-bold text-white"
        >
          {value}
        </motion.span>
        {label && (
          <span className="text-xs text-gray-400">{label}</span>
        )}
      </div>
    </div>
  );
}

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

export function AnimatedCounter({ 
  value, 
  duration = 2, 
  suffix = '', 
  className = '' 
}: AnimatedCounterProps) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.span
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ duration, ease: "easeOut" }}
      >
        {value.toLocaleString('pt-BR')}{suffix}
      </motion.span>
    </motion.span>
  );
}

interface AnimatedTimelineProps {
  items: {
    id: string;
    title: string;
    description: string;
    status: 'completed' | 'current' | 'pending';
    date?: string;
  }[];
}

export function AnimatedTimeline({ items }: AnimatedTimelineProps) {
  return (
    <div className="space-y-6">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.2 }}
          className="flex items-start space-x-4"
        >
          <div className="flex flex-col items-center">
            <motion.div
              animate={{
                scale: item.status === 'current' ? [1, 1.2, 1] : 1,
              }}
              transition={{ repeat: item.status === 'current' ? Infinity : 0, duration: 2 }}
              className={`w-4 h-4 rounded-full ${
                item.status === 'completed' ? 'bg-emerald-500' :
                item.status === 'current' ? 'bg-indigo-500' :
                'bg-gray-500'
              }`}
            />
            {index < items.length - 1 && (
              <div className="w-0.5 h-16 bg-white/20 mt-2" />
            )}
          </div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex-1"
          >
            <Card className={`glass-card p-4 ${
              item.status === 'current' ? 'ring-2 ring-indigo-500' : ''
            }`}>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium text-white">{item.title}</h4>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                  {item.date && (
                    <div className="flex items-center space-x-1 text-gray-500 text-xs">
                      <Clock className="w-3 h-3" />
                      <span>{item.date}</span>
                    </div>
                  )}
                </div>
                
                <Badge className={
                  item.status === 'completed' ? 'sentiment-positive' :
                  item.status === 'current' ? 'sentiment-neutral' :
                  'bg-gray-500/20 text-gray-300 border-gray-500/30'
                }>
                  {item.status === 'completed' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                  {item.status === 'current' && <Circle className="w-3 h-3 mr-1" />}
                  {item.status === 'pending' && <Circle className="w-3 h-3 mr-1" />}
                  {item.status === 'completed' ? 'Concluído' :
                   item.status === 'current' ? 'Em Andamento' : 'Pendente'}
                </Badge>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

interface AnimatedStatCardProps {
  title: string;
  value: number | string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon: React.ReactNode;
  delay?: number;
}

export function AnimatedStatCard({ title, value, trend, icon, delay = 0 }: AnimatedStatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02, y: -2 }}
    >
      <Card className="glass-card p-6 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-white/5 backdrop-blur-sm">
              {icon}
            </div>
            {trend && (
              <div className={`flex items-center space-x-1 text-sm ${
                trend.isPositive ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                <TrendingUp className={`w-4 h-4 ${!trend.isPositive && 'rotate-180'}`} />
                <span>{trend.value}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-1">
            <p className="text-gray-400 text-sm">{title}</p>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: delay + 0.2 }}
              className="text-2xl font-bold text-white"
            >
              {typeof value === 'number' ? (
                <AnimatedCounter value={value} />
              ) : (
                value
              )}
            </motion.p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
