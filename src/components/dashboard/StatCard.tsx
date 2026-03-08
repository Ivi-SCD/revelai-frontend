'use client';

import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { AnimatedStatCard } from '@/components/ui/animated-components';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: 'indigo' | 'emerald' | 'amber' | 'rose';
}

export default function StatCard({ title, value, icon, trend, color = 'indigo' }: StatCardProps) {
  return (
    <AnimatedStatCard
      title={title}
      value={value}
      icon={icon}
      trend={trend}
      delay={0}
    />
  );
}
