import { ChangeEvent, FormEvent, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Input } from '../dyve-figma/components/ui/input';
import { Textarea } from '../dyve-figma/components/ui/textarea';
import { Label } from '../dyve-figma/components/ui/label';
import { Button } from '../dyve-figma/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../dyve-figma/components/ui/select';
import { createArtistProfile } from '../api/artists';
import { useAppContext } from '../contexts/AppContext';
import { BottomNav } from '../components/navigation/BottomNav';

const FALLBACK_GENRES = ['Jazz', 'Rock', 'Electronic', 'Hip-Hop', 'Indie', '디제잉', '클래식', 'R&B'];
const FALLBACK_REGIONS = ['서울', '경기', '인천', '강원', '충청', '전라', '경상', '제주'];

type ArtistFormState = {
  name: string;
  genre: string;
  region: string;
  bio: string;
  instagram: string;
  portfolio_url: string;
  image_url: string;
};

export default function ArtistProfileCreate() {
  const navigate = useNavigate();
  const { genres, regions } = useAppContext();
  const [formData, setFormData] = useState<ArtistFormState>({
    name: '',
    genre: '',
    region: '',
    bio: '',
    instagram: '',
    portfolio_url: '',
    image_url: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const genreOptions = useMemo(() => (genres.length ? genres : FALLBACK_GENRES), [genres]);
  const regionOptions = useMemo(() => (regions.length ? regions : FALLBACK_REGIONS), [regions]);
  const isFormInvalid = !formData.name.trim();

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isFormInvalid) {
      alert('이름은 반드시 입력해야 합니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createArtistProfile({
        name: formData.name.trim(),
        genre: formData.genre || undefined,
        region: formData.region || undefined,
        bio: formData.bio.trim() || undefined,
        instagram: formData.instagram.trim() || undefined,
        portfolio_url: formData.portfolio_url.trim() || undefined,
        image_url: formData.image_url.trim() || undefined,
      });
      alert('아티스트 프로필이 등록되었습니다.');
      navigate('/networking');
    } catch (error) {
      console.error('아티스트 프로필 등록 실패', error);
      alert('프로필 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pb-20 text-white">
      <div className="sticky top-0 z-40 border-b border-white/10 bg-black/90 backdrop-blur">
        <div className="flex items-center justify-between px-6 py-4">
          <button type="button" onClick={() => navigate(-1)} className="text-white hover:text-[#FF3B5C]">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-extrabold">아티스트 프로필 생성</h1>
          <span className="w-6" />
        </div>
      </div>

      <div className="mx-auto max-w-screen-sm px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="artist-name" className="mb-2 block text-white">
              아티스트명 <span className="text-[#FF3B5C]">*</span>
            </Label>
            <Input
              id="artist-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="활동명을 입력하세요"
              className="bg-[#111] text-white"
              required
            />
          </div>

          <div>
            <Label className="mb-2 block text-white">장르</Label>
            <Select value={formData.genre} onValueChange={(value) => setFormData((prev) => ({ ...prev, genre: value }))}>
              <SelectTrigger className="bg-[#111] text-white" aria-label="장르 선택">
                <SelectValue placeholder="장르를 선택하세요" />
              </SelectTrigger>
              <SelectContent className="bg-[#111] text-white">
                {genreOptions.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2 block text-white">활동 지역</Label>
            <Select value={formData.region} onValueChange={(value) => setFormData((prev) => ({ ...prev, region: value }))}>
              <SelectTrigger className="bg-[#111] text-white" aria-label="지역 선택">
                <SelectValue placeholder="활동 지역을 선택하세요" />
              </SelectTrigger>
              <SelectContent className="bg-[#111] text-white">
                {regionOptions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2 block text-white">소개</Label>
            <Textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="정체성과 공연 스타일을 간단히 소개하세요"
              className="bg-[#111] text-white"
              rows={3}
            />
          </div>

          <div>
            <Label className="mb-2 block text-white">Instagram</Label>
            <Input
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              placeholder="https://www.instagram.com/..."
              className="bg-[#111] text-white"
            />
          </div>

          <div>
            <Label className="mb-2 block text-white">포트폴리오 링크</Label>
            <Input
              name="portfolio_url"
              value={formData.portfolio_url}
              onChange={handleChange}
              placeholder="SoundCloud, YouTube 등"
              className="bg-[#111] text-white"
            />
          </div>

          <div>
            <Label className="mb-2 block text-white">대표 이미지 URL</Label>
            <Input
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://"
              className="bg-[#111] text-white"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#FF3B5C] py-4 font-bold"
            disabled={isSubmitting || isFormInvalid}
          >
            {isSubmitting ? '등록 중...' : '프로필 등록 완료'}
          </Button>
        </form>
      </div>

      <BottomNav />
    </div>
  );
}
