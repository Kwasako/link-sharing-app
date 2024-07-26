// ClientLinkProvider.tsx
'use client';

import { LinkProvider } from './LinkContext';

export default function ClientLinkProvider({ children }: { children: React.ReactNode }) {
  return <LinkProvider>{children}</LinkProvider>;
}