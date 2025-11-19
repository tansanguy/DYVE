import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Instagram, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '../dyve-figma/components/ui/input';
import { Textarea } from '../dyve-figma/components/ui/textarea';
import { Button } from '../dyve-figma/components/ui/button';
import { Checkbox } from '../dyve-figma/components/ui/checkbox';
import { Label } from '../dyve-figma/components/ui/label';
import { Calendar } from '../dyve-figma/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../dyve-figma/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../dyve-figma/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../dyve-figma/components/ui/dialog';
import { createEvent } from '../api/management';

const genres = ['Jazz', 'Rock', 'Electronic', 'Hip-Hop', 'Indie', '디제잉', '북토크', '스탠드업 코미디', '클래식', 'R&B'];
const regions = ['서울', '경기', '인천', '강원', '충청', '전라', '경상', '제주'];
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

export default function CreateEventPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    date: undefined as Date | undefined,
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
    imageFile: null as File | null,
    dyveBookable: true,
  });
  const [instagramUrl, setInstagramUrl] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleInstagramImport = () => {
    if (!instagramUrl.trim()) {
      toast.error('인스타그램 게시물 URL을 입력해주세요');
      return;
    }
    toast.success('인스타그램 게시물을 가져왔습니다!');
    setFormData((prev) => ({
      ...prev,
      description: '인스타그램에서 가져온 공연 설명입니다.\n\n📅 날짜와 시간을 확인해주세요\n🎵 장르와 장소 정보를 입력해주세요',
    }));
    setInstagramUrl('');
    setIsDialogOpen(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('이미지 크기는 5MB 이하여야 합니다');
      return;
    }
    setFormData((prev) => ({ ...prev, imageFile: file }));
    toast.success('이미지가 선택되었습니다');
  };

  const formatDateLabel = (date?: Date) => {
    if (!date) return '날짜 선택';
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.title || !formData.genre || !formData.date || !formData.time || !formData.venueName || !formData.region || !formData.entryType) {
      toast.error('필수 항목을 모두 입력해주세요');
      return;
    }

    if (formData.entryType !== 'firstcome' && !formData.totalSeats) {
      toast.error('좌석 수를 입력해주세요');
      return;
    }

    setSubmitting(true);
    try {
      await createEvent(
        {
          title: formData.title,
          description: formData.description,
          genre: formData.genre,
          date: formData.date.toISOString().split('T')[0],
          time: formData.time,
          venue_name: formData.venueName,
          address: formData.venueAddress,
          region: formData.region,
          price: formData.isFree ? 0 : Number(formData.price || 0),
          is_free: formData.isFree,
          entry_type: formData.entryType,
          total_seats: formData.totalSeats ? Number(formData.totalSeats) : undefined,
          seat_rows: formData.seatRows ? Number(formData.seatRows) : undefined,
          seat_cols: formData.seatCols ? Number(formData.seatCols) : undefined,
          allow_dyve_reservation: formData.dyveBookable,
        },
        formData.imageFile,
      );
      toast.success('공연이 등록되었습니다!');
      setTimeout(() => navigate('/events'), 1200);
    } catch (error) {
      console.error('공연 등록 실패', error);
      toast.error('공연 등록을 완료하지 못했습니다. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pb-20">
      <div className="bg-black sticky top-0 z-40 border-b border-white/10">
        <div className="px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-white hover:text-[#FF3B5C] transition" type="button">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-white font-extrabold">공연 등록</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition text-sm font-semibold" type="button">
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
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-8 max-w-2xl mx-auto">
        <div className="space-y-5">
          <div>
            <Label htmlFor="title" className="text-white mb-2 block">
              공연 제목 <span className="text-[#FF3B5C]">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="공연 제목을 입력하세요"
              className="bg-[#1A1A1A] border-white/5 text-white placeholder:text-gray-700 rounded-xl"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-white mb-2 block">공연 소개</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="공연에 대한 상세 소개를 입력하세요"
              className="bg-[#1A1A1A] border-white/5 text-white placeholder:text-gray-700 rounded-2xl"
              rows={4}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-white mb-2 block">장르 <span className="text-[#FF3B5C]">*</span></Label>
              <Select value={formData.genre} onValueChange={(value) => setFormData({ ...formData, genre: value })}>
                <SelectTrigger className="bg-[#1A1A1A] border-white/5 text-white rounded-xl">
                  <SelectValue placeholder="장르 선택" />
                </SelectTrigger>
                <SelectContent className="bg-[#0F0F0F] border-white/5 text-white">
                  {genres.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-white mb-2 block">지역 <span className="text-[#FF3B5C]">*</span></Label>
              <Select value={formData.region} onValueChange={(value) => setFormData({ ...formData, region: value })}>
                <SelectTrigger className="bg-[#1A1A1A] border-white/5 text-white rounded-xl">
                  <SelectValue placeholder="지역 선택" />
                </SelectTrigger>
                <SelectContent className="bg-[#0F0F0F] border-white/5 text-white">
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-white mb-2 block">공연 날짜 <span className="text-[#FF3B5C]">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl py-3 text-left px-4 text-white"
                  >
                    {formatDateLabel(formData.date)}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="bg-[#1A1A1A] border-white/10 p-2">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => setFormData({ ...formData, date: date ?? formData.date })}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label className="text-white mb-2 block">공연 시간 <span className="text-[#FF3B5C]">*</span></Label>
              <Select value={formData.time} onValueChange={(value) => setFormData({ ...formData, time: value })}>
                <SelectTrigger className="bg-[#1A1A1A] border-white/5 text-white rounded-xl">
                  <SelectValue placeholder="시간 선택" />
                </SelectTrigger>
                <SelectContent className="bg-[#0F0F0F] border-white/5 text-white max-h-64">
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
            <Label htmlFor="venue-name" className="text-white mb-2 block">공연장 이름 <span className="text-[#FF3B5C]">*</span></Label>
            <Input
              id="venue-name"
              value={formData.venueName}
              onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
              placeholder="공연장 이름을 입력하세요"
              className="bg-[#1A1A1A] border-white/5 text-white placeholder:text-gray-700 rounded-xl"
            />
          </div>

          <div>
            <Label htmlFor="venue-address" className="text-white mb-2 block">공연장 주소</Label>
            <Input
              id="venue-address"
              value={formData.venueAddress}
              onChange={(e) => setFormData({ ...formData, venueAddress: e.target.value })}
              placeholder="주소를 입력하세요"
              className="bg-[#1A1A1A] border-white/5 text-white placeholder:text-gray-700 rounded-xl"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-white mb-2 block">입장 방식 <span className="text-[#FF3B5C]">*</span></Label>
              <Select value={formData.entryType} onValueChange={(value) => setFormData({ ...formData, entryType: value })}>
                <SelectTrigger className="bg-[#1A1A1A] border-white/5 text-white rounded-xl">
                  <SelectValue placeholder="입장 방식 선택" />
                </SelectTrigger>
                <SelectContent className="bg-[#0F0F0F] border-white/5 text-white">
                  {entryTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-white mb-2 block">티켓 가격</Label>
              <Input
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="가격 입력"
                className="bg-[#1A1A1A] border-white/5 text-white placeholder:text-gray-700 rounded-xl"
                disabled={formData.isFree}
              />
              <label className="mt-2 flex items-center gap-2 text-sm text-gray-400">
                <Checkbox checked={formData.isFree} onCheckedChange={(checked) => setFormData({ ...formData, isFree: Boolean(checked), price: checked ? '0' : formData.price })} />
                무료 공연입니다
              </label>
            </div>
          </div>

          {formData.entryType !== 'firstcome' && (
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <Label className="text-white mb-2 block">총 좌석 수</Label>
                <Input
                  type="number"
                  value={formData.totalSeats}
                  onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })}
                  className="bg-[#1A1A1A] border-white/5 text-white placeholder:text-gray-700 rounded-xl"
                />
              </div>
              <div>
                <Label className="text-white mb-2 block">좌석 행 수</Label>
                <Input
                  type="number"
                  value={formData.seatRows}
                  onChange={(e) => setFormData({ ...formData, seatRows: e.target.value })}
                  className="bg-[#1A1A1A] border-white/5 text-white placeholder:text-gray-700 rounded-xl"
                />
              </div>
              <div>
                <Label className="text-white mb-2 block">좌석 열 수</Label>
                <Input
                  type="number"
                  value={formData.seatCols}
                  onChange={(e) => setFormData({ ...formData, seatCols: e.target.value })}
                  className="bg-[#1A1A1A] border-white/5 text-white placeholder:text-gray-700 rounded-xl"
                />
              </div>
            </div>
          )}

          <div>
            <Label className="text-white mb-2 block">공연 이미지</Label>
            {formData.imageFile ? (
              <div className="relative inline-block">
                <img src={URL.createObjectURL(formData.imageFile)} alt="업로드 이미지" className="h-40 w-40 rounded-2xl border border-white/10 object-cover" />
                <button type="button" onClick={() => setFormData({ ...formData, imageFile: null })} className="absolute -right-2 -top-2 rounded-full bg-black/80 p-1 text-white">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-[#FF3B5C] transition cursor-pointer bg-[#1A1A1A] flex flex-col items-center gap-2">
                <Upload size={32} className="text-gray-600" />
                <p className="text-gray-600 text-sm">클릭하여 이미지 업로드</p>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-400">
            <Checkbox checked={formData.dyveBookable} onCheckedChange={(checked) => setFormData({ ...formData, dyveBookable: Boolean(checked) })} />
            DYVE 예약을 받을 수 있어요
          </label>

          <Button type="submit" disabled={submitting} className="w-full bg-[#FF2E2E] text-white py-4 rounded-2xl hover:bg-[#cc2525] transition font-bold text-lg">
            {submitting ? '등록 중...' : '공연 등록하기'}
          </Button>
        </div>
      </form>
    </div>
  );
}
