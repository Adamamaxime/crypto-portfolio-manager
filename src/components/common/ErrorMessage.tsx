import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-center gap-2 text-red-600"
  >
    <AlertCircle className="w-5 h-5" />
    {message}
  </motion.div>
);