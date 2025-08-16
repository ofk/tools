import { Anchor, Text, Title } from '@mantine/core';
import { Link } from 'react-router';

import type { Route } from './+types/about';

export const meta: Route.MetaFunction = () => [{ title: 'About | New React Router App' }];

export default function About(): React.ReactElement {
  return (
    <>
      <Title order={1}>About</Title>
      <Text>
        <Anchor component={Link} to="/">
          Welcome
        </Anchor>
      </Text>
    </>
  );
}
