import { ChangeEvent, FormEvent, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Input } from '../dyve-figma/components/ui/input';
import { Textarea } from '../dyve-figma/components/ui/textarea';
import { Label } from '../dyve-figma/components/ui/label';
import { Button } from '../dyve-figma/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../dyve-figma/components/ui/select';
import { createSpaceProfile } from '../api/spaces';
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
  contact: string;
  image_url: string;
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
    contact: '',
    image_url: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categoryOptions = useMemo(() => (spaceCategories.length ? spaceCategories : FALLBACK_SPACE_CATEGORIES), [spaceCategories]);
  const regionOptions = useMemo(() => (regions.length ? regions : FALLBACK_REGIONS), [regions]);
  const isFormInvalid = !formState.name.trim() || !formState.region || !formState.address.trim();

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isFormInvalid) {
      alert('필수 항목을 모두 입력해 주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const capacityNumber = Number(formState.capacity);
      await createSpaceProfile({
        name: formState.name.trim(),
        category: formState.category || undefined,
        region: formState.region,
        address: formState.address.trim(),
        description: formState.description.trim() || undefined,
        capacity: Number.isFinite(capacityNumber) && capacityNumber > 0 ? capacityNumber : undefined,
        equipments: formState.equipments.trim() || undefined,
        contact: formState.contact.trim() || undefined,
        image_url: formState.image_url.trim() || undefined,
      });
      alert('공간 프로필이 등록되었습니다.');
      navigate('/networking');
    } catch (error) {
      console.error('공간 프로필 등록 실패', error);
      alert('공간 등록을 완료하지 못했습니다. 다시 시도해 주세요.');
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
            <Label className="mb-2 block text-white">공간명 <span className="text-[#FF3B5C]">*</span></Label>
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
            <Label className="mb-2 block text-white">활동 지역 <span className="text-[#FF3B5C]">*</span></Label>
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
            <Label className="mb-2 block text-white">상세 주소 <span className="text-[#FF3B5C]">*</span></Label>
            <Input
              name="address"
              value={formState.address}
              onChange={handleChange}
              placeholder="예시) 서울시 마포구 ..."
              className="bg-[#111] text-white"
            />
          </div>

          <div>
            <Label className="mb-2 block text-white">설명</Label>
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
            <Label className="mb-2 block text-white">수용 인원</Label>
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
            <Label className="mb-2 block text-white">연락처</Label>
            <Input
              name="contact"
              value={formState.contact}
              onChange={handleChange}
              placeholder="010-0000-0000"
              className="bg-[#111] text-white"
            />
          </div>

          <div>
            <Label className="mb-2 block text-white">대표 이미지 URL</Label>
            <Input
              name="image_url"
              value={formState.image_url}
              onChange={handleChange}
              placeholder="https://"
              className="bg-[#111] text-white"
            />
          </div>

          <Button type="submit" disabled={isSubmitting || isFormInvalid} className="w-full bg-[#FF3B5C] py-4 font-bold">
            {isSubmitting ? '저장 중...' : '공간 등록하기'}
          </Button>
        </form>
      </div>

      <BottomNav />
    </div>
  );
}
