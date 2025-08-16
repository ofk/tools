import { Anchor, Text, Title } from '@mantine/core';
import { Link } from 'react-router';

import { AppLayout } from '~/components/AppLayout';

import type { Route } from './+types/_index';

export const meta: Route.MetaFunction = () => [
  { title: 'New React Router App' },
  { content: 'Welcome to React Router!', name: 'description' },
];

export default function Home(): React.ReactElement {
  return (
    <AppLayout>
      <Title mb="xs" order={1}>
        Welcome
      </Title>
      <Text mb="xs">
        <Anchor component={Link} to="/about">
          About
        </Anchor>
      </Text>
    </AppLayout>
  );
}
