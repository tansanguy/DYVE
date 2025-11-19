import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Building2, CheckCircle2, XCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../dyve-figma/components/ui/tabs';
import { getReceivedProposals, Proposal } from '../api/proposal';

export default function InboxPage() {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [status, setStatus] = useState<'loading' | 'error' | 'idle'>('loading');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getReceivedProposals();
        setProposals(data);
        setStatus('idle');
      } catch (error) {
        console.error('제안함 데이터를 불러오지 못했습니다.', error);
        setStatus('error');
      }
    };
    load();
  }, []);

  const grouped = {
    pending: proposals.filter((proposal) => proposal.status === 'pending'),
    accepted: proposals.filter((proposal) => proposal.status === 'accepted'),
    rejected: proposals.filter((proposal) => proposal.status === 'rejected'),
  };

  const ProposalCard = ({ proposal }: { proposal: Proposal }) => (
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
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            proposal.receiver_space ? 'bg-blue-500/10' : 'bg-[#FF3B5C]/10'
          }`}
        >
          {proposal.receiver_space ? (
            <Building2 size={20} className="text-blue-400" />
          ) : (
            <User size={20} className="text-[#FF3B5C]" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-white font-bold mb-1">제안 #{proposal.id}</h3>
          <p className="text-gray-500 text-sm">{proposal.receiver_space ? '공간 제안' : '아티스트 제안'}</p>
        </div>
        {proposal.status === 'accepted' && <CheckCircle2 size={20} className="text-green-500" />}
        {proposal.status === 'rejected' && <XCircle size={20} className="text-gray-600" />}
      </div>
      <p className="text-gray-400 text-sm line-clamp-2 mb-3">{proposal.content}</p>
      <div className="flex items-center gap-2 text-gray-600 text-xs">
        <Calendar size={14} />
        <span>{new Date(proposal.sent_at).toLocaleDateString()}</span>
      </div>
    </div>
  );

  const renderEmpty = (message: string) => (
    <div className="text-center py-20">
      <p className="text-gray-600">{message}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-black">
      <div className="bg-black sticky top-0 z-40 border-b border-white/10">
        <div className="px-6 py-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-white" type="button">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-white text-xl font-extrabold">받은 제안함</h1>
        </div>
      </div>

      <div className="px-6 py-6">
        {status === 'error' ? (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-6 text-center text-sm text-red-100">
            제안함을 불러오지 못했습니다.
          </div>
        ) : status === 'loading' ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`proposal-skeleton-${index}`}
                className="h-32 rounded-2xl border border-white/10 bg-white/5 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="w-full bg-[#1A1A1A] border border-white/5 mb-6 grid grid-cols-3">
              <TabsTrigger value="pending" className="data-[state=active]:bg-[#FF2E2E] data-[state=active]:text-white font-semibold">
                대기중 ({grouped.pending.length})
              </TabsTrigger>
              <TabsTrigger value="accepted" className="data-[state=active]:bg-[#FF2E2E] data-[state=active]:text-white font-semibold">
                수락됨 ({grouped.accepted.length})
              </TabsTrigger>
              <TabsTrigger value="rejected" className="data-[state=active]:bg-[#FF2E2E] data-[state=active]:text-white font-semibold">
                거절됨 ({grouped.rejected.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-3">
              {grouped.pending.length ? grouped.pending.map((proposal) => (
                <ProposalCard key={proposal.id} proposal={proposal} />
              )) : renderEmpty('대기중인 제안이 없습니다')}
            </TabsContent>
            <TabsContent value="accepted" className="space-y-3">
              {grouped.accepted.length ? grouped.accepted.map((proposal) => (
                <ProposalCard key={proposal.id} proposal={proposal} />
              )) : renderEmpty('수락한 제안이 없습니다')}
            </TabsContent>
            <TabsContent value="rejected" className="space-y-3">
              {grouped.rejected.length ? grouped.rejected.map((proposal) => (
                <ProposalCard key={proposal.id} proposal={proposal} />
              )) : renderEmpty('거절한 제안이 없습니다')}
            </TabsContent>
          </Tabs>
        )}
      </div>

      {selectedProposal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center" onClick={() => setSelectedProposal(null)}>
          <div className="bg-[#0F0F0F] w-full max-w-md rounded-t-3xl border-t border-white/10 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-6">
              <div className="w-12 h-1 bg-gray-700 rounded-full mx-auto mb-6" />
              <div className="flex items-start gap-4 mb-6">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    selectedProposal.receiver_space ? 'bg-blue-500/10' : 'bg-[#FF3B5C]/10'
                  }`}
                >
                  {selectedProposal.receiver_space ? (
                    <Building2 size={28} className="text-blue-400" />
                  ) : (
                    <User size={28} className="text-[#FF3B5C]" />
                  )}
                </div>
                <div>
                  <h2 className="text-white text-xl font-bold mb-1">제안 #{selectedProposal.id}</h2>
                  <p className="text-gray-500 text-sm mb-2">
                    {selectedProposal.receiver_space ? '공간 제안' : '아티스트 제안'}
                  </p>
                  <div className="flex items-center gap-2 text-gray-600 text-xs">
                    <Calendar size={14} />
                    <span>{new Date(selectedProposal.sent_at).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="bg-[#1A1A1A] rounded-2xl p-5 border border-white/5 mb-6">
                <h3 className="text-white font-bold mb-3">제안 내용</h3>
                <p className="text-gray-400 leading-relaxed">{selectedProposal.content}</p>
              </div>
              {selectedProposal.status === 'pending' ? (
                <div className="flex gap-3">
                  <button type="button" className="flex-1 bg-gray-800 text-white py-4 rounded-2xl hover:bg-gray-700 transition font-bold">
                    거절하기
                  </button>
                  <button type="button" className="flex-1 bg-[#FF2E2E] text-white py-4 rounded-2xl hover:bg-[#cc2525] transition font-bold">
                    수락하기
                  </button>
                </div>
              ) : (
                <div className="bg-gray-800/50 border border-gray-700/30 rounded-2xl p-4 text-center text-sm text-gray-500">
                  이미 {selectedProposal.status === 'accepted' ? '수락' : '거절'}한 제안입니다
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
