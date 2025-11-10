import { Screen } from '../App';
import { ArrowLeft, Users, Music, Building, FileText, Ticket } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface AdminPageProps {
  navigate: (screen: Screen) => void;
}

export default function AdminPage({ navigate }: AdminPageProps) {
  const stats = [
    { title: '총 사용자', value: '1,234', icon: Users, color: 'text-blue-400' },
    { title: '등록 아티스트', value: '156', icon: Music, color: 'text-purple-400' },
    { title: '등록 공간', value: '89', icon: Building, color: 'text-green-400' },
    { title: '제안서', value: '342', icon: FileText, color: 'text-yellow-400' },
    { title: '예매 건수', value: '567', icon: Ticket, color: 'text-[#FF2E2E]' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-red-950 to-black">
      <div className="bg-black/50 backdrop-blur-sm sticky top-0 z-40 border-b border-red-900/30">
        <div className="max-w-md mx-auto px-6 py-4 flex items-center gap-4">
          <button onClick={() => navigate('home')} className="text-white">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-white text-xl">관리자 대시보드</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-8">
        <div className="grid grid-cols-2 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={index}
                className="bg-black/40 backdrop-blur-sm border-red-900/30"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                    <Icon size={16} className={stat.color} />
                    {stat.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-2xl ${stat.color}`}>{stat.value}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-red-900/30 mb-6">
          <h3 className="text-white mb-4">최근 활동</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">신규 아티스트 등록</span>
              <span className="text-[#FF2E2E]">+3</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">신규 공간 등록</span>
              <span className="text-green-400">+2</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">제안서 전송</span>
              <span className="text-yellow-400">+12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">공연 예매</span>
              <span className="text-blue-400">+8</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-red-900/30">
          <h3 className="text-white mb-4">빠른 작업</h3>
          <div className="space-y-2">
            <button className="w-full bg-[#FF2E2E] text-white py-3 rounded-lg hover:bg-red-600 transition">
              공연 승인 대기 목록
            </button>
            <button className="w-full bg-black/60 text-white py-3 rounded-lg border border-red-900/30 hover:border-[#FF2E2E] transition">
              사용자 관리
            </button>
            <button className="w-full bg-black/60 text-white py-3 rounded-lg border border-red-900/30 hover:border-[#FF2E2E] transition">
              정산 관리
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
