import { useNavigate } from 'react-router-dom';

interface ProposalInboxButtonProps {
  badgeLabel?: string;
  className?: string;
}

export function ProposalInboxButton({ badgeLabel = '2', className = '' }: ProposalInboxButtonProps) {
  const navigate = useNavigate();

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
      <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF3B5C] text-white text-xs rounded-full flex items-center justify-center font-bold">
        {badgeLabel}
      </span>
    </button>
  );
}
