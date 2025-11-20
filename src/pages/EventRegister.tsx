import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Instagram } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '../dyve-figma/components/ui/input';
import { Textarea } from '../dyve-figma/components/ui/textarea';
import { Button } from '../dyve-figma/components/ui/button';
import { Checkbox } from '../dyve-figma/components/ui/checkbox';
import { Label } from '../dyve-figma/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../dyve-figma/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../dyve-figma/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../dyve-figma/components/ui/tabs';
import { createEvent } from '../api/events';
import { createSpace } from '../api/spaces';
import { useAppContext } from '../contexts/AppContext';
const DEFAULT_GENRES = ['Jazz', 'Rock', 'Electronic', 'Hip-Hop', 'Indie', '디제잉', '북토크', '스탠드업 코미디', '클래식', 'R&B'];
const DEFAULT_REGIONS = ['서울', '경기', '인천', '강원', '충청', '전라', '경상', '제주'];
const DEFAULT_SPACE_CATEGORIES = ['Live Club', 'Hall', 'Studio', 'Theater'];
const entryTypes = [
  { value: 'standing', label: '스탠딩 입장번호' },
  { value: 'seat', label: '지정좌석' },
  { value: 'firstcome', label: '선착순 입장' },
];

const generateTimeOptions = () => {
  const times: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (const min of [0, 30]) {
      const h = hour.toString().padStart(2, '0');
      const m = min.toString().padStart(2, '0');
      times.push(`${h}:${m}`);
    }
  }
  return times;
};

const timeOptions = generateTimeOptions();

type RegisterTab = 'performance' | 'space';

