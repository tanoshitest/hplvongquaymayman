import { useState, useMemo } from 'react';
import { LayoutDashboard, Gift, Users, Settings, Search, ArrowLeft } from 'lucide-react';
import { PRIZES, USERS } from '@/data/mockData';
import hplLogo from '@/assets/hpl-logo.png';

type Tab = 'overview' | 'prizes' | 'users' | 'config';

interface AdminDashboardProps {
  onGoBack: () => void;
}

const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
  { key: 'prizes', label: 'Quản lý Giải thưởng', icon: Gift },
  { key: 'users', label: 'Quản lý Khách hàng', icon: Users },
  { key: 'config', label: 'Cấu hình Quay', icon: Settings },
];

const AdminDashboard = ({ onGoBack }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState<Tab>('users');
  const [search, setSearch] = useState('');

  const filteredUsers = useMemo(() => {
    if (!search) return USERS;
    const q = search.toLowerCase();
    return USERS.filter(u => u.code.toLowerCase().includes(q) || u.name.toLowerCase().includes(q) || u.phone.includes(q));
  }, [search]);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-primary/10 px-4 md:px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src={hplLogo} alt="HPL Logo" className="h-10 md:h-12 w-auto" />
          <h1 className="text-sm font-bold leading-none tracking-tight uppercase text-primary whitespace-nowrap">
            Quản trị Sự kiện
          </h1>
        </div>
        <button
          onClick={onGoBack}
          className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 text-primary/60 hover:text-secondary transition-colors"
        >
          <ArrowLeft size={14} />
          Quay lại Sự kiện
        </button>
      </nav>

      <main className="pt-20 pb-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Sidebar */}
          <aside className="md:w-64 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pt-2">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-primary/60 hover:bg-primary/5'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </aside>

          {/* Content */}
          <div className="flex-1 bg-background border border-primary/10 rounded-[2rem] overflow-hidden shadow-sm">
            <div className="p-6 md:p-8 border-b border-primary/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface/50">
              <h3 className="text-xl font-black tracking-tight text-primary font-display">
                {tabs.find(t => t.key === activeTab)?.label}
              </h3>
              {(activeTab === 'users' || activeTab === 'prizes') && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/30" size={16} />
                  <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-background border border-primary/10 rounded-lg text-sm outline-none focus:border-primary text-primary"
                  />
                </div>
              )}
            </div>

            {activeTab === 'users' && (
              <div className="overflow-auto max-h-[600px]">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-surface text-[10px] font-bold uppercase tracking-widest text-primary/40">
                    <tr>
                      <th className="px-6 md:px-8 py-4">Mã KH</th>
                      <th className="px-6 md:px-8 py-4">Họ và Tên</th>
                      <th className="px-6 md:px-8 py-4">Số điện thoại</th>
                      <th className="px-6 md:px-8 py-4">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/5">
                    {filteredUsers.map(user => (
                      <tr key={user.id} className="hover:bg-surface transition-colors">
                        <td className="px-6 md:px-8 py-4 font-mono text-xs font-bold text-secondary tabular">{user.code}</td>
                        <td className="px-6 md:px-8 py-4 font-bold text-sm text-primary">{user.name}</td>
                        <td className="px-6 md:px-8 py-4 text-sm text-primary/60 tabular">{user.phone}</td>
                        <td className="px-6 md:px-8 py-4">
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded text-[10px] font-bold uppercase">
                            Sẵn sàng
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'prizes' && (
              <div className="p-6 md:p-8 grid gap-4">
                {PRIZES.map(prize => (
                  <div
                    key={prize.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-primary/5 hover:bg-surface transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{prize.icon}</span>
                      <div>
                        <p className="font-bold text-sm text-primary">{prize.name}</p>
                        <p className="text-xs text-primary/40">ID: {prize.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <p className="text-[10px] font-bold uppercase text-primary/40">Số lượng</p>
                        <p className="font-black text-primary tabular">{prize.qty}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-bold uppercase text-primary/40">Tỷ lệ</p>
                        <p className="font-black text-secondary tabular">{prize.chance}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'overview' && (
              <div className="p-6 md:p-8 grid sm:grid-cols-3 gap-4">
                <div className="p-6 rounded-2xl bg-surface border border-primary/5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40 mb-1">Tổng khách hàng</p>
                  <p className="text-3xl font-black text-primary tabular">{USERS.length}</p>
                </div>
                <div className="p-6 rounded-2xl bg-surface border border-primary/5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40 mb-1">Tổng giải thưởng</p>
                  <p className="text-3xl font-black text-primary tabular">{PRIZES.reduce((s, p) => s + p.qty, 0)}</p>
                </div>
                <div className="p-6 rounded-2xl bg-secondary/10 border border-secondary/20">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Giải đặc biệt</p>
                  <p className="text-3xl font-black text-secondary tabular">{PRIZES[0].qty}</p>
                  <p className="text-xs text-primary/60 mt-1">{PRIZES[0].name}</p>
                </div>
              </div>
            )}

            {activeTab === 'config' && (
              <div className="p-6 md:p-8">
                <div className="bg-surface rounded-2xl p-6 border border-primary/5 max-w-md">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40 mb-4">Cấu hình vòng quay</p>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-primary/60 block mb-1">Thời gian quay (giây)</label>
                      <input type="number" defaultValue={4} className="w-full bg-background border border-primary/10 rounded-lg px-4 py-2 text-sm font-bold text-primary outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-primary/60 block mb-1">Số lượt quay / khách</label>
                      <input type="number" defaultValue={1} className="w-full bg-background border border-primary/10 rounded-lg px-4 py-2 text-sm font-bold text-primary outline-none focus:border-primary" />
                    </div>
                    <button className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">
                      Lưu cấu hình
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
