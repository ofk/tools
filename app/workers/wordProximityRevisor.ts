import { invariant } from 'es-toolkit';

import type {
  RevisorWorkerRequest,
  RevisorWorkerResponse,
  TextAnnotation,
  WordProximityRevisorOptions,
} from '~/shared/revisor';

import { getTokenizer } from '~/shared/kuromojin';
import { getStyle } from '~/shared/revisor';

// 形態素解析済みの行を保持し、再解析を防ぐキャッシュ
type ReturnTokens = ReturnType<Awaited<ReturnType<typeof getTokenizer>>['tokenize']>;

let lineCache = new Map<string, ReturnTokens>();

interface ProcessedToken {
  absoluteEnd: number;
  absoluteStart: number;
  colorIndex?: number;
  endInLine: number;
  key: string;
  lineIndex: number;
  startInLine: number;
  surface: string;
  word: string;
}

async function analyzeText(
  lines: string[],
  option: WordProximityRevisorOptions,
): Promise<RevisorWorkerResponse['annotationsPerLine']> {
  const distance = option.distance ?? 100;
  const nextLineCache = new Map<string, ReturnTokens>();
  const tokenizer = await getTokenizer({
    dicPath: 'https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict',
  });

  // 1. キャッシュを活用して形態素解析（未解析の行のみ tokenize を実行）
  const parsedLines = lines.map((line) => {
    if (line.trim().length === 0) return [];

    // 同一行の重複対応
    if (nextLineCache.has(line)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return nextLineCache.get(line)!;
    }

    // 前回解析済み
    if (lineCache.has(line)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const cached = lineCache.get(line)!;
      nextLineCache.set(line, cached);
      return cached;
    }

    const tokens = tokenizer.tokenize(line);
    nextLineCache.set(line, tokens);
    return tokens;
  });

  // キャッシュを最新の状態に更新（使われなかった古い行はここでGCされる）
  lineCache = nextLineCache;

  const targetTokens: ProcessedToken[] = [];
  let absoluteOffset = 0;
  const annotationsPerLine: TextAnnotation[][] = lines.map(() => []);

  // 2. トークンを絶対位置付きでフラットに整理し、対象となるものだけ抽出
  parsedLines.forEach((tokens, lineIndex) => {
    let currentInLineOffset = 0;

    tokens.forEach((token) => {
      const surface = token.surface_form;
      const startInLine = currentInLineOffset;
      const endInLine = startInLine + surface.length;
      const absoluteStart = absoluteOffset + startInLine;
      const absoluteEnd = absoluteOffset + endInLine;

      currentInLineOffset = endInLine;

      // 対象かどうかの判定
      const isTarget =
        token.pos !== '記号' &&
        token.pos !== '助詞' &&
        token.pos !== '助動詞' &&
        !/^[ぁ-ん]$/.test(surface);

      if (isTarget) {
        const word = token.word_type === 'KNOWN' ? token.basic_form : surface;
        const key = [
          token.word_type,
          token.pos,
          token.pos_detail_1,
          token.pos_detail_2,
          token.pos_detail_3,
          word,
        ].join(':');

        targetTokens.push({
          absoluteEnd,
          absoluteStart,
          endInLine,
          key,
          lineIndex,
          startInLine,
          surface,
          word,
        });
      }
    });

    // 次の行へ行く際、改行文字(\n)の1文字分をオフセットに加算
    absoluteOffset += currentInLineOffset + 1;
  });

  // 3. 近傍探索 (100文字以内かどうか)
  const history = new Map<string, ProcessedToken[]>();
  const keyToColorIndex = new Map<string, number>();
  let nextColorIndex = 0;

  // eslint-disable-next-line no-restricted-syntax
  for (const token of targetTokens) {
    const prevTokens = history.get(token.key) ?? [];
    const recentToken = prevTokens.length > 0 ? prevTokens.at(-1) : null;

    // 前回の出現から、指定された distance 以内であるか判定
    if (recentToken && token.absoluteStart - recentToken.absoluteEnd <= distance) {
      // 未知の重複グループであれば新しい色を割り当てる
      if (!keyToColorIndex.has(token.key)) {
        keyToColorIndex.set(token.key, nextColorIndex);
        nextColorIndex += 1;
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const colorIdx = keyToColorIndex.get(token.key)!;

      token.colorIndex = colorIdx;
      recentToken.colorIndex = colorIdx; // 近接元のトークンも着色対象にする
    }

    prevTokens.push(token);
    history.set(token.key, prevTokens);
  }

  // 4. アノテーションの構築
  // eslint-disable-next-line no-restricted-syntax
  for (const token of targetTokens) {
    if (token.colorIndex !== undefined) {
      annotationsPerLine[token.lineIndex].push({
        end: token.endInLine,
        href: `https://thesaurus.weblio.jp/content/${encodeURIComponent(token.word)}`,
        start: token.startInLine,
        style: getStyle(token.colorIndex),
        tooltip: token.key,
      });
    }
  }

  return annotationsPerLine;
}

// eslint-disable-next-line @typescript-eslint/no-misused-promises
self.addEventListener('message', async (e: MessageEvent<RevisorWorkerRequest>) => {
  const { lines, option, uuid } = e.data;
  invariant(option.type === 'word-proximity', 'Invalid option type for WordProximityRevisor');

  self.postMessage({
    annotationsPerLine: await analyzeText(lines, option),
    lines,
    uuid,
  } satisfies RevisorWorkerResponse);
});

export default {};
