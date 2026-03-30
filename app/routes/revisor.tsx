import { NativeSelect, Textarea } from '@mantine/core';
import { useState } from 'react';
import { RichTextarea } from 'rich-textarea';

import { Revisor } from '~/components/Revisor';
import { Title } from '~/components/Title';
import { debugRevisorInitialText } from '~/shared/debugRevisorInitialText';

import type { Route } from './+types/revisor';

export const meta: Route.MetaFunction = () => [{ title: 'revisor ofktools' }];

export default function RevisorPage(): React.ReactElement {
  const [input, setInput] = useState(
    process.env.NODE_ENV === 'development' ? debugRevisorInitialText : '',
  );
  const [option, setOption] = useState({ type: 'ending-vowel' });

  return (
    <>
      <Title>
        revisor
        <NativeSelect
          data={[
            { label: '文末検証', value: 'ending-vowel' },
            { label: '類語検証', value: 'word-proximity' },
          ]}
          onChange={(e) => {
            setOption({ type: e.currentTarget.value });
          }}
          value={option.type}
        />
      </Title>
      <Textarea
        component={RichTextarea}
        flex="1"
        onChange={(e) => {
          setInput(e.currentTarget.value);
        }}
        styles={{
          input: { height: '100%', width: '100%' },
          root: { display: 'flex', flexDirection: 'column' },
          wrapper: { flex: 1 },
        }}
        value={input}
      >
        {
          // @ts-expect-error: RichTextareaと型が合わないので、Textareaの型を無視
          (v: string) => <Revisor input={v} option={option} />
        }
      </Textarea>
    </>
  );
}
