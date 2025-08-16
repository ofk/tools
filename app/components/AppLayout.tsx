import { AppShell } from '@mantine/core';

export function AppLayout({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <AppShell padding="md">
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
