import { motion } from 'framer-motion';

export const LoadingSpinner = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex justify-center items-center py-12"
  >
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  </motion.div>
);