import type { ChangeObject } from 'diff';

import { diffChars, diffLines } from 'diff';

export type DiffObject<T> =
  | { addition: T; deletion: T; type: 'change' }
  | { common: T; type: 'equal' };

export type DiffChanges = (
  | { changes: DiffObject<string>[]; type: 'change' }
  | { common: string; type: 'equal' }
)[];

export interface DiffResult {
  changes: DiffChanges | null;
  uuid: string;
}

export function createDiffObject(changes: ChangeObject<string>[]): DiffObject<string>[] {
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

export function diff(inputs: string[]): DiffChanges {
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
}
