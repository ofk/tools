import type React from 'react';

export interface TextAnnotation {
  end: number;
  href?: string;
  start: number;
  style?: React.CSSProperties;
  tooltip?: string;
}

export interface AnnotatedData {
  annotationsPerLine: TextAnnotation[][];
  lines: string[];
}

export interface EndingVowelRevisorOptions {
  maxConsecutive?: number;
  type: 'ending-vowel';
}

export interface WordProximityRevisorOptions {
  distance?: number;
  type: 'word-proximity';
}

export type RevisorOption = EndingVowelRevisorOptions | WordProximityRevisorOptions;

export interface RevisorWorkerRequest {
  lines: string[];
  option: RevisorOption;
  uuid: string;
}

export interface RevisorWorkerResponse extends AnnotatedData {
  uuid: string;
}

const bgColors = [
  '#c06',
  '#6c0',
  '#06c',
  '#c60',
  '#0c6',
  '#60c',
  '#900',
  '#090',
  '#009',
  '#066',
  '#606',
  '#660',
  '#099',
  '#909',
  '#990',
  '#c03',
  '#3c0',
  '#03c',
  '#c30',
  '#0c3',
  '#30c',
  '#c33',
  '#3c3',
  '#33c',
];

export function getStyle(colorIndex: number): React.CSSProperties {
  if (colorIndex < 0) {
    return {
      backgroundColor: '#ccc',
      borderRadius: '2px',
      color: '#000',
      outlineColor: '#ccc',
      outlineStyle: 'solid',
      outlineWidth: '1px',
      position: 'relative',
    };
  }

  const bgColor = bgColors[colorIndex % bgColors.length];
  return {
    ...getStyle(-1),
    backgroundColor: bgColor,
    color: '#fff',
    outlineColor: bgColor,
  };
}
