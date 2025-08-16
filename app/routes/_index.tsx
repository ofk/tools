import { Anchor, List, Title } from '@mantine/core';
import { Link } from 'react-router';

export default function HomePage(): React.ReactElement {
  return (
    <>
      <Title order={1}>ofktools</Title>
      <List listStyleType="disc" withPadding>
        <List.Item>
          <Anchor component={Link} to="/about">
            About
          </Anchor>
        </List.Item>
      </List>
    </>
  );
}
