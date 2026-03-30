import type { DiffWorkerRequest } from '~/shared/diff';

import { diff } from '~/shared/diff';

self.addEventListener('message', ({ data }: MessageEvent<DiffWorkerRequest>) => {
  const { inputs, uuid } = data;
  const changes = diff(inputs);
  self.postMessage({ changes, uuid });
});

export default {};
