import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Upload } from 'lucide-react';
import { Input } from '../dyve-figma/components/ui/input';
import { Textarea } from '../dyve-figma/components/ui/textarea';
import { Label } from '../dyve-figma/components/ui/label';
import { Button } from '../dyve-figma/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../dyve-figma/components/ui/select';
import { apiClient } from '../api/client';
import { useAppContext } from '../contexts/AppContext';

interface ArtistProfileFormData {
  name: string;
  category?: string;
  genres: string;
  equipments: string;
  portfolio_url: string;
  image_url: string;
  history: string;
  phone: string;
}

const DEFAULT_GENRE_OPTIONS = ['Jazz', 'Rock', 'Electronic', 'Hip-Hop', 'Indie', '디제잉', '북토크', '스탠드업 코미디', '클래식', 'R&B'];
const CLOUDINARY_UPLOAD_URL =
  process.env.REACT_APP_CLOUDINARY_UPLOAD_URL || 'https://api.cloudinary.com/v1_1/dleuidipg/image/upload';
const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'dyve_unsigned';

export default function ArtistProfileCreatePage() {
  const navigate = useNavigate();
  const { genres } = useAppContext();
  const [formData, setFormData] = useState<ArtistProfileFormData>({
    name: '',
    category: undefined,
    genres: '',
    equipments: '',
    portfolio_url: '',
    image_url: '',
    history: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const genreOptions = genres.length ? genres : DEFAULT_GENRE_OPTIONS;
  const isFormInvalid = !formData.name.trim();

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isFormInvalid) {
      alert('필수 정보를 입력해 주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      await apiClient.post('/api/artists/profile/', formData);
      navigate('/mypage');
    } catch (error) {
      console.error('아티스트 프로필 생성에 실패했습니다.', error);
      alert('프로필 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('이미지는 5MB 이하로 업로드해 주세요.');
      return;
    }

    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      setIsUploadingImage(true);
      const response = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: 'POST',
        body: form,
      });
      const data = await response.json();
      if (!response.ok || (!data.secure_url && !data.url)) {
        throw new Error(data.error?.message || '이미지 업로드에 실패했습니다.');
      }
      const uploadedUrl = data.secure_url || data.url;
      setFormData((prev) => ({ ...prev, image_url: uploadedUrl }));
    } catch (error) {
      console.error('이미지 업로드 실패', error);
      alert('이미지 업로드를 완료하지 못했습니다. 다시 시도해 주세요.');
    } finally {
      setIsUploadingImage(false);
      event.target.value = '';
    }
  };

  const goBack = () => navigate(-1);

  return (
    <div className="min-h-screen bg-black pb-24 text-white">
      <div className="sticky top-0 z-40 border-b border-white/10 bg-black/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-screen-sm items-center gap-3 px-6 py-4">
          <button
            type="button"
            onClick={goBack}
            aria-label="이전으로"
            className="text-white transition hover:text-[#FF3B5C]"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-xl font-extrabold text-white">아티스트 등록</h1>
        </div>
      </div>

      <div className="mx-auto w-full max-w-screen-sm px-6 py-8">
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
              className="rounded-xl border-white/5 bg-[#1A1A1A] text-white placeholder:text-gray-700"
              required
            />
          </div>

          <div>
            <Label className="mb-2 block text-white">장르</Label>
            <Select value={formData.genres} onValueChange={(value) => setFormData((prev) => ({ ...prev, genres: value }))}>
              <SelectTrigger className="rounded-xl border-white/5 bg-[#1A1A1A] text-white">
                <SelectValue placeholder="장르를 선택하세요" />
              </SelectTrigger>
              <SelectContent className="border border-white/5 bg-[#0F0F0F] text-white">
                {genreOptions.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="artist-equipments" className="mb-2 block text-white">
              사용 장비
            </Label>
            <Textarea
              id="artist-equipments"
              name="equipments"
              value={formData.equipments}
              onChange={handleChange}
              placeholder="자주 사용하는 장비를 입력하세요"
              className="rounded-2xl border-white/5 bg-[#1A1A1A] text-white placeholder:text-gray-700"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="artist-portfolio" className="mb-2 block text-white">
              포트폴리오 링크
            </Label>
            <Input
              id="artist-portfolio"
              name="portfolio_url"
              value={formData.portfolio_url}
              onChange={handleChange}
              placeholder="SoundCloud, YouTube 등"
              className="rounded-xl border-white/5 bg-[#1A1A1A] text-white placeholder:text-gray-700"
            />
          </div>

          <div>
            <Label className="mb-2 block text-white">대표 이미지</Label>
            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-white/10 bg-[#1A1A1A] p-6 text-center hover:border-[#FF3B5C] transition">
              <Upload size={28} className="text-gray-600" />
              <p className="text-sm text-gray-500">{isUploadingImage ? '업로드 중...' : '클릭하여 이미지 업로드'}</p>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
            {formData.image_url && (
              <div className="mt-3 flex items-center gap-3">
                <img src={formData.image_url} alt="업로드된 아티스트 이미지" className="h-16 w-16 rounded-xl object-cover" />
                <p className="flex-1 truncate text-xs text-gray-400">{formData.image_url}</p>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="artist-history" className="mb-2 block text-white">
              활동 소개
            </Label>
            <Textarea
              id="artist-history"
              name="history"
              value={formData.history}
              onChange={handleChange}
              placeholder="공연 경험, 협업 이력 등을 자유롭게 작성하세요"
              className="rounded-2xl border-white/5 bg-[#1A1A1A] text-white placeholder:text-gray-700"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="artist-phone" className="mb-2 block text-white">
              연락처
            </Label>
            <Input
              id="artist-phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="010-0000-0000"
              className="rounded-xl border-white/5 bg-[#1A1A1A] text-white placeholder:text-gray-700"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || isFormInvalid}
            className="w-full rounded-2xl bg-[#FF2E2E] py-4 text-lg font-bold text-white transition hover:bg-[#cc2525] disabled:opacity-40"
          >
            {isSubmitting ? '등록 중...' : '아티스트 프로필 생성하기'}
          </Button>
        </form>
      </div>
    </div>
  );
}
