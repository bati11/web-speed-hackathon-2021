import React from 'react';

function _max(xs) {
  if (xs && xs.length > 0) {
    let result = xs[0]
    for (let i = 1; i < result.length; i++) {
      let x = xs[i]
      if (x > result) {
        result = x
      }
    }
    return result
  } else {
    return undefined
  }
}

function _mean(xs) {
  if (xs) {
    let sum = 0
    for (let i = 0; i < xs.length; i++) {
      sum = sum + xs[i]
    }
    return sum/xs.length
  } else {
    return NaN
  }
}

function _zip(...xss) {
  let result = []
  for (let i = 0; i < 1000000; i++) {
    let as = []
    xss.forEach(xs => {
      if (i < xs.length) {
        as.push(xs[i])
      } else {
        as.push(undefined)
      }
    })
    if (as.findIndex(a => a != undefined) == -1) {
      return result
    }
    result.push(as)
  }
  return result
}

function _chunk(xs, n) {
  if (!xs) {
    return []
  }
  let result = []
  let i = 0
  while (true) {
    let as = []
    for (let j = 0; j < n; j++) {
      as.push(xs[i]);
      i++
      if (i >= xs.length) {
        result.push(as)
        return result
      }
    }
    result.push(as)
  }
}

/**
 * @param {ArrayBuffer} data
 * @returns {Promise<{ max: number, peaks: number[] }}
 */
async function calculate(data) {
  const audioCtx = new AudioContext();

  // 音声をデコードする
  /** @type {AudioBuffer} */
  const buffer = await new Promise((resolve, reject) => {
    audioCtx.decodeAudioData(data.slice(0), resolve, reject);
  });
  // 左の音声データの絶対値を取る
  const leftData = buffer.getChannelData(0).map((x) => Math.abs(x));
  // 右の音声データの絶対値を取る
  const rightData = buffer.getChannelData(1).map((x) => Math.abs(x));

  // 左右の音声データの平均を取る
  const normalized = _zip(leftData, rightData).map((xs) => _mean(xs));
  // 100 個の chunk に分ける
  const chunks = _chunk(normalized, Math.ceil(normalized.length / 100));
  // chunk ごとに平均を取る
  const peaks = chunks.map((xs) => _mean(xs));
  // chunk の平均の中から最大値を取る
  const max = _max(peaks);

  return { max, peaks };
}

/**
 * @typedef {object} Props
 * @property {ArrayBuffer} soundData
 */

/**
 * @type {React.VFC<Props>}
 */
const SoundWaveSVG = ({ soundData }) => {
  const uniqueIdRef = React.useRef(Math.random().toString(16));
  const [{ max, peaks }, setPeaks] = React.useState({ max: 0, peaks: [] });

  React.useEffect(() => {
    calculate(soundData).then(({ max, peaks }) => {
      setPeaks({ max, peaks });
    });
  }, [soundData]);

  return (
    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 1">
      {peaks.map((peak, idx) => {
        const ratio = peak / max;
        return (
          <rect key={`${uniqueIdRef.current}#${idx}`} fill="#2563EB" height={ratio} width="1" x={idx} y={1 - ratio} />
        );
      })}
    </svg>
  );
};

export { SoundWaveSVG };
