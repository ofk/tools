/* eslint-disable react/no-array-index-key */

import type { ChangeObject } from 'diff';

import { Group, Textarea } from '@mantine/core';
import { diffChars, diffLines } from 'diff';
import { useMemo, useState } from 'react';
import { RichTextarea } from 'rich-textarea';

import { Title } from '~/components/Title';

import type { Route } from './+types/diff';

export const meta: Route.MetaFunction = () => [{ title: 'diff ofktools' }];

type DiffObject<T> = { addition: T; deletion: T; type: 'change' } | { common: T; type: 'equal' };

function createDiffObject(changes: ChangeObject<string>[]): DiffObject<string>[] {
  return changes.reduce<DiffObject<string>[]>((acc, change) => {
    if (change.added || change.removed) {
      let lastChange = acc.at(-1);
      if (lastChange?.type !== 'change') {
        lastChange = {
          addition: '',
          deletion: '',
          type: 'change',
        };
        acc.push(lastChange);
      }
      lastChange[change.added ? 'addition' : 'deletion'] += change.value;
    } else {
      acc.push({ common: change.value, type: 'equal' });
    }
    return acc;
  }, []);
}

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

  const changes = useMemo(() => {
    const lineChanges = createDiffObject(diffLines(inputs[0], inputs[1]));
    const charChanges = lineChanges.map((change) => {
      if (change.type === 'equal') {
        return change;
      }
      return {
        changes: createDiffObject(diffChars(change.deletion, change.addition)),
        type: 'change' as const,
      };
    });
    return charChanges;
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
                () => (
                  <>
                    {changes.map((change, j) => {
                      if (change.type === 'equal') {
                        return <div key={j}>{change.common}</div>;
                      }
                      return (
                        <div key={j} style={{ backgroundColor: i === 0 ? '#ffebe9' : '#dafbe1' }}>
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
                    })}
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
