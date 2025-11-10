import { Screen } from '../App';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

interface BookingPageProps {
  navigate: (screen: Screen, data?: any) => void;
  performance: any;
}

export default function BookingPage({ navigate, performance }: BookingPageProps) {
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [bookedSeats] = useState<string[]>(['A3', 'B2', 'C4', 'D1']); // Mock booked seats

  if (!performance) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">공연 정보를 찾을 수 없습니다</p>
      </div>
    );
  }

  const handleBooking = () => {
    const bookingData = {
      performance: performance.title,
      artist: performance.artist,
      venue: performance.venue,
      date: performance.date,
      time: performance.time,
      price: performance.price,
      entryType: performance.entryType,
      selectedSeat,
      bookingNumber: `DYVE${Date.now()}`,
    };
    navigate('confirm', { booking: bookingData });
  };

  // Render seat selection (좌석)
  const renderSeatSelection = () => {
    const { rows, cols } = performance.seatingInfo;
    const rowLabels = Array.from({ length: rows }, (_, i) => String.fromCharCode(65 + i));

    return (
      <div className="mb-8">
        <h3 className="text-white mb-4 font-bold">좌석 선택</h3>
        <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5">
          {/* Stage */}
          <div className="bg-[#FF3B5C] text-white text-center py-2 rounded-lg mb-6">
            STAGE
          </div>

          {/* Seat Grid */}
          <div className="space-y-3">
            {rowLabels.map((rowLabel) => (
              <div key={rowLabel} className="flex items-center gap-2">
                <div className="w-8 text-gray-400 text-sm font-semibold">{rowLabel}</div>
                <div className="flex gap-2 flex-1 justify-center">
                  {Array.from({ length: cols }, (_, i) => {
                    const seatId = `${rowLabel}${i + 1}`;
                    const isBooked = bookedSeats.includes(seatId);
                    const isSelected = selectedSeat === seatId;

                    return (
                      <button
                        key={seatId}
                        onClick={() => !isBooked && setSelectedSeat(seatId)}
                        disabled={isBooked}
                        className={`w-10 h-10 rounded-lg font-semibold text-xs transition ${
                          isBooked
                            ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                            : isSelected
                            ? 'bg-[#FF3B5C] text-white'
                            : 'bg-[#0F0F0F] text-gray-400 border border-white/10 hover:border-[#FF3B5C]'
                        }`}
                      >
                        {i + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex gap-4 justify-center mt-6 pt-6 border-t border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#0F0F0F] rounded border border-white/10" />
              <span className="text-gray-400 text-sm">선택 가능</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#FF3B5C] rounded" />
              <span className="text-gray-400 text-sm">선택됨</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-800 rounded" />
              <span className="text-gray-400 text-sm">예매 완료</span>
            </div>
          </div>

          {selectedSeat && (
            <div className="mt-6 pt-6 border-t border-white/5">
              <p className="text-white text-center">
                선택한 좌석: <span className="text-[#FF3B5C] font-bold">{selectedSeat}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render number selection (입장 번호 - 포도알 형태)
  const renderNumberSelection = () => {
    const { rows, cols } = performance.seatingInfo;
    const totalNumbers = rows * cols;
    const bookedNumbers = [3, 7, 12, 18, 25]; // Mock booked numbers

    return (
      <div className="mb-8">
        <h3 className="text-white mb-4 font-bold">입장 번호 선택</h3>
        <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5">
          <p className="text-gray-400 text-sm mb-4 text-center">
            원하시는 입장 번호를 선택해주세요
          </p>

          {/* Number Grid (포도알 형태) */}
          <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
            {Array.from({ length: totalNumbers }, (_, i) => {
              const number = i + 1;
              const isBooked = bookedNumbers.includes(number);
              const isSelected = selectedSeat === `${number}`;

              return (
                <button
                  key={number}
                  onClick={() => !isBooked && setSelectedSeat(`${number}`)}
                  disabled={isBooked}
                  className={`aspect-square rounded-full font-bold transition ${
                    isBooked
                      ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                      : isSelected
                      ? 'bg-[#FF3B5C] text-white shadow-lg shadow-[#FF3B5C]/30'
                      : 'bg-[#0F0F0F] text-gray-400 border border-white/10 hover:border-[#FF3B5C] hover:scale-110'
                  }`}
                >
                  {number}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex gap-4 justify-center mt-6 pt-6 border-t border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#0F0F0F] rounded-full border border-white/10" />
              <span className="text-gray-400 text-sm">선택 가능</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#FF3B5C] rounded-full" />
              <span className="text-gray-400 text-sm">선택됨</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-800 rounded-full" />
              <span className="text-gray-400 text-sm">예매 완료</span>
            </div>
          </div>

          {selectedSeat && (
            <div className="mt-6 pt-6 border-t border-white/5">
              <p className="text-white text-center">
                선택한 번호: <span className="text-[#FF3B5C] font-bold">{selectedSeat}번</span>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render entry confirmation (입장 확인만)
  const renderEntryConfirmation = () => {
    return (
      <div className="mb-8">
        <h3 className="text-white mb-4 font-bold">입장 확인</h3>
        <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5">
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-[#FF3B5C]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-[#FF3B5C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="text-white mb-2">별도 좌석 지정 없음</h4>
            <p className="text-gray-400 text-sm">
              이 공연은 자유 입장 방식입니다.<br />
              예매 확인 후 현장에서 자유롭게 입장하실 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-black sticky top-0 z-40 border-b border-white/10">
        <div className="px-6 py-4 flex items-center gap-4">
          <button onClick={() => navigate('detail', { performance })} className="text-white">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-white text-xl font-extrabold">공연 예매</h1>
        </div>
      </div>

      <div className="px-6 py-8">
        {/* Performance Summary */}
        <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5 mb-8">
          <h3 className="text-white mb-4 font-bold">예매 정보</h3>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">공연</span>
              <span className="text-white font-medium">{performance.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">아티스트</span>
              <span className="text-white font-medium">{performance.artist}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">날짜</span>
              <span className="text-white font-medium">{performance.date} {performance.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">입장 방식</span>
              <span className="text-[#FF3B5C] font-medium">
                {performance.entryType === 'seat' && '좌석 지정'}
                {performance.entryType === 'number' && '입장 번호'}
                {performance.entryType === 'entry' && '입장 확인'}
              </span>
            </div>
          </div>
        </div>

        {/* Entry Type Based Selection */}
        {performance.entryType === 'seat' && renderSeatSelection()}
        {performance.entryType === 'number' && renderNumberSelection()}
        {performance.entryType === 'entry' && renderEntryConfirmation()}

        {/* Price Summary */}
        <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-white/5 mb-8">
          <h3 className="text-white mb-4 font-bold">결제 정보</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-500">
              <span>티켓 가격</span>
              <span>{performance.price.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>수수료</span>
              <span>0원</span>
            </div>
            <div className="h-px bg-white/5 my-3" />
            <div className="flex justify-between text-white text-lg">
              <span className="font-bold">총 결제 금액</span>
              <span className="text-[#FF2E2E] font-bold">{performance.price.toLocaleString()}원</span>
            </div>
          </div>
        </div>

        {/* Book Button */}
        <button 
          onClick={handleBooking}
          disabled={(performance.entryType !== 'entry' && !selectedSeat)}
          className="w-full bg-[#FF2E2E] text-white py-4 rounded-2xl hover:bg-[#cc2525] transition font-bold text-lg disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed"
        >
          {(performance.entryType !== 'entry' && !selectedSeat) ? '좌석/번호를 선택해주세요' : '예매하기'}
        </button>
      </div>
    </div>
  );
}
