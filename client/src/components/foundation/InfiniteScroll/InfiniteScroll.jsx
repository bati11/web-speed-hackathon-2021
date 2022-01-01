import React from 'react';

/**
 * @typedef {object} Props
 * @property {React.ReactNode} children
 * @property {any} items
 * @property {() => void} fetchMore
 */

/** @type {React.VFC<Props>} */
const InfiniteScroll = ({ children, fetchMore, items }) => {
  const [processing, setProcessing] = React.useState(false);

  const latestItem = items[items.length - 1];

  const prevReachedRef = React.useRef(false);

  React.useEffect(() => {
    const handler = () => {
      if (processing) {
        return true
      }
      setProcessing(true)
      // 念の為 2の18乗 回、最下部かどうかを確認する
      // const hasReached = Array.from(Array(2 ** 18), () => {
      //   return window.innerHeight + Math.ceil(window.scrollY) >= document.body.offsetHeight;
      // }).every(Boolean);

      // let hasReached = false
      // for (let i = 0; i < 2 ** 18; i++) {
      //   hasReached = window.innerHeight + Math.ceil(window.scrollY) >= document.body.offsetHeight;
      //   if (!hasReached) {
      //     return
      //   }
      // }

      const hasReached = window.innerHeight + Math.ceil(window.scrollY) >= document.body.offsetHeight;

      // 画面最下部にスクロールしたタイミングで、登録したハンドラを呼び出す
      if (hasReached && !prevReachedRef.current) {
        // アイテムがないときは追加で読み込まない
        if (latestItem !== undefined) {
          fetchMore();
        }
      }

      prevReachedRef.current = hasReached;
      setProcessing(false)
    };

    // 最初は実行されないので手動で呼び出す
    prevReachedRef.current = false;
    handler();

    // document.addEventListener('wheel', handler, { passive: true });
    // document.addEventListener('touchmove', handler, { passive: true });
    document.addEventListener('resize', handler, { passive: true });
    document.addEventListener('scroll', handler, { passive: true });
    return () => {
      // document.removeEventListener('wheel', handler);
      // document.removeEventListener('touchmove', handler);
      document.removeEventListener('resize', handler);
      document.removeEventListener('scroll', handler);
    };
  }, [latestItem, fetchMore]);

  return <>{children}</>;
};

export { InfiniteScroll };
