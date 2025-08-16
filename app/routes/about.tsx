import { Anchor, Text, Title } from '@mantine/core';
import { Link } from 'react-router';

import { AppLayout } from '~/components/AppLayout';

import type { Route } from './+types/about';

export const meta: Route.MetaFunction = () => [{ title: 'About | New React Router App' }];

export default function About(): React.ReactElement {
  return (
    <AppLayout>
      <Title mb="xs" order={1}>
        About
      </Title>
      <Text mb="xs">
        <Anchor component={Link} to="/">
          Welcome
        </Anchor>
      </Text>
    </AppLayout>
  );
}
