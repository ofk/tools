import { Tooltip } from '@mantine/core';
import React from 'react';

import type { AnnotatedData } from '~/shared/revisor';

import type { AnnotatedLineProps } from './AnnotatedLine';

import { AnnotatedLine } from './AnnotatedLine';

export interface AnnotatedTextProps {
  annotatedData: AnnotatedData;
  text: string;
}

export function AnnotatedText({ annotatedData, text }: AnnotatedTextProps): React.ReactElement {
  const currentLines = text.split('\n');
  const parsedLines = annotatedData.lines;

  let topMatch = 0;
  while (
    topMatch < currentLines.length &&
    topMatch < parsedLines.length &&
    currentLines[topMatch] === parsedLines[topMatch]
  ) {
    topMatch += 1;
  }

  let bottomMatch = 0;
  while (
    bottomMatch < currentLines.length - topMatch &&
    bottomMatch < parsedLines.length - topMatch &&
    currentLines[currentLines.length - 1 - bottomMatch] ===
      parsedLines[parsedLines.length - 1 - bottomMatch]
  ) {
    bottomMatch += 1;
  }

  return (
    <Tooltip.Group>
      {currentLines.map((lineText, index) => {
        let annotations: AnnotatedLineProps['annotations'] = [];

        if (index < topMatch) {
          annotations = annotatedData.annotationsPerLine[index] || [];
        } else if (index >= currentLines.length - bottomMatch) {
          const bottomOffset = currentLines.length - 1 - index;
          const parsedIndex = parsedLines.length - 1 - bottomOffset;
          annotations = annotatedData.annotationsPerLine[parsedIndex] || [];
        }

        return (
          <React.Fragment key={`line-${String(index)}`}>
            <AnnotatedLine annotations={annotations} text={lineText} />
            {index < currentLines.length - 1 ? '\n' : null}
          </React.Fragment>
        );
      })}
    </Tooltip.Group>
  );
}
