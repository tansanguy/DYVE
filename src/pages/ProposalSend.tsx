import { FormEvent, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Textarea } from '../dyve-figma/components/ui/textarea';
import { Label } from '../dyve-figma/components/ui/label';
import { Button } from '../dyve-figma/components/ui/button';
import { createProposal } from '../api/proposal';
import { BottomNav } from '../components/navigation/BottomNav';

type TargetType = 'artist' | 'space';

export default function ProposalSend() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const initialArtistId = searchParams.get('artistId');
  const initialSpaceId = searchParams.get('spaceId');
  const targetType: TargetType = initialArtistId ? 'artist' : initialSpaceId ? 'space' : 'artist';
  const targetId = initialArtistId ? Number(initialArtistId) : initialSpaceId ? Number(initialSpaceId) : null;

  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormInvalid = !content.trim();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isFormInvalid) {
      alert('모든 항목을 입력해주세요.');
      return;
    }
    if (!targetId || !Number.isInteger(targetId) || targetId <= 0) {
      alert('제안할 대상을 선택해 주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createProposal({
        receiver_artist: targetType === 'artist' ? targetId : null,
        receiver_space: targetType === 'space' ? targetId : null,
        content: content.trim(),
      });
      alert('제안이 전송되었습니다!');
      navigate('/inbox');
    } catch (error) {
      console.error('제안 전송 실패', error);
      alert('제안 전송을 완료하지 못했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pb-24 text-white">
      <div className="sticky top-0 z-40 border-b border-white/10 bg-black/95 backdrop-blur">
        <div className="flex items-center justify-between px-6 py-4">
          <button type="button" onClick={() => navigate(-1)} className="text-white hover:text-[#FF3B5C]">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-extrabold">제안서 작성</h1>
          <span className="w-6" />
        </div>
      </div>

      <div className="mx-auto max-w-screen-sm px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label className="mb-2 block text-white">제안 내용</Label>
            <Textarea
              rows={6}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="어떤 협업을 원하시는지 상세히 작성하세요"
              className="bg-[#111] text-white"
            />
          </div>

          <Button type="submit" disabled={isSubmitting || isFormInvalid} className="w-full bg-[#FF3B5C] py-4 font-bold">
            {isSubmitting ? '전송 중...' : '제안 보내기'}
          </Button>
        </form>
      </div>

      <BottomNav />
    </div>
  );
}
