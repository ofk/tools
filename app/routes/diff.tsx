/* eslint-disable react/no-array-index-key */

import { Group, Textarea } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import { RichTextarea } from 'rich-textarea';

import type { DiffResult } from '~/shared/diff';

import { Title } from '~/components/Title';

import type { Route } from './+types/diff';

export const meta: Route.MetaFunction = () => [{ title: 'diff ofktools' }];

export default function DiffPage(): React.ReactElement {
  const [inputs, setInputs] = useState([
    `下記の文章を比較してください。
   Betty Botter bought some butter, 
But, she said, this butter's bitter;
If I put it in my batter,
It will make my batter bitter,
But a bit of better butter
Will make my batter better.
So she bought a bit of butter
Better than her bitter butter,
And she put it in her batter,
And it made her batter better,
So 'twas better Betty Botter
Bought a bit of better butter.
`,
    `下記の文章を，ﾋﾋ較してくだちい．
Betty Botter bought some butter,
But, she said, the butter's bitter;
If I put it in my batter,
That will make my batter bitter.
But a bit of better butter, 
That will make my batter better.
So she bought a bit of butter
Better than her bitter butter.
And she put it in her batter,
And it made her batter better.
So it was better Betty Botter
Bought a bit of better butter.
`,
  ]);

  const [result, setResult] = useState<DiffResult>({
    changes: null,
    uuid: '',
  });

  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = new Worker(new URL('../workers/diff.ts', import.meta.url), {
      type: 'module',
    });
    workerRef.current.addEventListener('message', (e) => {
      const data = e.data as DiffResult;
      setResult((prevResult) => (prevResult.uuid === data.uuid ? data : prevResult));
    });
    return (): void => {
      workerRef.current?.terminate();
    };
  }, []);

  useEffect(() => {
    const uuid = crypto.randomUUID();
    setResult((prevResult) => ({ ...prevResult, uuid }));
    workerRef.current?.postMessage({ inputs, uuid });
  }, [inputs]);

  return (
    <>
      <Title>diff</Title>
      <Group align="start">
        {inputs.map((input, i) => (
          <div key={i} className="flex-1">
            <Textarea
              component={RichTextarea}
              onChange={(e) => {
                const { value } = e.currentTarget;
                setInputs((prevInputs) => [
                  ...prevInputs.slice(0, i),
                  value,
                  ...prevInputs.slice(i + 1),
                ]);
              }}
              styles={{ input: { fieldSizing: 'content', width: '100%' } }}
              value={input}
            >
              {
                // @ts-expect-error: RichTextareaと型が合わないので、Textareaの型を無視
                (v: string) => (
                  <>
                    {result.changes
                      ? result.changes.map((change, j) => {
                          if (change.type === 'equal') {
                            return <div key={j}>{change.common}</div>;
                          }
                          return (
                            <div
                              key={j}
                              style={{ backgroundColor: i === 0 ? '#ffebe9' : '#dafbe1' }}
                            >
                              {change.changes.map((c, k) => {
                                if (c.type === 'equal') {
                                  return <span key={k}>{c.common}</span>;
                                }
                                return (
                                  <span
                                    key={k}
                                    style={{ backgroundColor: i === 0 ? '#ffcecb' : '#aceebb' }}
                                  >
                                    {c[i === 0 ? 'deletion' : 'addition']}
                                  </span>
                                );
                              })}
                            </div>
                          );
                        })
                      : v}
                  </>
                )
              }
            </Textarea>
          </div>
        ))}
      </Group>
    </>
  );
}
