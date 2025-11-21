import { ChangeEvent, FormEvent, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Input } from '../dyve-figma/components/ui/input';
import { Textarea } from '../dyve-figma/components/ui/textarea';
import { Label } from '../dyve-figma/components/ui/label';
import { Button } from '../dyve-figma/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../dyve-figma/components/ui/select';
import { toast } from 'sonner';
import { createSpaceProfile } from '../api/spaces';
import { uploadImage } from '../api/uploads';
import { useAppContext } from '../contexts/AppContext';
import { BottomNav } from '../components/navigation/BottomNav';

const FALLBACK_SPACE_CATEGORIES = ['Live Club', 'Hall', 'Studio', 'Theater'];
const FALLBACK_REGIONS = ['서울', '경기', '인천', '강원', '충청', '전라', '경상', '제주'];

type SpaceFormState = {
  name: string;
  category: string;
  region: string;
  address: string;
  description: string;
  capacity: string;
  equipments: string;
  image_url: string;
  genres: string;
  phone: string;
};

export default function SpaceProfileCreate() {
  const navigate = useNavigate();
  const { spaceCategories, regions } = useAppContext();
  const [formState, setFormState] = useState<SpaceFormState>({
    name: '',
    category: '',
    region: '',
    address: '',
    description: '',
    capacity: '',
    equipments: '',
    genres: '',
    phone: '',
    image_url: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUploadStatus, setImageUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  const categoryOptions = useMemo(() => (spaceCategories.length ? spaceCategories : FALLBACK_SPACE_CATEGORIES), [spaceCategories]);
  const regionOptions = useMemo(() => (regions.length ? regions : FALLBACK_REGIONS), [regions]);
  const isFormInvalid =
    !formState.name.trim() ||
    !formState.category ||
    !formState.region ||
    !formState.address.trim() ||
    !formState.description.trim() ||
    !formState.capacity.trim() ||
    !formState.phone.trim();
  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setImageUploadStatus('uploading');
    try {
      const url = await uploadImage(file);
      setFormState((prev) => ({ ...prev, image_url: url }));
      toast.success('공간 대표 이미지 업로드를 완료했습니다.');
      setImageUploadStatus('success');
    } catch (error) {
      console.error('공간 이미지 업로드 실패', error);
      toast.error('이미지 업로드에 실패했습니다. 다른 파일로 다시 시도해 주세요.');
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
      toast.error('필수 항목이나 대표 이미지가 누락되었습니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      const hasValidCategory = categoryOptions.includes(formState.category);
      const hasValidRegion = regionOptions.includes(formState.region);
      if (!hasValidCategory || !hasValidRegion) {
        toast.error('카테고리 혹은 활동 지역 선택이 올바르지 않습니다.');
        setIsSubmitting(false);
        return;
      }

      const capacityNumber = Number(formState.capacity);
      await createSpaceProfile({
        name: formState.name.trim(),
        category: formState.category,
        region: formState.region,
        genres: formState.genres.trim() || undefined,
        address: formState.address.trim(),
        description: formState.description.trim() || undefined,
        capacity: Number.isFinite(capacityNumber) && capacityNumber > 0 ? capacityNumber : undefined,
        equipments: formState.equipments.trim() || undefined,
        phone: formState.phone.trim() || undefined,
        image_url: formState.image_url,
      });
      toast.success('공간 프로필이 등록되었습니다.');
      navigate('/networking');
    } catch (error) {
      console.error('공간 프로필 등록 실패', error);
      toast.error('공간 등록을 완료하지 못했습니다. 다시 시도해 주세요.');
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
          <h1 className="text-xl font-extrabold">공간 프로필 생성</h1>
          <span className="w-6" />
        </div>
      </div>

      <div className="mx-auto max-w-screen-sm px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label className="mb-2 block text-white">
              공간명 <span className="text-[#FF3B5C]">*</span>
            </Label>
            <Input
              name="name"
              value={formState.name}
              onChange={handleChange}
              placeholder="공간 이름"
              className="bg-[#111] text-white"
            />
          </div>

          <div>
            <Label className="mb-2 block text-white">카테고리</Label>
            <Select value={formState.category} onValueChange={(value) => setFormState((prev) => ({ ...prev, category: value }))}>
              <SelectTrigger className="bg-[#111] text-white">
                <SelectValue placeholder="카테고리를 선택하세요" />
              </SelectTrigger>
              <SelectContent className="bg-[#111] text-white">
                {categoryOptions.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2 block text-white">
              활동 지역 <span className="text-[#FF3B5C]">*</span>
            </Label>
            <Select value={formState.region} onValueChange={(value) => setFormState((prev) => ({ ...prev, region: value }))}>
              <SelectTrigger className="bg-[#111] text-white">
                <SelectValue placeholder="지역 선택" />
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
              상세 주소 <span className="text-[#FF3B5C]">*</span>
            </Label>
            <Input
              name="address"
              value={formState.address}
              onChange={handleChange}
              placeholder="예시) 서울시 마포구 ..."
              className="bg-[#111] text-white"
            />
          </div>

          <div>
            <Label className="mb-2 block text-white">
              설명 <span className="text-[#FF3B5C]">*</span>
            </Label>
            <Textarea
              rows={3}
              name="description"
              value={formState.description}
              onChange={handleChange}
              placeholder="공간의 콘셉트 혹은 특징을 소개하세요"
              className="bg-[#111] text-white"
            />
          </div>

          <div>
            <Label className="mb-2 block text-white">
              수용 인원 <span className="text-[#FF3B5C]">*</span>
            </Label>
            <Input
              name="capacity"
              type="number"
              min={0}
              value={formState.capacity}
              onChange={handleChange}
              placeholder="숫자로 입력"
              className="bg-[#111] text-white"
            />
          </div>

          <div>
            <Label className="mb-2 block text-white">대표 장비</Label>
            <Textarea
              rows={2}
              name="equipments"
              value={formState.equipments}
              onChange={handleChange}
              placeholder="주요 장비를 나열해 주세요"
              className="bg-[#111] text-white"
            />
          </div>

          <div>
            <Label className="mb-2 block text-white">장르</Label>
            <Input
              name="genres"
              value={formState.genres}
              onChange={handleChange}
              placeholder="Rock, Jazz 등"
              className="bg-[#111] text-white"
            />
          </div>

          <div>
            <Label className="mb-2 block text-white">
              전화번호 <span className="text-[#FF3B5C]">*</span>
            </Label>
            <Input
              name="phone"
              value={formState.phone}
              onChange={handleChange}
              placeholder="010-0000-0000"
              className="bg-[#111] text-white"
            />
          </div>

          <div>
            <Label className="mb-2 block text-white">
              대표 이미지 업로드 <span className="text-xs text-white/60">(선택)</span>
            </Label>
            <label className="relative flex cursor-pointer items-center justify-between rounded-2xl border border-white/10 bg-gradient-to-r from-[#FF2E2E] to-[#DB1A43] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#FF2E2E]/40 transition hover:brightness-110">
              <span>{formState.image_url ? '등록된 이미지 확인' : '이미지 업로드하기'}</span>
              <span className="text-xs text-white/80">
                {imageUploadStatus === 'uploading'
                  ? '업로드 중'
                  : imageUploadStatus === 'success'
                    ? '완료'
                    : '파일 선택'}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0"
              />
            </label>
            {imageUploadStatus === 'error' && (
              <p className="text-xs text-[#FF2E2E] mt-1">이미지 업로드에 실패했습니다. 다시 시도해 주세요.</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || isFormInvalid}
            className="w-full bg-[#FF3B5C] py-4 font-bold"
          >
            {isSubmitting ? '저장 중...' : '공간 등록하기'}
          </Button>
        </form>
      </div>

      <BottomNav />
    </div>
  );
}
