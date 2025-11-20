import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';

interface ProposalInboxButtonProps {
  badgeLabel?: string;
  className?: string;
}

export function ProposalInboxButton({ badgeLabel, className = '' }: ProposalInboxButtonProps) {
  const navigate = useNavigate();
  const { proposalCount, loadingProposalCount } = useAppContext();
  const computedBadge = badgeLabel !== undefined ? Number(badgeLabel) : proposalCount;
  const shouldShowBadge = !loadingProposalCount && computedBadge >= 1;

  return (
    <button
      type="button"
      onClick={() => navigate('/inbox')}
      className={`relative text-white hover:text-[#FF3B5C] transition ${className}`.trim()}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
      {shouldShowBadge && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#FF3B5C] text-xs font-bold text-white">
          {computedBadge}
        </span>
      )}
      {/* 한국어 주석: 글로벌 배지는 받은 제안함 카운트가 1개 이상일 때만 노출해 디자인 가이드를 지킨다. */}
    </button>
  );
}
