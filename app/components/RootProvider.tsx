import { createTheme, MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { NavigationProgress } from '@mantine/nprogress';

const theme = createTheme({});

export function RootProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <MantineProvider theme={theme}>
      <Notifications />
      <NavigationProgress />
      <ModalsProvider>{children}</ModalsProvider>
    </MantineProvider>
  );
}
