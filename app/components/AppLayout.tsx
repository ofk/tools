import { AppShell, Stack } from '@mantine/core';

export function AppLayout({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <AppShell padding="md">
      <AppShell.Main component={Stack} mih="100dvh">
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
