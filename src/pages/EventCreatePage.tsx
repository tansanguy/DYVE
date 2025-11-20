import { ChangeEvent, FormEvent, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Input } from '../dyve-figma/components/ui/input';
import { Textarea } from '../dyve-figma/components/ui/textarea';
import { Label } from '../dyve-figma/components/ui/label';
import { Button } from '../dyve-figma/components/ui/button';
import { Checkbox } from '../dyve-figma/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../dyve-figma/components/ui/select';
import { createEvent } from '../api/events';
import { BottomNav } from '../components/navigation/BottomNav';
import { useAppContext } from '../contexts/AppContext';
import type { CreateEventPayload } from '../types/Event';

const ENTRY_TYPES = [
  { value: 'standing', label: '스탠딩 입장번호' },
  { value: 'seat', label: '지정좌석' },
  { value: 'firstcome', label: '선착순 입장' },
];
const FALLBACK_GENRES = ['Jazz', 'Rock', 'Electronic', 'Hip-Hop', 'Indie', '디제잉', '북토크', '스탠드업 코미디', '클래식', 'R&B'];
const FALLBACK_REGIONS = ['서울', '경기', '인천', '강원', '충청', '전라', '경상', '제주'];

type EventFormState = {
  title: string;
  description: string;
  genre: string;
  date: string;
  time: string;
  venueName: string;
  address: string;
  region: string;
  price: string;
  isFree: boolean;
  entryType: string;
  imageUrl: string;
  allowDyve: boolean;
  advertise: boolean;
  space: string;
  artists: string;
};

