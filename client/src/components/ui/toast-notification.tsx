import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckIcon } from '@/components/ui/icons';

interface ToastNotificationProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function ToastNotification({ 
  message, 
  isVisible, 
  onClose, 
  duration = 3000 
}: ToastNotificationProps) {
  const [isShowing, setIsShowing] = useState(isVisible);

  useEffect(() => {
    setIsShowing(isVisible);
    
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsShowing(false);
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  return (
    <AnimatePresence>
      {isShowing && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg text-sm font-medium z-50"
        >
          <div className="flex items-center">
            <CheckIcon className="w-4 h-4 mr-2" />
            {message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
