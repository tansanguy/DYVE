import { Screen } from '../App';
import { ArrowLeft, Upload } from 'lucide-react';
import { useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';

interface RegistrationPageProps {
  navigate: (screen: Screen) => void;
}

export default function RegistrationPage({ navigate }: RegistrationPageProps) {
  const [activeTab, setActiveTab] = useState('artist');

  const handleSubmit = () => {
    toast.success('등록이 완료되었습니다!');
    setTimeout(() => navigate('home'), 1500);
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="bg-black sticky top-0 z-40 border-b border-white/10">
        <div className="px-6 py-4 flex items-center gap-4">
          <button onClick={() => navigate('login')} className="text-white">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-white text-xl font-extrabold">등록하기</h1>
        </div>
      </div>

      <div className="px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full bg-[#1A1A1A] border border-white/5 mb-6">
            <TabsTrigger 
              value="artist" 
              className="flex-1 data-[state=active]:bg-[#FF2E2E] data-[state=active]:text-white font-semibold"
            >
              아티스트
            </TabsTrigger>
            <TabsTrigger 
              value="space"
              className="flex-1 data-[state=active]:bg-[#FF2E2E] data-[state=active]:text-white font-semibold"
            >
              공간
            </TabsTrigger>
          </TabsList>

          <TabsContent value="artist" className="space-y-6">
            <div>
              <Label htmlFor="artist-name" className="text-white mb-2 block font-bold">아티스트명</Label>
              <Input 
                id="artist-name"
                placeholder="활동명을 입력하세요"
                className="bg-[#1A1A1A] border-white/5 text-white placeholder:text-gray-700 rounded-xl"
              />
            </div>

            <div>
              <Label htmlFor="genre" className="text-white mb-2 block font-bold">장르</Label>
              <Input 
                id="genre"
                placeholder="예: Rock, Jazz, Electronic"
                className="bg-[#1A1A1A] border-white/5 text-white placeholder:text-gray-700 rounded-xl"
              />
            </div>

            <div>
              <Label htmlFor="equipment" className="text-white mb-2 block font-bold">보유 장비</Label>
              <Textarea 
                id="equipment"
                placeholder="보유하고 있는 장비를 입력하세요"
                className="bg-[#1A1A1A] border-white/5 text-white placeholder:text-gray-700 rounded-xl"
              />
            </div>

            <div>
              <Label htmlFor="portfolio" className="text-white mb-2 block font-bold">포트폴리오 링크</Label>
              <Input 
                id="portfolio"
                placeholder="SoundCloud, YouTube 등"
                className="bg-[#1A1A1A] border-white/5 text-white placeholder:text-gray-700 rounded-xl"
              />
            </div>

            <div>
              <Label className="text-white mb-2 block font-bold">프로필 이미지</Label>
              <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-[#FF2E2E] transition cursor-pointer bg-[#1A1A1A]">
                <Upload size={32} className="text-gray-600 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">클릭하여 이미지 업로드</p>
              </div>
            </div>

            <button 
              onClick={handleSubmit}
              className="w-full bg-[#FF2E2E] text-white py-4 rounded-2xl hover:bg-[#cc2525] transition font-bold text-lg flex items-center justify-center"
            >
              아티스트 등록하기
            </button>
          </TabsContent>

          <TabsContent value="space" className="space-y-6">
            <div>
              <Label htmlFor="space-name" className="text-white mb-2 block font-bold">공간명</Label>
              <Input 
                id="space-name"
                placeholder="공간 이름을 입력하세요"
                className="bg-[#1A1A1A] border-white/5 text-white placeholder:text-gray-700 rounded-xl"
              />
            </div>

            <div>
              <Label htmlFor="location" className="text-white mb-2 block font-bold">위치</Label>
              <Input 
                id="location"
                placeholder="주소를 입력하세요"
                className="bg-[#1A1A1A] border-white/5 text-white placeholder:text-gray-700 rounded-xl"
              />
            </div>

            <div>
              <Label htmlFor="capacity" className="text-white mb-2 block font-bold">수용 인원</Label>
              <Input 
                id="capacity"
                type="number"
                placeholder="최대 수용 인원"
                className="bg-[#1A1A1A] border-white/5 text-white placeholder:text-gray-700 rounded-xl"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-white mb-2 block font-bold">공간 소개</Label>
              <Textarea 
                id="description"
                placeholder="공간에 대한 설명을 입력하세요"
                className="bg-[#1A1A1A] border-white/5 text-white placeholder:text-gray-700 rounded-xl"
              />
            </div>

            <div>
              <Label htmlFor="space-equipment" className="text-white mb-2 block font-bold">보유 장비</Label>
              <Textarea 
                id="space-equipment"
                placeholder="제공 가능한 장비를 입력하세요"
                className="bg-[#1A1A1A] border-white/5 text-white placeholder:text-gray-700 rounded-xl"
              />
            </div>

            <div>
              <Label className="text-white mb-2 block font-bold">공간 이미지</Label>
              <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-[#FF2E2E] transition cursor-pointer bg-[#1A1A1A]">
                <Upload size={32} className="text-gray-600 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">클릭하여 이미지 업로드</p>
              </div>
            </div>

            <button 
              onClick={handleSubmit}
              className="w-full bg-[#FF2E2E] text-white py-4 rounded-2xl hover:bg-[#cc2525] transition font-bold text-lg flex items-center justify-center"
            >
              공간 등록하기
            </button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
