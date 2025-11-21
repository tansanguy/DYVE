import { ChangeEvent, FormEvent, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Input } from '../dyve-figma/components/ui/input';
import { Textarea } from '../dyve-figma/components/ui/textarea';
import { Label } from '../dyve-figma/components/ui/label';
import { Button } from '../dyve-figma/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../dyve-figma/components/ui/select';
import { toast } from 'sonner';
import { createArtistProfile } from '../api/artists';
import { uploadImage } from '../api/uploads';
import { useAppContext } from '../contexts/AppContext';
import { BottomNav } from '../components/navigation/BottomNav';

const FALLBACK_GENRES = ['Jazz', 'Rock', 'Electronic', 'Hip-Hop', 'Indie', '디제잉', '클래식', 'R&B'];
const FALLBACK_REGIONS = ['서울', '경기', '인천', '강원', '충청', '전라', '경상', '제주'];
const ARTIST_CATEGORIES = ['공연', '전시', '프로젝트', '기타'];

type ArtistFormState = {
  name: string;
  category: string;
  genres: string;
  region: string;
  bio: string;
  instagram: string;
  portfolio_url: string;
  image_url: string;
  equipments: string;
  history: string;
  phone: string;
};

export default function ArtistProfileCreate() {
  const navigate = useNavigate();
  const { genres, regions } = useAppContext();
  const [formData, setFormData] = useState<ArtistFormState>({
    name: '',
    category: '',
    genres: '',
    region: '',
    bio: '',
    instagram: '',
    portfolio_url: '',
    image_url: '',
    equipments: '',
    history: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUploadStatus, setImageUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  const genreOptions = useMemo(() => (genres.length ? genres : FALLBACK_GENRES), [genres]);
  const regionOptions = useMemo(() => (regions.length ? regions : FALLBACK_REGIONS), [regions]);
  const isFormInvalid =
    !formData.name.trim() ||
    !formData.category ||
    !formData.genres ||
    !formData.region ||
    !formData.bio.trim() ||
    !formData.phone.trim();
  const isImageReady = Boolean(formData.image_url) && imageUploadStatus === 'success';

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setImageUploadStatus('uploading');
    try {
      const url = await uploadImage(file);
      setFormData((prev) => ({ ...prev, image_url: url }));
      toast.success('대표 이미지 업로드를 완료했습니다.');
      setImageUploadStatus('success');
    } catch (error) {
      console.error('이미지 업로드 실패', error);
      toast.error('이미지 업로드에 실패했습니다. 다른 파일을 선택해 주세요.');
      setImageUploadStatus('error');
    } finally {
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isFormInvalid || !isImageReady) {
      toast.error('필수 입력 항목이나 이미지가 누락되었습니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createArtistProfile({
        name: formData.name.trim(),
        category: formData.category,
        genres: formData.genres,
        region: formData.region,
        bio: formData.bio.trim() || undefined,
        instagram: formData.instagram.trim() || undefined,
        portfolio_url: formData.portfolio_url.trim() || undefined,
        image_url: formData.image_url,
        equipments: formData.equipments.trim() || undefined,
        history: formData.history.trim() || undefined,
        phone: formData.phone.trim() || undefined,
      });
      toast.success('아티스트 프로필이 등록되었습니다.');
      navigate('/networking');
    } catch (error) {
      console.error('아티스트 프로필 등록 실패', error);
      toast.error('프로필 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.');
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
            <Label className="mb-2 block text-white">
              아티스트명 <span className="text-[#FF3B5C]">*</span>
            </Label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="활동명을 입력하세요"
              className="bg-[#111] text-white"
              required
            />
          </div>

          <div>
            <Label className="mb-2 block text-white">
              카테고리 <span className="text-[#FF3B5C]">*</span>
            </Label>
            <Select value={formData.category} onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}>
              <SelectTrigger className="bg-[#111] text-white" aria-label="카테고리 선택">
                <SelectValue placeholder="카테고리를 선택하세요" />
              </SelectTrigger>
              <SelectContent className="bg-[#111] text-white">
                {ARTIST_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2 block text-white">
              장르 <span className="text-[#FF3B5C]">*</span>
            </Label>
            <Select value={formData.genres} onValueChange={(value) => setFormData((prev) => ({ ...prev, genres: value }))}>
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
            <Label className="mb-2 block text-white">
              활동 지역 <span className="text-[#FF3B5C]">*</span>
            </Label>
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
            <Label className="mb-2 block text-white">
              소개 <span className="text-[#FF3B5C]">*</span>
            </Label>
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
            <Label className="mb-2 block text-white">
              대표 이미지 업로드 <span className="text-xs text-gray-400">필수</span>
            </Label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full rounded-2xl border border-white/10 bg-[#111] px-4 py-3 text-sm text-gray-200"
            />
            {imageUploadStatus === 'uploading' && (
              <p className="text-xs text-blue-300 mt-1">이미지를 업로드하는 중입니다...</p>
            )}
            {imageUploadStatus === 'error' && (
              <p className="text-xs text-[#FF2E2E] mt-1">이미지 업로드에 실패했습니다. 다시 시도해 주세요.</p>
            )}
            {imageUploadStatus === 'success' && (
              <p className="text-xs text-[#7AF5C6] mt-1">이미지 업로드가 완료되었습니다.</p>
            )}
          </div>

          <div>
            <Label className="mb-2 block text-white">보유 장비</Label>
            <Textarea
              rows={2}
              name="equipments"
              value={formData.equipments}
              onChange={handleChange}
              placeholder="장비를 콤마나 줄바꿈으로 입력하세요"
              className="bg-[#111] text-white"
            />
          </div>

          <div>
            <Label className="mb-2 block text-white">공연 이력</Label>
            <Textarea
              rows={2}
              name="history"
              value={formData.history}
              onChange={handleChange}
              placeholder="주요 공연 이력을 간단히 정리하세요"
              className="bg-[#111] text-white"
            />
          </div>

          <div>
            <Label className="mb-2 block text-white">
              휴대폰 번호 <span className="text-[#FF3B5C]">*</span>
            </Label>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="010-0000-0000"
              className="bg-[#111] text-white"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#FF3B5C] py-4 font-bold"
            disabled={isSubmitting || isFormInvalid || !isImageReady}
          >
            {isSubmitting ? '등록 중...' : '프로필 등록 완료'}
          </Button>
        </form>
      </div>

      <BottomNav />
    </div>
  );
}
