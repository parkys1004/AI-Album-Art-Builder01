import { ReactNode } from 'react';

export default function AppGuard({ children }: { children: ReactNode }) {
  // 인증 절차 없이 누구나 바로 통과
  return <>{children}</>;
}