import { AppShell, Stack } from '@mantine/core';

export function AppLayout({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <AppShell padding="md">
      <AppShell.Main component={Stack}>{children}</AppShell.Main>
    </AppShell>
  );
}