export default function EventRegisterPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'space' ? 'space' : 'performance';
  const [activeTab, setActiveTab] = useState<RegisterTab>(initialTab);

  const [performanceForm, setPerformanceForm] = useState({
    title: '',
    description: '',
    genre: '',
    date: '',
    time: '',
    venueName: '',
    venueAddress: '',
    region: '',
    price: '',
    isFree: false,
    entryType: '',
    totalSeats: '',
    seatRows: '',
    seatCols: '',
    imageUrl: '',
    dyveBookable: true,
  });
  const [spaceForm, setSpaceForm] = useState({
    name: '',
    category: '',
    genres: '',
    region: '',
    address: '',
    capacity: '',
    description: '',
    equipments: '',
    imageUrl: '',
    phone: '',
  });
  const [instagramUrl, setInstagramUrl] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [spaceSubmitting, setSpaceSubmitting] = useState(false);
  const { genres, regions, spaceCategories } = useAppContext();
  // 한국어 주석: 메타 데이터가 아직 오지 않은 경우를 대비해 기존 더미 옵션을 그대로 fallback으로 둔다.
  const genreOptions = genres.length ? genres : DEFAULT_GENRES;
  const regionOptions = regions.length ? regions : DEFAULT_REGIONS;
  const spaceCategoryOptions = spaceCategories.length ? spaceCategories : DEFAULT_SPACE_CATEGORIES;

  const handleTabChange = (value: string) => {
    const nextTab: RegisterTab = value === 'space' ? 'space' : 'performance';
    setActiveTab(nextTab);
    setSearchParams(nextTab === 'performance' ? {} : { tab: nextTab });
  };

  const handleInstagramImport = () => {
    if (!instagramUrl.trim()) {
      toast.error('인스타그램 게시물 URL을 입력해주세요');
      return;
    }
    toast.success('인스타그램 게시물을 가져왔습니다!');
    setPerformanceForm((prev) => ({
      ...prev,
      description: '인스타그램에서 가져온 공연 설명입니다.\n\n📅 날짜와 시간을 확인해주세요\n🎵 장르와 장소 정보를 입력해주세요',
    }));
    setInstagramUrl('');
    setIsDialogOpen(false);
  };

  const handlePerformanceSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!performanceForm.title || !performanceForm.genre || !performanceForm.date || !performanceForm.time || !performanceForm.venueName || !performanceForm.region || !performanceForm.entryType) {
      toast.error('필수 항목을 모두 입력해주세요');
      return;
    }

    if (performanceForm.entryType !== 'firstcome' && !performanceForm.totalSeats) {
      toast.error('좌석 수를 입력해주세요');
      return;
    }

    const normalizedTime = performanceForm.time && performanceForm.time.length === 5 ? `${performanceForm.time}:00` : performanceForm.time;

    setSubmitting(true);
    try {
      await createEvent({
        title: performanceForm.title,
        description: performanceForm.description || undefined,
        genre: performanceForm.genre,
        date: performanceForm.date,
        time: normalizedTime,
        venue_name: performanceForm.venueName,
        address: performanceForm.venueAddress || undefined,
        region: performanceForm.region,
        price: performanceForm.isFree ? 0 : Number(performanceForm.price || 0),
        is_free: performanceForm.isFree,
        entry_type: performanceForm.entryType,
        total_seats: performanceForm.totalSeats ? Number(performanceForm.totalSeats) : undefined,
        seat_rows: performanceForm.seatRows ? Number(performanceForm.seatRows) : undefined,
        seat_cols: performanceForm.seatCols ? Number(performanceForm.seatCols) : undefined,
        allow_dyve_reservation: performanceForm.dyveBookable,
        advertise: false,
        image_url: performanceForm.imageUrl || undefined,
        artists: [],
      });
      toast.success('공연이 등록되었습니다!');
      setTimeout(() => navigate('/events'), 1200);
    } catch (error) {
      console.error('공연 등록 실패', error);
      toast.error('공연 등록을 완료하지 못했습니다. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSpaceSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!spaceForm.name || !spaceForm.region || !spaceForm.address || !spaceForm.capacity) {
      toast.error('필수 항목을 모두 입력해주세요');
      return;
    }
    setSpaceSubmitting(true);
    try {
      await createSpace({
        name: spaceForm.name,
        category: spaceForm.category || undefined,
        genres: spaceForm.genres || undefined,
        region: spaceForm.region,
        address: spaceForm.address,
        capacity: Number(spaceForm.capacity),
        description: spaceForm.description || undefined,
        equipments: spaceForm.equipments || undefined,
        image_url: spaceForm.imageUrl || undefined,
        phone: spaceForm.phone || undefined,
      });
      toast.success('공간 등록이 완료되었습니다!');
      setTimeout(() => navigate('/events'), 1200);
    } catch (error) {
      console.error('공간 등록 실패', error);
      toast.error('공간 등록을 완료하지 못했습니다. 다시 시도해주세요.');
    } finally {
      setSpaceSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pb-20">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="sticky top-0 z-40 border-b border-white/10 bg-black/95 backdrop-blur">
          <div className="mx-auto flex w-full max-w-screen-sm items-center justify-between gap-3 px-6 py-4">
            <button onClick={() => navigate(-1)} className="text-white hover:text-[#FF3B5C] transition" type="button">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-white font-extrabold">{activeTab === 'space' ? '공간 등록' : '공연 등록'}</h1>
            {activeTab === 'performance' ? (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90" type="button">
                    <Instagram size={16} />
                    인스타그램에서 가져오기
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-[#1A1A1A] border-white/10">
                  <DialogHeader>
                    <DialogTitle className="text-white">인스타그램에서 가져오기</DialogTitle>
                    <DialogDescription className="text-gray-400">공연 게시물의 URL을 입력하면 사진과 설명을 자동으로 가져옵니다</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <Input
                      value={instagramUrl}
                      onChange={(e) => setInstagramUrl(e.target.value)}
                      placeholder="https://www.instagram.com/p/..."
                      className="bg-black border-white/10 text-white placeholder:text-gray-600"
                    />
                    <div className="flex gap-3">
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1 bg-transparent border-white/10 text-white hover:bg-white/5">
                        취소
                      </Button>
                      <Button type="button" onClick={handleInstagramImport} className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90">
                        가져오기
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <div className="h-10 w-[170px]" />
            )}
          </div>
          <div className="mx-auto w-full max-w-screen-sm px-6 pb-4">
            <TabsList className="w-full border border-white/5 bg-[#121212]">
              <TabsTrigger value="performance" className="flex-1 data-[state=active]:bg-[#FF2E2E] data-[state=active]:text-white font-semibold">
                공연 등록
              </TabsTrigger>
              <TabsTrigger value="space" className="flex-1 data-[state=active]:bg-[#FF2E2E] data-[state=active]:text-white font-semibold">
                공간 등록
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <div className="mx-auto w-full max-w-2xl px-6 py-8">
          <TabsContent value="performance">
            <form onSubmit={handlePerformanceSubmit} className="space-y-5">
              <div>
                <Label htmlFor="title" className="mb-2 block text-white">
                  공연 제목 <span className="text-[#FF3B5C]">*</span>
                </Label>
                <Input
                  id="title"
                  value={performanceForm.title}
                  onChange={(e) => setPerformanceForm({ ...performanceForm, title: e.target.value })}
                  placeholder="공연 제목을 입력하세요"
                  className="rounded-xl border-white/5 bg-[#1A1A1A] text-white placeholder:text-gray-700"
                />
              </div>

              <div>
                <Label htmlFor="description" className="mb-2 block text-white">
                  공연 소개
                </Label>
                <Textarea
                  id="description"
                  value={performanceForm.description}
                  onChange={(e) => setPerformanceForm({ ...performanceForm, description: e.target.value })}
                  placeholder="공연에 대한 상세 소개를 입력하세요"
                  className="rounded-2xl border-white/5 bg-[#1A1A1A] text-white placeholder:text-gray-700"
                  rows={4}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="mb-2 block text-white">
                    장르 <span className="text-[#FF3B5C]">*</span>
                  </Label>
                  <Select value={performanceForm.genre} onValueChange={(value) => setPerformanceForm({ ...performanceForm, genre: value })}>
                    <SelectTrigger className="rounded-xl border border-white/5 bg-[#1A1A1A] text-white">
                      <SelectValue placeholder="장르 선택" />
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
                  <Label className="mb-2 block text-white">
                    지역 <span className="text-[#FF3B5C]">*</span>
                  </Label>
                  <Select value={performanceForm.region} onValueChange={(value) => setPerformanceForm({ ...performanceForm, region: value })}>
                    <SelectTrigger className="rounded-xl border border-white/5 bg-[#1A1A1A] text-white">
                      <SelectValue placeholder="지역 선택" />
                    </SelectTrigger>
                    <SelectContent className="border border-white/5 bg-[#0F0F0F] text-white">
                      {regionOptions.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="mb-2 block text-white">
                    공연 날짜 <span className="text-[#FF3B5C]">*</span>
                  </Label>
                  <Input
                    type="date"
                    value={performanceForm.date}
                    onChange={(e) => setPerformanceForm({ ...performanceForm, date: e.target.value })}
                    className="rounded-xl border border-white/5 bg-[#1A1A1A] text-white"
                    placeholder="YYYY-MM-DD"
                  />
                </div>
                <div>
                  <Label className="mb-2 block text-white">
                    공연 시간 <span className="text-[#FF3B5C]">*</span>
                  </Label>
                  <Select value={performanceForm.time} onValueChange={(value) => setPerformanceForm({ ...performanceForm, time: value })}>
                    <SelectTrigger className="rounded-xl border border-white/5 bg-[#1A1A1A] text-white">
                      <SelectValue placeholder="시간 선택" />
                    </SelectTrigger>
                    <SelectContent className="max-h-64 border border-white/5 bg-[#0F0F0F] text-white">
                      {timeOptions.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="venue-name" className="mb-2 block text-white">
                  공연장 이름 <span className="text-[#FF3B5C]">*</span>
                </Label>
                <Input
                  id="venue-name"
                  value={performanceForm.venueName}
                  onChange={(e) => setPerformanceForm({ ...performanceForm, venueName: e.target.value })}
                  placeholder="공연장 이름을 입력하세요"
                  className="rounded-xl border-white/5 bg-[#1A1A1A] text-white placeholder:text-gray-700"
                />
              </div>

              <div>
                <Label htmlFor="venue-address" className="mb-2 block text-white">
                  공연장 주소
                </Label>
                <Input
                  id="venue-address"
                  value={performanceForm.venueAddress}
                  onChange={(e) => setPerformanceForm({ ...performanceForm, venueAddress: e.target.value })}
                  placeholder="주소를 입력하세요"
                  className="rounded-xl border-white/5 bg-[#1A1A1A] text-white placeholder:text-gray-700"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="mb-2 block text-white">
                    입장 방식 <span className="text-[#FF3B5C]">*</span>
                  </Label>
                  <Select value={performanceForm.entryType} onValueChange={(value) => setPerformanceForm({ ...performanceForm, entryType: value })}>
                    <SelectTrigger className="rounded-xl border border-white/5 bg-[#1A1A1A] text-white">
                      <SelectValue placeholder="입장 방식 선택" />
                    </SelectTrigger>
                    <SelectContent className="border border-white/5 bg-[#0F0F0F] text-white">
                      {entryTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-2 block text-white">티켓 가격</Label>
                  <Input
                    type="number"
                    min="0"
                    value={performanceForm.price}
                    onChange={(e) => setPerformanceForm({ ...performanceForm, price: e.target.value })}
                    placeholder="가격 입력"
                    className="rounded-xl border-white/5 bg-[#1A1A1A] text-white placeholder:text-gray-700"
                    disabled={performanceForm.isFree}
                  />
                  <label className="mt-2 flex items-center gap-2 text-sm text-gray-400">
                    <Checkbox
                      checked={performanceForm.isFree}
                      onCheckedChange={(checked) => setPerformanceForm({ ...performanceForm, isFree: Boolean(checked), price: checked ? '0' : performanceForm.price })}
                    />
                    무료 공연입니다
                  </label>
                </div>
              </div>

              {performanceForm.entryType !== 'firstcome' && (
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <Label className="mb-2 block text-white">총 좌석 수</Label>
                    <Input
                      type="number"
                      value={performanceForm.totalSeats}
                      onChange={(e) => setPerformanceForm({ ...performanceForm, totalSeats: e.target.value })}
                      className="rounded-xl border-white/5 bg-[#1A1A1A] text-white placeholder:text-gray-700"
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block text-white">좌석 행 수</Label>
                    <Input
                      type="number"
                      value={performanceForm.seatRows}
                      onChange={(e) => setPerformanceForm({ ...performanceForm, seatRows: e.target.value })}
                      className="rounded-xl border-white/5 bg-[#1A1A1A] text-white placeholder:text-gray-700"
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block text-white">좌석 열 수</Label>
                    <Input
                      type="number"
                      value={performanceForm.seatCols}
                      onChange={(e) => setPerformanceForm({ ...performanceForm, seatCols: e.target.value })}
                      className="rounded-xl border-white/5 bg-[#1A1A1A] text-white placeholder:text-gray-700"
                    />
                  </div>
                </div>
              )}

              <div>
                <Label className="mb-2 block text-white">공연 이미지 URL</Label>
                <Input
                  value={performanceForm.imageUrl}
                  onChange={(e) => setPerformanceForm({ ...performanceForm, imageUrl: e.target.value })}
                  placeholder="https://example.com/poster.jpg"
                  className="rounded-xl border-white/5 bg-[#1A1A1A] text-white placeholder:text-gray-700"
                />
                <p className="mt-2 text-xs text-gray-500">이미지 주소를 입력하면 포스터가 함께 등록됩니다.</p>
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-400">
                <Checkbox checked={performanceForm.dyveBookable} onCheckedChange={(checked) => setPerformanceForm({ ...performanceForm, dyveBookable: Boolean(checked) })} />
                DYVE 예약을 받을 수 있어요
              </label>

              <Button type="submit" disabled={submitting} className="w-full rounded-2xl bg-[#FF2E2E] py-4 text-lg font-bold text-white transition hover:bg-[#cc2525]">
                {submitting ? '등록 중...' : '공연 등록하기'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="space">
            <form onSubmit={handleSpaceSubmit} className="space-y-5">
              <div>
                <Label htmlFor="space-name" className="mb-2 block text-white">
                  공간명 <span className="text-[#FF3B5C]">*</span>
                </Label>
                <Input
                  id="space-name"
                  value={spaceForm.name}
                  onChange={(e) => setSpaceForm({ ...spaceForm, name: e.target.value })}
                  placeholder="공간 이름을 입력하세요"
                  className="rounded-xl border-white/5 bg-[#1A1A1A] text-white placeholder:text-gray-700"
                />
              </div>

              <div>
                <Label className="mb-2 block text-white">카테고리</Label>
                <Select value={spaceForm.category} onValueChange={(value) => setSpaceForm({ ...spaceForm, category: value })}>
                  <SelectTrigger className="rounded-xl border-white/5 bg-[#1A1A1A] text-white">
                    <SelectValue placeholder="카테고리를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent className="border border-white/5 bg-[#0F0F0F] text-white">
                    {spaceCategoryOptions.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="space-genres" className="mb-2 block text-white">
                  장르
                </Label>
                <Input
                  id="space-genres"
                  value={spaceForm.genres}
                  onChange={(e) => setSpaceForm({ ...spaceForm, genres: e.target.value })}
                  placeholder="예: 재즈, 락"
                  className="rounded-xl border-white/5 bg-[#1A1A1A] text-white placeholder:text-gray-700"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="mb-2 block text-white">
                    지역 <span className="text-[#FF3B5C]">*</span>
                  </Label>
                  <Select value={spaceForm.region} onValueChange={(value) => setSpaceForm({ ...spaceForm, region: value })}>
                    <SelectTrigger className="rounded-xl border-white/5 bg-[#1A1A1A] text-white">
                      <SelectValue placeholder="지역 선택" />
                    </SelectTrigger>
                    <SelectContent className="border border-white/5 bg-[#0F0F0F] text-white">
                      {regionOptions.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="space-address" className="mb-2 block text-white">
                    주소 <span className="text-[#FF3B5C]">*</span>
                  </Label>
                  <Input
                    id="space-address"
                    value={spaceForm.address}
                    onChange={(e) => setSpaceForm({ ...spaceForm, address: e.target.value })}
                    placeholder="주소를 입력하세요"
                    className="rounded-xl border-white/5 bg-[#1A1A1A] text-white placeholder:text-gray-700"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="space-capacity" className="mb-2 block text-white">
                  수용 인원 <span className="text-[#FF3B5C]">*</span>
                </Label>
                <Input
                  id="space-capacity"
                  type="number"
                  min="1"
                  value={spaceForm.capacity}
                  onChange={(e) => setSpaceForm({ ...spaceForm, capacity: e.target.value })}
                  placeholder="최대 수용 인원"
                  className="rounded-xl border-white/5 bg-[#1A1A1A] text-white placeholder:text-gray-700"
                />
              </div>

              <div>
                <Label htmlFor="space-description" className="mb-2 block text-white">
                  공간 소개
                </Label>
                <Textarea
                  id="space-description"
                  value={spaceForm.description}
                  onChange={(e) => setSpaceForm({ ...spaceForm, description: e.target.value })}
                  placeholder="공간에 대한 설명을 입력하세요"
                  className="rounded-2xl border-white/5 bg-[#1A1A1A] text-white placeholder:text-gray-700"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="space-equipment" className="mb-2 block text-white">
                  보유 장비
                </Label>
                <Textarea
                  id="space-equipment"
                  value={spaceForm.equipments}
                  onChange={(e) => setSpaceForm({ ...spaceForm, equipments: e.target.value })}
                  placeholder="제공 가능한 장비를 입력하세요"
                  className="rounded-2xl border-white/5 bg-[#1A1A1A] text-white placeholder:text-gray-700"
                  rows={3}
                />
              </div>

              <div>
                <Label className="mb-2 block text-white">공간 이미지 URL</Label>
                <Input
                  value={spaceForm.imageUrl}
                  onChange={(e) => setSpaceForm({ ...spaceForm, imageUrl: e.target.value })}
                  placeholder="https://example.com/space.jpg"
                  className="rounded-xl border-white/5 bg-[#1A1A1A] text-white placeholder:text-gray-700"
                />
              </div>

              <div>
                <Label htmlFor="space-phone" className="mb-2 block text-white">
                  연락처
                </Label>
                <Input
                  id="space-phone"
                  value={spaceForm.phone}
                  onChange={(e) => setSpaceForm({ ...spaceForm, phone: e.target.value })}
                  placeholder="010-0000-0000"
                  className="rounded-xl border-white/5 bg-[#1A1A1A] text-white placeholder:text-gray-700"
                />
              </div>

              <Button type="submit" disabled={spaceSubmitting} className="w-full rounded-2xl bg-[#FF2E2E] py-4 text-lg font-bold text-white transition hover:bg-[#cc2525]">
                {spaceSubmitting ? '등록 중...' : '공간 등록하기'}
              </Button>
            </form>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
