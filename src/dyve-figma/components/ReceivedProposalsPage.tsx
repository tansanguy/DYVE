import { Screen } from '../App';
import { ArrowLeft, Calendar, User, Building2, CheckCircle2, XCircle } from 'lucide-react';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface ReceivedProposalsPageProps {
  navigate: (screen: Screen) => void;
}

const mockProposals = [
  {
    id: 1,
    type: 'artist',
    from: 'Luna Quartet',
    fromType: 'artist',
    message: '안녕하세요! 11월 중순에 재즈 공연을 기획하고 있습니다. 귀하의 공간에서 협업 공연을 진행하고 싶습니다. 약 50명 규모의 공연을 생각하고 있으며, 티켓 수익을 5:5로 나누는 것을 제안합니다.',
    date: '2025-11-01',
    status: 'pending',
  },
  {
    id: 2,
    type: 'space',
    from: 'Blue Note Seoul',
    fromType: 'space',
    message: '저희 클럽에서 11월 15일 금요일 공연을 제안드립니다. 20:00 시작으로 약 2시간 공연을 원하며, 보장 출연료 50만원과 티켓 판매 수익 분배를 제안합니다.',
    date: '2025-10-30',
    status: 'pending',
  },
  {
    id: 3,
    type: 'artist',
    from: 'The Wanderers',
    fromType: 'artist',
    message: '합동 공연을 제안드립니다. 인디 록 씬에서 서로 시너지를 낼 수 있을 것 같습니다. 11월 20일쯤 홍대 지역에서 투어 공연을 진행할 예정인데 함께 하시면 좋을 것 같습니다.',
    date: '2025-10-28',
    status: 'accepted',
  },
  {
    id: 4,
    type: 'space',
    from: 'Cafe Live 신촌',
    fromType: 'space',
    message: '저희 카페에서 매주 목요일 어쿠스틱 나잇을 진행하고 있습니다. 11월 14일 공연을 제안드리며, 개런티 30만원과 음료 판매 수익의 20%를 드립니다.',
    date: '2025-10-25',
    status: 'rejected',
  },
];

