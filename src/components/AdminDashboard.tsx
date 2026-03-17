import { useState, useMemo } from 'react';
import { LayoutDashboard, Gift, Users, Settings, Search, ArrowLeft, Trash2, Edit } from 'lucide-react';
import type { User, Prize } from '@/data/mockData';
import { Switch } from '@/components/ui/switch';
import hplLogo from '@/assets/hpl-logo.png';

type Tab = 'overview' | 'prizes' | 'users' | 'config';

interface AdminDashboardProps {
  onGoBack: () => void;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  prizes: Prize[];
  setPrizes: React.Dispatch<React.SetStateAction<Prize[]>>;
}

const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
  { key: 'prizes', label: 'Quản lý Giải thưởng', icon: Gift },
  { key: 'users', label: 'Quản lý Khách hàng', icon: Users },
  { key: 'config', label: 'Cấu hình Quay', icon: Settings },
];

const AdminDashboard = ({ onGoBack, users, setUsers, prizes, setPrizes }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState<Tab>('prizes');
  const [search, setSearch] = useState('');
  const [editingPrize, setEditingPrize] = useState<Prize | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Filters
  const filteredUsers = useMemo(() => {
    if (!search) return users;
    const q = search.toLowerCase();
    return users.filter(u => 
      u.code.toLowerCase().includes(q) || 
      u.name.toLowerCase().includes(q) || 
      u.phone.includes(q)
    );
  }, [search, users]);

  const totalChance = useMemo(() => 
    prizes.reduce((sum, p) => sum + p.chance, 0), [prizes]
  );

  // Handlers
  const toggleAllowed = (userId: number) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, allowedToWin: !u.allowedToWin } : u));
  };

  const handleDeletePrize = (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xoá giải thưởng này?')) {
      setPrizes(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleSavePrize = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const prizeData = {
      name: formData.get('name') as string,
      icon: formData.get('icon') as string,
      qty: parseInt(formData.get('qty') as string),
      chance: parseFloat(formData.get('chance') as string),
    };

    if (editingPrize) {
      setPrizes(prev => prev.map(p => p.id === editingPrize.id ? { ...p, ...prizeData } : p));
    } else {
      const newId = prizes.length > 0 ? Math.max(...prizes.map(p => p.id)) + 1 : 1;
      setPrizes(prev => [...prev, { id: newId, ...prizeData }]);
    }
    setEditingPrize(null);
    setIsAdding(false);
  };

  return (
    <div className="min-h-screen bg-background text-primary">
      {/* Prize Modal */}
      {(editingPrize || isAdding) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-primary/20 backdrop-blur-sm">
          <div className="bg-background rounded-3xl p-8 max-w-md w-full border border-primary/10 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h4 className="text-xl font-black mb-6 uppercase tracking-tight text-primary">
              {isAdding ? 'Thêm Giải thưởng' : 'Sửa Giải thưởng'}
            </h4>
            <form onSubmit={handleSavePrize} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-primary/40 block mb-1 tracking-widest">Tên giải thưởng</label>
                <input 
                  name="name" 
                  defaultValue={editingPrize?.name} 
                  required 
                  placeholder="Ví dụ: Chỉ Vàng 20 Năm"
                  className="w-full bg-surface border border-primary/10 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-secondary transition-colors" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-primary/40 block mb-1 tracking-widest">Icon (Emoji)</label>
                  <input 
                    name="icon" 
                    defaultValue={editingPrize?.icon} 
                    required 
                    className="w-full bg-surface border border-primary/10 rounded-xl px-4 py-3 text-sm font-bold text-center outline-none focus:border-secondary transition-colors" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-primary/40 block mb-1 tracking-widest">Số lượng</label>
                  <input 
                    name="qty" 
                    type="number" 
                    defaultValue={editingPrize?.qty} 
                    required 
                    className="w-full bg-surface border border-primary/10 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-secondary transition-colors" 
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-primary/40 block mb-1 tracking-widest">Tỷ lệ trúng (%)</label>
                <input 
                  name="chance" 
                  type="number" 
                  step="0.1" 
                  defaultValue={editingPrize?.chance} 
                  required 
                  className="w-full bg-surface border border-primary/10 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-secondary transition-colors" 
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => { setEditingPrize(null); setIsAdding(false); }} 
                  className="flex-1 px-6 py-3 border border-primary/10 rounded-2xl font-bold text-sm hover:bg-primary/5 transition-all active:scale-95"
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-bold text-sm hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/20"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-primary/10 px-4 md:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img src={hplLogo} alt="HPL Logo" className="h-10 md:h-12 w-auto" />
          <div className="h-6 w-px bg-primary/10 hidden md:block" />
          <h1 className="text-sm font-black leading-none tracking-tight uppercase text-primary whitespace-nowrap hidden sm:block">
            Cổng Quản trị Hệ thống
          </h1>
        </div>
        <button
          onClick={onGoBack}
          className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 text-primary/40 hover:text-secondary transition-all"
        >
          <ArrowLeft size={16} />
          Quay lại Sự kiện
        </button>
      </nav>

      <main className="pt-24 pb-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-72 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-sm transition-all whitespace-nowrap group ${
                  activeTab === tab.key
                    ? 'bg-primary text-primary-foreground shadow-xl shadow-primary/20'
                    : 'text-primary/40 hover:bg-primary/5 hover:text-primary'
                }`}
              >
                <tab.icon size={20} className={activeTab === tab.key ? 'text-secondary' : 'group-hover:text-primary'} />
                {tab.label}
              </button>
            ))}
          </aside>

          {/* Content Area */}
          <div className="flex-1 bg-surface/30 border border-primary/5 rounded-[2.5rem] overflow-hidden shadow-sm flex flex-col min-h-[600px]">
            {/* Header */}
            <div className="p-8 border-b border-primary/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-surface/50">
              <div>
                <h3 className="text-2xl font-black tracking-tight text-primary font-display mb-1">
                  {tabs.find(t => t.key === activeTab)?.label}
                </h3>
                <p className="text-xs font-medium text-primary/40">Quản lý và điều chỉnh thông số hệ thống</p>
              </div>

              {activeTab === 'prizes' && (
                <div className="flex items-center gap-8">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-bold uppercase text-primary/30 tracking-[0.2em] mb-1">Tổng Tỷ lệ</p>
                    <div className="flex items-center gap-2 justify-end">
                       <p className={`text-xl font-black tabular ${totalChance === 100 ? 'text-secondary' : 'text-red-500'}`}>
                        {totalChance}%
                      </p>
                      {totalChance !== 100 && <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
                    </div>
                  </div>
                  <button
                    onClick={() => setIsAdding(true)}
                    className="bg-primary text-primary-foreground px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/10 whitespace-nowrap"
                  >
                    Thêm Giải thưởng
                  </button>
                </div>
              )}

              {activeTab === 'users' && (
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30" size={18} />
                  <input
                    type="text"
                    placeholder="Tìm kiếm khách hàng..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-background border border-primary/10 rounded-2xl text-sm font-bold outline-none focus:border-primary text-primary transition-all shadow-sm"
                  />
                </div>
              )}
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-hidden relative">
              {activeTab === 'overview' && (
                <div className="p-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="p-8 rounded-[2rem] bg-background border border-primary/5 shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/30 mb-2">Tổng khách hàng</p>
                    <p className="text-4xl font-black text-primary tabular">{users.length}</p>
                  </div>
                  <div className="p-8 rounded-[2rem] bg-background border border-primary/5 shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/30 mb-2">Tổng giải thưởng</p>
                    <p className="text-4xl font-black text-primary tabular">{prizes.reduce((s, p) => s + p.qty, 0)}</p>
                  </div>
                  <div className="p-8 rounded-[2rem] bg-secondary/5 border border-secondary/10 shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary/60 mb-2">Đã quay</p>
                    <p className="text-4xl font-black text-secondary tabular">{users.filter(u => u.status === 'đã quay').length}</p>
                  </div>
                  <div className="p-8 rounded-[2rem] bg-primary/5 border border-primary/10 shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40 mb-2">Chưa quay</p>
                    <p className="text-4xl font-black text-primary tabular">{users.filter(u => u.status === 'chưa quay').length}</p>
                  </div>
                </div>
              )}

              {activeTab === 'users' && (
                <div className="overflow-auto h-full px-8 pb-8">
                  <table className="w-full text-left border-separate border-spacing-y-3 min-w-[900px]">
                    <thead className="sticky top-0 bg-surface/80 backdrop-blur-md z-10">
                      <tr className="text-[10px] font-bold uppercase tracking-widest text-primary/30">
                        <th className="px-6 py-4">Mã KH</th>
                        <th className="px-6 py-4">Họ và Tên</th>
                        <th className="px-6 py-4">Số điện thoại</th>
                        <th className="px-6 py-4">Được phép trúng</th>
                        <th className="px-6 py-4 text-center">Trạng thái</th>
                        <th className="px-6 py-4">Kết quả</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(user => (
                        <tr key={user.id} className="bg-background/40 hover:bg-surface transition-all group rounded-2xl border border-primary/5">
                          <td className="px-6 py-5 font-mono text-xs font-black text-secondary tabular first:rounded-l-2xl">{user.code}</td>
                          <td className="px-6 py-5 font-bold text-sm text-primary">{user.name}</td>
                          <td className="px-6 py-5 text-sm font-medium text-primary/60 tabular">{user.phone}</td>
                          <td className="px-6 py-5">
                            <Switch
                              checked={user.allowedToWin}
                              onCheckedChange={() => toggleAllowed(user.id)}
                            />
                          </td>
                          <td className="px-6 py-5 text-center">
                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                              user.status === 'đã quay'
                                ? 'bg-secondary/10 text-secondary'
                                : 'bg-primary/5 text-primary/40'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-5 last:rounded-r-2xl">
                            <span className={`text-sm font-black ${
                              user.result === 'May mắn lần sau' || !user.result
                                ? 'text-primary/20'
                                : 'text-secondary underline decoration-secondary/20 underline-offset-4'
                            }`}>
                              {user.result || '-'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'prizes' && (
                <div className="p-8 grid gap-4 overflow-auto h-full pb-12">
                  {prizes.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-primary/20">
                      <Gift size={64} className="mb-4 opacity-50" />
                      <p className="font-bold">Chưa có giải thưởng nào</p>
                    </div>
                  )}
                  {prizes.map(prize => (
                    <div
                      key={prize.id}
                      className="flex items-center justify-between p-6 rounded-[2rem] border border-primary/5 bg-background/40 hover:bg-surface transition-all group animate-in fade-in slide-in-from-right-4 duration-300"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-4xl shadow-xl shadow-primary/5 border border-primary/5 group-hover:scale-110 transition-transform">
                          {prize.icon}
                        </div>
                        <div>
                          <p className="font-black text-lg text-primary mb-1">{prize.name}</p>
                          <div className="flex items-center gap-3">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-primary/20 px-2 py-0.5 bg-primary/5 rounded-md">ID: {prize.id}</p>
                            {prize.qty === 0 && <span className="text-[10px] font-black uppercase text-red-500">Hết quà</span>}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-12">
                        <div className="flex items-center gap-10">
                          <div className="text-center min-w-[70px]">
                            <p className="text-[10px] font-bold uppercase text-primary/30 tracking-widest mb-1">Số lượng</p>
                            <p className="font-black text-primary tabular text-xl">{prize.qty}</p>
                          </div>
                          <div className="text-center min-w-[70px]">
                            <p className="text-[10px] font-bold uppercase text-primary/30 tracking-widest mb-1">Tỷ lệ</p>
                            <p className="font-black text-secondary tabular text-xl">{prize.chance}%</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-all transform lg:translate-x-4 lg:group-hover:translate-x-0">
                          <button
                            onClick={() => setEditingPrize(prize)}
                            className="p-3.5 rounded-xl border border-primary/5 bg-background text-primary/40 hover:text-primary hover:border-primary/20 hover:shadow-lg transition-all active:scale-90"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeletePrize(prize.id)}
                            className="p-3.5 rounded-xl border border-primary/5 bg-background text-red-300 hover:text-red-500 hover:border-red-200 hover:shadow-lg transition-all active:scale-90"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Total Chance Indicator at bottom */}
                  <div className={`mt-4 p-4 rounded-2xl border flex items-center justify-center gap-3 ${
                    totalChance === 100 ? 'bg-secondary/5 border-secondary/20 text-secondary' : 'bg-red-50 border-red-100 text-red-500'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${totalChance === 100 ? 'bg-secondary animate-pulse' : 'bg-red-500'}`} />
                    <span className="text-xs font-black uppercase tracking-widest">
                      Tổng tỷ lệ quà tặng hiện tại: {totalChance}% {totalChance !== 100 ? '(Vui lòng điều chỉnh về 100%)' : '(Hợp lệ)'}
                    </span>
                  </div>
                </div>
              )}

              {activeTab === 'config' && (
                <div className="p-8">
                  <div className="bg-background/40 rounded-[2.5rem] p-10 border border-primary/5 max-w-xl shadow-sm">
                    <h4 className="text-xl font-black mb-8 uppercase tracking-tight text-primary">Cấu hình vận hành</h4>
                    <div className="grid gap-8">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <label className="text-[10px] font-bold uppercase text-primary/40 block mb-2 tracking-widest">Thời gian quay (giây)</label>
                          <input type="number" defaultValue={4} className="w-full bg-surface border border-primary/5 rounded-2xl px-5 py-4 text-sm font-black text-primary outline-none focus:border-secondary transition-all" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase text-primary/40 block mb-2 tracking-widest">Lượt quay tối đa / khách</label>
                          <input type="number" defaultValue={1} className="w-full bg-surface border border-primary/5 rounded-2xl px-5 py-4 text-sm font-black text-primary outline-none focus:border-secondary transition-all" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-6 bg-primary/5 rounded-3xl border border-primary/5">
                        <div>
                          <p className="font-bold text-sm text-primary">Chế độ Thử nghiệm</p>
                          <p className="text-[10px] font-medium text-primary/40">Cho phép quay thử không trừ số lượng giải</p>
                        </div>
                        <Switch />
                      </div>
                      <button className="bg-primary text-primary-foreground w-full py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:opacity-95 active:scale-[0.98] transition-all">
                        Cập nhật cấu hình
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
