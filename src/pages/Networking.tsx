import { useEffect, useMemo, useState } from 'react';
import { Calendar, CheckCircle2, User, Building2, XCircle } from 'lucide-react';
import { getReceivedProposals, Proposal } from '../api/proposal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../dyve-figma/components/ui/tabs';
import { BottomNav } from '../components/navigation/BottomNav';

interface ProposalView extends Proposal {
  fromLabel: string;
  fromType: 'artist' | 'space';
  sentDate: string;
}

export default function NetworkingPage() {
  const [proposals, setProposals] = useState<ProposalView[]>([]);
  const [status, setStatus] = useState<'loading' | 'error' | 'idle'>('loading');
  const [selectedProposal, setSelectedProposal] = useState<ProposalView | null>(null);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const data = await getReceivedProposals();
        const mapped: ProposalView[] = data.map((proposal) => ({
          ...proposal,
          fromLabel: `제안자 #${proposal.sender}`,
          fromType: proposal.receiver_space ? 'space' : 'artist',
          sentDate: new Date(proposal.sent_at).toLocaleDateString('ko-KR'),
        }));
        setProposals(mapped);
        setStatus('idle');
      } catch (error) {
        console.error('제안함 데이터를 불러오는 중 오류 발생', error);
        setStatus('error');
      }
    };

    fetchProposals();
  }, []);

  const grouped = useMemo(() => {
    return {
      pending: proposals.filter((proposal) => proposal.status === 'pending'),
      accepted: proposals.filter((proposal) => proposal.status === 'accepted'),
      rejected: proposals.filter((proposal) => proposal.status === 'rejected'),
    };
  }, [proposals]);

  const loadingMessage = status === 'loading' ? '제안을 불러오는 중입니다...' : null;
  const errorMessage = status === 'error' ? '제안함을 불러오지 못했습니다.' : null;

  const handleDecision = (proposal: ProposalView, decision: 'accepted' | 'rejected') => {
    setSelectedProposal(null);
    setProposals((prev) => prev.map((item) => (item.id === proposal.id ? { ...item, status: decision } : item)));
  };

  const ProposalCard = ({ proposal }: { proposal: ProposalView }) => (
    <button
      type="button"
      onClick={() => setSelectedProposal(proposal)}
      className={`w-full rounded-2xl border p-5 text-left transition ${
        proposal.status === 'pending'
          ? 'border-[#FF3B5C]/30 hover:border-[#FF3B5C]'
          : proposal.status === 'accepted'
          ? 'border-green-500/30'
          : 'border-gray-700/30'
      } bg-[#1A1A1A]`}
    >
      <div className="mb-3 flex items-start gap-3">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full ${
            proposal.fromType === 'artist' ? 'bg-[#FF3B5C]/10' : 'bg-blue-500/10'
          }`}
        >
          {proposal.fromType === 'artist' ? (
            <User size={20} className="text-[#FF3B5C]" />
          ) : (
            <Building2 size={20} className="text-blue-400" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-white font-bold">{proposal.fromLabel}</h3>
          <p className="text-sm text-gray-500">{proposal.fromType === 'artist' ? '아티스트 제안' : '공간 제안'}</p>
        </div>
        {proposal.status === 'accepted' && <CheckCircle2 size={20} className="text-green-500" />}
        {proposal.status === 'rejected' && <XCircle size={20} className="text-gray-600" />}
      </div>
      <p className="mb-3 line-clamp-2 text-sm text-gray-400">{proposal.content}</p>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Calendar size={14} />
        <span>{proposal.sentDate}</span>
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-black pb-24 text-white">
      <div className="mx-auto w-full max-w-screen-sm">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-black/95 px-6 py-4 backdrop-blur">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">받은 제안함</h1>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
              총 {proposals.length}건
            </span>
          </div>
        </header>

        <div className="px-6 py-6">
          {loadingMessage && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm text-white/70">
              {loadingMessage}
            </div>
          )}
          {errorMessage && (
            <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-6 text-center text-sm text-red-100">
              {errorMessage}
            </div>
          )}

          {status === 'idle' && (
            <Tabs defaultValue="pending" className="mt-2">
              <TabsList className="mb-6 grid w-full grid-cols-3 rounded-2xl border border-white/5 bg-[#1A1A1A]">
                <TabsTrigger value="pending" className="data-[state=active]:bg-[#FF3B5C] data-[state=active]:text-white font-semibold">
                  대기중 ({grouped.pending.length})
                </TabsTrigger>
                <TabsTrigger value="accepted" className="data-[state=active]:bg-[#FF3B5C] data-[state=active]:text-white font-semibold">
                  수락됨 ({grouped.accepted.length})
                </TabsTrigger>
                <TabsTrigger value="rejected" className="data-[state=active]:bg-[#FF3B5C] data-[state=active]:text-white font-semibold">
                  거절됨 ({grouped.rejected.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-3">
                {grouped.pending.length ? grouped.pending.map((proposal) => <ProposalCard key={proposal.id} proposal={proposal} />) : <EmptyState message="대기중인 제안이 없습니다" />}
              </TabsContent>
              <TabsContent value="accepted" className="space-y-3">
                {grouped.accepted.length ? grouped.accepted.map((proposal) => <ProposalCard key={proposal.id} proposal={proposal} />) : <EmptyState message="수락한 제안이 없습니다" />}
              </TabsContent>
              <TabsContent value="rejected" className="space-y-3">
                {grouped.rejected.length ? grouped.rejected.map((proposal) => <ProposalCard key={proposal.id} proposal={proposal} />) : <EmptyState message="거절한 제안이 없습니다" />}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>

      {selectedProposal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80" onClick={() => setSelectedProposal(null)}>
          <div className="w-full max-w-screen-sm rounded-t-3xl border-t border-white/10 bg-[#0F0F0F]" onClick={(event) => event.stopPropagation()}>
            <div className="px-6 py-6">
              <div className="mx-auto mb-6 h-1 w-12 rounded-full bg-gray-600" />
              <div className="flex items-center gap-3">
                <div className={`flex h-14 w-14 items-center justify-center rounded-full ${selectedProposal.fromType === 'artist' ? 'bg-[#FF3B5C]/10' : 'bg-blue-500/10'}`}>
                  {selectedProposal.fromType === 'artist' ? (
                    <User size={24} className="text-[#FF3B5C]" />
                  ) : (
                    <Building2 size={24} className="text-blue-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-white/60">{selectedProposal.sentDate}</p>
                  <h3 className="text-xl font-bold">{selectedProposal.fromLabel}</h3>
                </div>
              </div>
              <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-white/80">{selectedProposal.content}</p>

              {selectedProposal.status === 'pending' ? (
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleDecision(selectedProposal, 'rejected')}
                    className="flex-1 rounded-2xl border border-white/10 py-3 text-sm font-semibold text-white/70"
                  >
                    거절하기
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDecision(selectedProposal, 'accepted')}
                    className="flex-1 rounded-2xl bg-[#FF3B5C] py-3 text-sm font-semibold text-white"
                  >
                    수락하기
                  </button>
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 py-3 text-center text-sm text-white/70">
                  이미 {selectedProposal.status === 'accepted' ? '수락' : '거절'}한 제안입니다.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 py-10 text-center text-sm text-white/60">
      {message}
    </div>
  );
}
