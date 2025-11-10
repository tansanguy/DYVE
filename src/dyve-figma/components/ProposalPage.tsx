import { Screen } from '../App';
import { ArrowLeft, Send } from 'lucide-react';
import { useState } from 'react';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';

interface ProposalPageProps {
  navigate: (screen: Screen) => void;
  target: any;
}

export default function ProposalPage({ navigate, target }: ProposalPageProps) {
  const [proposal, setProposal] = useState('');

  const handleSubmit = () => {
    if (proposal.length < 10) {
      toast.error('제안 내용을 최소 10자 이상 입력해주세요');
      return;
    }
    toast.success('제안이 전송되었습니다!');
    setTimeout(() => navigate('suggest'), 1500);
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="bg-black sticky top-0 z-40 border-b border-white/10">
        <div className="px-6 py-4 flex items-center gap-4">
          <button onClick={() => navigate('suggest')} className="text-white">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-white text-xl font-extrabold">제안서 보내기</h1>
        </div>
      </div>

      <div className="px-6 py-8">
        {/* Target Info */}
        <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5 mb-6">
          <p className="text-gray-600 text-sm mb-2">제안 대상</p>
          <h3 className="text-white text-xl font-bold">{target?.name || '선택된 대상'}</h3>
        </div>

        {/* Proposal Form */}
        <div className="mb-6">
          <label className="text-white mb-3 block font-bold">
            협업 제안 내용 <span className="text-gray-600 text-sm font-normal">(400자 내외)</span>
          </label>
          <Textarea 
            value={proposal}
            onChange={(e) => setProposal(e.target.value)}
            placeholder="협업 제안 내용을 입력해주세요...&#10;&#10;• 원하는 공연 형태&#10;• 희망 날짜 및 시간&#10;• 예상 관객 수&#10;• 기타 요청사항"
            className="min-h-64 bg-[#1A1A1A] border-white/5 text-white placeholder:text-gray-700 resize-none rounded-2xl"
            maxLength={400}
          />
          <p className="text-gray-600 text-sm mt-2 text-right">
            {proposal.length} / 400
          </p>
        </div>

        {/* Guidelines */}
        <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5 mb-8">
          <h4 className="text-white mb-3 font-bold">제안서 작성 가이드</h4>
          <ul className="text-gray-500 text-sm space-y-2">
            <li>• 구체적인 협업 아이디어를 제시해주세요</li>
            <li>• 희망하는 날짜와 시간을 명시해주세요</li>
            <li>• 상대방이 알아야 할 중요 정보를 포함해주세요</li>
            <li>• 정중하고 명확한 문장으로 작성해주세요</li>
          </ul>
        </div>

        {/* Submit Button */}
        <button 
          onClick={handleSubmit}
          className="w-full bg-[#FF2E2E] text-white py-4 rounded-2xl hover:bg-[#cc2525] transition flex items-center justify-center gap-2 font-bold text-lg"
        >
          <Send size={20} />
          <span>제안 보내기</span>
        </button>
      </div>
    </div>
  );
}
