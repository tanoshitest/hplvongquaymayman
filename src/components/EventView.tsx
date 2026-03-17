import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';
import hplLogo from '@/assets/hpl-logo.png';
import SpinWheel from './SpinWheel';
import WinnerModal from './WinnerModal';
import type { Prize, User } from '@/data/mockData';

interface EventViewProps {
  onGoAdmin: () => void;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  prizes: Prize[];
}

const EventView = ({ onGoAdmin, users, setUsers, prizes }: EventViewProps) => {
  const [customerCode, setCustomerCode] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<Prize | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [targetIndex, setTargetIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const handleSpin = useCallback(() => {
    const user = users.find(u => u.code.toUpperCase() === customerCode.trim().toUpperCase());
    if (!user) {
      alert('Mã khách hàng không hợp lệ (Thử: KH001 - KH500)');
      return;
    }
    
    if (user.status === 'đã quay') {
      alert('Khách hàng này đã thực hiện lượt quay!');
      return;
    }

    setCurrentUser(user);
    
    let idx;
    if (!user.allowedToWin) {
      // Find "May mắn lần sau" index
      idx = prizes.findIndex(p => p.name === 'May mắn lần sau');
      if (idx === -1) idx = 0; // Fallback
    } else {
      // Filter out the loss prize for a win spin
      const winPrizes = prizes.filter(p => p.name !== 'May mắn lần sau');
      const randomWinPrize = winPrizes[Math.floor(Math.random() * winPrizes.length)];
      idx = prizes.findIndex(p => p.id === randomWinPrize.id);
    }
    
    setTargetIndex(idx);
    setWinner(prizes[idx]);
    setIsSpinning(true);
  }, [customerCode, users, prizes]);

  const handleFinished = useCallback(() => {
    setIsSpinning(false);
    setShowModal(true);
    
    if (currentUser && winner) {
      setUsers(prev => prev.map(u => 
        u.id === currentUser.id 
          ? { ...u, status: 'đã quay', result: winner.name }
          : u
      ));
    }
  }, [currentUser, winner, setUsers]);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setWinner(null);
    setCustomerCode('');
    setCurrentUser(null);
  }, []);

  return (
    <div className="h-screen overflow-hidden bg-background flex flex-col">
      {/* Nav */}
      <nav className="w-full z-50 bg-background/80 backdrop-blur-md border-b border-primary/10 px-4 md:px-6 py-2 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <img src={hplLogo} alt="HPL Logo" className="h-8 md:h-10 w-auto" />
        </div>
        <button
          onClick={onGoAdmin}
          className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 text-primary/60 hover:text-secondary transition-colors"
        >
          <Settings size={14} />
          Đăng nhập Quản trị
        </button>
      </nav>

      <main className="flex-1 min-h-0 px-4 md:px-6 py-3 flex flex-col">
        <div className="max-w-6xl mx-auto flex flex-col items-center flex-1 min-h-0 w-full">
          {/* Hero */}
          <div className="text-center mb-3 md:mb-4 shrink-0">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-4xl font-black mb-1 font-display text-primary"
            >
              VÒNG QUAY <span className="text-secondary">MAY MẮN</span>
            </motion.h2>
            <p className="text-primary/60 font-medium max-w-md mx-auto text-xs md:text-sm">
              Chào mừng kỷ niệm 20 năm thành lập. Nhập mã khách hàng để nhận những phần quà tri ân giá trị.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-4 lg:gap-8 items-center w-full flex-1 min-h-0">
            {/* Wheel */}
            <div className="flex justify-center order-2 lg:order-1 min-h-0">
              <SpinWheel
                spinning={isSpinning}
                targetIndex={targetIndex}
                onFinished={handleFinished}
                prizes={prizes}
              />
            </div>

            {/* Interaction panel */}
            <div className="flex flex-col gap-3 order-1 lg:order-2">
              <div className="bg-surface p-4 md:p-5 rounded-lg border border-primary/5 shadow-inner">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-primary/40 mb-2">
                  Xác thực thông tin
                </label>
                <input
                  type="text"
                  placeholder="Nhập mã khách hàng (vd: KH001)"
                  value={customerCode}
                  onChange={e => setCustomerCode(e.target.value)}
                  disabled={isSpinning}
                  className="w-full bg-background border-2 border-primary/10 rounded-lg px-4 py-3 text-base font-bold focus:border-primary outline-none transition-all placeholder:text-primary/20 text-primary"
                />
                <button
                  onClick={handleSpin}
                  disabled={isSpinning || !customerCode.trim()}
                  className="w-full mt-3 bg-primary text-primary-foreground py-3.5 rounded-lg font-black text-base tracking-widest hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
                >
                  {isSpinning ? 'ĐANG QUAY...' : 'QUAY NGAY'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border border-secondary/20 bg-secondary/5">
                  <p className="text-[10px] font-bold uppercase text-secondary">Giải đặc biệt</p>
                  <p className="text-lg font-black text-primary">02 Chỉ Vàng</p>
                </div>
                <div className="p-3 rounded-lg border border-primary/20 bg-primary/5">
                  <p className="text-[10px] font-bold uppercase text-primary">Tổng giải thưởng</p>
                  <p className="text-lg font-black text-primary">500+ Quà tặng</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <WinnerModal
        winner={winner}
        user={currentUser}
        visible={showModal}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default EventView;
