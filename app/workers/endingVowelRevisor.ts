import { invariant } from 'es-toolkit';

import type {
  EndingVowelRevisorOptions,
  RevisorWorkerRequest,
  RevisorWorkerResponse,
  TextAnnotation,
} from '~/shared/revisor';

import { getStyle } from '~/shared/revisor';

const vowelNames = ['あ段', 'い段', 'う段', 'え段', 'お段', 'その他'];

// 母音の分類正規表現
const regVowel =
  /([あぁかがさざただなはばぱまやゃらわ])|([いぃきぎしじちぢにひびぴみり])|([うぅくぐすずつづっぬふぶぷむゆゅる])|([えぇけげせぜてでねへべぺめれ])|([おぉこごそぞとどのほぼぽもよょろを])|([\s\S])/;

// 文末を切り出す正規表現
// グループ1: 本当の最後の1文字
// グループ2: 無視する記号（空白、三点リーダー、閉じ括弧など）
// グループ3以降（非キャプチャ）: 終端記号（。！？もしくは閉じ括弧相当記号）または行末
const sentenceEndRegex = /(.)([\s\p{P}]*)(?:[。！？\p{Pe}]|$)/gu;

function analyzeText(
  lines: string[],
  options: EndingVowelRevisorOptions,
): RevisorWorkerResponse['annotationsPerLine'] {
  const maxConsecutive = options.maxConsecutive ?? 1;

  let prevVowelIndex = -1;
  let consecutiveCount = 1;

  return lines.map((line) => {
    const annotations: TextAnnotation[] = [];
    if (line.trim().length === 0) return annotations;

    const matches = [...line.matchAll(sentenceEndRegex)];

    // eslint-disable-next-line no-restricted-syntax
    for (const match of matches) {
      const trueChar = match[1];
      // eslint-disable-next-line no-continue
      if (!trueChar) continue;

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const vowelIndex = regVowel.exec(trueChar)!.slice(1).findIndex(Boolean);

      // 連続判定
      if (vowelIndex === prevVowelIndex) {
        consecutiveCount += 1;
      } else {
        consecutiveCount = 1;
        prevVowelIndex = vowelIndex;
      }

      const start = match.index;
      const end = start + trueChar.length;

      if (consecutiveCount > maxConsecutive) {
        // 許容数を超えた場合（警告ハイライト）
        annotations.push({
          end,
          start,
          style: getStyle(vowelIndex),
          tooltip: `${vowelNames[vowelIndex]}の連続 (${String(consecutiveCount)}回目)`,
        });
      } else {
        // 許容数以下の場合（検知確認用のデフォルトハイライト）
        annotations.push({
          end,
          start,
          style: getStyle(-1),
          tooltip: `${vowelNames[vowelIndex]}の文末`,
        });
      }
    }

    return annotations;
  });
}

self.addEventListener('message', (e: MessageEvent<RevisorWorkerRequest>) => {
  const { lines, option, uuid } = e.data;
  invariant(option.type === 'ending-vowel', 'Invalid option type for EndingVowelRevisor');

  self.postMessage({
    annotationsPerLine: analyzeText(lines, option),
    lines,
    uuid,
  } satisfies RevisorWorkerResponse);
});

export default {};
