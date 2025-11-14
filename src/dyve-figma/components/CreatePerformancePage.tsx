import { Screen } from '../App';
import { useState } from 'react';
import { ArrowLeft, Instagram, Upload, X } from 'lucide-react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { toast } from 'sonner';

interface CreatePerformancePageProps {
  navigate: (screen: Screen) => void;
}

const genres = ['Jazz', 'Rock', 'Electronic', 'Hip-Hop', 'Indie', '디제잉', '북토크', '스탠드업 코미디', '클래식', 'R&B'];
const regions = ['서울', '경기', '인천', '강원', '충청', '전라', '경상', '제주'];
const entryTypes = [
  { value: 'standing', label: '스탠딩 입장번호' },
  { value: 'seat', label: '지정좌석' },
  { value: 'firstcome', label: '선착순 입장' }
];

// 시간 선택 옵션 생성 (00:00 ~ 23:30, 30분 간격)
const generateTimeOptions = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let min of [0, 30]) {
      const h = hour.toString().padStart(2, '0');
      const m = min.toString().padStart(2, '0');
      times.push(`${h}:${m}`);
    }
  }
  return times;
};

const timeOptions = generateTimeOptions();

export default function CreatePerformancePage({ navigate }: CreatePerformancePageProps) {
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

  const handleInstagramImport = () => {
    if (!instagramUrl) {
      toast.error('인스타그램 게시물 URL을 입력해주세요');
      return;
    }

    // 여기서는 임시로 모의 데이터를 사용
    // 실제로는 Instagram API 또는 스크래핑을 통해 데이터를 가져와야 합니다
    toast.success('인스타그램 게시물을 가져왔습니다!');
    
    // 예시 데이터 설정
    setFormData({
      ...formData,
      description: '인스타그램에서 가져온 공연 설명입니다.\n\n📅 날짜와 시간을 확인해주세요\n🎵 장르와 장소 정보를 입력해주세요'
    });
    
    setIsDialogOpen(false);
    setInstagramUrl('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('이미지 크기는 5MB 이하여야 합니다');
        return;
      }
      setFormData({ ...formData, imageFile: file });
      toast.success('이미지가 선택되었습니다');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 필수 필드 검증
    if (!formData.title || !formData.genre || !formData.date || !formData.time || 
        !formData.venueName || !formData.region || !formData.entryType) {
      toast.error('필수 항목을 모두 입력해주세요');
      return;
    }

    if (formData.entryType !== 'firstcome' && !formData.totalSeats) {
      toast.error('좌석 수를 입력해주세요');
      return;
    }

    toast.success('공연이 등록되었습니다!');
    setTimeout(() => {
      navigate('explore');
    }, 1500);
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return '날짜 선택';
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="min-h-screen bg-black pb-20">
      {/* Header */}
      <div className="bg-black sticky top-0 z-40 border-b border-white/10">
        <div className="px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('explore')}
            className="text-white hover:text-[#FF3B5C] transition"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-white font-extrabold">공연 등록</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition text-sm font-semibold">
                <Instagram size={16} />
                인스타그램에서 가져오기
              </button>
            </DialogTrigger>
            <DialogContent className="bg-[#1A1A1A] border-white/10">
              <DialogHeader>
                <DialogTitle className="text-white">인스타그램에서 가져오기</DialogTitle>
                <DialogDescription className="text-gray-400">
                  공연 게시물의 URL을 입력하면 사진과 설명을 자동으로 가져옵니다
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Input
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="https://www.instagram.com/p/..."
                  className="bg-black border-white/10 text-white placeholder:text-gray-600"
                />
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1 bg-transparent border-white/10 text-white hover:bg-white/5"
                  >
                    취소
                  </Button>
                  <Button
                    type="button"
                    onClick={handleInstagramImport}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90"
                  >
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
          {/* 공연 제목 */}
          <div>
            <Label htmlFor="title" className="text-white mb-2 block">
              공연 제목 <span className="text-[#FF3B5C]">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="공연 제목을 입력하세요"
              className="bg-[#1A1A1A] border-white/10 text-white placeholder:text-gray-600"
            />
          </div>

          {/* 공연 설명 */}
          <div>
            <Label htmlFor="description" className="text-white mb-2 block">
              공연 설명
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="공연에 대한 설명을 입력하세요"
              className="bg-[#1A1A1A] border-white/10 text-white placeholder:text-gray-600 min-h-[80px]"
            />
          </div>

          {/* 장르 & 지역 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="genre" className="text-white mb-2 block">
                장르 <span className="text-[#FF3B5C]">*</span>
              </Label>
              <Select value={formData.genre} onValueChange={(value) => setFormData({ ...formData, genre: value })}>
                <SelectTrigger className="bg-[#1A1A1A] border-white/10 text-white">
                  <SelectValue placeholder="선택" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1A1A] border-white/10">
                  {genres.map((genre) => (
                    <SelectItem key={genre} value={genre} className="text-white focus:bg-[#FF3B5C] focus:text-white">
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="region" className="text-white mb-2 block">
                지역 <span className="text-[#FF3B5C]">*</span>
              </Label>
              <Select value={formData.region} onValueChange={(value) => setFormData({ ...formData, region: value })}>
                <SelectTrigger className="bg-[#1A1A1A] border-white/10 text-white">
                  <SelectValue placeholder="선택" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1A1A] border-white/10">
                  {regions.map((region) => (
                    <SelectItem key={region} value={region} className="text-white focus:bg-[#FF3B5C] focus:text-white">
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 날짜 & 시간 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white mb-2 block">
                날짜 <span className="text-[#FF3B5C]">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full bg-[#1A1A1A] border-white/10 text-white hover:bg-[#1A1A1A] hover:text-white justify-start"
                  >
                    {formatDate(formData.date)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-[#1A1A1A] border-white/10" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => setFormData({ ...formData, date })}
                    initialFocus
                    className="text-white"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="time" className="text-white mb-2 block">
                시간 <span className="text-[#FF3B5C]">*</span>
              </Label>
              <Select value={formData.time} onValueChange={(value) => setFormData({ ...formData, time: value })}>
                <SelectTrigger className="bg-[#1A1A1A] border-white/10 text-white">
                  <SelectValue placeholder="선택" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1A1A] border-white/10 max-h-[200px]">
                  {timeOptions.map((time) => (
                    <SelectItem key={time} value={time} className="text-white focus:bg-[#FF3B5C] focus:text-white">
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 장소명 */}
          <div>
            <Label htmlFor="venueName" className="text-white mb-2 block">
              장소명 <span className="text-[#FF3B5C]">*</span>
            </Label>
            <Input
              id="venueName"
              value={formData.venueName}
              onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
              placeholder="공연 장소 이름"
              className="bg-[#1A1A1A] border-white/10 text-white placeholder:text-gray-600"
            />
          </div>

          {/* 주소 */}
          <div>
            <Label htmlFor="venueAddress" className="text-white mb-2 block">
              주소
            </Label>
            <Input
              id="venueAddress"
              value={formData.venueAddress}
              onChange={(e) => setFormData({ ...formData, venueAddress: e.target.value })}
              placeholder="상세 주소"
              className="bg-[#1A1A1A] border-white/10 text-white placeholder:text-gray-600"
            />
          </div>

          {/* 가격 */}
          <div>
            <Label htmlFor="price" className="text-white mb-2 block">
              가격 (원)
            </Label>
            <Input
              id="price"
              type="text"
              value={formData.isFree ? '0' : formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value.replace(/[^0-9]/g, '') })}
              placeholder="10000"
              disabled={formData.isFree}
              className="bg-[#1A1A1A] border-white/10 text-white placeholder:text-gray-600 disabled:opacity-50"
            />
            <div className="flex items-center gap-3 mt-3">
              <Checkbox
                id="isFree"
                checked={formData.isFree}
                onCheckedChange={(checked) => setFormData({ ...formData, isFree: !!checked, price: checked ? '0' : '' })}
                className="border-gray-600 data-[state=checked]:bg-[#FF3B5C] data-[state=checked]:border-[#FF3B5C]"
              />
              <Label htmlFor="isFree" className="text-gray-400 cursor-pointer">
                무료공연
              </Label>
            </div>
          </div>

          {/* 입장 방식 */}
          <div>
            <Label htmlFor="entryType" className="text-white mb-2 block">
              입장 방식 <span className="text-[#FF3B5C]">*</span>
            </Label>
            <Select value={formData.entryType} onValueChange={(value) => setFormData({ ...formData, entryType: value })}>
              <SelectTrigger className="bg-[#1A1A1A] border-white/10 text-white">
                <SelectValue placeholder="선택" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A1A] border-white/10">
                {entryTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value} className="text-white focus:bg-[#FF3B5C] focus:text-white">
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 좌석 수 */}
          {formData.entryType !== 'firstcome' && formData.entryType && (
            <div>
              <Label htmlFor="totalSeats" className="text-white mb-2 block">
                {formData.entryType === 'seat' ? '좌석 수' : '입장 인원'} <span className="text-[#FF3B5C]">*</span>
              </Label>
              <Input
                id="totalSeats"
                type="text"
                value={formData.totalSeats}
                onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value.replace(/[^0-9]/g, '') })}
                placeholder="50"
                className="bg-[#1A1A1A] border-white/10 text-white placeholder:text-gray-600"
              />
            </div>
          )}

          {/* 좌석 배치 (지정좌석만) */}
          {formData.entryType === 'seat' && (
            <div>
              <Label className="text-white mb-2 block">
                좌석 배치
              </Label>
              <p className="text-gray-500 text-xs mb-3">행(세로) x 열(가로) 형태로 좌석을 배치합니다</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    type="text"
                    value={formData.seatRows}
                    onChange={(e) => setFormData({ ...formData, seatRows: e.target.value.replace(/[^0-9]/g, '') })}
                    placeholder="행 (예: 4)"
                    className="bg-[#1A1A1A] border-white/10 text-white placeholder:text-gray-600"
                  />
                </div>
                <div>
                  <Input
                    type="text"
                    value={formData.seatCols}
                    onChange={(e) => setFormData({ ...formData, seatCols: e.target.value.replace(/[^0-9]/g, '') })}
                    placeholder="열 (예: 6)"
                    className="bg-[#1A1A1A] border-white/10 text-white placeholder:text-gray-600"
                  />
                </div>
              </div>
              {formData.seatRows && formData.seatCols && (
                <p className="text-gray-400 text-sm mt-2">
                  {formData.seatRows} x {formData.seatCols} = {parseInt(formData.seatRows) * parseInt(formData.seatCols)}석
                </p>
              )}
            </div>
          )}

          {/* 입장 정원 (선착순만) */}
          {formData.entryType === 'firstcome' && (
            <div>
              <Label htmlFor="totalCapacity" className="text-white mb-2 block">
                입장 정원
              </Label>
              <Input
                id="totalCapacity"
                type="text"
                value={formData.totalSeats}
                onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value.replace(/[^0-9]/g, '') })}
                placeholder="최대 수용 인원 (예: 100)"
                className="bg-[#1A1A1A] border-white/10 text-white placeholder:text-gray-600"
              />
            </div>
          )}

          {/* 이미지 업로드 */}
          <div>
            <Label className="text-white mb-2 block">
              공연 이미지
            </Label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label
                htmlFor="imageUpload"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#1A1A1A] border border-white/10 text-white rounded-lg cursor-pointer hover:bg-[#252525] transition"
              >
                <Upload size={18} />
                <span className="text-sm">{formData.imageFile ? formData.imageFile.name : '이미지 업로드'}</span>
              </label>
              {formData.imageFile && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, imageFile: null })}
                  className="p-3 bg-[#1A1A1A] border border-white/10 text-white rounded-lg hover:bg-[#252525] transition"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            <p className="text-gray-500 text-xs mt-1.5">최대 5MB, JPG/PNG 형식</p>
          </div>

          {/* DYVE 예약 허용 */}
          <div className="flex items-center gap-3 pt-2">
            <Checkbox
              id="dyveBookable"
              checked={formData.dyveBookable}
              onCheckedChange={(checked) => setFormData({ ...formData, dyveBookable: !!checked })}
              className="border-gray-600 data-[state=checked]:bg-[#FF3B5C] data-[state=checked]:border-[#FF3B5C]"
            />
            <Label htmlFor="dyveBookable" className="text-white cursor-pointer">
              DYVE를 통한 예약 허용
            </Label>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="grid grid-cols-2 gap-4 pt-6">
          <Button
            type="button"
            onClick={() => navigate('explore')}
            variant="outline"
            className="flex-1 bg-transparent border-white/10 text-white hover:bg-white/5"
          >
            취소
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-[#FF3B5C] text-white hover:bg-[#d43550] font-bold"
          >
            등록하기
          </Button>
        </div>
      </form>
    </div>
  );
}
