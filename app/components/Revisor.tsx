import type React from 'react';

import { useEffect, useRef, useState } from 'react';

import type {
  AnnotatedData,
  RevisorOption,
  RevisorWorkerRequest,
  RevisorWorkerResponse,
} from '../shared/revisor';

import { AnnotatedText } from './AnnotatedText';

export interface RevisorProps {
  input: string;
  option: RevisorOption;
}

export function Revisor({ input, option }: RevisorProps): React.ReactElement {
  const [annotatedData, setAnnotatedData] = useState<AnnotatedData>({
    annotationsPerLine: [],
    lines: [],
  });

  const workerRef = useRef<Worker | null>(null);
  const latestWorkerUuidRef = useRef<string>('');
  const { type } = option;

  useEffect(() => {
    workerRef.current?.terminate();

    switch (type) {
      case 'ending-vowel':
        workerRef.current = new Worker(
          new URL('../workers/endingVowelRevisor.ts', import.meta.url),
          {
            type: 'module',
          },
        );
        break;
      case 'word-proximity':
        workerRef.current = new Worker(
          new URL('../workers/wordProximityRevisor.ts', import.meta.url),
          {
            type: 'module',
          },
        );
        break;
      default:
        throw new Error(`Unknown RevisorType: ${String(type)}`);
    }

    workerRef.current.addEventListener(
      'message',
      ({ data }: MessageEvent<RevisorWorkerResponse>) => {
        if (data.uuid === latestWorkerUuidRef.current) {
          setAnnotatedData({
            annotationsPerLine: data.annotationsPerLine,
            lines: data.lines,
          });
        }
      },
    );

    return (): void => {
      workerRef.current?.terminate();
    };
  }, [type]);

  useEffect(() => {
    const lines = input.split('\n');
    const uuid = crypto.randomUUID();

    latestWorkerUuidRef.current = uuid;

    workerRef.current?.postMessage({ lines, option, uuid } satisfies RevisorWorkerRequest);
  }, [input, option]);

  return <AnnotatedText annotatedData={annotatedData} text={input} />;
}
