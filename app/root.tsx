import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';
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
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack ? (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      ) : null}
    </main>
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

  return <Outlet />;
}
