import { Screen } from '../App';
import dyveLogo from '../../assets/images/dyve-logo.png';
import kakaoLoginBtn from '../../assets/images/kakao_login_large_wide.png';

interface LoginPageProps {
  navigate: (screen: Screen) => void;
}

export default function LoginPage({ navigate }: LoginPageProps) {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md flex flex-col items-center">
        <img 
          src={dyveLogo} 
          alt="DYVE" 
          className="w-48 mb-20"
        />
        
        <div className="w-full space-y-3">
          <button 
            onClick={() => navigate('home')}
            className="w-full hover:opacity-90 transition flex justify-center"
          >
            <img 
              src={kakaoLoginBtn} 
              alt="카카오 로그인" 
              className="w-full rounded-xl"
            />
          </button>
          
          <button 
            onClick={() => navigate('register')}
            className="w-full bg-[#FF3B5C] text-white py-4 rounded-xl hover:bg-[#d43550] transition font-bold shadow-lg shadow-[#FF3B5C]/20 flex items-center justify-center"
          >
            아티스트로 활동하기
          </button>
          
          <button 
            onClick={() => navigate('register')}
            className="w-full border-2 border-[#FF3B5C] text-[#FF3B5C] py-4 rounded-xl hover:bg-[#FF3B5C] hover:text-white transition font-bold flex items-center justify-center"
          >
            공간 보유자로 등록하기
          </button>
        </div>
        
        <p className="text-gray-600 text-sm mt-16 text-center">
          인디 아티스트와 소규모 공간을 위한<br />
          공연 연결 플랫폼
        </p>
      </div>
    </div>
  );
}
