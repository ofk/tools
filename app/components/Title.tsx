import type React from 'react';

import { Anchor, Title as MantineTitle } from '@mantine/core';
import { IconChevronsLeft } from '@tabler/icons-react';
import { Link, useLocation } from 'react-router';

export function Title({ children }: { children: React.ReactNode }): React.ReactElement {
  const location = useLocation();

  return (
    <MantineTitle order={1}>
      {location.pathname === '/' ? null : (
        <Anchor component={Link} style={{ fontSize: 'inherit', lineHeight: 'inherit' }} to="/">
          <IconChevronsLeft className="inline-block" size="0.7em" />
        </Anchor>
      )}
      {children}
    </MantineTitle>
  );
}