export default function EventCreatePage() {
  const navigate = useNavigate();
  const { genres, regions } = useAppContext();
  const [formState, setFormState] = useState<EventFormState>({
    title: '',
    description: '',
    genre: '',
    date: '',
    time: '',
    venueName: '',
    address: '',
    region: '',
    price: '',
    isFree: false,
    entryType: '',
    imageUrl: '',
    allowDyve: true,
    advertise: false,
    space: '',
    artists: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const genreOptions = useMemo(() => (genres.length ? genres : FALLBACK_GENRES), [genres]);
  const regionOptions = useMemo(() => (regions.length ? regions : FALLBACK_REGIONS), [regions]);
  const isPriceMissing = !formState.isFree && !formState.price.trim();
  const isFormInvalid =
    !formState.title.trim() ||
    !formState.genre ||
    !formState.date ||
    !formState.time ||
    !formState.venueName.trim() ||
    !formState.region ||
    !formState.entryType ||
    isPriceMissing;

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = event.target as HTMLInputElement;
    if (type === 'checkbox') {
      setFormState((prev) => ({ ...prev, [name]: checked }));
      return;
    }
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
      const artistIds = formState.artists
        .split(',')
        .map((item) => Number(item.trim()))
        .filter((value) => !Number.isNaN(value));
      const parsedSpace = Number(formState.space);
      const payload: CreateEventPayload = {
        title: formState.title.trim(),
        description: formState.description.trim() || undefined,
        genre: formState.genre,
        date: formState.date,
        time: formState.time,
        venue_name: formState.venueName.trim(),
        address: formState.address.trim() || undefined,
        region: formState.region,
        price: formState.isFree ? 0 : Number(formState.price) || undefined,
        is_free: formState.isFree,
        entry_type: formState.entryType,
        image_url: formState.imageUrl.trim() || undefined,
        allow_dyve_reservation: formState.allowDyve,
        advertise: formState.advertise,
      };
      if (!Number.isNaN(parsedSpace) && parsedSpace > 0) {
        payload.space = parsedSpace;
      }
      if (artistIds.length) {
        payload.artists = artistIds;
      }

      await createEvent(payload);
      alert('공연 등록이 완료되었습니다.');
      navigate('/events');
    } catch (error) {
      console.error('공연 등록 실패', error);
      alert('공연 등록을 완료하지 못했습니다. 다시 시도해 주세요.');
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
          <h1 className="text-xl font-extrabold">공연 등록</h1>
          <span className="w-6" />
        </div>
      </div>

      <div className="mx-auto max-w-screen-sm px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label className="mb-2 block text-white" htmlFor="title">
              공연 제목 <span className="text-[#FF3B5C]">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              value={formState.title}
              onChange={handleChange}
              placeholder="공연 이름을 입력하세요"
              className="bg-[#111] text-white"
            />
          </div>

          <div>
            <Label className="mb-2 block text-white">장르 <span className="text-[#FF3B5C]">*</span></Label>
            <Select value={formState.genre} onValueChange={(value) => setFormState((prev) => ({ ...prev, genre: value }))}>
              <SelectTrigger className="bg-[#111] text-white">
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
            <Label className="mb-2 block text-white" htmlFor="description">
              설명
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formState.description}
              onChange={handleChange}
              rows={3}
              placeholder="공연 소개를 적어주세요"
              className="bg-[#111] text-white"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="mb-2 block text-white" htmlFor="date">
                날짜 <span className="text-[#FF3B5C]">*</span>
              </Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formState.date}
                onChange={handleChange}
                className="bg-[#111] text-white"
              />
            </div>
            <div>
              <Label className="mb-2 block text-white" htmlFor="time">
                시간 <span className="text-[#FF3B5C]">*</span>
              </Label>
              <Input id="time" name="time" type="time" value={formState.time} onChange={handleChange} className="bg-[#111] text-white" />
            </div>
          </div>

          <div>
            <Label className="mb-2 block text-white" htmlFor="venueName">
              장소명 <span className="text-[#FF3B5C]">*</span>
            </Label>
            <Input
              id="venueName"
              name="venueName"
              value={formState.venueName}
              onChange={handleChange}
              placeholder="공연장 이름"
              className="bg-[#111] text-white"
            />
          </div>

          <div>
            <Label className="mb-2 block text-white" htmlFor="address">
              주소
            </Label>
            <Input
              id="address"
              name="address"
              value={formState.address}
              onChange={handleChange}
              placeholder="상세 주소"
              className="bg-[#111] text-white"
            />
          </div>

          <div>
            <Label className="mb-2 block text-white">활동 지역 <span className="text-[#FF3B5C]">*</span></Label>
            <Select value={formState.region} onValueChange={(value) => setFormState((prev) => ({ ...prev, region: value }))}>
              <SelectTrigger className="bg-[#111] text-white">
                <SelectValue placeholder="지역을 선택하세요" />
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
            <Label className="mb-2 block text-white" htmlFor="price">
              티켓 가격 ({formState.isFree ? '무료 공연' : '필수'})
            </Label>
            <Input
              id="price"
              name="price"
              type="number"
              min={0}
              value={formState.price}
              onChange={handleChange}
              placeholder="정가(숫자만)"
              className="bg-[#111] text-white"
              disabled={formState.isFree}
            />
          </div>

          <div>
            <label className="flex items-center gap-3">
              <Checkbox id="isFree" name="isFree" checked={formState.isFree} onCheckedChange={(value) => setFormState((prev) => ({ ...prev, isFree: Boolean(value) }))} />
              <span className="text-sm text-white">무료 공연으로 등록</span>
            </label>
          </div>

          <div>
            <Label className="mb-2 block text-white">입장 타입 <span className="text-[#FF3B5C]">*</span></Label>
            <Select value={formState.entryType} onValueChange={(value) => setFormState((prev) => ({ ...prev, entryType: value }))}>
              <SelectTrigger className="bg-[#111] text-white">
                <SelectValue placeholder="입장 타입을 선택하세요" />
              </SelectTrigger>
              <SelectContent className="bg-[#111] text-white">
                {ENTRY_TYPES.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2 block text-white" htmlFor="imageUrl">
              공연 이미지 URL
            </Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              value={formState.imageUrl}
              onChange={handleChange}
              placeholder="https://"
              className="bg-[#111] text-white"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="mb-2 block text-white" htmlFor="space">
                연결된 공간 ID
              </Label>
              <Input
                id="space"
                name="space"
                type="number"
                value={formState.space}
                onChange={handleChange}
                placeholder="숫자로만 입력"
                className="bg-[#111] text-white"
              />
            </div>
            <div>
              <Label className="mb-2 block text-white" htmlFor="artists">
                참여 아티스트 IDs
              </Label>
              <Input
                id="artists"
                name="artists"
                value={formState.artists}
                onChange={handleChange}
                placeholder="쉼표로 구분된 ID 나열"
                className="bg-[#111] text-white"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <Checkbox id="allowDyve" name="allowDyve" checked={formState.allowDyve} onCheckedChange={(value) => setFormState((prev) => ({ ...prev, allowDyve: Boolean(value) }))} />
              <span className="text-sm text-white">DYVE 예약 허용</span>
            </label>
            <label className="flex items-center gap-3">
              <Checkbox id="advertise" name="advertise" checked={formState.advertise} onCheckedChange={(value) => setFormState((prev) => ({ ...prev, advertise: Boolean(value) }))} />
              <span className="text-sm text-white">다이브 측 광고 노출</span>
            </label>
          </div>

          <Button type="submit" disabled={isSubmitting || isFormInvalid} className="w-full bg-[#FF3B5C] py-4 font-bold">
            {isSubmitting ? '등록 중...' : '공연 등록하기'}
          </Button>
        </form>
      </div>

      <BottomNav />
    </div>
  );
}
