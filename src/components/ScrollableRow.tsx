// 简化版 ScrollableRow，排除 Hooks 问题
import { useRef } from 'react';

interface ScrollableRowProps {
  children: React.ReactNode;
  scrollDistance?: number;
}

export default function ScrollableRow({ children }: ScrollableRowProps) {
  // 保留 useRef 但不使用复杂逻辑，看看是否还有问题
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className='relative group'>
      <div
        ref={containerRef}
        className='flex space-x-6 overflow-x-auto scrollbar-hide py-1 sm:py-2 pb-12 sm:pb-14 px-4 sm:px-6'
      >
        {children}
      </div>
    </div>
  );
}
