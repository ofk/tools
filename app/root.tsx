import {
  Code,
  ColorSchemeScript,
  Container,
  Flex,
  mantineHtmlProps,
  Text,
  Title,
} from '@mantine/core';
import { nprogress } from '@mantine/nprogress';
import { useEffect } from 'react';
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
} from 'react-router';

import type { Route } from './+types/root';

import { AppLayout } from './components/AppLayout';
import { RootProvider } from './components/RootProvider';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/nprogress/styles.css';
import './app.css';

export const links: Route.LinksFunction = () => [
  { href: 'https://fonts.googleapis.com', rel: 'preconnect' },
  {
    crossOrigin: 'anonymous',
    href: 'https://fonts.gstatic.com',
    rel: 'preconnect',
  },
];

export const meta: Route.MetaFunction = () => [{ title: 'ofktools' }];

export function Layout({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <Meta />
        <Links />
        <ColorSchemeScript />
      </head>
      <body>
        <RootProvider>{children}</RootProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function HydrateFallback(): null {
  useEffect(() => {
    const tid = setTimeout(() => {
      nprogress.start();
    }, 1000);
    return (): void => {
      clearTimeout(tid);
      nprogress.complete();
    };
  }, []);

  return null;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps): React.ReactElement {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404 ? 'The requested page could not be found.' : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <Container>
      <Flex className="h-dvh items-center justify-center">
        <div className="text-center">
          <Title>{message}</Title>
          <Text>{details}</Text>
          {stack ? <Code block>{stack}</Code> : null}
        </div>
      </Flex>
    </Container>
  );
}

export default function App(): React.ReactElement {
  const navigation = useNavigation();
  useEffect(() => {
    let tid: ReturnType<typeof setTimeout> | null = null;
    if (navigation.state === 'idle') {
      nprogress.complete();
    } else {
      tid = setTimeout(() => {
        nprogress.start();
      }, 1000);
    }
    return (): void => {
      if (tid != null) {
        clearTimeout(tid);
      }
    };
  }, [navigation.state]);

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