export default function ReceivedProposalsPage({ navigate }: ReceivedProposalsPageProps) {
  const [selectedProposal, setSelectedProposal] = useState<any>(null);

  const pendingProposals = mockProposals.filter(p => p.status === 'pending');
  const acceptedProposals = mockProposals.filter(p => p.status === 'accepted');
  const rejectedProposals = mockProposals.filter(p => p.status === 'rejected');

  const handleAccept = (proposalId: number) => {
    console.log('Accepted proposal:', proposalId);
    setSelectedProposal(null);
  };

  const handleReject = (proposalId: number) => {
    console.log('Rejected proposal:', proposalId);
    setSelectedProposal(null);
  };

  const ProposalCard = ({ proposal }: { proposal: any }) => (
    <div
      onClick={() => setSelectedProposal(proposal)}
      className={`bg-[#1A1A1A] rounded-2xl p-5 border cursor-pointer transition-all ${
        proposal.status === 'pending'
          ? 'border-[#FF3B5C]/30 hover:border-[#FF3B5C]'
          : proposal.status === 'accepted'
          ? 'border-green-500/30'
          : 'border-gray-700/30'
      }`}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          proposal.fromType === 'artist' ? 'bg-[#FF3B5C]/10' : 'bg-blue-500/10'
        }`}>
          {proposal.fromType === 'artist' ? (
            <User size={20} className="text-[#FF3B5C]" />
          ) : (
            <Building2 size={20} className="text-blue-400" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-white font-bold mb-1">{proposal.from}</h3>
          <p className="text-gray-500 text-sm">{proposal.fromType === 'artist' ? '아티스트' : '공간'}</p>
        </div>
        {proposal.status === 'accepted' && (
          <CheckCircle2 size={20} className="text-green-500" />
        )}
        {proposal.status === 'rejected' && (
          <XCircle size={20} className="text-gray-600" />
        )}
      </div>
      <p className="text-gray-400 text-sm line-clamp-2 mb-3">
        {proposal.message}
      </p>
      <div className="flex items-center gap-2 text-gray-600 text-xs">
        <Calendar size={14} />
        <span>{proposal.date}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black">
      <div className="bg-black sticky top-0 z-40 border-b border-white/10">
        <div className="px-6 py-4 flex items-center gap-4">
          <button onClick={() => navigate('home')} className="text-white">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-white text-xl font-extrabold">받은 제안함</h1>
        </div>
      </div>

      <div className="px-6 py-6">
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="w-full bg-[#1A1A1A] border border-white/5 mb-6 grid grid-cols-3">
            <TabsTrigger 
              value="pending" 
              className="data-[state=active]:bg-[#FF2E2E] data-[state=active]:text-white font-semibold"
            >
              대기중 ({pendingProposals.length})
            </TabsTrigger>
            <TabsTrigger 
              value="accepted"
              className="data-[state=active]:bg-[#FF2E2E] data-[state=active]:text-white font-semibold"
            >
              수락됨 ({acceptedProposals.length})
            </TabsTrigger>
            <TabsTrigger 
              value="rejected"
              className="data-[state=active]:bg-[#FF2E2E] data-[state=active]:text-white font-semibold"
            >
              거절됨 ({rejectedProposals.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-3">
            {pendingProposals.length > 0 ? (
              pendingProposals.map((proposal) => (
                <ProposalCard key={proposal.id} proposal={proposal} />
              ))
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-600">대기중인 제안이 없습니다</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="accepted" className="space-y-3">
            {acceptedProposals.length > 0 ? (
              acceptedProposals.map((proposal) => (
                <ProposalCard key={proposal.id} proposal={proposal} />
              ))
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-600">수락한 제안이 없습니다</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-3">
            {rejectedProposals.length > 0 ? (
              rejectedProposals.map((proposal) => (
                <ProposalCard key={proposal.id} proposal={proposal} />
              ))
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-600">거절한 제안이 없습니다</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Proposal Detail Modal */}
      {selectedProposal && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center"
          onClick={() => setSelectedProposal(null)}
        >
          <div
            className="bg-[#0F0F0F] w-full max-w-md rounded-t-3xl border-t border-white/10 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-6">
              {/* Handle */}
              <div className="w-12 h-1 bg-gray-700 rounded-full mx-auto mb-6" />

              {/* Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  selectedProposal.fromType === 'artist' ? 'bg-[#FF3B5C]/10' : 'bg-blue-500/10'
                }`}>
                  {selectedProposal.fromType === 'artist' ? (
                    <User size={28} className="text-[#FF3B5C]" />
                  ) : (
                    <Building2 size={28} className="text-blue-400" />
                  )}
                </div>
                <div>
                  <h2 className="text-white text-xl font-bold mb-1">{selectedProposal.from}</h2>
                  <p className="text-gray-500 text-sm mb-2">
                    {selectedProposal.fromType === 'artist' ? '아티스트' : '공간'}
                  </p>
                  <div className="flex items-center gap-2 text-gray-600 text-xs">
                    <Calendar size={14} />
                    <span>{selectedProposal.date}</span>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="bg-[#1A1A1A] rounded-2xl p-5 border border-white/5 mb-6">
                <h3 className="text-white font-bold mb-3">제안 내용</h3>
                <p className="text-gray-400 leading-relaxed">
                  {selectedProposal.message}
                </p>
              </div>

              {/* Actions */}
              {selectedProposal.status === 'pending' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleReject(selectedProposal.id)}
                    className="flex-1 bg-gray-800 text-white py-4 rounded-2xl hover:bg-gray-700 transition font-bold flex items-center justify-center"
                  >
                    거절하기
                  </button>
                  <button
                    onClick={() => handleAccept(selectedProposal.id)}
                    className="flex-1 bg-[#FF2E2E] text-white py-4 rounded-2xl hover:bg-[#cc2525] transition font-bold flex items-center justify-center"
                  >
                    수락하기
                  </button>
                </div>
              )}

              {selectedProposal.status === 'accepted' && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4">
                  <p className="text-green-500 text-center font-semibold">
                    ✓ 수락한 제안입니다
                  </p>
                </div>
              )}

              {selectedProposal.status === 'rejected' && (
                <div className="bg-gray-800/50 border border-gray-700/30 rounded-2xl p-4">
                  <p className="text-gray-500 text-center font-semibold">
                    거절한 제안입니다
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
