import { Anchor, List } from '@mantine/core';
import { Link } from 'react-router';

import { Title } from '~/components/Title';

export default function HomePage(): React.ReactElement {
  return (
    <>
      <Title>ofktools</Title>
      <List listStyleType="disc" withPadding>
        <List.Item>
          <Anchor component={Link} to="/diff">
            diff
          </Anchor>
        </List.Item>
      </List>
    </>
  );
}
