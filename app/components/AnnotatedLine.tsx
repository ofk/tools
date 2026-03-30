import { Tooltip } from '@mantine/core';
import { invariant } from 'es-toolkit';
import React from 'react';

import type { TextAnnotation } from '~/shared/revisor';

export interface AnnotatedLineProps {
  annotations: TextAnnotation[];
  text: string;
}

export function AnnotatedLine({ annotations, text }: AnnotatedLineProps): React.ReactElement {
  if (annotations.length === 0) return <>{text}</>;

  const elems: React.ReactElement[] = [];
  let lastIndex = 0;

  for (let i = 0; i < annotations.length; i++) {
    const anno = annotations[i];

    invariant(anno.start >= lastIndex, 'Highlights must be sorted and non-overlapping.');
    invariant(anno.end <= text.length, 'Highlight end index out of bounds.');

    if (anno.start > lastIndex) {
      elems.push(
        <React.Fragment key={`text-${String(i)}`}>
          {text.slice(lastIndex, anno.start)}
        </React.Fragment>,
      );
    }

    elems.push(
      <Tooltip
        key={`anno-${String(i)}`}
        disabled={!anno.tooltip}
        label={anno.tooltip}
        position="top"
        withArrow
      >
        {anno.href ? (
          <a href={anno.href} style={anno.style} target="_new">
            {text.slice(anno.start, anno.end)}
          </a>
        ) : (
          <span style={anno.style}>{text.slice(anno.start, anno.end)}</span>
        )}
      </Tooltip>,
    );

    lastIndex = anno.end;
  }

  if (lastIndex < text.length) {
    elems.push(<React.Fragment key="text-end">{text.slice(lastIndex)}</React.Fragment>);
  }

  return <>{elems}</>;
}
