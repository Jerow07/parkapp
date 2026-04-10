import { Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SuccessOverlayProps {
  show: boolean;
}

export const SuccessOverlay = ({ show }: SuccessOverlayProps) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-white/90 backdrop-blur-md"
        >
          <motion.div 
            initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="flex flex-col items-center justify-center p-8 text-center"
          >
            <div className="w-48 h-48 rounded-full bg-green-500 flex items-center justify-center shadow-[0_20px_50px_rgba(34,197,94,0.4)] mb-8">
              <Check size={96} strokeWidth={4} className="text-white" />
            </div>
            
            <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
              ¡LISTO!
            </h2>
            <p className="text-2xl font-bold text-green-600 mt-2">
              Precio actualizado correctamente
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
