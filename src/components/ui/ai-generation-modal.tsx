'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Brain, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface AIGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  isLoading: boolean;
  onConfirm: () => void;
}

export default function AIGenerationModal({
  isOpen,
  onClose,
  title,
  description,
  isLoading,
  onConfirm
}: AIGenerationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="glass-card p-6 relative">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>

              {/* Content */}
              <div className="space-y-6">
                {/* Icon */}
                <div className="flex justify-center">
                  <motion.div
                    animate={isLoading ? { rotate: 360 } : { scale: [1, 1.1, 1] }}
                    transition={isLoading ? { repeat: Infinity, duration: 2 } : { duration: 2, repeat: Infinity }}
                    className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full flex items-center justify-center"
                  >
                    {isLoading ? (
                      <Brain className="w-8 h-8 text-white" />
                    ) : (
                      <Sparkles className="w-8 h-8 text-white" />
                    )}
                  </motion.div>
                </div>

                {/* Text */}
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold text-white">{title}</h3>
                  <p className="text-gray-400">{description}</p>
                </div>

                {/* Loading State */}
                {isLoading && (
                  <div className="space-y-3">
                    <div className="flex justify-center space-x-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 1.5,
                            delay: i * 0.2,
                          }}
                          className="w-3 h-3 bg-indigo-400 rounded-full"
                        />
                      ))}
                    </div>
                    <p className="text-center text-sm text-gray-400">
                      Nossa IA está analisando os dados e gerando insights personalizados...
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    disabled={isLoading}
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600"
                  >
                    {isLoading ? 'Gerando...' : 'Confirmar'}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
