import { motion, AnimatePresence } from 'framer-motion';
import type { Prize, User } from '@/data/mockData';

interface WinnerModalProps {
  winner: Prize | null;
  user: User | null;
  visible: boolean;
  onClose: () => void;
}

const WinnerModal = ({ winner, user, visible, onClose }: WinnerModalProps) => {
  return (
    <AnimatePresence>
      {visible && winner && user && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-primary/90 backdrop-blur-lg"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="bg-background rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 max-w-lg w-full text-center shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-secondary" />
            <div className="text-6xl mb-6">{winner.icon}</div>
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-secondary mb-2">
              Chúc mừng khách hàng
            </h3>
            <p className="text-3xl font-black text-primary mb-1 font-display">{user.name}</p>
            <p className="text-primary/60 font-medium mb-8">Mã số: {user.code}</p>

            <div className="bg-surface rounded-2xl p-6 border border-primary/5 mb-8">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40 mb-1">
                Bạn đã trúng giải
              </p>
              <p className="text-2xl font-black text-secondary">{winner.name}</p>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold hover:opacity-90 transition-opacity"
            >
              Xác nhận & Đóng
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WinnerModal;
