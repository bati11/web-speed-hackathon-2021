import classNames from 'classnames';
import React from 'react';

import { AspectRatioBox } from '../AspectRatioBox';
import { FontAwesomeIcon } from '../FontAwesomeIcon';

/**
 * @typedef {object} Props
 * @property {string} src
 */

/**
 * クリックすると再生・一時停止を切り替えます。
 * @type {React.VFC<Props>}
 */
const PausableMovie = ({ src }) => {
  // const { data, isLoading } = useFetch(src, fetchBinary);

  // /** @type {React.RefObject<import('gifler').Animator>} */
  const animatorRef = React.useRef(null);
  // /** @type {React.RefCallback<HTMLCanvasElement>} */
  // const canvasCallbackRef = React.useCallback(
  //   (el) => {
  //     animatorRef.current?.stop();

  //     if (el === null || data === null) {
  //       return;
  //     }

  //     // GIF を解析する
  //     const reader = new GifReader(new Uint8Array(data));
  //     const frames = Decoder.decodeFramesSync(reader);
  //     const animator = new Animator(reader, frames);

  //     animator.animateInCanvas(el);
  //     animator.onFrame(frames[0]);

  //     // 視覚効果 off のとき GIF を自動再生しない
  //     if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  //       setIsPlaying(false);
  //       animator.stop();
  //     } else {
  //       setIsPlaying(true);
  //       animator.start();
  //     }

  //     animatorRef.current = animator;
  //   },
  //   [data],
  // );

  const videoRef = React.useRef(null);

  const [isPlaying, setIsPlaying] = React.useState(true);
  const handleClick = React.useCallback(() => {
    setIsPlaying((isPlaying) => {
      if (isPlaying) {
        videoRef.current?.pause()
      } else {
        videoRef.current?.play()
      }
      return !isPlaying;
    });
  }, []);

  const autoplay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? null : "autoplay"

  React.useEffect(() => {
      // 視覚効果 off のとき GIF を自動再生しない
      if (autoplay) {
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
    }, [videoRef]);

  // if (isLoading || data === null) {
  //   return null;
  // }

  return (
    <AspectRatioBox aspectHeight={1} aspectWidth={1}>
      <button className="group relative block w-full h-full" onClick={handleClick} type="button">
        <video ref={videoRef} autoPlay={autoplay} loop muted playsInline>
          <source src={src} type='video/webm'></source>
        </video>
        {/* <canvas ref={canvasCallbackRef} className="w-full" width="1080" height="1080" /> */}
        <div
          className={classNames(
            'absolute left-1/2 top-1/2 flex items-center justify-center w-16 h-16 text-white text-3xl bg-black bg-opacity-50 rounded-full transform -translate-x-1/2 -translate-y-1/2',
            {
              'opacity-0 group-hover:opacity-100': isPlaying,
            },
          )}
        >
          <FontAwesomeIcon iconType={isPlaying ? 'pause' : 'play'} styleType="solid" />
        </div>
      </button>
    </AspectRatioBox>
  );
};

export { PausableMovie };
