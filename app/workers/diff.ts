/* eslint-disable import/no-default-export, no-restricted-globals */

import { diff } from '../shared/diff';

self.addEventListener('message', (e) => {
  const { inputs, uuid } = e.data as { inputs: string[]; uuid: string };
  const changes = diff(inputs);
  self.postMessage({ changes, uuid });
});

export default {};
