import { Screen } from '../App';
import { ArrowLeft, Mail, MessageCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

interface SupportPageProps {
  navigate: (screen: Screen) => void;
}

export default function SupportPage({ navigate }: SupportPageProps) {
  return (
    <div className="min-h-screen bg-black">
      <div className="bg-black sticky top-0 z-40 border-b border-white/10">
        <div className="px-6 py-4 flex items-center gap-4">
          <button onClick={() => navigate('home')} className="text-white">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-white text-xl font-extrabold">고객 지원</h1>
        </div>
      </div>

      <div className="px-6 py-8">
        {/* FAQ */}
        <div className="mb-8">
          <h2 className="text-white text-xl mb-4 font-bold">자주 묻는 질문</h2>
          
          <Accordion type="single" collapsible className="space-y-3">
            <AccordionItem 
              value="item-1" 
              className="bg-[#1A1A1A] rounded-2xl border border-white/5 px-6"
            >
              <AccordionTrigger className="text-white hover:text-[#FF2E2E] transition font-semibold">
                예매는 어떻게 하나요?
              </AccordionTrigger>
              <AccordionContent className="text-gray-500">
                공연 탐색 메뉴에서 원하는 공연을 선택한 후 'DYVE로 예매하기' 버튼을 클릭하세요. 
                입장 방식을 선택하고 결제를 완료하면 예매가 완료됩니다.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem 
              value="item-2"
              className="bg-[#1A1A1A] rounded-2xl border border-white/5 px-6"
            >
              <AccordionTrigger className="text-white hover:text-[#FF2E2E] transition font-semibold">
                제안서는 어떻게 보내나요?
              </AccordionTrigger>
              <AccordionContent className="text-gray-500">
                협업 제안 메뉴에서 아티스트 또는 공간을 선택한 후 '제안서 보내기' 버튼을 클릭하세요. 
                협업 내용을 작성하여 전송하면 상대방에게 전달됩니다.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem 
              value="item-3"
              className="bg-[#1A1A1A] rounded-2xl border border-white/5 px-6"
            >
              <AccordionTrigger className="text-white hover:text-[#FF2E2E] transition font-semibold">
                정산은 언제 이루어지나요?
              </AccordionTrigger>
              <AccordionContent className="text-gray-500">
                공연 종료 후 7일 이내에 정산이 진행됩니다. 
                마이페이지의 정산 내역에서 확인하실 수 있습니다.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem 
              value="item-4"
              className="bg-[#1A1A1A] rounded-2xl border border-white/5 px-6"
            >
              <AccordionTrigger className="text-white hover:text-[#FF2E2E] transition font-semibold">
                예매를 취소할 수 있나요?
              </AccordionTrigger>
              <AccordionContent className="text-gray-500">
                공연 3일 전까지 취소가 가능하며, 전액 환불됩니다. 
                그 이후에는 부분 환불 또는 환불이 불가할 수 있습니다.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem 
              value="item-5"
              className="bg-[#1A1A1A] rounded-2xl border border-white/5 px-6"
            >
              <AccordionTrigger className="text-white hover:text-[#FF2E2E] transition font-semibold">
                아티스트/공간 등록은 무료인가요?
              </AccordionTrigger>
              <AccordionContent className="text-gray-500">
                등록은 무료이며, 실제 공연이 성사되었을 때 소정의 수수료가 발생합니다. 
                자세한 내용은 약관을 확인해주세요.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <h2 className="text-white text-xl mb-4 font-bold">문의하기</h2>
          
          <button className="w-full bg-[#1A1A1A] rounded-2xl p-6 border border-white/5 hover:border-[#FF2E2E] transition flex items-center gap-4">
            <Mail size={24} className="text-[#FF2E2E]" />
            <div className="text-left">
              <h3 className="text-white mb-1 font-semibold">이메일 문의</h3>
              <p className="text-gray-500 text-sm">support@dyve.co.kr</p>
            </div>
          </button>

          <button className="w-full bg-[#1A1A1A] rounded-2xl p-6 border border-white/5 hover:border-[#FF2E2E] transition flex items-center gap-4">
            <MessageCircle size={24} className="text-[#FF2E2E]" />
            <div className="text-left">
              <h3 className="text-white mb-1 font-semibold">카카오톡 문의</h3>
              <p className="text-gray-500 text-sm">@DYVE_official</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
