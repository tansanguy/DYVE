import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Proposal, getReceivedProposals } from '../api/proposal';

const statusColors: Record<Proposal['status'], string> = {
  pending: 'bg-yellow-500/20 text-yellow-200',
  accepted: 'bg-green-500/20 text-green-200',
  rejected: 'bg-red-500/20 text-red-200',
};

export default function ProposalInbox() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const data = await getReceivedProposals();
        setProposals(data);
      } catch (err) {
        console.error('받은 제안함 데이터를 불러오는 중 오류 발생', err);
        setError('받은 제안을 불러오지 못했습니다.');
        alert('받은 제안을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, []);

  return (
    <div className="min-h-screen bg-black px-4 py-10 text-white">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <header className="flex flex-col gap-2">
          <p className="text-sm uppercase tracking-widest text-white/60">Inbox</p>
          <h1 className="text-3xl font-bold">받은 제안함</h1>
          <p className="text-sm text-white/60">
            아티스트 및 공간으로부터 받은 제안 상태를 확인하세요.
          </p>
        </header>

        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/80 transition hover:border-white/50"
          >
            홈으로 이동
          </Link>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-white/70">
            제안을 불러오는 중입니다...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-6 text-center text-red-200">
            {error}
          </div>
        ) : proposals.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-white/70">
            아직 받은 제안이 없습니다.
          </div>
        ) : (
          <ul className="space-y-4">
            {proposals.map((proposal) => (
              <li
                key={proposal.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-white/30"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[proposal.status]}`}>
                    {proposal.status.toUpperCase()}
                  </span>
                  <p className="text-sm text-white/60">
                    제안 ID: {proposal.id}
                  </p>
                  <p className="text-sm text-white/60">
                    받은 시간: {new Date(proposal.sent_at).toLocaleString()}
                  </p>
                </div>
                <p className="mt-3 text-base text-white">{proposal.content}</p>
                <div className="mt-4 grid gap-2 text-sm text-white/60 md:grid-cols-3">
                  <p>보낸 사람: {proposal.sender}</p>
                  <p>아티스트: {proposal.receiver_artist ?? '해당 없음'}</p>
                  <p>공간: {proposal.receiver_space ?? '해당 없음'}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
