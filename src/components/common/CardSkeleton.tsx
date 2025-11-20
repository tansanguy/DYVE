interface CardSkeletonProps {
  variant: 'event' | 'artist' | 'space';
}

export function CardSkeleton({ variant }: CardSkeletonProps) {
  const avatarClass =
    variant === 'artist'
      ? 'h-20 w-20 rounded-full'
      : variant === 'space'
        ? 'h-20 w-32 rounded-2xl'
        : 'h-20 w-20 rounded-2xl';

  // 한국어 주석: 카드 종류에 상관없이 동일한 스켈레톤 구조를 쓰면 로딩 중인 화면에서도 일관성을 유지할 수 있다.
  return (
    <div className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex gap-4">
        <div className={`${avatarClass} bg-white/10`} />
        <div className="flex-1 space-y-3">
          <div className="h-4 w-1/2 rounded-full bg-white/10" />
          <div className="h-3 w-3/4 rounded-full bg-white/10" />
          <div className="h-3 w-2/3 rounded-full bg-white/10" />
          <div className="mt-4 flex gap-2">
            <div className="h-8 flex-1 rounded-xl bg-white/10" />
            <div className="h-8 flex-1 rounded-xl bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
