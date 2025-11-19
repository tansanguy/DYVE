import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '../dyve-figma/components/ui/input';
import { Label } from '../dyve-figma/components/ui/label';
import { Textarea } from '../dyve-figma/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../dyve-figma/components/ui/tabs';
import { createSpace } from '../api/management';

export default function CreateSpacePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: '',
    description: '',
    equipment: '',
    imageFile: null as File | null,
  });
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.name || !formData.location || !formData.capacity) {
      toast.error('필수 항목을 모두 입력해주세요');
      return;
    }
    setSubmitting(true);
    try {
      await createSpace(
        {
          name: formData.name,
          location: formData.location,
          capacity: Number(formData.capacity),
          description: formData.description,
          equipment: formData.equipment,
        },
        formData.imageFile,
      );
      toast.success('공간 등록이 완료되었습니다!');
      setTimeout(() => navigate('/events'), 1200);
    } catch (error) {
      console.error('공간 등록 실패', error);
      toast.error('공간 등록을 완료하지 못했습니다. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTabChange = (value: string) => {
    if (value === 'artist') {
      navigate('/events/create');
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="bg-black sticky top-0 z-40 border-b border-white/10">
        <div className="px-6 py-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-white" type="button">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-white text-xl font-extrabold">등록하기</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-8">
        <Tabs value="space" onValueChange={handleTabChange} className="w-full">
          <TabsList className="w-full bg-[#1A1A1A] border border-white/5 mb-6">
            <TabsTrigger value="artist" className="flex-1 data-[state=active]:bg-[#FF2E2E] data-[state=active]:text-white font-semibold">
              아티스트
            </TabsTrigger>
            <TabsTrigger value="space" className="flex-1 data-[state=active]:bg-[#FF2E2E] data-[state=active]:text-white font-semibold">
              공간
            </TabsTrigger>
          </TabsList>

          <TabsContent value="space" className="space-y-6">
            <div>
              <Label htmlFor="space-name" className="text-white mb-2 block font-bold">공간명</Label>
              <Input
                id="space-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="공간 이름을 입력하세요"
                className="bg-[#1A1A1A] border-white/5 text-white placeholder:text-gray-700 rounded-xl"
              />
            </div>

            <div>
              <Label htmlFor="location" className="text-white mb-2 block font-bold">위치</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="주소를 입력하세요"
                className="bg-[#1A1A1A] border-white/5 text-white placeholder:text-gray-700 rounded-xl"
              />
            </div>

            <div>
              <Label htmlFor="capacity" className="text-white mb-2 block font-bold">수용 인원</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                placeholder="최대 수용 인원"
                className="bg-[#1A1A1A] border-white/5 text-white placeholder:text-gray-700 rounded-xl"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-white mb-2 block font-bold">공간 소개</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="공간에 대한 설명을 입력하세요"
                className="bg-[#1A1A1A] border-white/5 text-white placeholder:text-gray-700 rounded-xl"
              />
            </div>

            <div>
              <Label htmlFor="equipment" className="text-white mb-2 block font-bold">보유 장비</Label>
              <Textarea
                id="equipment"
                value={formData.equipment}
                onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                placeholder="제공 가능한 장비를 입력하세요"
                className="bg-[#1A1A1A] border-white/5 text-white placeholder:text-gray-700 rounded-xl"
              />
            </div>

            <div>
              <Label className="text-white mb-2 block font-bold">공간 이미지</Label>
              <label className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-[#FF2E2E] transition cursor-pointer bg-[#1A1A1A] flex flex-col items-center gap-2">
                <Upload size={32} className="text-gray-600" />
                <p className="text-gray-600 text-sm">클릭하여 이미지 업로드</p>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#FF2E2E] text-white py-4 rounded-2xl hover:bg-[#cc2525] transition font-bold text-lg flex items-center justify-center"
            >
              {submitting ? '등록 중...' : '공간 등록하기'}
            </button>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
}
